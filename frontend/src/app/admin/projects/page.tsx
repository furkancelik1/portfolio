"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getProjects as fetchProjects } from "@/lib/api";
import {
  createProject,
  updateProject,
  deleteProject,
  type Project,
  type ProjectInput,
} from "@/lib/admin-api";

const emptyForm: ProjectInput = {
  title: "",
  description: "",
  content: "",
  tags: [],
  imageUrl: "",
  githubUrl: "",
  liveUrl: "",
};

export default function AdminProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setError("");
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) load();
  }, [session]);

  function startEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      content: p.content,
      tags: p.tags,
      imageUrl: p.imageUrl,
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setTagInput("");
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateProject(editingId, form);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p))
        );
      } else {
        const created = await createProject(form);
        setProjects((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError((e as Error).message);
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
        <h1 className="text-2xl font-bold text-white">Projeler</h1>
        {!editingId && (
          <button
            onClick={() => setForm(emptyForm)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            + Yeni Proje
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {(editingId || form.title || form.description) && (
        <form
          onSubmit={handleSave}
          className="mb-10 space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <h2 className="text-base font-semibold text-white">
            {editingId ? "Projeyi Düzenle" : "Yeni Proje"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/50">Başlık</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Görsel URL</label>
              <input
                required
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/50">Kısa Açıklama</label>
            <input
              required
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/50">İçerik</label>
            <textarea
              required
              rows={3}
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/50">GitHub URL</label>
              <input
                value={form.githubUrl || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, githubUrl: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Canlı URL</label>
              <input
                value={form.liveUrl || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, liveUrl: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/50">Etiketler</label>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs text-indigo-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-indigo-400/60 hover:text-indigo-200"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Etiket ekle..."
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500/60"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:text-white/80"
              >
                Ekle
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {saving
                ? "Kaydediliyor..."
                : editingId
                  ? "Güncelle"
                  : "Oluştur"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/10 px-5 py-2 text-sm text-white/50 transition hover:border-white/20 hover:text-white/80"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="mt-20 text-center text-white/30">
          Henüz proje yok.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-5 py-4 transition hover:border-white/[0.08]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-white">
                    {p.title}
                  </span>
                  <span className="text-xs text-white/30">
                    {new Date(p.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/50 line-clamp-1">
                  {p.description}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 pl-4">
                <button
                  onClick={() => startEdit(p)}
                  className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:text-white/80"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-red-400/60 transition hover:border-red-400/30 hover:text-red-400"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
