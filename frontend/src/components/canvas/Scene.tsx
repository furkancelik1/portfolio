"use client";

import { useRef, useMemo } from "react";
import { Vector3, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, Group } from "three";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useStore } from "@/lib/store";

const NODE_COUNT = 120;
const CONNECT_DIST = 5;
const MOUSE_PARTICLE_COUNT = 80;
const MOUSE_PARTICLE_MAX = 40;

function createConstellation() {
  const nodePositions: Vector3[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const r = 2.5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    nodePositions.push(
      new Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.6,
        r * Math.cos(phi) * 0.5
      )
    );
  }

  const pairs: number[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < CONNECT_DIST) {
        pairs.push(i, j);
      }
    }
  }

  const pairCount = Math.floor(pairs.length / 2);
  const linePositions = new Float32Array(pairCount * 6);
  for (let k = 0; k < pairCount; k++) {
    const i = k * 2;
    const p1 = nodePositions[pairs[i]];
    const p2 = nodePositions[pairs[i + 1]];
    if (!p1 || !p2) continue;
    linePositions[k * 6] = p1.x;
    linePositions[k * 6 + 1] = p1.y;
    linePositions[k * 6 + 2] = p1.z;
    linePositions[k * 6 + 3] = p2.x;
    linePositions[k * 6 + 4] = p2.y;
    linePositions[k * 6 + 5] = p2.z;
  }

  const nodePos = new Float32Array(NODE_COUNT * 3);
  for (let i = 0; i < NODE_COUNT; i++) {
    nodePos[i * 3] = nodePositions[i].x;
    nodePos[i * 3 + 1] = nodePositions[i].y;
    nodePos[i * 3 + 2] = nodePositions[i].z;
  }

  return { nodePositions, nodePos, linePositions };
}

