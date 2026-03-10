# Mwendo

`Mwendo` is now a hybrid `library + demo` project for a React Three Fiber third-person character controller. The package exports a reusable primitive player, follow camera, provider, and ragdoll dummy, while the demo app in this repo uses those same exports inside a flat test world.

## What ships today

- `MwendoProvider` for scoped controller state
- `MwendoPlayer` for the primitive third-person character
- `MwendoCameraRig` for a follow camera with optional pointer lock
- `MwendoRagdollDummy` for sandbox physics testing
- A Vite demo app that consumes the library entry instead of private app-only components

## Repo layout

- `src/lib`: publishable library source
- `src/components`: demo-only scene pieces like the HUD, lights, and test arena
- `dist`: library build output
- `demo-dist`: demo site build output

## Install shape

When you publish this package, the intended consumer install is:

```bash
npm install mwendo react react-dom three @react-three/fiber @react-three/rapier @react-three/drei
```

If the `mwendo` package name is already taken on npm, rename it in `package.json` before publishing.

## Basic usage

```tsx
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import {
  MwendoCameraRig,
  MwendoPlayer,
  MwendoProvider,
  MwendoRagdollDummy,
} from "mwendo";

export function Scene() {
  return (
    <MwendoProvider initialState={{ playerPosition: [0, 2.5, 6] }}>
      <Canvas shadows>
        <Physics>
          <MwendoPlayer controls="keyboard" position={[0, 2.5, 6]} />
          <MwendoRagdollDummy position={[-4, 5.5, -6]} />
        </Physics>
        <MwendoCameraRig />
      </Canvas>
    </MwendoProvider>
  );
}
```

## Exported API

- `MwendoProvider`
- `createMwendoStore`
- `useMwendoStore`
- `useMwendoStoreApi`
- `useMwendoKeyboardInput`
- `MwendoPlayer`
- `MwendoCameraRig`
- `MwendoRagdollDummy`

## Scripts

- `npm run dev`: run the demo app
- `npm run build:lib`: build the publishable package into `dist`
- `npm run build:demo`: build the demo site into `demo-dist`
- `npm run build`: typecheck, then build both library and demo

## Current capabilities

- Third-person chase camera with mouse-look via pointer lock
- Physics-backed capsule controller with a rounded primitive biped
- Walk, run, and crouch movement states
- Flat test arena with crates and a ramp for collision checks
- Separate jointed ragdoll dummy for impact testing

## Next packaging steps

The next package-quality improvements are:

1. Expose custom input adapters beyond keyboard control.
2. Add callbacks/events for collisions, movement mode changes, and snapshot updates.
3. Add jump, interaction hooks, and ragdoll handoff.
4. Add richer docs and a versioned example app.

## Design notes

The practical conclusion for this repo is still the same: keep gameplay control deterministic and debuggable first, then layer animation sophistication afterward. That keeps future interactions like shooting, opening doors, and golf swings debuggable while leaving room for motion matching or learned controllers later.

See also:

- [ROADMAP.md](./ROADMAP.md) for milestone planning
- [RESEARCH.md](./RESEARCH.md) for the animation research shortlist
