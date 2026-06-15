# Backend schema notes (for the future Talli backend → Firebase)

Reference notes distilled from two existing sibling projects' migrations, to be
used as the house style when we design Talli's data layer. These are **planning
notes only** — Talli today is a frontend with in-memory dummy data
(`app/inventory.ts`, `app/ShopSelection.tsx`). No backend exists yet.

## Sample sources studied
- **billing_backend** — Django migrations: `G:\Visual Studio Files\billing_backend\bills\migrations`
  (notably `0001_initial.py`, `0003_audit.py`)
- **Minty** — Alembic/SQLAlchemy migrations: `G:\Visual Studio Files\Minty\migrations\versions`
  (notably `0001_full_schema.py`, `20260601_add_email_otp.py`)

## House conventions (consistent across both projects)
- **Primary keys**: UUID stored as `String(36)` / `CharField(max_length=36)`,
  default `uuid.uuid4`. (A few high-volume/log tables use autoincrement `Integer`.)
- **Table names**: `snake_case`, **singular** (`bill`, `bill_line_item`, `audit`,
  `user`, `report_history`). Join tables read as `a_b` (`user_entity`, `role_permissions`).
- **Timestamps**: `created_at` (auto_now_add / `server_default=CURRENT_TIMESTAMP`)
  and `updated_at` (auto_now). History/audit rows use `date` / `timestamp`.
- **Soft delete**: `is_deleted` boolean + `deleted_at` nullable (Django side).
- **Enums**: string columns with explicit `choices=[(value, "Label")]`
  (e.g. bill `status`, audit `action`). No native DB enum type.
- **Money**: `Decimal(max_digits=12, decimal_places=2)`. **Quantity**:
  `Decimal(..., decimal_places=4)` — matches our kg/ml decimal stock decision.
- **Foreign keys**: always explicit `on_delete` — `CASCADE` for owned children,
  `SET NULL` for actor/optional references; `related_name` set on the Django side.
- **Multi-tenancy**: a tenant id (`entity_id` in both projects) is carried on every
  scoped table and indexed (`db_index=True`). In Talli, **`entity` == `shop`**.
- **Many users per shop**: membership is a join table (`user_entity` in Minty:
  composite PK `(user_id, entity_id)`, `role`, `approved`, `joined_at`), so a shop
  has many users and a user can belong to many shops. New members arrive via an
  `invitation` table (`email`, `role`, `token`, `status`, `invited_by`). Per-shop
  roles come from `roles`/`permissions`/`role_permissions`. Note: the current
  frontend only stubs a single signed-in user — this whole layer is greenfield.
- **Actor tracking**: `user_id` / `created_by` / `uploaded_by` as `String(36)`.
  Django side keeps it a plain id (no hard FK) because the user table lives in a
  separate service/DB; Alembic side uses a real FK with `SET NULL`.
- **Audit / history pattern** (two flavors):
  - *Event log* (`audit`): `action` (choices), `detail` text, `date`, `user_id`,
    FK to the subject, indexed on subject + date, ordered by date.
  - *Field-level* (`report_history`): `action`, `field_changed`, `old_value`,
    `new_value`, `timestamp`, `user_id` FK SET NULL.
- **OTP** (`email_otp`, Minty): `id`, `email` (indexed), `code_hash` (hashed, never
  plaintext), `expires_at`, `attempts`, `verified_at`, `created_at`. Drop-in for
  Talli's existing OTP login screen.
- **Alembic structure**: one consolidated `0001_full_schema`, tables created in
  dependency order (root → level 1 → 2 → 3) under a named `schema`, with a
  matching `downgrade()` dropping in reverse.

## How current Talli features map to tables
| Feature (current UI)                     | Table(s)                                  |
|------------------------------------------|-------------------------------------------|
| Auth gate + OTP (`AuthScreen.tsx`)       | `user`, `email_otp`                        |
| Shop selection (`ShopSelection.tsx`)     | `shop` (the tenant/`entity`)               |
| User ↔ shop membership (many-to-many)    | `user_shop` (composite PK `(user_id, shop_id)`, `role`, `approved`, `joined_at`) |
| Inviting a teammate to a shop            | `invitation` (`shop_id`, `email`, `role`, `token`, `status`, `invited_by`) |
| Role-based access (optional, later)      | `role`, `permission`, `role_permission`    |
| Inventory list/detail (`inventory.ts`)   | `product` (FK `shop_id`, `supplier_id`, `category_id`) |
| Supplier detail page (`SupplierDetail`)  | `supplier` (FK `shop_id`)                  |
| Category combobox                        | `category` (FK `shop_id`)                  |
| Product + supplier activity history      | `activity` (action, detail, `user_id`, target ref, `created_at`) |
| Billing (`Billed` widget / billing core) | `bill` (FK `shop_id`, `created_by`), `bill_line_item` (FK `bill_id` CASCADE), `payment` (FK `bill_id`) — directly from the billing_backend sample |
| Purchase orders (`PurchaseOrdersPage`)   | `purchase_order` (FK `shop_id`, `supplier_id`, `created_by`, `status` Pending/Paid, `ordered_date`, `expected_date`), `purchase_order_item` (FK `po_id` CASCADE, `product_id`, `qty`, `unit`, `unit_price`) |
| Sidebar: Bar / Kitchen                   | future tables, TBD                         |

