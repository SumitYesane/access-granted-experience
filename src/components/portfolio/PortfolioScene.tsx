import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const CYAN = "#7df9ff";
const BLUE = "#33b8ff";
const VIOLET = "#c86bff";
const MAGENTA = "#ff8cf5";
const SOFT = "#eef8ff";

function WireSphere({ scale = 1 }: { scale?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += dt * 0.14;
    group.current.rotation.x = Math.sin(t * 0.35) * 0.16;
    group.current.rotation.z = Math.cos(t * 0.22) * 0.08;
  });
  return (
    <group ref={group} scale={scale}>
      <mesh scale={1.08}>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshPhysicalMaterial
          color="#14204f"
          emissive={VIOLET}
          emissiveIntensity={0.42}
          transparent
          opacity={0.34}
          roughness={0.12}
          metalness={0.45}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
      <mesh scale={0.72}>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshBasicMaterial color={MAGENTA} transparent opacity={0.18} />
      </mesh>
      <mesh scale={0.96}>
        <sphereGeometry args={[1.35, 28, 28]} />
        <meshBasicMaterial color={BLUE} wireframe transparent opacity={0.14} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.84} />
      </mesh>
      <mesh scale={1.15}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.38} />
      </mesh>
      <mesh scale={0.6}>
        <octahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial color={SOFT} wireframe transparent opacity={0.58} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]} scale={[1.05, 1.05, 1.05]}>
        <torusGeometry args={[1.95, 0.02, 12, 120]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[0.55, 0.6, Math.PI / 2]} scale={[0.92, 0.92, 0.92]}>
        <torusGeometry args={[2.08, 0.018, 12, 120]} />
        <meshBasicMaterial color={SOFT} transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[1.15, 0.15, 0.35]} scale={[0.86, 0.86, 0.86]}>
        <torusGeometry args={[2.22, 0.012, 10, 120]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 600 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.05 + Math.random() * 0.52;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.cos(phi);
      arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);
  const ref = useRef<THREE.Points>(null!);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += dt * 0.05;
    ref.current.rotation.z = Math.sin(t * 0.2) * 0.08;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={CYAN}
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.92}
      />
    </Points>
  );
}

function ConstellationLines() {
  const { lines, dots } = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    const dots: [number, number, number][] = [];
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 28; i++) {
      const radius = 1.72 + Math.random() * 0.1;
      const theta = (i / 28) * Math.PI * 2;
      const phi = 0.48 + (Math.random() - 0.5) * 2.1;
      const node =
        new THREE.Vector3(
          radius * Math.cos(theta) * Math.cos(phi),
          radius * Math.sin(phi),
          radius * Math.sin(theta) * Math.cos(phi),
        );
      nodes.push(node);
      dots.push([node.x, node.y, node.z]);
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.2) lines.push([nodes[i], nodes[j]]);
      }
    }
    return { lines, dots };
  }, []);

  return (
    <group>
      {lines.map((s, i) => (
        <Line
          key={i}
          points={[s[0], s[1]]}
          color={i % 4 === 0 ? MAGENTA : i % 2 === 0 ? CYAN : BLUE}
          opacity={0.4}
          transparent
          lineWidth={1}
        />
      ))}
      {dots.map((dot, i) => (
        <mesh key={`dot-${i}`} position={dot as [number, number, number]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshBasicMaterial color={i % 5 === 0 ? MAGENTA : i % 2 === 0 ? CYAN : SOFT} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitRings() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z += dt * 0.035;
    ref.current.rotation.y = Math.sin(t * 0.18) * 0.18;
    ref.current.rotation.x = Math.cos(t * 0.15) * 0.08;
  });

  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2.5, 0.3, 0.12]} scale={[1.24, 1.24, 1.24]}>
        <torusGeometry args={[2.35, 0.028, 18, 220]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.58} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.3, 0.12]} scale={[1.36, 1.14, 1.14]}>
        <torusGeometry args={[2.5, 0.014, 12, 220]} />
        <meshBasicMaterial color={SOFT} transparent opacity={0.32} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.3, 0.12]} scale={[1.48, 1.06, 1.06]}>
        <torusGeometry args={[2.68, 0.012, 10, 220]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.28} />
      </mesh>
      <Points
        positions={new Float32Array(
          Array.from({ length: 180 }, (_, i) => {
            const a = (i / 180) * Math.PI * 2;
            return [
              Math.cos(a) * 3.1,
              Math.sin(a * 2.2) * 0.08,
              Math.sin(a) * 1.65,
            ];
          }).flat(),
        )}
        stride={3}
      >
        <PointMaterial
          transparent
          color={SOFT}
          size={0.03}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
        />
      </Points>
    </group>
  );
}

function SphereCluster({ scale = 1 }: { scale?: number }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.42) * 0.06;
    ref.current.rotation.y += dt * 0.04;
  });

  return (
    <group ref={ref} scale={scale}>
      <ParticleField />
      <ConstellationLines />
      <WireSphere />
      <OrbitRings />
    </group>
  );
}

function SceneContents({ sphereScale = 1 }: { sphereScale?: number }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <pointLight position={[2.4, 1.8, 3.2]} color={CYAN} intensity={14} distance={12} />
      <pointLight position={[-3.5, -1.5, 1.4]} color={VIOLET} intensity={13} distance={10} />
      <pointLight position={[0.2, 0.1, 2.8]} color={SOFT} intensity={10} distance={8} />
      <group position={[0, 0.35, 0]}>
        <SphereCluster scale={sphereScale} />
      </group>
    </>
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
      <SceneContents sphereScale={0.85} />

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
      <SceneContents />

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
