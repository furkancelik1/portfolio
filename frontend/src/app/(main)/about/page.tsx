"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EXPERIENCE = [
  {
    company: "WordPress Giftshop Project",
    role: "Web Developer & Project Manager",
    period: "Ağustos 2024 — Devam",
    tasks: [
      "WooCommerce ile canlı e-ticaret platformu kurumu",
      "Ürün yönetimi, envanter ve ödeme sistemi entegrasyonu",
      "Özel Tailwind CSS tasarımı ve kategori menüsü konfigürasyonu",
      "Site optimizasyonu ve müşteri desteği yönetimi",
    ],
  },
  {
    company: "Mozaik Bilişim",
    role: "Frontend & Database Developer (Stajyer)",
    period: "Temmuz 2024 — Ağustos 2024",
    tasks: [
      "Web tabanlı uygulamalar için frontend komponentleri geliştirildi",
      "Veritabanı mimarisi ve implementasyon çalışmaları",
      "Yazılım ekipleriyle problem çözme süreçlerine katılım",
    ],
  },
];

const EDUCATION = [
  {
    school: "Bandırma Onyedi Eylül Üniversitesi",
    department: "Web Design and Coding",
    period: "2024 — Devam",
    description: undefined,
  },
  {
    school: "GOIT Education",
    department: "Full Stack Developer Eğitimi",
    period: "Tamamlandı",
    description: "React, Node.js, MongoDB, Advanced JS, State Management, REST APIs",
  },
  {
    school: "Çözen Education",
    department: "İngilizce Dil Eğitimi B2",
    period: "Tamamlandı",
    description: undefined,
  },
  {
    school: "Celal Bayar Üniversitesi",
    department: "Bilgisayar Teknolojileri",
    period: "2022 — 2024",
    description: undefined,
  },
];

const SKILLS: { category: string; items: string[] }[] = [
  {
    category: "Programlama Dilleri",
    items: ["JavaScript (Advanced)", "HTML5", "CSS3", "SQL"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Responsive Design", "UI/UX", "Framer Motion", "Three.js"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "TypeScript"],
  },
  {
    category: "Veritabanı",
    items: ["MongoDB", "PostgreSQL", "Prisma ORM", "Database Design"],
  },
  {
    category: "CMS & E-Ticaret",
    items: ["WordPress", "WooCommerce", "Plugin Development"],
  },
  {
    category: "Araçlar",
    items: ["Git", "GitHub", "VS Code", "npm", "Render", "Vercel", "Supabase"],
  },
];

const STATS = [
  { value: "2+", label: "Yıl Deneyim" },
  { value: "10+", label: "Tamamlanan Proje" },
  { value: "3", label: "Teknoloji Stack" },
  { value: "B2", label: "İngilizce Seviye" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="mx-auto max-w-5xl space-y-24">

        {/* ── Section 1: Hero ── */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <motion.div {...fadeUp(0)} className="space-y-6">
            <p className="text-xs tracking-widest uppercase text-white/30 font-mono">
              Hakkımda
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ahmet Furkan Çelik
            </h1>
            <p className="text-lg font-medium bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Web Developer &amp; Full Stack Developer
            </p>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Modern web teknolojileriyle performanslı, ölçeklenebilir ve estetik
              dijital deneyimler inşa ediyorum. React'tan Three.js'e, Node.js'ten
              PostgreSQL'e geniş bir yelpazede çalışıyorum.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-5 pt-2">
              <a
                href="https://github.com/furkancelik1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/80 transition-colors duration-200"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/80 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="mailto:furkan.celik35@outlook.com"
                className="text-white/30 hover:text-white/80 transition-colors duration-200"
                aria-label="Email"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Right: stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-1"
              >
                <span className="text-4xl font-bold text-violet-400">{s.value}</span>
                <span className="text-xs text-white/40 leading-tight">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Section 2: Experience ── */}
        <motion.section {...fadeUp(0.1)} className="space-y-8">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-mono">
            Deneyim
          </h2>
          <div className="relative pl-6 space-y-10">
            {/* Vertical line */}
            <div className="absolute left-0 top-2 bottom-2 w-px bg-violet-500/20" />

            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.12 }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full bg-violet-500/70 border border-violet-400/40" />

                <div className="space-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-semibold text-white">{exp.company}</span>
                    <span className="text-violet-400 text-sm">{exp.role}</span>
                  </div>
                  <p className="font-mono text-xs text-white/25">{exp.period}</p>
                  <ul className="mt-3 space-y-1.5">
                    {exp.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2 text-sm text-white/50">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-500/50 shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Section 3: Education ── */}
        <motion.section {...fadeUp(0.2)} className="space-y-8">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-mono">
            Eğitim
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {EDUCATION.map((edu, i) => (
              <motion.div
                key={edu.school + edu.department}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 space-y-1.5"
              >
                <p className="font-semibold text-white text-sm">{edu.school}</p>
                <p className="text-violet-400 text-sm">{edu.department}</p>
                <p className="font-mono text-xs text-white/30">{edu.period}</p>
                {edu.description && (
                  <p className="text-xs text-white/40 pt-1 leading-relaxed">{edu.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Section 4: Skills ── */}
        <motion.section {...fadeUp(0.25)} className="space-y-8">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-mono">
            Teknik Beceriler
          </h2>
          <div className="space-y-6">
            {SKILLS.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 + i * 0.07 }}
                className="space-y-3"
              >
                <p className="text-xs uppercase tracking-wider text-white/40 font-mono">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm text-white/60 border border-zinc-800/50 bg-zinc-900/40 rounded-lg transition-colors duration-200 hover:border-violet-500/30 hover:text-white/90 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Section 5: CV Download ── */}
        <motion.section {...fadeUp(0.3)} className="flex flex-col items-center gap-3 pt-4">
          <a
            href="/Furkan_Celik_CV.pdf"
            download
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-300 text-sm hover:bg-violet-500/20 hover:border-violet-400/60 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            CV İndir
          </a>
          <p className="text-[11px] font-mono text-white/25 tracking-wider">PDF · Güncel · TR/EN</p>
        </motion.section>

      </div>
    </main>
  );
}
