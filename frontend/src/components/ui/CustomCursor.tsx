"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const ringX = useSpring(cursorX, { damping: 25, stiffness: 180, mass: 1.0 });
  const ringY = useSpring(cursorY, { damping: 25, stiffness: 180, mass: 1.0 });

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] size-1 rounded-full bg-white"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9998] size-8 rounded-full border border-indigo-400/50"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 24px 6px rgba(99, 102, 241, 0.35), 0 0 48px 12px rgba(99, 102, 241, 0.15)",
        }}
      />
    </>
  );
}
