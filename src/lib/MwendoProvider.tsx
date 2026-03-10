import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
} from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import type { MwendoMovementMode, MwendoVec3 } from "./types";

export type MwendoControllerState = {
  playerPosition: MwendoVec3;
  playerFacing: number;
  movementMode: MwendoMovementMode;
  cameraYaw: number;
  cameraPitch: number;
  setPlayerSnapshot: (payload: {
    position: MwendoVec3;
    facing: number;
    movementMode: MwendoMovementMode;
  }) => void;
  adjustCamera: (yawDelta: number, pitchDelta: number) => void;
};

export type MwendoStoreInit = Partial<
  Pick<
    MwendoControllerState,
    "playerPosition" | "playerFacing" | "movementMode" | "cameraYaw" | "cameraPitch"
  >
>;

export type MwendoStoreApi = StoreApi<MwendoControllerState>;

const defaultState: Omit<
  MwendoControllerState,
  "setPlayerSnapshot" | "adjustCamera"
> = {
  playerPosition: [0, 2.5, 6],
  playerFacing: 0,
  movementMode: "idle",
  cameraYaw: Math.PI,
  cameraPitch: -0.22,
};

export function createMwendoStore(
  initialState: MwendoStoreInit = {},
): MwendoStoreApi {
  return createStore<MwendoControllerState>()((set) => ({
    ...defaultState,
    ...initialState,
    setPlayerSnapshot: ({ position, facing, movementMode }) =>
      set({
        playerPosition: position,
        playerFacing: facing,
        movementMode,
      }),
    adjustCamera: (yawDelta, pitchDelta) =>
      set((state) => ({
        cameraYaw: state.cameraYaw + yawDelta,
        cameraPitch: Math.max(
          -1.1,
          Math.min(0.35, state.cameraPitch + pitchDelta),
        ),
      })),
  }));
}

const MwendoStoreContext = createContext<MwendoStoreApi | null>(null);

export function MwendoProvider(props: {
  children: ReactNode;
  initialState?: MwendoStoreInit;
}) {
  const storeRef = useRef<MwendoStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createMwendoStore(props.initialState);
  }

  return (
    <MwendoStoreContext.Provider value={storeRef.current}>
      {props.children}
    </MwendoStoreContext.Provider>
  );
}

export function useMwendoStore<T>(
  selector: (state: MwendoControllerState) => T,
) {
  const store = useContext(MwendoStoreContext);

  if (!store) {
    throw new Error("Mwendo components must be rendered inside <MwendoProvider />.");
  }

  return useStore(store, selector);
}

export function useMwendoStoreApi() {
  const store = useContext(MwendoStoreContext);

  if (!store) {
    throw new Error("Mwendo components must be rendered inside <MwendoProvider />.");
  }

  return store;
}
