"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Configuration ───────────────────────────────────────────────────────────

const STAR_COUNT_DESKTOP = 5000;
const STAR_COUNT_MOBILE = 2000;

// ⭐ KAYAN YILDIZ AYARLARI — Daha belirgin için artırıldı
const MAX_SHOOTING_STARS = 12;          // 5 → 12 (daha fazla eşzamanlı yıldız)
const SHOOTING_TRAIL_LENGTH = 60;       // 30 → 60 (daha uzun, daha akıcı iz)
const SHOOTING_SPAWN_MIN = 0.6;         // 2s → 0.6s (çok daha sık spawn)
const SHOOTING_SPAWN_MAX = 1.8;         // 5s → 1.8s
const SHOOTING_HEAD_SIZE = 1.2;         // 0.35 → 1.2 (kalın parlak kafa)
const SHOOTING_GLOW_OPACITY = 1.0;      // 0.9 → 1.0 (tam opaklık)

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

// ─── ShootingStars ───────────────────────────────────────────────────────────
// ⭐ Tamamen yeniden yazıldı: Line2 yerine yoğun Points dizisi ile yumuşak iz

interface ShootingStar {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  speed: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; z: number }[];
}

function ShootingStars() {
  const ref = useRef<THREE.Points>(null);
  const stars = useRef<ShootingStar[]>([]);
  const lastSpawn = useRef(0);
  const initialized = useRef(false);

  const totalPoints = MAX_SHOOTING_STARS * SHOOTING_TRAIL_LENGTH;

  const initialPositions = useMemo(
    () => new Float32Array(totalPoints * 3),
    [totalPoints]
  );
  const initialSizes = useMemo(
    () => new Float32Array(totalPoints),
    [totalPoints]
  );
  const initialColors = useMemo(
    () => new Float32Array(totalPoints * 3),
    [totalPoints]
  );

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const time = state.clock.elapsedTime;
    const dt = Math.min(state.clock.getDelta(), 0.05);

    // İlk frame'de hemen birkaç yıldız doğursun ki kullanıcı beklemek zorunda kalmasın
    if (!initialized.current) {
      for (let i = 0; i < 3; i++) {
        const angle = Math.PI + (Math.random() - 0.5) * 0.4 + 0.3;
        stars.current.push({
          x: 16 + Math.random() * 3,
          y: 6 - i * 4,
          z: 0,
          dx: Math.cos(angle),
          dy: Math.sin(angle),
          speed: 20 + Math.random() * 8,
          life: 2.0,
          maxLife: 2.0,
          trail: [],
        });
      }
      initialized.current = true;
      lastSpawn.current = time;
    }

    // Spawn — Çok daha sık ve birden fazla aynı anda
    const spawnInterval =
      SHOOTING_SPAWN_MIN + Math.random() * (SHOOTING_SPAWN_MAX - SHOOTING_SPAWN_MIN);

    if (
      time - lastSpawn.current > spawnInterval &&
      stars.current.length < MAX_SHOOTING_STARS
    ) {
      // Bazen iki yıldız aynı anda doğsun (gerçekçilik için)
      const burstCount = Math.random() < 0.3 ? 2 : 1;

      for (let b = 0; b < burstCount; b++) {
        if (stars.current.length >= MAX_SHOOTING_STARS) break;

        // Açı: sağdan sola, hafif aşağı doğru (135° ± 20°)
        // Math.PI = sola, +0.3 = hafif aşağı
        const angle = Math.PI + (Math.random() - 0.5) * 0.6 + 0.3;
        const speed = 18 + Math.random() * 12;
        const lifetime = 1.5 + Math.random() * 1.0;

        // Kameranın görüş alanı: x ±15, y ±8 (z=0'da, fov 60°)
        // Yıldızlar ekranın SAĞ KENARINDAN biraz dışarıdan başlasın, sola gitsin
        // Ya da ekranın ÜST KENARINDAN başlasın
        const fromRight = Math.random() < 0.7;

        const startX = fromRight
          ? 16 + Math.random() * 3              // Sağdan: 16-19
          : (Math.random() - 0.5) * 24;         // Üstten: -12 ile +12

        const startY = fromRight
          ? (Math.random() - 0.3) * 14          // Sağdan: -4.2 ile +9.8 (üst yarıda yoğun)
          : 9 + Math.random() * 2;              // Üstten: 9-11

        stars.current.push({
          x: startX,
          y: startY,
          z: 0,
          dx: Math.cos(angle),
          dy: Math.sin(angle),
          speed,
          life: lifetime,
          maxLife: lifetime,
          trail: [],
        });
      }
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

      // Hareket
      s.x += s.dx * s.speed * dt;
      s.y += s.dy * s.speed * dt;

      // İzi her frame'de birden fazla nokta ile doldur → daha yoğun iz
      const stepsPerFrame = 2;
      for (let step = 0; step < stepsPerFrame; step++) {
        s.trail.push({
          x: s.x - s.dx * s.speed * dt * (step / stepsPerFrame),
          y: s.y - s.dy * s.speed * dt * (step / stepsPerFrame),
          z: s.z,
        });
      }
      while (s.trail.length > SHOOTING_TRAIL_LENGTH) s.trail.shift();

      // Render
      const lifeFactor = s.life / s.maxLife; // 1 → 0 yaşadıkça

      for (let j = 0; j < s.trail.length; j++) {
        if (head >= totalPoints) break;

        const idx = head * 3;
        posArr[idx] = s.trail[j].x;
        posArr[idx + 1] = s.trail[j].y;
        posArr[idx + 2] = s.trail[j].z;

        // frac: 0 = en eski, 1 = en yeni (kafa)
        const frac = j / Math.max(s.trail.length - 1, 1);

        // Kafa büyük ve parlak, kuyruk ince ve sönük
        // Eksponansiyel azalma → daha sinematik
        const intensity = Math.pow(frac, 1.8);
        sizeArr[head] = SHOOTING_HEAD_SIZE * (0.1 + 0.9 * intensity) * lifeFactor;

        // Renk: kafa beyaz-mavi parlak, kuyruk cyan-mor
        // Kafada R/G yüksek (beyaz), kuyrukta R düşük (mavi-cyan)
        colorArr[idx] = 0.4 + 0.6 * intensity;       // R: kafa beyaz
        colorArr[idx + 1] = 0.7 + 0.3 * intensity;   // G: hep yüksek (cyan tonu)
        colorArr[idx + 2] = 1.0;                      // B: hep tam

        head++;
      }
    }

    // Kalan noktaları sıfırla (görünmesin)
    for (let i = head; i < totalPoints; i++) {
      sizeArr[i] = 0;
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
        size={0.25}                          // 0.15 → 0.25 (daha büyük baz boyut)
        sizeAttenuation
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={SHOOTING_GLOW_OPACITY}
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
    <>
      {/* Nebula ve sabit yıldızlar parallax içinde — derinlik hissi */}
      <MouseParallax>
        <Nebula />
        <StarField />
        <CosmicDust />
      </MouseParallax>

      {/* Shooting stars parallax DIŞINDA — sahnenin önünde, hep aynı düzlemde */}
      <ShootingStars />
    </>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function SpaceBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at center, #000000 0%, #0a0e27 100%)",
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