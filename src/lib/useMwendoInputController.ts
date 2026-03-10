import { useRef } from "react";
import {
  DEFAULT_MWENDO_INPUT,
  type MwendoInputState,
} from "./types";

type InputUpdater =
  | Partial<MwendoInputState>
  | ((current: MwendoInputState) => Partial<MwendoInputState> | MwendoInputState);

export function useMwendoInputController(
  initialState?: Partial<MwendoInputState>,
) {
  const inputRef = useRef<MwendoInputState>({
    ...DEFAULT_MWENDO_INPUT,
    ...initialState,
  });
  const apiRef = useRef<{
    inputRef: typeof inputRef;
    setInput: (updater: InputUpdater) => void;
    replaceInput: (nextState?: Partial<MwendoInputState>) => void;
    pressInput: (key: keyof MwendoInputState, pressed?: boolean) => void;
    resetInput: () => void;
  } | null>(null);

  if (!apiRef.current) {
    apiRef.current = {
      inputRef,
      setInput: (updater: InputUpdater) => {
        const next =
          typeof updater === "function" ? updater(inputRef.current) : updater;

        inputRef.current = {
          ...inputRef.current,
          ...next,
        };
      },
      replaceInput: (nextState?: Partial<MwendoInputState>) => {
        inputRef.current = {
          ...DEFAULT_MWENDO_INPUT,
          ...nextState,
        };
      },
      pressInput: (key: keyof MwendoInputState, pressed = true) => {
        inputRef.current = {
          ...inputRef.current,
          [key]: pressed,
        };
      },
      resetInput: () => {
        inputRef.current = { ...DEFAULT_MWENDO_INPUT };
      },
    };
  }

  return apiRef.current;
}
