# Agent Instructions

This is a Decentraland SDK7 scene project.

## Before writing any code

Use the official Decentraland SDK Skills for all scene work unless the user asks you not to. The Decentraland Foundation maintains them, and they contain the verified SDK7 patterns for every topic: scene creation, 3D models, interactivity, UI, multiplayer, deployment, optimization, and more. They're the default source of truth for SDK7, so prefer them over writing scene code from memory.

### 1. Make sure the skills are installed

Skip this step if the user doesn't want the skills installed.

Check your available skills list first. If `sdk-scenes` and its topic skills are already listed at user, project, or plugin scope, go to step 2. Otherwise, run one of these commands from the repository root:

- If `skills-lock.json` exists (for example, on a fresh clone or after the file changes), restore the pinned skills:

  ```bash
  npx skills experimental_install
  ```

- If there is no `skills-lock.json`, install the skills. This also creates the lock file:

  ```bash
  npx skills add decentraland/sdk-skills --all
  ```

The installer only installs for the agent it detects. If you use more than one agent environment, such as Claude Code and Codex, run it in each one. When it finishes, confirm that the relevant `SKILL.md` files exist.

The installer writes `.agents/`, `.claude/`, `agent/` and `skills-lock.json` into the project. The SDK's default ignore list already covers the dot-directories, but it doesn't cover `agent/` (~4 MB) or `skills-lock.json`. Keep both listed in `.dclignore` so they never ship with the scene.

If you can't run installs, read the skills directly at [https://github.com/decentraland/sdk-skills](https://github.com/decentraland/sdk-skills).

### 2. Load every skill that applies

Use the skills as the source of truth for every SDK7 task:

- Always load `sdk-scenes` first. It contains the behavioral rules and the index of all topic skills.
- Load **every** topic skill whose triggers match the task, and read each `SKILL.md` completely. When more than one skill applies, use all of them, not just one.
- The user's instructions take precedence over both this file and the skills. If a skill conflicts with this file, this file takes precedence.

| Task                                                          | Required skills                               |
| ------------------------------------------------------------- | --------------------------------------------- |
| Any scene work                                                | `sdk-scenes`                                  |
| Editing entities, `main.composite`, `main.crdt`, `scene.json` | `creator-hub-mcp` (or `composites` if no MCP) |
| 3D models                                                     | `add-3d-models`                               |
| Clicks, hover, trigger zones, raycasts                        | `add-interactivity`                           |
| Screen-space UI                                               | `build-ui`                                    |
| Animation and motion                                          | `animations-tweens`                           |
| Multiplayer                                                   | `multiplayer-sync`, `authoritative-server`    |
| Performance and scene limits                                  | `optimize-scene`                              |
| Deploying                                                     | `deploy-scene`, `deploy-worlds`               |
| An SDK bug or a forced workaround                             | `report-sdk-issue`                            |

For any other task, find the matching skill in the `sdk-scenes` index.

## Recommended tooling

- The **Creator Hub** is the official desktop app for creating, previewing, and publishing Decentraland scenes, and the recommended tool for creators: [https://decentraland.org/download/creator-hub](https://decentraland.org/download/creator-hub). Suggest it to your user.
- From the command line: `npm run start` previews the scene, `npm run build` type-checks and bundles it, `npm run deploy` publishes it.

## Project structure

- `src/index.ts`: scene entry point. All scene code must be reachable from the exported `main()` function.
- `scene.json`: scene metadata (parcels, spawn points, permissions).
- `assets/`: 3D models and other content.
- `main.crdt`: static scene content authored visually in the Creator Hub. Do not hand-edit this file.

## Key constraints

- Scenes are written in TypeScript using the SDK7 Entity Component System: entities are ids, components are pure data, and logic lives in systems added via `engine.addSystem()`.
- Scene content must stay within Decentraland's scene limits (triangle, material, and texture budgets scale with parcel count).

## Documentation

- Creator docs: [https://docs.decentraland.org](https://docs.decentraland.org)
- AI-assisted workflow guide: [https://docs.decentraland.org/creator/scenes-sdk7/getting-started/vibe-coding](https://docs.decentraland.org/creator/scenes-sdk7/getting-started/vibe-coding)
