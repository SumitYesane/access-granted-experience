import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const NEON = "#5ef0ff";

function WireSphere({ scale = 1 }: { scale?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.15;
    group.current.rotation.x += dt * 0.05;
  });
  return (
    <group ref={group} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshBasicMaterial color={NEON} wireframe transparent opacity={0.85} />
      </mesh>
      <mesh scale={1.15}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color={NEON} wireframe transparent opacity={0.25} />
      </mesh>
      <mesh scale={0.6}>
        <octahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial color={NEON} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function FloatingCube({
  position,
  size = 0.85,
  speed = 1,
  delay = 0,
}: {
  position: [number, number, number];
  size?: number;
  speed?: number;
  delay?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(t * speed) * 0.15;
    ref.current.rotation.y += dt * 0.3 * speed;
    ref.current.rotation.x += dt * 0.12 * speed;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color={NEON} wireframe transparent opacity={0.9} />
      </mesh>
      <mesh scale={0.55}>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color={NEON} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 600 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
    }
    return arr;
  }, [count]);
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={NEON}
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function ConstellationLines() {
  const segments = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 22; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 8,
          -3 + (Math.random() - 0.5) * 4,
        ),
      );
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 3.2) lines.push([nodes[i], nodes[j]]);
      }
    }
    return lines;
  }, []);
  return (
    <group>
      {segments.map((s, i) => (
        <Line
          key={i}
          points={[s[0], s[1]]}
          color={NEON}
          opacity={0.15}
          transparent
          lineWidth={1}
        />
      ))}
    </group>
  );
}

export function PortfolioSphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <group position={[0, 0.4, 0]}>
        <WireSphere scale={0.85} />
      </group>

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}

export default function PortfolioScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#02030a", 6, 16]} />

      <ConstellationLines />
      <ParticleField />

      <group position={[0, 0.4, 0]}>
        <WireSphere />
      </group>

      <EffectComposer>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