### Purchase orders — behavior deferred until the DB exists
The frontend (`purchaseOrders.ts`, `PurchaseOrdersPage.tsx`, `PurchaseOrderModal.tsx`)
is UI-only with in-memory state. To wire once the backend lands:
- **Status flow**: new POs are created **Pending**; user reviews and **marks Paid**
  (mirrors the dashboard Recent Orders widget). Only two statuses.
- **Items are existing inventory products only** (Option A): the line-item picker
  selects from `product`; no create-from-PO. Each item snapshots `qty`/`unit`/`unit_price`.
- **Editable unit price = intentional**: the line price pre-fills from the product's
  inventory price (the *default/reference*) but is editable so it can capture the
  actual agreed price for that order (supplier price changes, negotiated rates). The
  `purchase_order_item.unit_price` snapshot means later inventory price edits never
  rewrite historical POs.
- **Receive → stock, on Pending → Paid** (not built): the *first time* a PO
  transitions **Pending → Paid**, add each line's quantity into `product.stock` and
  log an `activity` row per item — e.g. *"Stock +20 kg from PO-1042"* — attributed to
  the user who marked it Paid. Must be **idempotent**: never on create, and never
  applied twice if the status is toggled Paid → Pending → Paid or the PO is re-saved
  (track with a `stock_applied` flag / ledger row, not just the current status). This
  is also the natural place to later allow ordering brand-new items that get created
  on receipt.
- **Roles & permissions** (via `user_shop.role`, enforced on the backend; the UI
  only reflects it):
  - *Bar / Kitchen* = **requesters** — may create POs (always land as **Pending**)
    but **cannot** mark Paid. The "Mark as paid" action is hidden for them.
  - *Admin / back office* = **approvers** — the only roles that can mark a PO Paid.
  - A hidden button is not security: the mark-paid endpoint must check the caller's
    role server-side.
- **Each submission = a new PO** — every order a requester submits creates its own
  `purchase_order` row (own PO number, items, status, audit). Never append to or
  mutate an existing PO. (Optional later: a per-area draft "cart" that accumulates
  items, then becomes one new PO on submit.)
- **Visibility**: *Bar / Kitchen see only the POs they created* (scope by
  `created_by` = current user). Admin / back office see all of the shop's POs.
- Open (undecided): whether a requester can edit/cancel their own PO while still
  Pending, or it locks once submitted.
- Open (undecided): when a PO is received/paid, whether it should **update the
  inventory product's default price** to that PO's unit price. Default lean: no —
  inventory price is managed manually, the PO is just a record (optionally prompt
  "update default price?"). The historical PO line keeps its own snapshot regardless.

### Inventory — activity is attributed for every stock change
The product activity history (`ProductDetail`, currently mocked) becomes real
`activity` rows. Every change to a product writes one, attributed to the acting
`user`, capturing the quantity delta — from **two sources**:
- **PO Paid** → system-driven, e.g. *"Stock +20 kg from PO-1042"* (actor = who
  marked it Paid).
- **Manual admin edit** → when an admin edits the item directly, log *who* changed
  it and the quantity added/removed, e.g. *"Maria Santos updated stock +15 kg"*.
Both share the same `activity` shape (`action`, `detail`, `user_id`, `created_at`,
target = the product), so the history reads as one timeline regardless of source.

Key change from the current frontend: `product.supplier` and `product.category`
are free-text **strings** today; in the DB they become their own rows and
`product` carries `supplier_id` / `category_id` FKs. The comboboxes resolve to an
id instead of a string — minimal UI change.

## Firebase translation (decide before building)
- **Firestore (NoSQL)**: collections per entity, relations via id references or
  subcollections; supplier→items becomes `where("supplierId","==",id)`. No SQL
  migrations.
- **Firebase Data Connect (Postgres + GraphQL)**: real tables/FKs/migrations — the
  relational model above maps ~1:1. Closest to the two samples studied.
