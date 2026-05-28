import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

function InnerParticleGlobe({ count = 4000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const radius = 2.2;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }

    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00f3ff"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function OuterLattice() {
  const groupRef = useRef<THREE.Group>(null);
  const energyMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const pointColorsRef = useRef<Float32Array | null>(null);
  const blinkPhaseRef = useRef<Float32Array | null>(null);
  const energyUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  // 1. CREATE BASE GEOMETRY & GENERATE EDGES NATIVELY
  const { edgeGeometry, baseGeometry } = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(3, 2);
    // EdgesGeometry keeps the exact vertex array layout for lines
    const edges = new THREE.EdgesGeometry(base); 
    return { baseGeometry: base, edgeGeometry: edges };
  }, []);
  
  // 2. GENERATE GRADIENT COLORS FOR BOTH LINES AND POINTS
  useEffect(() => {
    const color1 = new THREE.Color('#3cf7ff'); // Bright Neon Cyan
    const color2 = new THREE.Color('#ff4df8'); // Bright Neon Magenta

    const makeGradientAttributes = (geometry: THREE.BufferGeometry, includeBlinkPhase = false) => {
      const pos = geometry.attributes.position;
      const cols = new Float32Array(pos.count * 3);
      const blinkPhase = includeBlinkPhase ? new Float32Array(pos.count) : null;

      for (let i = 0; i < pos.count; i++) {
        // Create a smooth horizontal gradient based on the node's X position
        const mixRatio = THREE.MathUtils.clamp((pos.getX(i) + 3) / 6, 0, 1);
        const finalColor = color1.clone().lerp(color2, mixRatio);

        cols[i * 3] = finalColor.r;
        cols[i * 3 + 1] = finalColor.g;
        cols[i * 3 + 2] = finalColor.b;

        if (blinkPhase) {
          blinkPhase[i] = Math.random() * Math.PI * 2;
        }
      }

      geometry.setAttribute('color', new THREE.BufferAttribute(cols, 3));
      geometry.attributes.color.needsUpdate = true;

      if (blinkPhase) {
        pointColorsRef.current = cols.slice();
        blinkPhaseRef.current = blinkPhase;
        geometry.setAttribute('blinkPhase', new THREE.BufferAttribute(blinkPhase, 1));
        geometry.attributes.blinkPhase.needsUpdate = true;
      }
    };

    makeGradientAttributes(baseGeometry, true);
    makeGradientAttributes(edgeGeometry);
  }, [baseGeometry, edgeGeometry]);

  // 3. ROTATION ANIMATION
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.03;
    }

    if (energyMaterialRef.current) {
      energyMaterialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }

    const colorAttribute = baseGeometry.getAttribute("color") as THREE.BufferAttribute | undefined;
    const baseColors = pointColorsRef.current;
    const blinkPhase = blinkPhaseRef.current;

    if (colorAttribute && baseColors && blinkPhase) {
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < blinkPhase.length; i++) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.45 + blinkPhase[i]);
        const brightness = 0.7 + 0.28 * Math.max(0, pulse);
        colorAttribute.array[i * 3] = baseColors[i * 3] * brightness;
        colorAttribute.array[i * 3 + 1] = baseColors[i * 3 + 1] * brightness;
        colorAttribute.array[i * 3 + 2] = baseColors[i * 3 + 2] * brightness;
      }

      colorAttribute.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core lattice lines */}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial 
          vertexColors={true} 
          transparent 
          opacity={0.82}
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {/* Slightly scaled glow pass helps the lattice feel thicker */}
      <lineSegments geometry={edgeGeometry} scale={1.015}>
        <lineBasicMaterial 
          vertexColors={true} 
          transparent 
          opacity={0.3}
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {/* Traveling energy pass */}
      <lineSegments geometry={edgeGeometry} scale={1.01}>
        <shaderMaterial
          ref={energyMaterialRef}
          uniforms={energyUniforms}
          vertexColors={true}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          vertexShader={`
            varying vec3 vColor;
            varying float vTravel;

            void main() {
              vColor = color;
              vTravel = position.y * 0.7 + position.x * 0.45 + position.z * 0.35;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec3 vColor;
            varying float vTravel;

            void main() {
              float sweep = sin(vTravel * 6.2 - uTime * 2.1);
              float pulse = smoothstep(0.78, 0.995, sweep);
              float flicker = 0.7 + 0.3 * sin(uTime * 7.0 + vTravel * 12.0);
              float alpha = pulse * flicker * 0.72;
              gl_FragColor = vec4(vColor, alpha);
            }
          `}
        />
      </lineSegments>

      {/* Glowing nodes */}
      <points geometry={baseGeometry}>
        <pointsMaterial
          vertexColors={true}
          size={0.44}
          sizeAttenuation={true}
          transparent
          opacity={0.96}
          blending={THREE.NormalBlending}
          depthWrite={false}
          toneMapped={false}
          onBeforeCompile={(shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              "vec4 diffuseColor = vec4( diffuse, opacity );",
              `float dist = length(gl_PointCoord - vec2(0.5));
              float solidCore = 1.0 - smoothstep(0.0, 0.22, dist);
              float core = 1.0 - smoothstep(0.0, 0.34, dist);
              float glow = 1.0 - smoothstep(0.22, 0.5, dist);
              float alpha = max(solidCore * 0.98, core * 0.82 + glow * 0.18);
              vec4 diffuseColor = vec4(diffuse, opacity * alpha);`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              "void main() {",
              `void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                if (length(coord) > 0.5) discard;
              `
            );
          }}
        />
      </points>
    </group>
  );
}

function OverlayCopy() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "10%",
        transform: "translateY(-50%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
        pointerEvents: "none",
      }}
    >
      <h1
        style={{
          fontSize: "3.5rem",
          margin: 0,
          textShadow: "0 0 10px rgba(0,243,255,0.5)",
        }}
      >
        CREATIVE DEVELOPER
      </h1>
      <p style={{ color: "#aaa", fontSize: "1.2rem" }}>
        Building interactive web experiences.
      </p>
    </div>
  );
}

export default function DigitalGlobePreview() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", background: "#000" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <InnerParticleGlobe count={5000} />
          <OuterLattice />
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls enableZoom={false} autoRotate={false} enablePan={false} />
        </Canvas>
      </div>
      {/* <OverlayCopy /> */}
    </div>
  );
}
