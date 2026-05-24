# Repository Guidelines

## Project Structure & Module Organization

This is an Angular workspace for the `@ks89/ngx-codemirror6` library and its demo app. Library source lives in `projects/ks89/ngx-codemirror6/src/lib`. The Angular component is `ngx-codemirror6.component.ts`; CodeMirror extension helpers are in `src/lib/internal`; exported types are in `src/lib/models`; the package entry point is `src/public-api.ts`. Library tests are beside the component as `ngx-codemirror6.component.spec.ts`. The demo application lives in `src/app`, with static assets in `src/assets`. Build output goes to `dist/` and should not be edited manually.

## Build, Test, and Development Commands

- `npm run serve`: run the demo app in development mode.
- `npm run build:lib`: build the publishable library package and copy docs/license files.
- `npm run build:main:dev`: build the demo app in development mode.
- `npm run build`: build both library and demo app.
- `npm test`: run the library Karma/Jasmine test suite once.
- `npm run test:watch`: run tests in watch mode.
- `npm run check:circulardeps`: check TypeScript circular dependencies with Madge.

## Coding Style & Naming Conventions

Use TypeScript and Angular conventions. Keep public library API exported from `projects/ks89/ngx-codemirror6/src/public-api.ts`. Prefer focused files: Angular orchestration in the component, reusable CodeMirror logic in `internal/`, and public/shared types in `models/`. Use two-space indentation and run Prettier before committing; the pre-commit hook uses `pretty-quick`. Use clear Angular names such as `CodemirrorComponent`, `CodemirrorModule`, and `Codemirror*` exported types.

## Testing Guidelines

Tests use Jasmine, Karma, and Chrome Headless through Angular CLI. Put component tests in `*.spec.ts` near the code under test. Cover real wrapper behavior: inputs, outputs, ControlValueAccessor, dynamic optional features, and public methods. Run `npm test` before opening a PR. Coverage is generated under `coverage/`; avoid adding shallow tests only to raise percentages.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style prefixes, for example `feat: upgrade to angular 21` and `fix: readme`. Use `feat:`, `fix:`, `docs:`, `test:`, or `refactor:` with a concise imperative summary. Pull requests should include a short description, relevant issue links, test/build commands run, and screenshots or notes when changing the demo UI or documentation.

## Security & Configuration Tips

Optional CodeMirror packages are loaded dynamically. Keep optional package behavior graceful and document which APIs require `@codemirror/autocomplete`, `@codemirror/commands`, `@codemirror/lint`, or `@codemirror/search`. Run `npm audit` when changing dependencies.

## CodeMirror API Design Priorities

When changing the wrapper API, compare behavior with the official CodeMirror docs and examples. Fix high-impact API surprises first:

1. Keep whole-state editor resets on the safe `resetEditor(config)` path. Do not reintroduce a public raw `EditorView` initializer that bypasses wrapper-managed extensions, outputs, forms integration, and input reconfiguration.
2. Keep feature inputs explicit and predictable. For example, `[lineNumbers]="true"` enables line numbers and `[lineNumbers]="false"` leaves them out.
3. Ensure config inputs are never silent no-ops. `lineNumberFormatter`, `foldGutterConfig`, and similar options must work when the related feature input is enabled.
4. Do not reintroduce wrapper presets for feature groups. Demo and documentation examples should show explicit inputs or native CodeMirror extensions through `[appendExtensions]`.
5. Avoid replacing language features accidentally. Custom autocomplete should stay additive unless users pass CodeMirror's native `override` option.
6. Match related CodeMirror behavior when exposing features, such as pairing `closeBrackets()` with its keymap and exposing native keymaps like `foldKeymap` and `lintKeymap` when the related feature is wrapped.
7. For stateful editor features like breakpoints and marked ranges, prefer CodeMirror state fields/effects so positions survive document edits. Do not reintroduce static-offset decoration behavior for document-coupled ranges.
