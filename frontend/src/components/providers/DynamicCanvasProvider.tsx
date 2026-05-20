"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "@/components/canvas/Scene";

export default function DynamicCanvasProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 5] }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
