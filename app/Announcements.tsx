"use client";

import { useEffect, useState } from "react";
import {
  CampaignIcon,
  PendingActionsIcon,
  InventoryIcon,
  SuppliersIcon,
  PlusIcon,
  CloseIcon,
} from "./icons";

type IconType = React.ComponentType<{ className?: string }>;

type Announcement = {
  Icon: IconType;
  tone: string;
  title: string;
  body: string;
  time: string;
  pinned?: boolean;
};

const iconOptions: { Icon: IconType; tone: string }[] = [
  { Icon: CampaignIcon, tone: "bg-primary/10 text-primary" },
  { Icon: PendingActionsIcon, tone: "bg-[#e4edf1] text-[#4d7d94]" },
  { Icon: InventoryIcon, tone: "bg-[#eef2dd] text-[#7d8f3c]" },
  { Icon: SuppliersIcon, tone: "bg-[#f5e7ee] text-[#a6516f]" },
];

const initialAnnouncements: Announcement[] = [
  {
    Icon: PendingActionsIcon,
    tone: "bg-[#e4edf1] text-[#4d7d94]",
    title: "Holiday hours this week",
    body: "We close at 6 PM Thursday to Saturday.",
    time: "2h",
    pinned: true,
  },
  {
    Icon: CampaignIcon,
    tone: "bg-primary/10 text-primary",
    title: "Promo: 20% off pastries",
    body: "Runs all weekend, starts Friday.",
    time: "1d",
  },
  {
    Icon: InventoryIcon,
    tone: "bg-[#eef2dd] text-[#7d8f3c]",
    title: "Stock count tonight",
    body: "Please count the back stock after closing.",
    time: "2d",
  },
  {
    Icon: SuppliersIcon,
    tone: "bg-[#f5e7ee] text-[#a6516f]",
    title: "New supplier onboarded",
    body: "Northwind Traders is now in the catalog.",
    time: "3d",
  },
];

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>(initialAnnouncements);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [iconIdx, setIconIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setView(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const remove = (target: Announcement) => {
    setItems((prev) => prev.filter((a) => a !== target));
    setView(null);
  };

  const togglePin = (target: Announcement) => {
    setItems((prev) =>
      prev.map((a) => (a === target ? { ...a, pinned: !a.pinned } : a)),
    );
    setView((v) => (v ? { ...v, pinned: !v.pinned } : v));
  };

  const post = () => {
    if (!title.trim()) return;
    setItems((prev) => [
      {
        Icon: iconOptions[iconIdx].Icon,
        tone: iconOptions[iconIdx].tone,
        title: title.trim(),
        body: body.trim(),
        time: "now",
        pinned,
      },
      ...prev,
    ]);
    setTitle("");
    setBody("");
    setPinned(false);
    setIconIdx(0);
    setOpen(false);
  };

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
          Announcements
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <PlusIcon className="h-4 w-4" />
          New
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {[...items]
          .sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false))
          .slice(0, 2)
          .map((item, i) => {
            const { Icon, tone, title, body, time, pinned } = item;
            return (
              <button
                key={`${title}-${i}`}
                type="button"
                onClick={() => setView(item)}
                className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-neutral-50"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-neutral-900">
                        {title}
                      </span>
                      {pinned && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          Pinned
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {time}
                    </span>
                  </div>
                  {body && (
                    <p className="truncate text-sm text-neutral-500">{body}</p>
                  )}
                </div>
              </button>
            );
          })}
      </div>

      {/* Detail modal */}
      {view && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() => setView(null)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${view.tone}`}
                >
                  <view.Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {view.title}
                    </h3>
                    {view.pinned && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400">{view.time}</span>
                </div>
              </div>
              <button
                onClick={() => setView(null)}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {view.body && (
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                {view.body}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => togglePin(view)}
                className="h-9 cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {view.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={() => remove(view)}
                className="h-9 cursor-pointer rounded-lg bg-primary px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose modal */}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                New announcement
              </h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Holiday hours this week"
                  autoFocus
                  className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Message
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  placeholder="Write your announcement…"
                  className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Icon
                </label>
                <div className="flex gap-2">
                  {iconOptions.map(({ Icon, tone }, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIconIdx(i)}
                      aria-label={`Icon ${i + 1}`}
                      aria-pressed={iconIdx === i}
                      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition ${tone} ${
                        iconIdx === i
                          ? "ring-2 ring-primary ring-offset-1"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-primary"
                />
                Pin this announcement
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="h-9 cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={post}
                disabled={!title.trim()}
                className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
