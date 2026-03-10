# Relevant Technical Studies

These are the most relevant references for the long-term target: a third-person playable character that can locomote, shoot, recover from physics hits, interact with vehicles and doors, and support sports-like actions such as golf.

## Current implementation takeaway

The repo is already following the right first principle from this research set:

- keep the controller deterministic
- keep the camera and state model explicit
- keep the physics body inspectable
- delay motion-matching or learned animation until the gameplay contract is stable

That is why the current library ships a controllable third-person controller, explicit movement snapshots, and a humanoid ragdoll debug lab before attempting a skinned animation stack.

## 1. Motion Matching and The Road to Next-Gen Animation

Link: <https://media.gdcvault.com/gdc2016/Presentations/Clavet_Simon_MotionMatching.pdf>

Why it matters:

- Best practical reference once locomotion and interaction clips become too numerous for comfortable manual transition management.
- Excellent for responsive starts, stops, pivots, and traversal.

Best use in `mwendo`:

- Future replacement for a manual locomotion graph after the current controller and interaction interfaces stabilize.

## 2. Phase-Functioned Neural Networks for Character Control

Link: <https://theorangeduck.com/page/phase-functioned-neural-networks-character-control>

Why it matters:

- Strong reference for terrain-aware locomotion, crouching under obstacles, and user-driven movement over varied geometry.
- Good conceptual guide for trajectory sampling and phase-aware motion control even without training a network today.

Best use in `mwendo`:

- Design inspiration for slope handling, trajectory queries, and a richer locomotion feature model.

## 3. DeepMimic: Example-Guided Deep Reinforcement Learning of Physics-Based Character Skills

Link: <https://xbpeng.github.io/projects/DeepMimic/index.html>

Why it matters:

- The clearest reference for physics-driven characters that can take impacts, recover, and perform stylized skills.
- Directly relevant to active ragdolls, hit reactions, and recovery logic.

Best use in `mwendo`:

- Long-term reference for player ragdoll handoff, recovery, and physically grounded special actions.

## 4. Neural State Machine for Character-Scene Interactions

Link: <https://github.com/sebastianstarke/AI4Animation>

Why it matters:

- One of the strongest references for doors, sitting, carrying, and obstacle-aware interactions from simple controls.
- Especially relevant because the end goal includes opening car doors and environment-aware actions.

Best use in `mwendo`:

- Blueprint for a future interaction layer that reasons about object geometry, approach alignment, and hand targets.

## 5. Local Motion Phases for Learning Multi-Contact Character Movements

Link: <https://github.com/sebastianstarke/AI4Animation>

Why it matters:

- Useful when a single global phase variable is not enough, which happens quickly with sports, shooting, ball handling, and door interaction.
- Strong fit for golf-like actions and mixed hand-foot interaction timing.

Best use in `mwendo`:

- Upgrade path for complex action synthesis after the deterministic interaction layer exists.

## 6. Neural Animation Layering for Synthesizing Martial Arts Movements

Link: <https://www.sebastianxstarke.com/assets/portfolio/14/page.html>

Why it matters:

- Useful for combining locomotion with upper-body intent, which is exactly the problem space for moving while aiming or shooting.
- Valuable conceptually even if the implementation remains authored and layered rather than learned.

Best use in `mwendo`:

- Reference for separating locomotion from action overlays and aiming systems.

## 7. DeepPhase: Periodic Autoencoders for Learning Motion Phase Manifolds

Link: <https://i.cs.hku.hk/~taku/deepphase.pdf>

Why it matters:

- Helps organize and search large mixed motion datasets.
- Useful once the project accumulates locomotion, combat, and sports clips.

Best use in `mwendo`:

- Future data-pipeline improvement for motion retrieval, clustering, and transition quality.

## 8. Animation Warping for Responsiveness in FIFA Soccer

Link: <https://www.gdcvault.com/play/1012342/Animation-Warping-for-Responsiveness-in>

Why it matters:

- Practical production reference for making authored animation respond to gameplay constraints.
- Highly relevant for stride warping, target alignment, foot placement, and sports timing.

Best use in `mwendo`:

- Immediate reference before any ML-heavy transition, especially for footsteps, turns, and golf alignment.

## Recommended reading order

1. Motion Matching
2. Animation Warping for Responsiveness in FIFA Soccer
3. PFNN
4. Neural State Machine
5. Local Motion Phases
6. DeepMimic
7. DeepPhase

That order matches the most practical shipping path for this repo:

1. deterministic controller and camera
2. interaction-aware authored animation
3. physics blending and recovery
4. larger data-driven or learned systems only when scale demands them
