"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

export default function AnimateWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const setCurrentRoute = useStore((s) => s.setCurrentRoute);

  useEffect(() => {
    setCurrentRoute(pathname);
  }, [pathname, setCurrentRoute]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
