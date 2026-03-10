import { useMwendoStore } from "../lib";

export function Hud() {
  const movementMode = useMwendoStore((state) => state.movementMode);

  return (
    <div className="hud">
      <h1>Mwendo Prototype</h1>
      <p>
        Demo goal: validate the published Mwendo player package inside a real scene
        while we keep iterating on the primitive biped and physics sandbox.
      </p>
      <div className="mode">
        <span className="swatch" />
        <span>Mode: {movementMode}</span>
      </div>
      <ul>
        <li>Click the scene to lock the camera.</li>
        <li>Move with WASD or arrow keys.</li>
        <li>Hold Shift to run and Ctrl or C to crouch.</li>
        <li>Walk into the crates, ramp, and ragdoll to test the packaged player in the demo world.</li>
      </ul>
    </div>
  );
}
