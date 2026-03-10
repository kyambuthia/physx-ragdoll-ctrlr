import type { RefObject } from "react";
import type { Group } from "three";
import type { MwendoMovementMode } from "../types";

type PrimitiveHeroRig = {
  rootRef: RefObject<Group | null>;
  pelvisRef: RefObject<Group | null>;
  spineRef: RefObject<Group | null>;
  headRef: RefObject<Group | null>;
  leftUpperArmRef: RefObject<Group | null>;
  leftLowerArmRef: RefObject<Group | null>;
  rightUpperArmRef: RefObject<Group | null>;
  rightLowerArmRef: RefObject<Group | null>;
  leftUpperLegRef: RefObject<Group | null>;
  leftLowerLegRef: RefObject<Group | null>;
  rightUpperLegRef: RefObject<Group | null>;
  rightLowerLegRef: RefObject<Group | null>;
};

const BODY_COLORS: Record<MwendoMovementMode, string> = {
  idle: "#384a61",
  walk: "#4178dd",
  run: "#ef7d32",
  crouch: "#18a87a",
};

function TaperedSegment(props: {
  color: string;
  height: number;
  topRadius: number;
  bottomRadius: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  roughness?: number;
  metalness?: number;
}) {
  return (
    <mesh castShadow position={props.position} rotation={props.rotation}>
      <cylinderGeometry
        args={[props.topRadius, props.bottomRadius, props.height, 18]}
      />
      <meshStandardMaterial
        color={props.color}
        roughness={props.roughness ?? 0.58}
        metalness={props.metalness ?? 0.06}
      />
    </mesh>
  );
}

function CapsuleAccent(props: {
  color: string;
  radius: number;
  length: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  roughness?: number;
  metalness?: number;
}) {
  return (
    <mesh castShadow position={props.position} rotation={props.rotation}>
      <capsuleGeometry args={[props.radius, props.length, 8, 18]} />
      <meshStandardMaterial
        color={props.color}
        roughness={props.roughness ?? 0.62}
        metalness={props.metalness ?? 0.04}
      />
    </mesh>
  );
}

function SoftSphere(props: {
  color: string;
  scale: [number, number, number];
  position?: [number, number, number];
  roughness?: number;
  metalness?: number;
}) {
  return (
    <mesh castShadow position={props.position} scale={props.scale}>
      <sphereGeometry args={[0.5, 24, 24]} />
      <meshStandardMaterial
        color={props.color}
        roughness={props.roughness ?? 0.66}
        metalness={props.metalness ?? 0.04}
      />
    </mesh>
  );
}

