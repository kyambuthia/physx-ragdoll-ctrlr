# Implementation Roadmap

## Guiding principle

Keep gameplay control deterministic and debuggable first, then layer richer animation and interaction systems on top. The library should stay usable for actual game logic even before it grows into a more advanced animation stack.

## Current status

The repo now has a production-ready baseline for packaging and integration:

- scoped store and library exports
- keyboard and external-input controller paths
- explicit movement states: `idle`, `walk`, `run`, `crouch`, `jump`, `fall`
- snapshot and lifecycle callbacks
- follow camera with occlusion handling
- humanoid ragdoll dummy plus in-world debug tooling
- demo and library builds from the same source tree

That baseline is strong enough for package publication and downstream experimentation, but it is not the final gameplay feature set yet.

## Milestone 0: Playground baseline

Status: complete

- Flatspace traversal scene
- Third-person chase camera
- Physics-backed player capsule
- Separate ragdoll target for sandbox testing

Exit criteria:

- Character can move around the arena reliably
- Camera remains readable behind the player
- Collisions with props and ragdoll are stable enough for iteration

## Milestone 1: Character controller quality

Status: mostly complete

Completed:

- acceleration and deceleration tuning
- explicit grounded detection
- `jump` and `fall` states
- external input adapter support
- follow camera occlusion handling
- state snapshots and movement callbacks

Remaining:

- slope-specialized handling
- step-up behavior for ledges and stairs
- camera collision polish against tighter indoor geometry
- optional aim-space rotation rules for strafing or shooting modes

Exit criteria:

- Controller feels stable at 60+ FPS under camera rotation and collision pressure
- Movement state is explicit and testable from input plus physics
- Camera can stay readable in typical gameplay spaces without clipping through level art

## Milestone 2: Locomotion puppet and active physics

Status: in progress

Completed:

- primitive humanoid player puppet
- full humanoid ragdoll dummy
- in-world debug overlays for colliders, joints, contacts, COM, trails, and velocities

Next implementation targets:

- active-ragdoll or hybrid targets for the player
- landing and recovery pose shaping
- foot placement and slope adaptation
- optional skinned-shell attachment without changing controller code

Exit criteria:

- Player body reads clearly in motion and under impacts
- The physics proportions and visual proportions stay aligned
- Ragdoll handoff and recovery are stable enough for gameplay testing

## Milestone 3: Upper-body and combat layering

Status: not started

- Add aim offsets, additive recoil, and upper-body masking
- Separate locomotion state from action state so moving and shooting can coexist
- Add hand targets and pose constraints for prop alignment

Exit criteria:

- Shooting does not break locomotion balance
- Upper-body overlays can be swapped without rewriting locomotion code

## Milestone 4: Context interactions

Status: not started

- Add interaction anchors for doors, seats, golf clubs, balls, and pickup points
- Implement approach, align, enter, use, and exit states for each interaction family
- Introduce hand IK and local pose correction around authored targets

Exit criteria:

- Car door and seat interactions can be entered from more than one approach angle
- Golf setup and swing can be driven by a controlled state instead of a cutscene lock

## Milestone 5: Physics blending and recovery

Status: not started

- Add hit reactions and partial ragdoll blending
- Support full ragdoll fallback with recovery get-up logic
- Define which gameplay events are purely kinematic, partially physical, or fully simulated

Exit criteria:

- Character can enter and leave ragdoll without exploding or teleporting
- Recovery paths are deterministic enough for gameplay use

## Milestone 6: Data-driven upgrade path

Status: research only

- Evaluate motion matching once the clip library is large enough
- Evaluate DeepPhase or Local Motion Phases when interactions and sports actions become too numerous for manual graph maintenance
- Keep feature extraction, query generation, and interaction metadata independent from render code

Exit criteria:

- Replacing the locomotion backend does not require rewriting controller, camera, or interaction code

## What I would implement next

1. Player ragdoll handoff and get-up recovery.
2. A first interaction contract for `use/open` targets such as doors and seats.
3. Aiming and upper-body overlays so shooting can coexist with locomotion.
