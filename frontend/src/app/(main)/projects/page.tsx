"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
}

// Görsellerin public içerisindeki tam ve sarsılmaz yolları
const localImages: Record<string, string> = {
  "yasin-karakurt": "/images/projects/yasin-karakurt.jpg",
  "tracking-app": "/images/projects/gym-app.jpg",
};

const fallbackProjects: Project[] = [
  {
    id: "yasin-karakurt",
    title: "Yasin Karakurt Coaching Platform",
    description: "Real-time Socket.io bildirimleri, su/beslenme takibi, kişiselleştirilmiş antrenman yönetimi ve entegre subscription ödeme altyapısı barındıran lüks full-stack fitness yönetim platformu.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Socket.io"],
    imageUrl: localImages["yasin-karakurt"],
    githubUrl: "https://github.com/furkancelik1/yasin-karakurt",
  },
  {
    id: "tracking-app",
    title: "Kozmik Alışkanlık & Rutin Takip Platformu (Tracking App)",
    description: "Kullanıcıların günlük disiplin ritimlerini izleyen fütüristik PWA. Gelişmiş Recharts istatistik grafikleri, Stripe API entegrasyonu, canlı düello arenası ve oyunlaştırma modülleri içerir.",
    tags: ["Next.js 15", "TypeScript", "Prisma ORM", "Stripe API", "PWA"],
    imageUrl: localImages["tracking-app"],
    githubUrl: "https://github.com/furkancelik1/tracking-app",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    fetch(`${apiUrl}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedData = data.map((proj: any, index: number) => {
            return {
              ...proj,
              id: proj.id || proj._id || (index === 0 ? "tracking-app" : "yasin-karakurt"),
              // İNDEX BAZLI KESİN EŞLEŞTİRME
              imageUrl: index === 0 ? localImages["tracking-app"] : localImages["yasin-karakurt"],
            };
          });
          setProjects(mappedData);
        } else {
          setProjects(fallbackProjects);
        }
      })
      .catch(() => {
        console.error("API hatası, premium fallback devrede.");
        setProjects(fallbackProjects);
      });
  }, []);

  return (
    <section className="min-h-screen px-6 pt-32 pb-20 relative z-30">

      <div className="mx-auto max-w-6xl relative z-30">
        <h1 className="text-4xl font-bold text-white sm:text-5xl tracking-tight">Projeler</h1>
        <p className="mt-4 text-white/50 font-medium">
          Üzerinde çalıştığım modern web projeleri
        </p>

        {/* Proje Kartları Grid Yapısı */}
        <div className="relative z-30 mt-12 grid gap-8 sm:grid-cols-2">
          {projects.map((project, index) => {
            // İNDEX BAZLI GÖRSEL YER DEĞİŞİMİ
            // index 0 -> tracking-app (gym-app.jpg)
            // index 1 -> yasin-karakurt (yasin-karakurt.jpg)
            const finalImgSrc = index === 0 ? localImages["tracking-app"] : localImages["yasin-karakurt"];

            return (
              <div
                key={project.id || index}
                className="group flex flex-col h-full rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-lg overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-2xl"
              >
                {/* Görsel Alanı (Kesinlikle En Üstte) */}
                <div className="relative w-full h-52 overflow-hidden z-40 bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 border-b border-zinc-900/50">
                  <Image
                    src={finalImgSrc}
                    alt={project.title}
                    fill
                    unoptimized={true}
                    sizes="(max-w-768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* İçerik Alanı (Altta) */}
                <div className="p-6 flex flex-col flex-grow bg-zinc-950/20">
                  <h3 className="text-xl font-semibold text-white tracking-wide">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-zinc-400 text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  
                  {/* Premium Teknolojik Etiketler */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-semibold tracking-wider bg-zinc-900/80 text-indigo-400 px-2.5 py-1 rounded border border-indigo-500/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Proje Linkleri Bölümü */}
                  <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center gap-4 text-xs font-mono">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors duration-200"
                      >
                        // GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                      >
                        // Canlı Gösterim
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}