import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, PointMaterial, Points } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const VOID = "#000000";
const CYAN = "#59efff";
const CYAN_BRIGHT = "#8bf8ff";
const BLUE = "#1ca8ff";
const VIOLET = "#b96dff";
const MAGENTA = "#f08cff";
const WHITE = "#f4fbff";

type Segment = [THREE.Vector3, THREE.Vector3];
type Dot = [number, number, number];

function latLonToVector(lat: number, lon: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function createShellNetwork() {
  const geometry = new THREE.IcosahedronGeometry(2.24, 2);
  const positions = geometry.attributes.position;
  const edges = new THREE.EdgesGeometry(geometry, 8);
  const edgePositions = edges.attributes.position;
  const dots: Dot[] = [];
  const lines: Segment[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < positions.count; i++) {
    const vertex = new THREE.Vector3().fromBufferAttribute(positions, i);
    const key = `${vertex.x.toFixed(4)}|${vertex.y.toFixed(4)}|${vertex.z.toFixed(4)}`;
    if (!seen.has(key)) {
      seen.add(key);
      dots.push([vertex.x, vertex.y, vertex.z]);
    }
  }

  for (let i = 0; i < edgePositions.count; i += 2) {
    const start = new THREE.Vector3().fromBufferAttribute(edgePositions, i);
    const end = new THREE.Vector3().fromBufferAttribute(edgePositions, i + 1);
    lines.push([start, end]);
  }

  geometry.dispose();
  edges.dispose();

  return { dots, lines };
}

function createOrbitParticles(count: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const radius = 2.25 + Math.random() * 1.55;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.82;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  return positions;
}

function sampleEllipse(
  centerLat: number,
  centerLon: number,
  width: number,
  height: number,
  count: number,
  radius: number,
) {
  const points: Dot[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    const lat = centerLat + Math.sin(angle) * height * r;
    const lon = centerLon + Math.cos(angle) * width * r;
    const point = latLonToVector(lat, lon, radius);
    points.push([point.x, point.y, point.z]);
  }

  return points;
}

function createWorldPoints(radius: number) {
  const cyanPoints: Dot[] = [];
  const violetPoints: Dot[] = [];

  const continents = [
    [-5, -65, 28, 44, 420],
    [42, -102, 32, 18, 220],
    [51, 18, 54, 20, 440],
    [8, 18, 26, 33, 320],
    [30, 88, 34, 18, 300],
    [-24, 134, 18, 12, 180],
    [-12, -48, 18, 16, 170],
    [63, 92, 42, 12, 180],
  ] as const;

  continents.forEach(([lat, lon, width, height, count], index) => {
    const cloud = sampleEllipse(lat, lon, width, height, count, radius);
    if (index % 2 === 0) {
      cyanPoints.push(...cloud);
    } else {
      violetPoints.push(...cloud);
    }
  });

  return { cyanPoints, violetPoints };
}

function createSphericalBands(radius: number, bandCount: number, pointsPerBand: number) {
  const cyanPoints: Dot[] = [];
  const violetPoints: Dot[] = [];

  for (let band = 0; band < bandCount; band++) {
    const v = band / (bandCount - 1);
    const lat = THREE.MathUtils.lerp(-72, 72, v);
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const bandRadius = Math.sin(phi) * radius;
    const y = Math.cos(phi) * radius;

    for (let index = 0; index < pointsPerBand; index++) {
      const t = index / pointsPerBand;
      const theta = t * Math.PI * 2;
      const wobble = 1 + Math.sin(theta * 3 + band * 0.8) * 0.012;
      const point: Dot = [
        Math.cos(theta) * bandRadius * wobble,
        y + Math.sin(theta * 2 + band) * 0.006,
        Math.sin(theta) * bandRadius * wobble,
      ];

      if ((band + index) % 5 === 0) {
        violetPoints.push(point);
      } else {
        cyanPoints.push(point);
      }
    }
  }

  return { cyanPoints, violetPoints };
}

function createMeridianArcs(radius: number, meridianCount: number, pointsPerArc: number) {
  const arcs: Float32Array[] = [];

  for (let meridian = 0; meridian < meridianCount; meridian++) {
    const yaw = (meridian / meridianCount) * Math.PI * 2;
    const points = Array.from({ length: pointsPerArc }, (_, index) => {
      const t = index / (pointsPerArc - 1);
      const lat = THREE.MathUtils.lerp(-1.15, 1.15, t);
      const ringRadius = Math.cos(lat) * radius;
      const y = Math.sin(lat) * radius;
      return [
        Math.cos(yaw) * ringRadius,
        y,
        Math.sin(yaw) * ringRadius,
      ];
    }).flat();

    arcs.push(new Float32Array(points));
  }

  return arcs;
}

function createLatitudeRing(radius: number, tilt = 0) {
  return new Float32Array(
    Array.from({ length: 200 }, (_, index) => {
      const angle = (index / 199) * Math.PI * 2;
      return [
        Math.cos(angle) * radius,
        Math.sin(angle * 2 + tilt) * 0.03,
        Math.sin(angle) * radius,
      ];
    }).flat(),
  );
}

function createInnerHalo(radius: number, yScale: number, count: number) {
  return new Float32Array(
    Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      return [
        Math.cos(angle) * radius,
        Math.sin(angle * 2.4) * yScale,
        Math.sin(angle) * radius,
      ];
    }).flat(),
  );
}

