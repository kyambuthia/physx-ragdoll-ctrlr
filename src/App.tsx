import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { FlatArena } from "./components/FlatArena";
import { KeyRibbon } from "./components/KeyRibbon";
import { Lights } from "./components/Lights";
import {
  MwendoCameraRig,
  MwendoPlayer,
  MwendoProvider,
  MwendoRagdollDummy,
} from "./lib";

export default function App() {
  return (
    <MwendoProvider initialState={{ playerPosition: [0, 2.5, 6] }}>
      <KeyRibbon />
      <Canvas
        camera={{ fov: 42, near: 0.1, far: 250, position: [0, 3.5, 8] }}
        gl={{ antialias: true }}
        shadows
      >
        <color attach="background" args={["#c9dcff"]} />
        <fog attach="fog" args={["#c9dcff", 30, 120]} />
        <Suspense fallback={null}>
          <Lights />
          <Physics gravity={[0, -9.81, 0]}>
            <FlatArena />
            <MwendoPlayer controls="keyboard" position={[0, 2.5, 6]} />
            <MwendoRagdollDummy position={[-4, 5.5, -6]} />
          </Physics>
          <MwendoCameraRig />
        </Suspense>
      </Canvas>
    </MwendoProvider>
  );
}
