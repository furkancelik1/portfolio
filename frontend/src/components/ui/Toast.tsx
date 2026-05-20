"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={
            "fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-6 py-4 text-sm shadow-2xl backdrop-blur-xl " +
            (type === "success"
              ? "border-violet-500/30 bg-zinc-950/90 text-violet-200"
              : "border-red-500/30 bg-zinc-950/90 text-red-200")
          }
        >
          <div className="flex items-center gap-3">
            <span
              className={
                "flex h-6 w-6 items-center justify-center rounded-full text-xs " +
                (type === "success"
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-red-500/20 text-red-400")
              }
            >
              {type === "success" ? "✓" : "!"}
            </span>
            <span>{message}</span>
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 300);
              }}
              className="ml-4 text-current opacity-40 transition-opacity hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