function createArcBand(radius: number, start: number, end: number, count: number, wobble: number) {
  return new Float32Array(
    Array.from({ length: count }, (_, index) => {
      const t = index / (count - 1);
      const angle = THREE.MathUtils.lerp(start, end, t);
      return [
        Math.cos(angle) * radius,
        Math.sin(angle * 3.1) * wobble,
        Math.sin(angle) * radius,
      ];
    }).flat(),
  );
}

function createSpiralBand(radius: number, turns: number, count: number, lift: number) {
  return new Float32Array(
    Array.from({ length: count }, (_, index) => {
      const t = index / (count - 1);
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * lift;
      const shrink = 1 - Math.abs(t - 0.5) * 0.22;
      return [
        Math.cos(angle) * radius * shrink,
        y,
        Math.sin(angle) * radius * shrink,
      ];
    }).flat(),
  );
}

function GlobeShell() {
  const network = useMemo(() => createShellNetwork(), []);
  const world = useMemo(() => createWorldPoints(1.78), []);
  const sphericalBands = useMemo(() => createSphericalBands(1.77, 18, 110), []);
  const meridianArcs = useMemo(() => createMeridianArcs(1.76, 8, 120), []);
  const outerDust = useMemo(() => createOrbitParticles(180), []);
  const innerDust = useMemo(() => createOrbitParticles(140), []);
  const latitudeRing = useMemo(() => createLatitudeRing(2.05, 0.4), []);
  const innerHaloA = useMemo(() => createInnerHalo(1.8, 0.022, 320), []);
  const innerHaloB = useMemo(() => createInnerHalo(1.66, 0.018, 280), []);
  const arcBandA = useMemo(() => createArcBand(1.86, -2.8, 0.4, 170, 0.018), []);
  const arcBandB = useMemo(() => createArcBand(1.72, 0.1, 3.4, 180, 0.015), []);
  const spiralBandA = useMemo(() => createSpiralBand(1.7, 1.35, 220, 1.7), []);
  const spiralBandB = useMemo(() => createSpiralBand(1.54, 1.1, 200, 1.35), []);
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += delta * 0.16;
    ref.current.rotation.x = Math.sin(t * 0.28) * 0.08;
    ref.current.rotation.z = Math.cos(t * 0.22) * 0.05;
    ref.current.position.y = Math.sin(t * 0.5) * 0.07;
  });

  return (
    <group ref={ref}>
      <mesh scale={1.03}>
        <sphereGeometry args={[1.82, 64, 64]} />
        <meshPhysicalMaterial
          color="#06101f"
          emissive={BLUE}
          emissiveIntensity={0.22}
          transparent
          opacity={0.2}
          roughness={0.08}
          metalness={0.18}
          transmission={0.18}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>

      <mesh scale={0.988}>
        <sphereGeometry args={[1.78, 64, 64]} />
        <meshPhysicalMaterial
          color="#071423"
          emissive={CYAN}
          emissiveIntensity={0.14}
          transparent
          opacity={0.16}
          roughness={0.04}
          metalness={0.08}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.02}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={0.996}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial color="#03101f" transparent opacity={0.08} />
      </mesh>

      <mesh scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshBasicMaterial color={CYAN_BRIGHT} transparent opacity={0.06} />
      </mesh>

      <mesh position={[-0.18, 0.26, 0.98]} rotation={[0.15, -0.35, 0.25]} scale={[0.9, 0.64, 1]}>
        <ringGeometry args={[0.72, 0.96, 96]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0.3, -0.34, 0.88]} rotation={[-0.3, 0.44, -0.2]} scale={[1.08, 0.38, 1]}>
        <ringGeometry args={[0.74, 0.98, 96]} />
        <meshBasicMaterial color={CYAN_BRIGHT} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      <mesh scale={1.005}>
        <sphereGeometry args={[1.82, 44, 44]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.025} />
      </mesh>

      {network.lines.map((segment, index) => (
        <Line
          key={`line-${index}`}
          points={[segment[0], segment[1]]}
          color={index % 4 === 0 ? MAGENTA : index % 2 === 0 ? CYAN_BRIGHT : BLUE}
          transparent
          opacity={0.82}
          lineWidth={1.4}
        />
      ))}

      {network.dots.map((dot, index) => (
        <mesh key={`node-${index}`} position={dot}>
          <sphereGeometry args={[0.062, 16, 16]} />
          <meshBasicMaterial
            color={index % 5 === 0 ? MAGENTA : index % 2 === 0 ? CYAN_BRIGHT : WHITE}
          />
        </mesh>
      ))}

      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2.76, 0.22, 0.12]}>
        <torusGeometry args={[1.83, 0.034, 18, 240]} />
        <meshBasicMaterial color={CYAN_BRIGHT} transparent opacity={0.54} />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[1.18, 0.44, 0.82]}>
        <torusGeometry args={[1.69, 0.022, 16, 220]} />
        <meshBasicMaterial color={MAGENTA} transparent opacity={0.34} />
      </mesh>

      <mesh scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.02} />
      </mesh>

      <mesh scale={[0.985, 0.985, 0.985]}>
        <sphereGeometry args={[1.83, 64, 64]} />
        <meshPhysicalMaterial
          color="#08131c"
          emissive={MAGENTA}
          emissiveIntensity={0.06}
          transparent
          opacity={0.06}
          roughness={0}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      <Points positions={innerHaloA} stride={3} rotation={[0.92, 0.3, 0.2]}>
        <PointMaterial
          color={CYAN_BRIGHT}
          transparent
          opacity={0.95}
          size={0.017}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={innerHaloB} stride={3} rotation={[1.18, 0.46, 0.86]}>
        <PointMaterial
          color={MAGENTA}
          transparent
          opacity={0.68}
          size={0.015}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={arcBandA} stride={3} rotation={[0.16, -0.35, -0.22]}>
        <PointMaterial
          color={CYAN_BRIGHT}
          transparent
          opacity={0.92}
          size={0.016}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={arcBandB} stride={3} rotation={[-0.22, 0.48, 0.3]}>
        <PointMaterial
          color={CYAN}
          transparent
          opacity={0.7}
          size={0.013}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={spiralBandA} stride={3} rotation={[0.44, 0.92, 0.18]}>
        <PointMaterial
          color={CYAN_BRIGHT}
          transparent
          opacity={0.34}
          size={0.01}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={spiralBandB} stride={3} rotation={[-0.36, 0.48, 0.74]}>
        <PointMaterial
          color={WHITE}
          transparent
          opacity={0.18}
          size={0.008}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <sprite scale={[3.2, 3.2, 1]}>
        <spriteMaterial color={CYAN_BRIGHT} transparent opacity={0.16} />
      </sprite>

      <sprite scale={[2.35, 2.35, 1]}>
        <spriteMaterial color={MAGENTA} transparent opacity={0.1} />
      </sprite>

      <Points positions={new Float32Array(sphericalBands.cyanPoints.flat())} stride={3}>
        <PointMaterial
          color={CYAN_BRIGHT}
          transparent
          opacity={0.98}
          size={0.012}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={new Float32Array(sphericalBands.violetPoints.flat())} stride={3}>
        <PointMaterial
          color={MAGENTA}
          transparent
          opacity={0.62}
          size={0.009}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {meridianArcs.map((arc, index) => (
        <Points
          key={`meridian-${index}`}
          positions={arc}
          stride={3}
          rotation={[0.08 * index, 0.15 * index, 0]}
        >
          <PointMaterial
            color={index % 3 === 0 ? MAGENTA : CYAN}
            transparent
            opacity={0.38}
            size={0.008}
            sizeAttenuation
            depthWrite={false}
          />
        </Points>
      ))}

      <mesh rotation={[0.3, -0.62, 0.16]} scale={[1.02, 0.86, 1.02]}>
        <torusGeometry args={[1.42, 0.012, 12, 220]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.18} />
      </mesh>

      <mesh rotation={[-0.44, 0.82, -0.28]} scale={[0.92, 1.06, 0.92]}>
        <torusGeometry args={[1.3, 0.009, 10, 220]} />
        <meshBasicMaterial color={CYAN_BRIGHT} transparent opacity={0.15} />
      </mesh>

      <Points positions={new Float32Array(world.cyanPoints.flat())} stride={3}>
        <PointMaterial
          color={CYAN}
          transparent
          opacity={0.74}
          size={0.01}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={new Float32Array(world.violetPoints.flat())} stride={3}>
        <PointMaterial
          color={MAGENTA}
          transparent
          opacity={0.52}
          size={0.008}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={innerDust} stride={3} rotation={[0.5, 0.3, 0.1]} scale={0.62}>
        <PointMaterial
          color={BLUE}
          transparent
          opacity={0.2}
          size={0.012}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={latitudeRing} stride={3} rotation={[0.92, 0.42, 0.25]}>
        <PointMaterial
          color={WHITE}
          transparent
          opacity={0.9}
          size={0.02}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={outerDust} stride={3}>
        <PointMaterial
          color={CYAN_BRIGHT}
          transparent
          opacity={0.24}
          size={0.018}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function SceneContents() {
  return (
    <>
      <color attach="background" args={[VOID]} />
      <fog attach="fog" args={[VOID, 6.5, 13]} />
      <ambientLight intensity={0.9} />
      <pointLight position={[3.2, 2.8, 3]} color={CYAN_BRIGHT} intensity={36} distance={14} />
      <pointLight position={[-2.8, 0.8, 3.6]} color={MAGENTA} intensity={28} distance={13} />
      <pointLight position={[0, -2.2, 2.2]} color={BLUE} intensity={16} distance={11} />
      <GlobeShell />
    </>
  );
}

export default function CinematicGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0.02, 6.1], fov: 42 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents />
      <EffectComposer>
        <Bloom intensity={2.1} luminanceThreshold={0.02} luminanceSmoothing={0.88} mipmapBlur />
        <Noise opacity={0.028} premultiply />
        <Vignette eskil={false} offset={0.22} darkness={0.72} />
      </EffectComposer>
    </Canvas>
  );
}