export function PrimitiveHero(props: {
  movementMode: MwendoMovementMode;
  rig: PrimitiveHeroRig;
}) {
  const bodyColor = BODY_COLORS[props.movementMode];

  return (
    <group ref={props.rig.rootRef} position={[0, 0.04, 0]}>
      <group ref={props.rig.pelvisRef} position={[0, 0.88, 0]}>
        <SoftSphere
          color="#233145"
          position={[0, 0.02, 0]}
          scale={[0.58, 0.36, 0.44]}
          roughness={0.7}
        />
        <TaperedSegment
          color="#2c3c53"
          height={0.24}
          topRadius={0.18}
          bottomRadius={0.24}
          position={[0, 0.09, 0]}
          roughness={0.68}
        />
        <CapsuleAccent
          color="#5e789e"
          length={0.3}
          radius={0.055}
          position={[0, 0.14, -0.02]}
          rotation={[0, 0, Math.PI / 2]}
          roughness={0.5}
        />
        <SoftSphere color="#31455e" scale={[0.2, 0.2, 0.2]} position={[-0.23, 0.03, 0]} />
        <SoftSphere color="#31455e" scale={[0.2, 0.2, 0.2]} position={[0.23, 0.03, 0]} />

        <group ref={props.rig.spineRef} position={[0, 0.34, 0]}>
          <TaperedSegment
            color={bodyColor}
            height={0.84}
            topRadius={0.23}
            bottomRadius={0.3}
            position={[0, 0.34, 0]}
            roughness={0.44}
            metalness={0.12}
          />
          <SoftSphere
            color={bodyColor}
            position={[0, 0.77, 0.02]}
            scale={[0.84, 0.56, 0.5]}
            roughness={0.42}
            metalness={0.08}
          />
          <CapsuleAccent
            color="#d9e3ef"
            length={0.6}
            radius={0.07}
            position={[0, 0.95, 0.02]}
            rotation={[0, 0, Math.PI / 2]}
            roughness={0.46}
          />
          <SoftSphere
            color="#fde68a"
            position={[-0.16, 0.36, 0.22]}
            scale={[0.14, 0.14, 0.14]}
            roughness={0.36}
          />
          <SoftSphere
            color="#f4f7fb"
            position={[0.16, 0.28, 0.22]}
            scale={[0.08, 0.08, 0.08]}
            roughness={0.24}
          />

          <group ref={props.rig.headRef} position={[0, 1.12, 0.04]}>
            <TaperedSegment
              color="#dcb690"
              height={0.14}
              topRadius={0.065}
              bottomRadius={0.085}
              position={[0, -0.25, -0.02]}
              roughness={0.84}
            />
            <SoftSphere
              color="#f1d7b8"
              position={[0, 0.01, 0]}
              scale={[0.56, 0.68, 0.58]}
              roughness={0.88}
            />
            <CapsuleAccent
              color="#1f2937"
              length={0.24}
              radius={0.055}
              position={[0, 0.05, 0.18]}
              rotation={[0, 0, Math.PI / 2]}
              roughness={0.54}
            />
            <SoftSphere
              color="#f7e4cf"
              position={[0, -0.18, 0.19]}
              scale={[0.1, 0.07, 0.08]}
              roughness={0.82}
            />
          </group>

          <group ref={props.rig.leftUpperArmRef} position={[-0.53, 0.79, 0]}>
            <SoftSphere color="#5f83bc" scale={[0.2, 0.2, 0.2]} />
            <TaperedSegment
              color="#6088c7"
              height={0.56}
              topRadius={0.1}
              bottomRadius={0.082}
              position={[0, -0.3, 0]}
              roughness={0.58}
            />
            <group ref={props.rig.leftLowerArmRef} position={[0, -0.58, 0]}>
              <SoftSphere color="#5376aa" scale={[0.16, 0.16, 0.16]} />
              <TaperedSegment
                color="#466998"
                height={0.48}
                topRadius={0.08}
                bottomRadius={0.066}
                position={[0, -0.25, 0]}
                roughness={0.62}
              />
              <SoftSphere
                color="#f1d7b8"
                position={[0, -0.53, 0.04]}
                scale={[0.16, 0.18, 0.17]}
                roughness={0.84}
              />
            </group>
          </group>

          <group ref={props.rig.rightUpperArmRef} position={[0.53, 0.79, 0]}>
            <SoftSphere color="#5f83bc" scale={[0.2, 0.2, 0.2]} />
            <TaperedSegment
              color="#6088c7"
              height={0.56}
              topRadius={0.1}
              bottomRadius={0.082}
              position={[0, -0.3, 0]}
              roughness={0.58}
            />
            <group ref={props.rig.rightLowerArmRef} position={[0, -0.58, 0]}>
              <SoftSphere color="#5376aa" scale={[0.16, 0.16, 0.16]} />
              <TaperedSegment
                color="#466998"
                height={0.48}
                topRadius={0.08}
                bottomRadius={0.066}
                position={[0, -0.25, 0]}
                roughness={0.62}
              />
              <SoftSphere
                color="#f1d7b8"
                position={[0, -0.53, 0.04]}
                scale={[0.16, 0.18, 0.17]}
                roughness={0.84}
              />
            </group>
          </group>
        </group>

        <group ref={props.rig.leftUpperLegRef} position={[-0.23, 0.01, 0]}>
          <SoftSphere color="#31455e" scale={[0.18, 0.18, 0.18]} />
          <TaperedSegment
            color="#24364c"
            height={0.68}
            topRadius={0.12}
            bottomRadius={0.1}
            position={[0, -0.38, 0]}
            roughness={0.66}
          />
          <group ref={props.rig.leftLowerLegRef} position={[0, -0.74, 0]}>
            <SoftSphere color="#31455e" scale={[0.16, 0.16, 0.16]} />
            <TaperedSegment
              color="#1b2b3c"
              height={0.6}
              topRadius={0.1}
              bottomRadius={0.082}
              position={[0, -0.3, 0]}
              roughness={0.7}
            />
            <SoftSphere
              color="#27384d"
              position={[0, -0.66, 0.1]}
              scale={[0.3, 0.18, 0.42]}
              roughness={0.62}
            />
            <CapsuleAccent
              color="#b7c5d6"
              length={0.22}
              radius={0.035}
              position={[0, -0.57, 0.24]}
              rotation={[0, Math.PI / 2, 0]}
              roughness={0.34}
            />
          </group>
        </group>

        <group ref={props.rig.rightUpperLegRef} position={[0.23, 0.01, 0]}>
          <SoftSphere color="#31455e" scale={[0.18, 0.18, 0.18]} />
          <TaperedSegment
            color="#24364c"
            height={0.68}
            topRadius={0.12}
            bottomRadius={0.1}
            position={[0, -0.38, 0]}
            roughness={0.66}
          />
          <group ref={props.rig.rightLowerLegRef} position={[0, -0.74, 0]}>
            <SoftSphere color="#31455e" scale={[0.16, 0.16, 0.16]} />
            <TaperedSegment
              color="#1b2b3c"
              height={0.6}
              topRadius={0.1}
              bottomRadius={0.082}
              position={[0, -0.3, 0]}
              roughness={0.7}
            />
            <SoftSphere
              color="#27384d"
              position={[0, -0.66, 0.1]}
              scale={[0.3, 0.18, 0.42]}
              roughness={0.62}
            />
            <CapsuleAccent
              color="#b7c5d6"
              length={0.22}
              radius={0.035}
              position={[0, -0.57, 0.24]}
              rotation={[0, Math.PI / 2, 0]}
              roughness={0.34}
            />
          </group>
        </group>
      </group>
    </group>
  );
}
