# Agent Instructions

This is a Decentraland SDK7 scene project.

## Before writing any code

This project relies on the official Decentraland SDK Skills, maintained by the Decentraland Foundation. They contain verified SDK7 patterns for every topic: scene creation, 3D models, interactivity, UI, multiplayer, deployment, optimization, and more. Start with the `sdk-scenes` skill, which acts as an index for all the other topics.

Check your available skills list first — they may already be installed at user, project, or plugin scope, in which case there is nothing to do. Install them only if they are not listed there:

```bash
npx skills add decentraland/sdk-skills --all
```

The installer writes `.agents/`, `.claude/`, `agent/` and `skills-lock.json` into the project. The SDK's own default ignore list already covers the dot-directories, but `agent/` (~4 MB) and `skills-lock.json` are not covered by it — keep both listed in `.dclignore` so they never ship with the scene.

If you cannot run installs, read the skills directly at [https://github.com/decentraland/sdk-skills](https://github.com/decentraland/sdk-skills), starting with the `sdk-scenes` skill.

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