function MouseParticles({
  nodePositions,
  disabled,
}: {
  nodePositions: Vector3[];
  disabled?: boolean;
}) {
  const particleData = useRef(
    Array.from({ length: MOUSE_PARTICLE_COUNT }, () => ({
      pos: new Vector3(0, 0, 0),
      vel: new Vector3(),
      life: 0,
      connectedNode: 0,
    }))
  );
  const head = useRef(0);
  const activeCount = useRef(0);

  const particlePos = useMemo(
    () => new Float32Array(MOUSE_PARTICLE_COUNT * 3),
    []
  );
  const particleSizes = useMemo(
    () => new Float32Array(MOUSE_PARTICLE_COUNT),
    []
  );

  const connLinePos = useMemo(
    () => new Float32Array(MOUSE_PARTICLE_COUNT * 6),
    []
  );

  const particleGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(particlePos, 3));
    geo.setAttribute("aSize", new Float32BufferAttribute(particleSizes, 1));
    return geo;
  }, [particlePos, particleSizes]);

  const connGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(connLinePos, 3));
    return geo;
  }, [connLinePos]);

  const particleMat = useMemo(
    () => ({
      size: 0.06,
      color: "#7c3aed",
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    }),
    []
  );

  const tempVec = useMemo(() => new Vector3(), []);
  const tempVec2 = useMemo(() => new Vector3(), []);

  useFrame((state) => {
    const { pointer, camera, clock } = state;
    const dt = Math.min(clock.getDelta(), 0.05);

    if (disabled) return;

    tempVec.set(pointer.x, pointer.y, 0.5).unproject(camera);
    const dir = tempVec.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const mousePos = camera.position.clone().add(dir.clone().multiplyScalar(dist));

    const spawnCount = 2;
    for (let i = 0; i < spawnCount; i++) {
      const idx = (head.current + i) % MOUSE_PARTICLE_COUNT;
      const p = particleData.current[idx];
      p.pos.copy(mousePos);
      p.pos.x += (Math.random() - 0.5) * 0.3;
      p.pos.y += (Math.random() - 0.5) * 0.3;
      p.pos.z += (Math.random() - 0.5) * 0.15;
      p.vel.set(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.2
      );

      let nearestDist = Infinity;
      let nearestIdx = 0;
      for (let n = 0; n < nodePositions.length; n++) {
        const d = p.pos.distanceTo(nodePositions[n]);
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = n;
        }
      }
      p.connectedNode = nearestIdx;
      p.life = 1;
    }
    head.current = (head.current + spawnCount) % MOUSE_PARTICLE_COUNT;
    activeCount.current = Math.min(activeCount.current + spawnCount, MOUSE_PARTICLE_COUNT);

    const posAttr = particleGeo.attributes.position as Float32BufferAttribute;
    const sizeAttr = particleGeo.attributes.aSize as Float32BufferAttribute;
    const connAttr = connGeo.attributes.position as Float32BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const sizeArr = sizeAttr.array as Float32Array;
    const connArr = connAttr.array as Float32Array;

    let activeLines = 0;

    for (let i = 0; i < MOUSE_PARTICLE_COUNT; i++) {
      const p = particleData.current[i];
      if (p.life > 0) {
        p.pos.x += p.vel.x * dt;
        p.pos.y += p.vel.y * dt;
        p.pos.z += p.vel.z * dt;
        p.vel.multiplyScalar(0.95);
        p.life -= dt * 0.6;
        if (p.life < 0) p.life = 0;
      }

      posArr[i * 3] = p.pos.x;
      posArr[i * 3 + 1] = p.pos.y;
      posArr[i * 3 + 2] = p.pos.z;
      sizeArr[i] = p.life;

      if (p.life > 0.1) {
        const node = nodePositions[p.connectedNode];
        connArr[activeLines * 6] = p.pos.x;
        connArr[activeLines * 6 + 1] = p.pos.y;
        connArr[activeLines * 6 + 2] = p.pos.z;
        connArr[activeLines * 6 + 3] = node.x;
        connArr[activeLines * 6 + 4] = node.y;
        connArr[activeLines * 6 + 5] = node.z;
        activeLines++;
      }
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    connAttr.needsUpdate = true;
    connGeo.setDrawRange(0, activeLines * 2);
  });

  return (
    <>
      <points geometry={particleGeo}>
        <pointsMaterial
          size={particleMat.size}
          color={particleMat.color}
          sizeAttenuation={particleMat.sizeAttenuation}
          transparent={particleMat.transparent}
          opacity={particleMat.opacity}
          depthWrite={particleMat.depthWrite}
        />
      </points>
      <lineSegments geometry={connGeo}>
        <lineBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

export default function Scene() {
  const currentRoute = useStore((s) => s.currentRoute);
  const lineMatRef = useRef<LineBasicMaterial>(null!);
  const nodeMatRef = useRef<typeof PointMaterial.prototype>(null!);
  const groupRef = useRef<Group>(null!);

  const { nodePositions, nodePos, linePositions } = useMemo(
    () => createConstellation(),
    []
  );

  const lineGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  const targetCameraPos = useMemo(() => new Vector3(), []);
  const targetLookAt = useMemo(() => new Vector3(0, 0, 0), []);

  const isContact = currentRoute === "/contact";

  useFrame((state) => {
    const { camera } = state;
    const isProjects = currentRoute === "/projects";

    if (isProjects) {
      targetCameraPos.set(0, 0, 8);
    } else if (isContact) {
      targetCameraPos.set(4, 0, 0);
    } else {
      targetCameraPos.set(0, 0, 6);
    }

    camera.position.lerp(targetCameraPos, 0.06);
    camera.lookAt(targetLookAt);

    if (lineMatRef.current) {
      lineMatRef.current.opacity = isProjects ? 0.04 : 0.25;
    }

    if (nodeMatRef.current) {
      nodeMatRef.current.opacity = isProjects ? 0.15 : 0.5;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += isProjects ? 0 : 0.001;
    }
  });

  return (
    <>
      <ambientLight intensity={0.03} />

      {!isContact && (
        <group ref={groupRef}>
          <lineSegments geometry={lineGeo}>
            <lineBasicMaterial
              ref={lineMatRef}
              color="#4f46e5"
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </lineSegments>

          <Points positions={nodePos} stride={3}>
            <PointMaterial
              ref={nodeMatRef}
              size={0.08}
              color="#7c3aed"
              sizeAttenuation
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </Points>
        </group>
      )}

      {!isContact && (
        <MouseParticles nodePositions={nodePositions} disabled={currentRoute === "/projects"} />
      )}
    </>
  );
}
