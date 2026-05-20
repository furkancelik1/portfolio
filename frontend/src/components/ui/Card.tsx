"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
}

export default function Card({
  title,
  description,
  tags,
  imageUrl,
  githubUrl,
  liveUrl,
}: CardProps) {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !imageUrl || imgError;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative z-30 flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-lg transition-colors hover:border-zinc-700"
    >
      <div className="relative z-40 h-48 w-full overflow-hidden rounded-t-xl">
        {showPlaceholder ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950">
            <span className="rounded-md border border-zinc-800/80 bg-zinc-900/60 px-3 py-1 font-mono text-sm tracking-wider text-zinc-500">
              {title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-grow flex-col p-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/50">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs text-violet-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              className="text-sm text-white/40 transition-colors hover:text-white"
            >
              GitHub
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              className="text-sm text-white/40 transition-colors hover:text-white"
            >
              Canlı
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
