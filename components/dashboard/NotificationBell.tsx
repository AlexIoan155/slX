"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { listNotifications, markNotificationRead } from "@/services/notification.service";
import { formatDate } from "@/utils/format";
import type { NotificationRow } from "@/types/database";

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient()).current;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleOpen() {
    setOpen((o) => !o);
    if (!loaded) {
      try {
        const data = await listNotifications(supabase, userId);
        setNotifications(data);
      } finally {
        setLoaded(true);
      }
    }
  }

  async function handleMarkRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    try {
      await markNotificationRead(supabase, id);
    } catch {
      // Non-critical — the next full reload will re-sync read state.
    }
  }

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated text-ink-muted hover:text-ink"
        aria-label="Notificări"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-alert-to text-[10px] font-semibold text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="glass absolute right-0 top-11 z-50 w-80 rounded-2xl border border-surface-border p-2 shadow-card">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-ink-faint">Notificări</div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3 py-4 text-sm text-ink-muted">Nu ai notificări momentan.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`block w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-elevated ${
                    n.read_at ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    {!n.read_at && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-alert-to" />}
                  </div>
                  {n.body && <p className="mt-0.5 text-xs text-ink-muted">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-ink-faint">{formatDate(n.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
