import { useEffect, useRef } from "react";
import {
  DEFAULT_MWENDO_INPUT,
  type MwendoInputState,
} from "./types";

const keyMap: Record<string, keyof MwendoInputState> = {
  ArrowUp: "forward",
  KeyW: "forward",
  ArrowDown: "backward",
  KeyS: "backward",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ShiftLeft: "run",
  ShiftRight: "run",
  ControlLeft: "crouch",
  ControlRight: "crouch",
  KeyC: "crouch",
};

export function useMwendoKeyboardInput(enabled = true) {
  const stateRef = useRef<MwendoInputState>({ ...DEFAULT_MWENDO_INPUT });

  useEffect(() => {
    if (!enabled) {
      stateRef.current = { ...DEFAULT_MWENDO_INPUT };
      return;
    }

    const handleKey = (pressed: boolean) => (event: KeyboardEvent) => {
      const mapped = keyMap[event.code];

      if (!mapped) {
        return;
      }

      stateRef.current[mapped] = pressed;
    };

    const handleBlur = () => {
      stateRef.current = { ...DEFAULT_MWENDO_INPUT };
    };

    const onKeyDown = handleKey(true);
    const onKeyUp = handleKey(false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled]);

  return stateRef;
}
