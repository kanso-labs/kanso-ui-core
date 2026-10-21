# AGENTS.md

Guidance for coding agents working in this repository.

## What this is

kanso-ui-core is the design data Kanso UI's two component libraries share:
[kanso-ui](https://github.com/kanso-labs/kanso-ui), for web apps, and
[react-native-kanso-ui](https://github.com/kanso-labs/react-native-kanso-ui),
for iOS and Android. The two libraries stay separate, each drawing its
components with its own platform's primitives. What they read in common is
published from here once, so neither keeps a copy of the other's.

**The package is data and types, and nothing else.** It renders nothing, imports
no React, and relies on no platform's globals: `tsconfig.lib.json` gives it
neither the DOM's types nor Node's, and tsdown builds it for the `neutral`
platform, so a browser bundle, Metro and Node can all load what it publishes.

**Neither library hands it on to an app.** Each takes it as a pinned
devDependency and bundles what it reads into its own `dist`, so an app installs
kanso-ui or react-native-kanso-ui and never this. That is why the package
declares no `dependencies`, `peerDependencies` or `optionalDependencies`:
anything listed there would reach no app through a devDependency, and a peer
would ask every app for one. `src/package.test.ts` fails if one is added.

**The design system's source of truth is the Kanso UI design system artifact**,
<https://claude.ai/artifact/TJSpYMBeBEMx1agnDVuZdv>. A person changes the design
system there, and a change made there reaches the libraries through a pull
request against the repository that holds the data.

## The design tokens

**`src/tokens/design.tokens.json` is the token source**, the W3C Design Tokens
(DTCG) file both libraries build from, `$extensions` → `voice` and its copy
guidelines included. `scripts/build-tokens.mjs` reads it through Style
Dictionary and writes two files beside it:

- `design.tokens.css`, published as `./tokens.css`: every `--kui-*` custom
  property at its light value on `:root`, and the colours again under
  `prefers-color-scheme: dark`. It is the override contract both libraries
  publish.
- `defaults.ts`, which the main entry re-exports: `light` and `dark`, each
  mapping every property to its value in CSS syntax; `breakpoints`, the window
  size classes in px, which are dp on native; and the `KuiTheme` type, whose
  per-property JSDoc names each default.

The source itself goes out as `./tokens.json`, unchanged.

**Neither generated file is committed.** `build`, `lint` and `test` run
`npm run tokens:build` first, so there is no copy to edit by hand or to leave
stale. `.gitignore`, ESLint's `globalIgnores` and oxlint's `ignorePatterns` all
name them. `src/tokens/defaults.test.ts` holds `light` and `dark` to the
stylesheet's two blocks and `breakpoints` to the source; `light` and `dark` are
typed `Required<KuiTheme>`, so `tsc -b` holds the type to the same keys.

**The stylesheet is byte for byte the one kanso-ui published, banner included.**
The generators are kanso-ui's and react-native-kanso-ui's, moved here, and
kanso-ui publishes this file under its own `./tokens.css`, so a change to a
generator changes what both libraries ship. Diff the built `dist/tokens.css`
against the last release's before changing one.

**`./tokens.css` takes a `types` condition**, pointing at an empty
`dist/stylesheet.d.ts` that tsdown writes, as kanso-ui's does. Without it a
TypeScript consumer's side-effect import of the stylesheet fails under
`noUncheckedSideEffectImports`, and attw reports the subpath unresolved. The
stylesheet is also why `sideEffects` names `**/*.css` rather than being `false`:
a bundler would otherwise drop an import of it.

**The design system sync still writes kanso-ui's copy of the source.** It moves
here in its own change; until then, a token edited in the artifact reaches
kanso-ui's `src/tokens/design.tokens.json` first, and this file is brought in
step with it by hand. This one was taken from kanso-ui at `e21ae3e`.

## Commands

| Task     | Command                 | Notes                                                               |
| -------- | ----------------------- | ------------------------------------------------------------------- |
| Test     | `npm test`              | Vitest, in Node                                                     |
| Coverage | `npm run test:coverage` | The same suite with coverage and JUnit results, which Test sends    |
| Lint     | `npm run lint`          | oxlint, then ESLint, then oxfmt formatting check                    |
| Build    | `npm run build`         | Type-checks (`tsc -b`) then builds ESM into `dist/`                 |
| Format   | `npm run format`        | oxfmt; `npm run format:check` is the check `lint` already runs      |
| Verify   | `npm run package:check` | publint, then attw; reads `dist/`, so build first                   |
| Tokens   | `npm run tokens:build`  | Writes the stylesheet and the defaults; build, lint and test run it |

**Install with the Node version in `.tool-versions`.** CI resolves it from that
file, and an older npm rewrites `package-lock.json` in a way no check here can
see. If `node --version` disagrees, prefix the command so it reads the pin
rather than restating it:

```bash
mise exec node@"$(awk '/^nodejs/{print $2}' .tool-versions)" -- npm install
```

## Conventions

Shared with the other `kanso-labs` repositories. The canonical text is
[`CONVENTIONS.md`](https://github.com/kanso-labs/.github/blob/main/CONVENTIONS.md)
in `kanso-labs/.github`; this is a copy, kept in step by hand. Change that file
first, then every copy.

- **Keys in JSON and YAML are ordered by name.** Files whose order carries
  meaning are exempt: workflows, where step order is execution order;
  changelogs, which are chronological; and `package.json`, where the npm
  ecosystem expects `name` and `version` first.
- **A workflow's filename is the kebab-case of its `name:` field.** Reusable
  workflows, meaning those triggered only by `workflow_call`, take a leading
  underscore.
- **Job names and step names are imperative verb phrases.** Job ids, step ids,
  and matrix keys are exempt.
- **Actions are pinned to exact release tags**, `actions/checkout@v7.0.1`, never
  `@main` and never a tag the publisher moves — `@v7` and `@v7.0` both move.
  Renovate opens the bump pull requests, and it has nothing to open when the pin
  never changes: `frenck/action-app-linter@v2.21` sat still through a repository
  rename and a release that fixed something a consumer was working around,
  because the tag it named was moved onto both.
- **Dependency versions are pinned exactly.** Every `dependencies`,
  `devDependencies`, and `optionalDependencies` entry is a bare version,
  `1.2.3`, never `^1.2.3`, `~1.2.3`, `>=1.2.3`, `*`, `1.x`, or an `||` union.
  Renovate opens those bumps too. `peerDependencies` are the deliberate
  exception: they state what the consumer's own installed copy must satisfy, so
  ranges are correct there and stay.
- **`.tool-versions` pins a fully-specified version on every line**,
  `nodejs <major>.<minor>.<patch>`, never `nodejs 24` or `nodejs lts`.

In TypeScript the ordering rule is enforced rather than trusted:
`eslint-plugin-perfectionist` runs at `recommended-natural`, so object keys,
imports, union members and the declarations in a module are sorted by the
linter. `npm run lint -- --fix` puts them in order.

The formatter is not shared: **oxfmt formats this repository**, not Prettier, so
the command is `npm run format` and the check runs inside `npm run lint`.
`CHANGELOG.md` and `LICENSE.md` are exempt in `.oxfmtrc.json`: release-please
writes the first in a style oxfmt disagrees with, and the second is owned
elsewhere.

Specific to this repository:

- **The exports map says `default`, not `import`.** Under `default`, Node
  resolves the ESM file for a `require()` too, through `require(esm)`; under
  `import` alone the same call fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`.
  Renaming the condition reads like a tidy-up beside `type: module` and drops
  every CommonJS consumer, a bundler resolving a `require()` among them.
  `src/package.test.ts` pins it.
- **The main entry's names are pinned.** `src/index.test.ts` lists exactly what
  `src/index.ts` exports, so a name added or dropped is a change made on
  purpose. Add a name there when adding one to the entry.
- **The design system is called Material Design**, in comments, tests, docs and
  commit messages alike, never a version or an edition name.
- **Comments describe what the package has.** A comment explains what the code
  in front of it does and why, never data or an export the package lacks. What
  is not built yet is the plan's business, recorded in the project's issues.
- Staged `.cjs`, `.js`, `.mjs` and `.ts` files are linted (oxlint, then ESLint)
  and formatted (oxfmt) on commit, through husky and lint-staged
  (`.lintstagedrc.json`). Staged `.json`, `.md`, `.yaml` and `.yml` files are
  formatted wherever they live. That entry passes
  `--no-error-on-unmatched-pattern` because oxfmt exits non-zero when every path
  handed to it is one of its own ignores, which would reject a commit staging
  `CHANGELOG.md` alone; keep `.oxfmtrc.json` the one list of ignores rather than
  repeating them in the glob.

## Testing

Vitest runs every `src/**/*.test.ts` in Node, beside the module it tests. Tests
import `describe`, `it` and `expect` from `vitest` rather than reading them as
globals, and type-check under `tsconfig.test.json`, which gives them Node's
types while the package's own `tsconfig.lib.json` leaves them out.

**Prove a new assertion can fail before trusting it.** Break the code it pins,
watch the test go red, and put the code back. `[].every()` is `true`, so a check
built on an empty list reports a state that never happened.

`Test` runs `npm run test:coverage`, which writes a Cobertura report and a JUnit
file under `.vitest/`. `actions/upload-code-coverage` reports the first on the
pull request under the `code-coverage/vitest` label, and
`codecov/codecov-action` sends both to Codecov, the second with
`report_type: test_results`. None of them gates: the uploads do not fail `Test`,
and `.github/codecov.yml` marks every Codecov status informational. That file is
`.yml` rather than the `.yaml` everything else here uses because Codecov
recognises `codecov.yml` and `.codecov.yml` alone.

## Workflows and checks

`Build`, `Lint` and `Test` run on every pull request and on pushes to `main`,
all on [`kanso-labs/actions`](https://github.com/kanso-labs/actions) pinned by
exact tag. `Lint` runs actionlint before the install and checks the pull request
title with commitlint after it; both are steps of that job rather than jobs of
their own. `Build` ends in `npm run package:check` for the same reason.

**A job name becomes a check name.** A ruleset requiring checks matches them by
exact string, so renaming a job means renaming it in the ruleset in the same
change. The `pull_request` trigger is deliberately unscoped: adding
`branches: [main]` would leave a pull request against any other base without the
checks a ruleset waits on, which reads as a hang rather than a failure.

**`Build` also uploads the bundle to Codecov**, through `@codecov/rollup-plugin`
in `tsdown.config.ts`, which `CODECOV_TOKEN` switches on: unset locally and
empty for a fork, so neither writes a stats file nor uploads anything. A failed
upload does not fail the build, so read the job log rather than the check mark.

**Releases are cut by release-please**, once a day at 09:00 UTC like every
kanso-labs repository, from `release-please.yaml`. It publishes through npm's
trusted publishing, so this repository holds no npm token, and then publishes
the same tarball to GitHub Packages with `GITHUB_TOKEN`, only once npm has taken
it. A trusted publisher is registered on the package's npm page, which exists
only once a first version has been published, so that version is published by
hand. With no release tagged yet, `initial-version` makes the first release
0.1.0; the manifest's `0.0.0` is not read as a release.

**Dependencies come from Renovate**, through the org-wide runner in
[`kanso-labs/renovate`](https://github.com/kanso-labs/renovate), and its commits
are typed `deps:` so an upgrade cuts a release of its own. A repository is
managed by being listed in that runner's `config.js`, and
`.github/renovate.json` here is merged over it. `renovate-command.yaml` answers
`@renovate rebase` on one of its pull requests; only the copy on `main` runs,
since `issue_comment` is a repository-level event. TypeScript is held below 7
until typescript-eslint admits it, and the rule says so.

## Commits and pull requests

Pull requests are squash-merged, with the pull request title as the commit
subject and an empty body. That title becomes the only commit on `main`, and is
what release-please reads to pick the next version and write the changelog line,
so it is the one that has to be right: a Conventional Commit, with `!` before
the colon for a breaking change. `.commitlintrc.json` admits `deps` beside the
standard types, lifts the header's length limit, and turns commitlint's default
ignores off, so a title GitHub's Revert button writes has to be retitled
`revert: …` before it merges.

Write branch commits conventionally anyway. They are what a reviewer reads while
the pull request is open.

## Working the plan

The plan lives on the
[Kanso UI project](https://github.com/orgs/kanso-labs/projects/1), under the
Phase `19 · Core package`, beside the items in kanso-ui and
react-native-kanso-ui it unblocks. One issue per pull request, each titled with
the Conventional Commit it will merge as, carrying a `kind:` and an `area:`
label, a type, and the native Priority and Effort fields, and naming what it
depends on. kanso-ui's `AGENTS.md`, under "Working the coverage plan", sets out
how each field is derived. A pull request closes its issue with `Closes #N` and
takes the issue's two labels.

## Traps

**`npm run lint` does not type-check.** It passes on code that `tsc -b` rejects,
so run `npm run build` before pushing as well.
