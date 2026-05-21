"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getMessages,
  markMessageRead,
  deleteMessage,
  type ContactMessage,
} from "@/lib/admin-api";

export default function AdminMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMessages() {
    try {
      setError("");
      const data = await getMessages();
      setMessages(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) fetchMessages();
  }, [session]);

  async function handleMarkRead(id: number) {
    try {
      await markMessageRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gelen Mesajlar</h1>
        <span className="text-sm text-white/40">
          {messages.length} mesaj
        </span>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="mt-20 text-center text-white/30">
          Henüz mesaj yok.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border px-5 py-4 transition ${
                msg.isRead
                  ? "border-white/[0.04] bg-white/[0.02]"
                  : "border-indigo-500/20 bg-indigo-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-white">
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                        YENİ
                      </span>
                    )}
                    <span className="ml-auto text-xs text-white/30">
                      {new Date(msg.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="mt-0.5 block text-xs text-indigo-400/70 hover:text-indigo-300"
                  >
                    {msg.email}
                  </a>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {msg.message}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkRead(msg.id)}
                      className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:text-white/80"
                      title="Okundu işaretle"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-red-400/60 transition hover:border-red-400/30 hover:text-red-400"
                    title="Sil"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
