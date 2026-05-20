"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const auraX = useTransform(smoothX, [0, 1], [-25, 25]);
  const auraY = useTransform(smoothY, [0, 1], [-25, 25]);

  const handleMouse = useCallback(
    (e: MouseEvent) => {
      const rect = sectionRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set(1 - (e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const el = sectionRef.current;
    el.addEventListener("mousemove", handleMouse);
    return () => el.removeEventListener("mousemove", handleMouse);
  }, [handleMouse]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          x: auraX,
          y: auraY,
          background:
            "radial-gradient(circle at center, rgba(124,58,237,0.15), transparent 70%)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <motion.span
          variants={itemVariants}
          className="mb-6 block text-xs tracking-[0.3em] uppercase text-white/40"
        >
          Full-Stack Developer & Designer
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="max-w-4xl text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-white"
        >
          Geleceğin Dijital Deneyimlerini{" "}
          <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
            İnşa Ediyorum
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-xl text-base text-white/50 leading-relaxed"
        >
          Modern web teknolojileri ile 3D görseller, akıcı animasyonlar ve
          minimalist tasarımları birleştiren üst düzey kullanıcı deneyimleri
          oluşturuyorum.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="/projects"
            className="rounded-full border border-violet-500/50 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500/10 hover:border-violet-400"
          >
            Projelerimi Gör
          </a>
          <a
            href="/contact"
            className="rounded-full px-6 py-3 text-sm font-medium text-white/50 transition-colors hover:text-white"
          >
            İletişime Geç
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
