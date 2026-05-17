import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildBackgroundNetwork, buildGlobeNetwork } from "./globeNetwork.js";

function DigitalGlobe() {
  const group = useRef(null);
  const glow = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { lineGeo, pointsGeo } = useMemo(() => buildGlobeNetwork(2.55, 44, 88), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    const px = state.pointer.x * 0.22;
    const py = state.pointer.y * 0.16;
    mouse.current.x += (px - mouse.current.x) * 0.035;
    mouse.current.y += (py - mouse.current.y) * 0.035;
    group.current.rotation.x = mouse.current.y * 0.35;
    group.current.rotation.z = mouse.current.x * 0.06;
    if (glow.current) glow.current.rotation.y -= delta * 0.04;
  });

  return (
    <group ref={group} position={[0, 0.05, 0]} scale={1.28}>
      <mesh ref={glow}>
        <sphereGeometry args={[2.28, 48, 48]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.06}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.32, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#67e8f9" transparent opacity={0.42} depthWrite={false} />
      </lineSegments>
      <points geometry={pointsGeo}>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function BackgroundNetwork() {
  const ref = useRef(null);
  const { lineGeo, positions } = useMemo(() => buildBackgroundNetwork(150, 13), []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <group ref={ref}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#7dd3fc" transparent opacity={0.12} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          color="#bae6fd"
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function AmbientParticles({ count = 280 }) {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#38bdf8"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroWebGLCanvas() {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0.05, 7.4], fov: 46 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <fog attach="fog" args={["#020617", 10, 22]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 1.5, 4]} intensity={0.75} color="#38bdf8" />
      <pointLight position={[0, -1, 2]} intensity={0.5} color="#22d3ee" />
      <BackgroundNetwork />
      <AmbientParticles />
      <DigitalGlobe />
    </Canvas>
  );
}
