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
| Sidebar: Purchase Orders / Bar / Kitchen | future: `purchase_order`(+ lines), etc.    |

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
