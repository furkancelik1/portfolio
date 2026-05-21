"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { BlogPost } from "@/lib/blog";

const TAG_COLORS: Record<string, string> = {
  "Next.js": "text-white/70 border-white/15 bg-white/5",
  React: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  TypeScript: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  WebGL: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  Creative: "text-pink-400 border-pink-500/20 bg-pink-500/5",
  Frontend: "text-sky-400 border-sky-500/20 bg-sky-500/5",
  Backend: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  Prisma: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
  Supabase: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  SaaS: "text-violet-400 border-violet-500/20 bg-violet-500/5",
  MERN: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  "Socket.io": "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
  JWT: "text-red-400 border-red-500/20 bg-red-500/5",
  MongoDB: "text-green-400 border-green-500/20 bg-green-500/5",
  Kariyer: "text-pink-400 border-pink-500/20 bg-pink-500/5",
  Staj: "text-sky-400 border-sky-500/20 bg-sky-500/5",
  "Three.js": "text-violet-400 border-violet-500/20 bg-violet-500/5",
};

function tagClass(tag: string) {
  return TAG_COLORS[tag] ?? "text-white/50 border-white/10 bg-white/3";
}

function toLocale(locale: string) {
  return locale === "tr" ? "tr-TR" : locale === "es" ? "es-ES" : "en-US";
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(toLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getUniqueTags(posts: BlogPost[]) {
  return Array.from(new Set(posts.flatMap((p) => p.frontmatter.tags)));
}

export default function BlogList({
  posts,
  locale,
}: {
  posts: BlogPost[];
  locale: string;
}) {
  const t = useTranslations("blog");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activeTag
        ? posts.filter((p) => p.frontmatter.tags.includes(activeTag))
        : posts,
    [activeTag, posts]
  );

  const allTags = useMemo(() => getUniqueTags(posts), [posts]);

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="mx-auto max-w-3xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <p className="text-xs tracking-widest uppercase text-white/30 font-mono">
            {t("sectionLabel")}
          </p>
          <h1 className="text-4xl font-bold text-white">{t("title")}</h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-lg">
            {t("description")}
          </p>
        </motion.div>

        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={
                "px-3 py-1.5 rounded-lg text-xs border transition-colors duration-150 " +
                (activeTag === null
                  ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                  : "border-zinc-800/60 bg-transparent text-white/35 hover:text-white/60")
              }
            >
              {t("allTags")}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={
                  "px-3 py-1.5 rounded-lg text-xs border transition-colors duration-150 " +
                  (activeTag === tag
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                    : "border-zinc-800/60 bg-transparent text-white/35 hover:text-white/60")
                }
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((post, i) => (
              <motion.article
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="group bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 hover:border-zinc-700/60 transition-colors duration-200"
              >
                <Link href={`/blog/${post.slug}`} className="block space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {post.frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded-md text-[11px] border ${tagClass(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-white font-semibold text-base leading-snug group-hover:text-violet-200 transition-colors duration-200">
                    {post.frontmatter.title}
                  </h2>

                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                    {post.frontmatter.excerpt}
                  </p>

                  <div className="flex items-center gap-4 pt-1 text-[11px] font-mono text-white/25">
                    <span>{formatDate(post.frontmatter.date, locale)}</span>
                    <span>·</span>
                    <span>{post.readingTime} {t("readingTime")}</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-white/30 text-sm text-center py-12">
              {t("emptyState")}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
