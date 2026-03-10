export type MwendoMovementMode = "idle" | "walk" | "run" | "crouch";

export type MwendoVec3 = [number, number, number];

export type MwendoInputState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
  crouch: boolean;
};

export const DEFAULT_MWENDO_INPUT: MwendoInputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
  crouch: false,
};
