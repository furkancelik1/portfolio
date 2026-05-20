"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  views: number;
  createdAt: string;
}

const FALLBACK_POSTS: Post[] = [
  {
    id: "1",
    slug: "nextjs-prisma-supabase-saas",
    title: "Next.js + Prisma + Supabase ile SaaS Uygulama Geliştirdim",
    excerpt:
      "NextAuth v4, Prisma v6 ve Supabase PostgreSQL kullanarak production'a aldığım tracking-app projesinde karşılaştığım sorunlar ve çözümleri: session stratejisi, adapter uyumsuzlukları ve Vercel deploy süreci.",
    tags: ["Next.js", "Prisma", "Supabase", "SaaS"],
    readingTime: 12,
    views: 0,
    createdAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "2",
    slug: "threejs-uzay-arka-plani",
    title: "Three.js ile Portfolyoma Uzay Arka Planı Yaptım",
    excerpt:
      "React Three Fiber ve vanilla Three.js kullanarak yıldız alanı, kayan yıldızlar, nebula ve kozmik toz efektlerini nasıl oluşturduğumu anlattım. Performance optimizasyonu ve mobile uyumluluk detayları.",
    tags: ["Three.js", "React", "WebGL", "Creative"],
    readingTime: 10,
    views: 0,
    createdAt: "2025-04-20T00:00:00Z",
  },
  {
    id: "3",
    slug: "fullstack-twitter-clone",
    title: "MERN Stack ile Twitter Clone: JWT Auth ve Socket.io",
    excerpt:
      "MongoDB, Express, React ve Node.js kullanarak gerçek zamanlı Twitter klonu geliştirdim. JWT ile kimlik doğrulama, bcrypt şifreleme ve Socket.io entegrasyonu.",
    tags: ["MERN", "Socket.io", "JWT", "MongoDB"],
    readingTime: 15,
    views: 0,
    createdAt: "2025-03-15T00:00:00Z",
  },
  {
    id: "4",
    slug: "stajdan-ogrendiklerim-mozaik-bilisim",
    title: "Mozaik Bilişim Stajından Öğrendiklerim",
    excerpt:
      "Production ortamında çalışmanın getirdiği sorumluluklar, ekip içi iletişim, kod review süreçleri ve gerçek proje deneyiminin bootcamp'ten farkı.",
    tags: ["Kariyer", "Staj", "Backend", "Frontend"],
    readingTime: 8,
    views: 0,
    createdAt: "2025-02-10T00:00:00Z",
  },
];

const TAG_COLORS: Record<string, string> = {
  "Next.js": "text-white/70 border-white/15 bg-white/5",
  "React": "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  "TypeScript": "text-blue-400 border-blue-500/20 bg-blue-500/5",
  "WebGL": "text-purple-400 border-purple-500/20 bg-purple-500/5",
  "Creative": "text-pink-400 border-pink-500/20 bg-pink-500/5",
  "Frontend": "text-sky-400 border-sky-500/20 bg-sky-500/5",
  "Backend": "text-orange-400 border-orange-500/20 bg-orange-500/5",
  "Prisma": "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
  "Supabase": "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  "SaaS": "text-violet-400 border-violet-500/20 bg-violet-500/5",
  "MERN": "text-orange-400 border-orange-500/20 bg-orange-500/5",
  "Socket.io": "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
  "JWT": "text-red-400 border-red-500/20 bg-red-500/5",
  "MongoDB": "text-green-400 border-green-500/20 bg-green-500/5",
  "Kariyer": "text-pink-400 border-pink-500/20 bg-pink-500/5",
  "Staj": "text-sky-400 border-sky-500/20 bg-sky-500/5",
  "Three.js": "text-violet-400 border-violet-500/20 bg-violet-500/5",
};

function tagClass(tag: string) {
  return TAG_COLORS[tag] ?? "text-white/50 border-white/10 bg-white/3";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const ALL_TAGS = Array.from(new Set(FALLBACK_POSTS.flatMap((p) => p.tags)));

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activeTag
        ? FALLBACK_POSTS.filter((p) => p.tags.includes(activeTag))
        : FALLBACK_POSTS,
    [activeTag]
  );

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="mx-auto max-w-3xl space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <p className="text-xs tracking-widest uppercase text-white/30 font-mono">Blog</p>
          <h1 className="text-4xl font-bold text-white">Yazılar</h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-lg">
            Projeler, öğrendiklerim ve web geliştirme üzerine kişisel notlar.
          </p>
        </motion.div>

        {/* Tag filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          <button
            onClick={() => setActiveTag(null)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs border transition-colors duration-150",
              activeTag === null
                ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                : "border-zinc-800/60 bg-transparent text-white/35 hover:text-white/60",
            ].join(" ")}
          >
            Tümü
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs border transition-colors duration-150",
                activeTag === tag
                  ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                  : "border-zinc-800/60 bg-transparent text-white/35 hover:text-white/60",
              ].join(" ")}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="group bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 hover:border-zinc-700/60 transition-colors duration-200"
              >
                <Link href={`/blog/${post.slug}`} className="block space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded-md text-[11px] border ${tagClass(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-white font-semibold text-base leading-snug group-hover:text-violet-200 transition-colors duration-200">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 pt-1 text-[11px] font-mono text-white/25">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>·</span>
                    <span>{post.readingTime} dk okuma</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-white/30 text-sm text-center py-12">
              Bu etikette yazı bulunamadı.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}
