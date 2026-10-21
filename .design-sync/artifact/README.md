# The design system artifact

The Kanso UI design system is published as a Claude Design System artifact,
<https://claude.ai/artifact/TJSpYMBeBEMx1agnDVuZdv>, and **that artifact is the
design system's source of truth**: its tokens and their usage notes, the type
styles and families, the brand book, the cover, and each component's guidelines
and live preview. A person changes the design system there, in its page.

This repository holds `src/tokens/design.tokens.json`, the copy of the tokens
both libraries build from: it is published as `./tokens.json`, with
`./tokens.css` and the `light`, `dark` and `KuiTheme` of the main entry
generated from it. kanso-ui and react-native-kanso-ui each take the package as a
devDependency. A token edited in the artifact therefore reaches both libraries
the same way: through a pull request here, a release, and the Renovate bump that
follows it in each library.

The sync has two halves, one per repository. This directory is the tokens';
kanso-ui's `.design-sync/artifact/` is the rest, the bundle, the fonts, the
types and each component's preview and guidelines, and it holds the step that
publishes. A daily routine, "Kanso UI design system sync", runs both in one
session after release-please's 09:00 UTC run, this half first, and any session
asked to sync the artifact by hand follows the same steps.

## What lives where

| Artifact path under `project/` | Owned by     | Written by                                   |
| ------------------------------- | ------------ | -------------------------------------------- |
| `tokens.json`                   | the artifact | `tokens.mjs`, merging both sides (see below) |

Every other path is kanso-ui's half; its README has the rest of this table.

`notes.json` here holds the usage notes the artifact shows beside each token,
type style and token family, because `design.tokens.json` has no place for
them. It is part of the token source as far as a sync is concerned: a usage note
edited in the artifact comes back into this file.

`tokens.json`'s `meta` names both repositories. `repo` and `ref` are this one
and the commit of it the artifact was last synced from, which is what a pull
merges against. `refs` holds that commit again beside the kanso-ui commit the
same sync brought into the artifact, which is what kanso-ui's half diffs
against, and `components` maps each component to its entry in kanso-ui.

## The script

- `tokens.mjs build <out.json> --ref main@<sha> --ui <kanso-ui checkout> --ui-ref main@<sha>`
  writes the artifact's `tokens.json` from `design.tokens.json` and
  `notes.json`. `--ref` is this repository's commit and `--ui-ref` kanso-ui's;
  `--ui` is where the component list is read from.
- `tokens.mjs pull <artifact tokens.json>` applies the artifact's edits since
  the commit its `meta.ref` names, and only those, to `design.tokens.json` and
  `notes.json`, then reruns `npm run tokens:build`. It prints what it changed,
  what also changed in the repository since then (`clashes`, where the artifact
  wins), and what has no place in the token file (`unmapped`), such as a colour
  added in the page or a role pointed at a raw hex value instead of a palette
  tone. A field the artifact left as it was is the repository's to keep.
  `--base <sha>` names the commit instead, which a file whose `meta.repo` is not
  this repository needs.
- `tokens.mjs check` proves the two directions agree: a pull of an unedited
  build changes nothing, one edit of every kind lands where it should, and a
  repository edit the artifact never touched survives a pull. Run it after
  changing either direction.

## The sync

Work in a scratch directory outside both repositories, `<dir>` below, with a
checkout of kanso-labs/kanso-ui beside this one. Read artifact files with the
Artifact tool's `read` and a `path`; never from a cached copy.

1. **Read the artifact.** `project/design-system.json` and
   `project/tokens.json`. The sha in `tokens.json`'s `meta.ref` is the commit of
   this repository the artifact was last synced from.
2. **Bring the artifact's edits into this repository.** On the branch
   `design-sync/artifact` reset to `origin/main`, run
   `node .design-sync/artifact/tokens.mjs pull <dir>/tokens.json`.
   - If it changed anything, commit it, run `npm run lint`, `npm run build` and
     `npm test`, and open a pull request from that branch, or push to the one
     already open from it. Title it as the Conventional Commit for what changed
     — `fix(tokens): …` for an adjusted value, `feat(tokens): …` for a new one —
     with the `kind:` label read off its type (`kind:fix` for a `fix`) and
     `area:foundations`. Name each value it changes, with its old and new value,
     and list the `clashes` and the `unmapped` entries in its body, the second
     as what a person has to decide.
   - An edit to the brand book that asks for a change in the token file — a new
     role, a new step on a scale — becomes an issue here naming the artifact
     edit.
3. **Build the artifact's tokens.json.** On the same branch, which is now
   `origin/main` with the artifact's edits applied, run
   `node .design-sync/artifact/tokens.mjs build <dir>/project/tokens.json --ref main@<sha> --ui <kanso-ui checkout> --ui-ref main@<kanso-ui sha>`,
   `<sha>` being `origin/main`'s here and `<kanso-ui sha>` `origin/main`'s
   there. The file carries the repository's changes, keeps every artifact edit
   not yet released, and moves `meta.ref` to this commit. A later pull then
   finds the same unreleased edits again, which keeps the pull request from
   step 2 current until it merges.
4. **Go on to kanso-ui's half**, in its `.design-sync/artifact/README.md`. Its
   publish sends this `tokens.json` with the rest, and a file whose bytes match
   what the artifact serves is left out of it.
