import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function WireIcosahedron() {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.12;
    ref.current.rotation.y += delta * 0.18;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.35, 1]} />
      <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.45} depthWrite={false} />
    </mesh>
  );
}

function InnerRing() {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.08;
  });
  return (
    <mesh ref={ref} rotation={[1.1, 0.4, 0]}>
      <torusGeometry args={[1.85, 0.02, 12, 48]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.6} />
    </mesh>
  );
}

export default function HeroWireMesh() {
  return (
    <div className="pointer-events-none h-[min(280px,42vw)] w-full min-h-[180px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <WireIcosahedron />
        <InnerRing />
      </Canvas>
    </div>
  );
}
