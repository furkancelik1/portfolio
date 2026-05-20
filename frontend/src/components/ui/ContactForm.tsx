"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { sendContactMessage } from "@/lib/api";
import Toast from "./Toast";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FieldError {
  field: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const getFieldError = (field: string) =>
    fieldErrors.find((e) => e.field === field)?.message;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors([]);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFieldErrors([
        { field: "name", message: "Bu alan zorunlu" },
        { field: "email", message: "Bu alan zorunlu" },
        { field: "message", message: "Bu alan zorunlu" },
      ].filter((f) => !form[f.field as keyof FormData].trim()));
      return;
    }

    setLoading(true);

    try {
      const result = await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      if (result.success) {
        setToast({
          message: "Mesajınız kozmik ağa iletildi, Furkan en kısa sürede dönecek.",
          type: "success",
        });
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err: unknown) {
      const apiErr = err as { status?: number; message?: string; data?: unknown };

      if (apiErr.status === 400 && (apiErr.data as { errors?: FieldError[] })?.errors) {
        setFieldErrors((apiErr.data as { errors: FieldError[] }).errors);
      } else if (apiErr.status === 429) {
        setToast({ message: "Çok fazla istek gönderdiniz, lütfen biraz bekleyin.", type: "error" });
      } else {
        setToast({
          message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6 rounded-2xl border border-zinc-900/50 bg-zinc-950/40 p-8 backdrop-blur-lg"
      >
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-white/60">
            İsim
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={
              "w-full rounded-xl border bg-zinc-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/50 " +
              (getFieldError("name") ? "border-red-500/50" : "border-zinc-800/80")
            }
            placeholder="Adınız"
          />
          {getFieldError("name") && (
            <p className="mt-1 text-xs text-red-400">{getFieldError("name")}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-white/60">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={
              "w-full rounded-xl border bg-zinc-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/50 " +
              (getFieldError("email") ? "border-red-500/50" : "border-zinc-800/80")
            }
            placeholder="ornek@email.com"
          />
          {getFieldError("email") && (
            <p className="mt-1 text-xs text-red-400">{getFieldError("email")}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm text-white/60">
            Mesaj
          </label>
          <textarea
            id="message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={
              "w-full resize-none rounded-xl border bg-zinc-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/50 " +
              (getFieldError("message") ? "border-red-500/50" : "border-zinc-800/80")
            }
            placeholder="Mesajınız..."
          />
          {getFieldError("message") && (
            <p className="mt-1 text-xs text-red-400">{getFieldError("message")}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={
            "flex w-full items-center justify-center rounded-xl border border-violet-500/30 py-3 text-sm font-medium text-violet-200 transition-all " +
            (loading
              ? "cursor-not-allowed bg-violet-500/10"
              : "bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-500/50")
          }
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Gönderiliyor...
            </span>
          ) : (
            "Gönder"
          )}
        </button>
      </motion.form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
