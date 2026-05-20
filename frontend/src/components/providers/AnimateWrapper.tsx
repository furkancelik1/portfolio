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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
