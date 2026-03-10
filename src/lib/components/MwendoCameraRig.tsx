import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Euler, Vector3 } from "three";
import { useMwendoStore, useMwendoStoreApi } from "../MwendoProvider";
import type { MwendoVec3 } from "../types";

const focus = new Vector3();
const desiredPosition = new Vector3();
const rotation = new Euler(0, 0, 0, "YXZ");

export type MwendoCameraRigProps = {
  followOffset?: MwendoVec3;
  focusHeight?: number;
  pointerLock?: boolean;
  yawSensitivity?: number;
  pitchSensitivity?: number;
  smoothing?: number;
};

export function MwendoCameraRig({
  followOffset = [0, 1.85, 5.1],
  focusHeight = 1.2,
  pointerLock = true,
  yawSensitivity = 0.0026,
  pitchSensitivity = 0.002,
  smoothing = 8,
}: MwendoCameraRigProps) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const adjustCamera = useMwendoStore((state) => state.adjustCamera);
  const storeApi = useMwendoStoreApi();
  const offset = useMemo(
    () => new Vector3(...followOffset),
    [followOffset],
  );

  useEffect(() => {
    if (!pointerLock) {
      return;
    }

    const element = gl.domElement;

    const onPointerDown = () => {
      if (document.pointerLockElement !== element) {
        void element.requestPointerLock();
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== element) {
        return;
      }

      adjustCamera(
        -event.movementX * yawSensitivity,
        -event.movementY * pitchSensitivity,
      );
    };

    element.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [adjustCamera, gl, pitchSensitivity, pointerLock, yawSensitivity]);

  useFrame((_, delta) => {
    const state = storeApi.getState();
    const [x, y, z] = state.playerPosition;

    focus.set(x, y + focusHeight, z);
    rotation.set(state.cameraPitch, state.cameraYaw, 0);
    desiredPosition.copy(offset).applyEuler(rotation).add(focus);
    camera.position.lerp(
      desiredPosition,
      1 - Math.exp(-delta * smoothing),
    );
    camera.lookAt(focus);
  });

  return null;
}
