import { useEffect, useRef, useState } from "react";

type RibbonKey = {
  id: number;
  label: string;
  leaving: boolean;
};

const keyLabels: Record<string, string> = {
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Space: "Space",
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  ControlLeft: "Ctrl",
  ControlRight: "Ctrl",
  AltLeft: "Alt",
  AltRight: "Alt",
  Tab: "Tab",
  Enter: "Enter",
  Escape: "Esc",
};

const MAX_VISIBLE_KEYS = 7;
const LEAVE_AFTER_MS = 900;
const REMOVE_AFTER_MS = 1300;

function formatKeyLabel(code: string) {
  if (keyLabels[code]) {
    return keyLabels[code];
  }

  if (code.startsWith("Key")) {
    return code.slice(3);
  }

  if (code.startsWith("Digit")) {
    return code.slice(5);
  }

  return code.replace(/(Left|Right)$/u, "");
}

export function KeyRibbon() {
  const [items, setItems] = useState<RibbonKey[]>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    const timers = new Set<number>();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      const id = nextIdRef.current++;
      const label = formatKeyLabel(event.code);

      setItems((current) => [
        ...current.slice(-(MAX_VISIBLE_KEYS - 1)),
        { id, label, leaving: false },
      ]);

      const leaveTimer = window.setTimeout(() => {
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, leaving: true } : item,
          ),
        );
      }, LEAVE_AFTER_MS);

      const removeTimer = window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, REMOVE_AFTER_MS);

      timers.add(leaveTimer);
      timers.add(removeTimer);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div className="key-ribbon" aria-hidden="true">
      {items.map((item, index) => {
        const offset = (items.length - 1 - index) * 74;
        const transform = item.leaving
          ? `translateX(${-offset}px) translateY(14px) scale(0.92)`
          : `translateX(${-offset}px) translateY(0px) scale(1)`;

        return (
          <span
            key={item.id}
            className={`key-ribbon__key${item.leaving ? " is-leaving" : ""}`}
            style={{ transform }}
          >
            {item.label}
          </span>
        );
      })}
    </div>
  );
}
