"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Configuration ───────────────────────────────────────────────────────────

const STAR_COUNT_DESKTOP = 5000;
const STAR_COUNT_MOBILE = 2000;
const MAX_SHOOTING_STARS = 5;
const SHOOTING_TRAIL_LENGTH = 30;
const COSMIC_DUST_COUNT = 400;
const MOBILE_BREAKPOINT = 768;

// ─── StarField ───────────────────────────────────────────────────────────────

function StarField() {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
  const count = isMobile ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;

  const ref = useRef<THREE.Points>(null);

  const { positions, baseSizes, phases, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    const cl = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      sz[i] = 0.5 + Math.random() * 1.5;
      ph[i] = Math.random() * Math.PI * 2;

      const shift = Math.random() * 0.35;
      cl[i * 3] = 1 - shift;
      cl[i * 3 + 1] = 1 - shift * 0.5;
      cl[i * 3 + 2] = 1;
    }

    return { positions: pos, baseSizes: sz, phases: ph, colors: cl };
  }, [count]);

  const initialSizes = useMemo(() => new Float32Array(count).fill(1), [count]);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const attr = points.geometry.attributes.size;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i] = baseSizes[i] * (0.6 + 0.4 * Math.sin(t * 1.5 + phases[i]));
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={initialSizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── ShootingStars ──────────────────────────────────────────────────────────

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  life: number;
  trail: { x: number; y: number }[];
}

function ShootingStars() {
  const ref = useRef<THREE.Points>(null);
  const stars = useRef<ShootingStar[]>([]);
  const lastSpawn = useRef(0);

  const totalPoints = MAX_SHOOTING_STARS * SHOOTING_TRAIL_LENGTH;

  const initialPositions = useMemo(
    () => new Float32Array(totalPoints * 3),
    []
  );
  const initialSizes = useMemo(() => new Float32Array(totalPoints), []);
  const initialColors = useMemo(() => new Float32Array(totalPoints * 3), []);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const time = state.clock.elapsedTime;
    const dt = Math.min(state.clock.getDelta(), 0.05);

    if (
      time - lastSpawn.current > 2 + Math.random() * 3 &&
      stars.current.length < MAX_SHOOTING_STARS
    ) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      const speed = 25 + Math.random() * 15;
      stars.current.push({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 20 + 6,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        speed,
        life: 1.5,
        trail: [],
      });
      lastSpawn.current = time;
    }

    const posAttr = points.geometry.attributes.position;
    const sizeAttr = points.geometry.attributes.size;
    const colorAttr = points.geometry.attributes.color;
    const posArr = posAttr.array as Float32Array;
    const sizeArr = sizeAttr.array as Float32Array;
    const colorArr = colorAttr.array as Float32Array;

    let head = 0;

    for (let i = stars.current.length - 1; i >= 0; i--) {
      const s = stars.current[i];
      s.life -= dt;

      if (s.life <= 0) {
        stars.current.splice(i, 1);
        continue;
      }

      s.x += s.dx * s.speed * dt;
      s.y += s.dy * s.speed * dt;
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > SHOOTING_TRAIL_LENGTH) s.trail.shift();

      for (let j = 0; j < s.trail.length; j++) {
        const idx = (head + j) * 3;
        posArr[idx] = s.trail[j].x;
        posArr[idx + 1] = s.trail[j].y;
        posArr[idx + 2] = 0;

        const frac = j / s.trail.length;
        const trailSize = 0.35 * (1 - frac * 0.85);
        sizeArr[head + j] = trailSize;

        colorArr[idx] = 0.2 + 0.8 * (1 - frac);
        colorArr[idx + 1] = 0.6 + 0.4 * (1 - frac);
        colorArr[idx + 2] = 1;
      }

      head += s.trail.length;
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    points.geometry.setDrawRange(0, head);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={totalPoints}
          array={initialPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={totalPoints}
          array={initialSizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={totalPoints}
          array={initialColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </points>
  );
}

// ─── Nebula ──────────────────────────────────────────────────────────────────

function Nebula() {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(
    () => [
      { pos: [-14, -4, -25], color: "#6a0dad", radius: 8 },
      { pos: [13, 7, -30], color: "#1e3a8a", radius: 10 },
      { pos: [-4, -10, -35], color: "#4c1d95", radius: 6 },
    ] as { pos: [number, number, number]; color: string; radius: number }[],
    []
  );

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0004;
      groupRef.current.rotation.x += 0.00015;
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <sphereGeometry args={[c.radius, 24, 24]} />
          <meshBasicMaterial
            color={c.color}
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── CosmicDust ─────────────────────────────────────────────────────────────

function CosmicDust() {
  const ref = useRef<THREE.Points>(null);
  const count = COSMIC_DUST_COUNT;

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, [count]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      arr[idx] += Math.sin(t * 0.2 + phases[i]) * 0.002;
      arr[idx + 1] += Math.cos(t * 0.15 + phases[i] * 1.3) * 0.002;
    }
    attr.needsUpdate = true;
  });

  const initialPositions = useMemo(
    () => new Float32Array(positions),
    [positions]
  );

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.25}
        color="#a78bfa"
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── MouseParallax ──────────────────────────────────────────────────────────

function MouseParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    g.position.x += (pointer.x * 2 - g.position.x) * 0.04;
    g.position.y += (pointer.y * 2 - g.position.y) * 0.04;
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <MouseParallax>
      <Nebula />
      <StarField />
      <CosmicDust />
      <ShootingStars />
    </MouseParallax>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function SpaceBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, #000000 0%, #0a0e27 100%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 80 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
