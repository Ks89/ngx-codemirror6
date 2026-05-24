# ngx-codemirror6 Documentation

Documentation for the Angular library in `projects/ks89/ngx-codemirror6`.

`@ks89/ngx-codemirror6` is an Angular wrapper for [CodeMirror 6](https://codemirror.net/), a modern code editor for the browser. The wrapper lets Angular developers use CodeMirror with Angular inputs, outputs, forms, and component methods, without manually creating `EditorView` and `EditorState` objects for common cases.

## Index

1. [What This Library Gives You](#1-what-this-library-gives-you)
2. [Installation](#2-installation)
3. [Quick Start](#3-quick-start)
4. [Run The Example App](#4-run-the-example-app)
5. [Core Concepts In Simple Words](#5-core-concepts-in-simple-words)
6. [Basic Editor Features](#6-basic-editor-features)
7. [Events And Angular Forms](#7-events-and-angular-forms)
8. [Public Methods](#8-public-methods)
9. [Advanced Core Features](#9-advanced-core-features)
10. [Optional Package Features](#10-optional-package-features)
11. [Types Exported By The Library](#11-types-exported-by-the-library)
12. [Current API Design Notes](#12-current-api-design-notes)
13. [Official CodeMirror References](#13-official-codemirror-references)

## 1. What This Library Gives You

This library exposes one Angular component:

```html
<ks-codemirror></ks-codemirror>
```

You can use it for:

- Read-only code blocks.
- Editable code editors.
- Angular reactive forms.
- Language support such as TypeScript, JSON, HTML, CSS, Python, SQL, and more.
- Themes.
- Line numbers, active line, whitespace markers, wrapping, indentation, and selection helpers.
- Search, autocomplete, linting, commands, folding, gutters, decorations, panels, and tooltips.

CodeMirror itself is built from small pieces called **extensions**. An extension adds behavior or UI to the editor. For example, line numbers, a language parser, a theme, search, linting, and keymaps are all extensions.

This wrapper gives you Angular inputs for many common extensions and still lets you pass custom CodeMirror extensions through `[appendExtensions]`.

## 2. Installation

Install the Angular wrapper and the required CodeMirror core packages:

```bash
npm install @ks89/ngx-codemirror6 @codemirror/state @codemirror/view @codemirror/language
```

Install at least one language package if you want syntax highlighting and language-aware behavior:

```bash
npm install @codemirror/lang-javascript
```

Language packages are installed separately because CodeMirror is modular. You only install the languages your application needs.

The official CodeMirror website lists full parser packages for these languages: Angular, CSS, C++, Go, HTML, Java, JavaScript, Jinja, JSON, Liquid, Markdown, PHP, Python, Rust, Sass, SQL, Vue, WAST, XML, and YAML.

Common package names:

| Language | Package | Import example |
| --- | --- | --- |
| Angular | `@codemirror/lang-angular` | `import { angular } from '@codemirror/lang-angular';` |
| CSS | `@codemirror/lang-css` | `import { css } from '@codemirror/lang-css';` |
| C++ | `@codemirror/lang-cpp` | `import { cpp } from '@codemirror/lang-cpp';` |
| Go | `@codemirror/lang-go` | `import { go } from '@codemirror/lang-go';` |
| HTML | `@codemirror/lang-html` | `import { html } from '@codemirror/lang-html';` |
| Java | `@codemirror/lang-java` | `import { java } from '@codemirror/lang-java';` |
| JavaScript / TypeScript | `@codemirror/lang-javascript` | `import { javascript } from '@codemirror/lang-javascript';` |
| JSON | `@codemirror/lang-json` | `import { json } from '@codemirror/lang-json';` |
| Markdown | `@codemirror/lang-markdown` | `import { markdown } from '@codemirror/lang-markdown';` |
| PHP | `@codemirror/lang-php` | `import { php } from '@codemirror/lang-php';` |
| Python | `@codemirror/lang-python` | `import { python } from '@codemirror/lang-python';` |
| Rust | `@codemirror/lang-rust` | `import { rust } from '@codemirror/lang-rust';` |
| Sass | `@codemirror/lang-sass` | `import { sass } from '@codemirror/lang-sass';` |
| SQL | `@codemirror/lang-sql` | `import { sql } from '@codemirror/lang-sql';` |
| XML | `@codemirror/lang-xml` | `import { xml } from '@codemirror/lang-xml';` |
| YAML | `@codemirror/lang-yaml` | `import { yaml } from '@codemirror/lang-yaml';` |

Official language information:

- [CodeMirror language support list](https://codemirror.net/#features)
- [Language package example](https://codemirror.net/examples/lang-package/)
- [Community packages](https://codemirror.net/docs/community/)

Theme packages are also extensions. The official CodeMirror package used most often is:

```bash
npm install @codemirror/theme-one-dark
```

CodeMirror also supports custom themes with `EditorView.theme` and base themes with `EditorView.baseTheme`. This wrapper exposes `[theme]` for theme extensions and `[baseTheme]` for base theme rules.

Official theme information:

- [CodeMirror theming example](https://codemirror.net/examples/styling/)
- [EditorView.theme reference](https://codemirror.net/docs/ref/#view.EditorView%5Etheme)
- [EditorView.baseTheme reference](https://codemirror.net/docs/ref/#view.EditorView%5EbaseTheme)

Import the module in your Angular module:

```ts
import { NgModule } from '@angular/core';
import { CodemirrorModule } from '@ks89/ngx-codemirror6';

@NgModule({
  imports: [CodemirrorModule]
})
export class AppModule {}
```

### 2.1 Optional Packages

Some features are loaded with dynamic imports and need extra CodeMirror packages only when you use them:

```bash
npm install @codemirror/autocomplete @codemirror/commands @codemirror/lint @codemirror/search
```

You do not need all of them for a simple editor. For example, if you do not use autocomplete, you do not need `@codemirror/autocomplete`.

See [10. Optional Package Features](#10-optional-package-features) for the full list.

## 3. Quick Start

### 3.1 Minimal Read-Only Editor

Install the JavaScript language package before using this example:

```bash
npm install @codemirror/lang-javascript
```

```ts
import { Component } from '@angular/core';
import { javascript } from '@codemirror/lang-javascript';
import { Extension } from '@codemirror/state';

@Component({
  selector: 'app-code-preview',
  template: `
    <ks-codemirror
      [content]="code"
      [language]="language"
      [readOnly]="true">
    </ks-codemirror>
  `
})
export class CodePreviewComponent {
  code = `const message = 'Hello CodeMirror';`;
  language: Extension = javascript({ typescript: true });
}
```

### 3.2 Editable Editor

```html
<ks-codemirror
  [content]="code"
  [language]="language"
  [readOnly]="false"
  (contentChange)="code = $event">
</ks-codemirror>
```

### 3.3 Themes

CodeMirror themes are extensions. For example, the official one-dark theme:

```bash
npm install @codemirror/theme-one-dark
```

```ts
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';

theme: Extension[] = [oneDark];
```

```html
<ks-codemirror
  [content]="code"
  [language]="language"
  [theme]="theme">
</ks-codemirror>
```

For a light editor, pass an empty array:

```ts
theme: Extension[] = [];
```

### 3.4 Explicit Feature Inputs

The wrapper does not use automatic feature presets. Enable each editor feature with the input that represents it.

```html
<ks-codemirror
  [content]="code"
  [language]="language"
  [readOnly]="false"
  [lineNumbers]="true"
  [highlightActiveLine]="true"
  [bracketMatching]="true"
  [lineWrapping]="true">
</ks-codemirror>
```

This makes the component predictable: `true` enables a feature and `false` disables it. Configuration inputs such as `lineNumberFormatter` and `foldGutterConfig` apply when the related feature input is enabled.

### 3.5 `readOnly` vs `editable`

Most users should use only `readOnly`.

```html
<!-- Code block / viewer -->
<ks-codemirror [readOnly]="true"></ks-codemirror>

<!-- Normal editor -->
<ks-codemirror [readOnly]="false"></ks-codemirror>
```

`readOnly` maps to CodeMirror's `EditorState.readOnly`. Editing commands and extensions use it to decide if they should change the document.

`editable` is an advanced escape hatch. It maps to CodeMirror's `EditorView.editable`, which controls whether the browser DOM is editable/focusable.

By default:

```ts
editable = !readOnly
```

Only use `[editable]` when you intentionally need CodeMirror's lower-level DOM editability behavior.

## 4. Run The Example App

The repository includes a live Angular example app in `src`.

Run it locally:

```bash
npm install
npm run serve
```

Then open the Angular dev server URL printed by the CLI.

The example app includes these tabs:

- `Languages examples`: read-only and editable examples for several language packages.
- `Assist`: autocomplete and lint examples.
- `Events`: outputs, forms-like behavior, public methods, state serialization, undo/redo.
- `Advanced APIs`: search, folding, gutters, breakpoints, decorations, panels, tooltips, and commands.

Use the example app as a working reference when you are unsure how an input or method should be wired in Angular.

## 5. Core Concepts In Simple Words

### 5.1 Editor State

CodeMirror stores the document, selection, and other data in an `EditorState`.

You usually do not create this yourself when using this wrapper. The component creates it for you from inputs like `[content]`, `[language]`, `[theme]`, and other options.

Official reference: [EditorState](https://codemirror.net/docs/ref/#state.EditorState)

### 5.2 Editor View

The `EditorView` is the browser UI for the editor. It renders the document and handles user interaction.

The wrapper emits the created `EditorView` through:

```html
(editorReady)="onEditorReady($event)"
```

Official reference: [EditorView](https://codemirror.net/docs/ref/#view.EditorView)

### 5.3 Extensions

An extension is a CodeMirror configuration piece. It can add a language, theme, keymap, search, linting, line numbers, and many other features.

This wrapper gives you inputs for common extensions. For custom extensions, use:

```html
<ks-codemirror [appendExtensions]="myExtensions"></ks-codemirror>
```

Official guide: [CodeMirror System Guide](https://codemirror.net/docs/guide/)

## 6. Basic Editor Features

### 6.1 Content

```html
<ks-codemirror [content]="code"></ks-codemirror>
```

Listen for changes:

```html
<ks-codemirror
  [content]="code"
  [readOnly]="false"
  (contentChange)="code = $event">
</ks-codemirror>
```

### 6.2 Languages

Language packages provide syntax highlighting and language-aware behavior.

CodeMirror does not install every language by default. Install the language package you need, import its helper function, and pass the returned extension to `[language]`.

Example with JavaScript or TypeScript:

```bash
npm install @codemirror/lang-javascript
```

```ts
import { javascript } from '@codemirror/lang-javascript';

language = javascript({ typescript: true });
```

```html
<ks-codemirror [language]="language"></ks-codemirror>
```

Official language examples: [CodeMirror examples](https://codemirror.net/examples/)

Official language package details: [Language package example](https://codemirror.net/examples/lang-package/)

### 6.3 Display Options

```html
<ks-codemirror
  [lineWrapping]="true"
  [placeholder]="'Write code...'"
  [lineNumbers]="true"
  [highlightActiveLine]="true"
  [highlightActiveLineGutter]="true"
  [bracketMatching]="true"
  [highlightSpecialChars]="true"
  [highlightWhitespace]="false"
  [highlightTrailingWhitespace]="false"
  [scrollPastEnd]="false">
</ks-codemirror>
```

Useful inputs:

| Input | Purpose |
| --- | --- |
| `lineWrapping` | Wrap long lines instead of horizontal scrolling. |
| `placeholder` | Show text when the editor is empty. |
| `lineNumbers` | Show line numbers in a gutter, the side column next to the code. |
| `lineNumberFormatter` | Customize how line numbers are displayed. |
| `highlightActiveLine` | Highlight the current line. |
| `highlightActiveLineGutter` | Highlight the gutter for the current line. |
| `bracketMatching` | Highlight matching brackets. |
| `highlightWhitespace` | Show whitespace markers. |
| `highlightTrailingWhitespace` | Show whitespace at line ends. |
| `scrollPastEnd` | Allow scrolling after the last line. |

These inputs are explicit. For example, `[lineNumbers]="false"` keeps line numbers disabled, and `lineNumberFormatter` customizes the line-number gutter when `[lineNumbers]="true"`.

Official reference: [@codemirror/view](https://codemirror.net/docs/ref/#view)

### 6.4 Indentation And Selection

```html
<ks-codemirror
  [tabSize]="2"
  [indentUnit]="'  '"
  [indentOnInput]="true"
  [multipleSelections]="true"
  [drawSelection]="true">
</ks-codemirror>
```

`indentOnInput` is useful for editable editors. It lets language rules adjust indentation while the user types.

`multipleSelections` allows more than one cursor/selection. `drawSelection` helps render those selections consistently.

Official reference: [EditorState facets](https://codemirror.net/docs/ref/#state.EditorState%5EallowMultipleSelections)

## 7. Events And Angular Forms

### 7.1 Outputs

```html
<ks-codemirror
  (editorReady)="onReady($event)"
  (contentChange)="onContentChange($event)"
  (update)="onUpdate($event)"
  (selectionChange)="onSelectionChange($event)"
  (breakpointsChange)="onBreakpointsChange($event)">
</ks-codemirror>
```

| Output | Emits |
| --- | --- |
| `editorReady` | The created CodeMirror `EditorView`. |
| `contentChange` | Full document text after editor changes. |
| `update` | Every CodeMirror `ViewUpdate`. |
| `selectionChange` | Current `EditorSelection` when selection changes. |
| `breakpointsChange` | Updated breakpoint line numbers. |

Official reference: [ViewUpdate](https://codemirror.net/docs/ref/#view.ViewUpdate)

### 7.2 Reactive Forms

The component implements `ControlValueAccessor`, so it can be used with Angular reactive forms.

```ts
control = new FormControl('initial code', { nonNullable: true });
```

```html
<ks-codemirror
  [formControl]="control"
  [readOnly]="false">
</ks-codemirror>
```

## 8. Public Methods

Use a template reference when you need to call methods:

```html
<ks-codemirror #editor [readOnly]="false"></ks-codemirror>

<button type="button" (click)="editor.focus()">Focus</button>
<button type="button" (click)="editor.setValue('new code')">Set value</button>
```

### 8.1 Value And Transactions

| Method | Purpose |
| --- | --- |
| `focus()` | Focus the editor. |
| `getValue()` | Return the current document text. |
| `setValue(value)` | Replace the full document text. |
| `dispatch(...specs)` | Dispatch raw CodeMirror transactions. |
| `replaceSelection(text)` | Replace the current selection. |
| `resetEditor(config)` | Recreate the editor from a CodeMirror state config while preserving wrapper behavior. |

Official reference: [transactions](https://codemirror.net/docs/ref/#state.Transaction)

### 8.2 Scrolling

| Method | Purpose |
| --- | --- |
| `scrollToPosition(position)` | Scroll a document offset into view. |
| `scrollToLine(line)` | Scroll a one-based line number into view. |
| `scrollSelectionIntoView()` | Scroll the current selection into view. |

### 8.3 State Serialization

```ts
const saved = editor.toJSON();
await editor.restoreFromJSON(saved);
```

`toJSON()` serializes the editor state. It includes history and fold state when those extensions are active.

Official reference: [EditorState.toJSON](https://codemirror.net/docs/ref/#state.EditorState.toJSON)

### 8.4 Advanced State Reset

The component exposes `resetEditor(config)` for advanced cases where you want to recreate the editor from a CodeMirror `EditorStateConfig`.

```ts
await editor.resetEditor({
  doc: 'const value = 1;',
  extensions: myCustomExtensions
});
```

The wrapper preserves its managed extensions, outputs, Angular forms integration, and input reconfiguration support. User-provided extensions are appended after the wrapper extensions.

Prefer normal inputs and `[appendExtensions]` for most applications. Use `resetEditor(config)` only when you need to recreate the whole editor state.

## 9. Advanced Core Features

These features use required core packages: `@codemirror/state`, `@codemirror/view`, and `@codemirror/language`.

### 9.1 Code Folding

```html
<ks-codemirror
  [language]="language"
  [codeFolding]="true"
  [foldGutter]="true"
  [foldKeymap]="true">
</ks-codemirror>
```

Inputs:

| Input | Purpose |
| --- | --- |
| `codeFolding` | Enable folded range state and folding commands. |
| `codeFoldingConfig` | Pass CodeMirror code folding options. |
| `foldGutter` | Show fold controls in a gutter. |
| `foldGutterConfig` | Pass CodeMirror fold gutter options. |
| `foldKeymap` | Enable CodeMirror's default folding keyboard shortcuts. |

Methods:

| Method | Purpose |
| --- | --- |
| `foldCode()` | Fold at the current selection. |
| `unfoldCode()` | Unfold at the current selection. |
| `toggleFold()` | Toggle folding at the current selection. |
| `foldAll()` | Fold all foldable ranges. |
| `unfoldAll()` | Unfold all ranges. |
| `getFoldedRanges()` | Return folded ranges. |

Official reference: [@codemirror/language folding](https://codemirror.net/docs/ref/#language.foldGutter)

### 9.2 Gutters And Breakpoints

A gutter is a vertical area beside the code. Line numbers and fold markers are examples of gutters.

```html
<ks-codemirror
  [breakpointGutter]="true"
  [breakpoints]="[2, 5]"
  (breakpointsChange)="breakpoints = $event">
</ks-codemirror>
```

Methods:

```ts
editor.toggleBreakpoint(4);
editor.hasBreakpoint(4);
```

Custom gutters:

```html
<ks-codemirror [customGutters]="gutters"></ks-codemirror>
```

Official reference: [gutters](https://codemirror.net/docs/ref/#view.gutter)

`[breakpoints]` uses one-based line numbers for Angular binding and emits one-based line numbers through `(breakpointsChange)`. Internally, breakpoint positions are stored in CodeMirror state and mapped through editor document changes, so markers stay attached to the edited document positions.

### 9.3 Decorations And Marked Ranges

Decorations let you style or replace parts of the document without changing the text.

Simple marked range:

```ts
markedRanges = [
  { from: 0, to: 10, class: 'warning-range' }
];
```

```html
<ks-codemirror [markedRanges]="markedRanges"></ks-codemirror>
```

Direct CodeMirror decorations:

```html
<ks-codemirror [decorations]="decorations"></ks-codemirror>
```

`markedRanges` is backed by CodeMirror state and mapped through editor document changes. When the Angular `[markedRanges]` input changes, the wrapper replaces the marked range set with the new input value.

Official reference: [decorations](https://codemirror.net/docs/ref/#view.Decoration)

### 9.4 Panels And Tooltips

Panels are custom DOM blocks attached above or below the editor. Tooltips are floating UI elements attached to document positions.

```html
<ks-codemirror
  [panels]="panel"
  [tooltips]="tooltip"
  [hoverTooltip]="hoverTooltip">
</ks-codemirror>
```

Methods:

| Method | Purpose |
| --- | --- |
| `getPanel(panelConstructor)` | Get a mounted panel instance. |
| `hasHoverTooltips()` | Check if hover tooltips are active. |
| `activateHover(position)` | Start hover tooltip resolution. |
| `closeHoverTooltips()` | Close hover tooltips. |
| `repositionTooltips()` | Recalculate tooltip positions. |

Official references:

- [panels](https://codemirror.net/docs/ref/#view.showPanel)
- [tooltips](https://codemirror.net/docs/ref/#view.showTooltip)
- [hoverTooltip](https://codemirror.net/docs/ref/#view.hoverTooltip)

### 9.5 Styling, Attributes, And CSP

```html
<ks-codemirror
  [editorAttributes]="{ 'data-editor': 'main' }"
  [contentAttributes]="{ 'aria-label': 'Code editor' }"
  [baseTheme]="baseTheme"
  [cspNonce]="nonce">
</ks-codemirror>
```

Use:

- `editorAttributes` for the outer `.cm-editor` element.
- `contentAttributes` for the editable content element.
- `baseTheme` for base styles related to your editor features.
- `cspNonce` when your application uses Content Security Policy nonces for style elements.

Official reference: [EditorView](https://codemirror.net/docs/ref/#view.EditorView)

## 10. Optional Package Features

Optional packages are not required for a basic editor. Install them only when you use the related features.

### 10.1 `@codemirror/autocomplete`

Install:

```bash
npm install @codemirror/autocomplete
```

Inputs:

| Input | Purpose |
| --- | --- |
| `closeBrackets` | Automatically close brackets while typing. |
| `autocompletion` | Enable the completion UI. |
| `completions` | Provide custom completion sources. |
| `autocompletionConfig` | Pass CodeMirror autocomplete options. |

When `[completions]` is provided, the wrapper registers those sources as CodeMirror language data. This adds application-specific suggestions alongside language-provided completions. If you intentionally want to replace all language completions, pass CodeMirror's native `override` option through `[autocompletionConfig]`.

`closeBrackets` enables CodeMirror's bracket-closing extension and its related keymap, including bracket-pair deletion behavior such as Backspace between an inserted pair.

Example:

```ts
import { CompletionSource } from '@codemirror/autocomplete';

completions: CompletionSource = (context) => {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  return {
    from: word.from,
    options: [
      { label: 'const', type: 'keyword' },
      { label: 'console.log', type: 'function' }
    ]
  };
};
```

```html
<ks-codemirror
  [readOnly]="false"
  [autocompletion]="true"
  [completions]="completions">
</ks-codemirror>
```

Methods:

| Method | Purpose |
| --- | --- |
| `startCompletion()` | Open the completion UI. |
| `closeCompletion()` | Close completion. |
| `acceptCompletion()` | Accept selected completion. |
| `completionStatus()` | Return completion UI status. |
| `currentCompletions()` | Return current options. |
| `selectedCompletion()` | Return selected option. |
| `selectedCompletionIndex()` | Return selected option index. |

Official reference: [@codemirror/autocomplete](https://codemirror.net/docs/ref/#autocomplete)

### 10.2 `@codemirror/commands`

Install:

```bash
npm install @codemirror/commands
```

Input:

| Input | Purpose |
| --- | --- |
| `indentWithTab` | Let Tab indent the selection. |
| `keymaps` | Register custom CodeMirror key bindings. |
| `appendExtensions` | Pass native command extensions, such as history and default keymaps. |

Undo and redo need CodeMirror history in the editor state. Add it explicitly when your UI uses `undo()` or `redo()`:

```ts
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

commandExtensions = [history(), keymap.of([...defaultKeymap, ...historyKeymap])];
```

```html
<ks-codemirror
  [appendExtensions]="commandExtensions"
  [indentWithTab]="true">
</ks-codemirror>
```

Methods:

| Method | Purpose |
| --- | --- |
| `undo()` / `redo()` | Undo and redo document history. |
| `addCursorAbove()` / `addCursorBelow()` | Add more cursors. |
| `toggleComment()` | Toggle comment syntax. |
| `toggleLineComment()` | Toggle line comments. |
| `lineComment()` / `lineUncomment()` | Add or remove line comments. |
| `toggleBlockComment()` | Toggle block comments. |
| `indentMore()` / `indentLess()` | Change indentation level. |
| `indentSelection()` | Apply language-aware indentation. |
| `deleteLine()` | Delete selected lines. |
| `moveLineUp()` / `moveLineDown()` | Move selected lines. |
| `selectLine()` | Select current line. |
| `cursorMatchingBracket()` | Move to matching bracket. |
| `toggleTabFocusMode()` | Toggle Tab focus mode. |

Official reference: [@codemirror/commands](https://codemirror.net/docs/ref/#commands)

### 10.3 `@codemirror/lint`

Install:

```bash
npm install @codemirror/lint
```

Inputs:

| Input | Purpose |
| --- | --- |
| `lint` | Enable diagnostics when a linter is provided. |
| `linter` | Function that returns diagnostics. |
| `lintConfig` | Pass CodeMirror linter options. |
| `lintGutter` | Show diagnostic markers in the gutter. |
| `lintKeymap` | Enable CodeMirror's default lint keyboard shortcuts. |

Example:

```ts
import { Diagnostic, LintSource } from '@codemirror/lint';

linter: LintSource = (view) => {
  const diagnostics: Diagnostic[] = [];
  const text = view.state.doc.toString();
  const index = text.indexOf('var ');

  if (index >= 0) {
    diagnostics.push({
      from: index,
      to: index + 3,
      severity: 'warning',
      message: 'Prefer const or let.'
    });
  }

  return diagnostics;
};
```

```html
<ks-codemirror
  [lint]="true"
  [linter]="linter"
  [lintConfig]="{ delay: 300 }"
  [lintGutter]="true"
  [lintKeymap]="true">
</ks-codemirror>
```

Official reference: [@codemirror/lint](https://codemirror.net/docs/ref/#lint)

`lintConfig` supports CodeMirror linter options such as lint delay, refresh predicates, marker filters, tooltip filters, and automatic lint panel behavior. Use `[appendExtensions]` with native CodeMirror lint extensions only when you need behavior beyond the exposed wrapper inputs.

### 10.4 `@codemirror/search`

Install:

```bash
npm install @codemirror/search
```

Inputs:

| Input | Purpose |
| --- | --- |
| `search` | Enable search state and search panel support. |
| `searchConfig` | Pass CodeMirror search options. |
| `searchKeymap` | Enable search keyboard shortcuts. |
| `highlightSelectionMatches` | Highlight matches for the current selection. |

`highlightSelectionMatches` is currently a boolean input. CodeMirror also supports options such as minimum selection length and whole-word matching. Use `[appendExtensions]` when you need those advanced options.

Methods:

| Method | Purpose |
| --- | --- |
| `openSearchPanel()` | Open search panel. |
| `closeSearchPanel()` | Close search panel. |
| `isSearchPanelOpen()` | Check panel state. |
| `findNext()` / `findPrevious()` | Move between matches. |
| `replaceNext()` / `replaceAll()` | Replace matches. |
| `gotoLine()` | Open go-to-line UI. |
| `selectNextOccurrence()` | Add next occurrence to selection. |
| `selectSelectionMatches()` | Select matches for current selection. |
| `selectMatches()` | Select all search matches. |

Official reference: [@codemirror/search](https://codemirror.net/docs/ref/#search)

## 11. Types Exported By The Library

The package exports useful wrapper types:

```ts
import {
  CodemirrorAutocompletionConfig,
  CodemirrorBaseTheme,
  CodemirrorCodeFoldingConfig,
  CodemirrorDecorationSource,
  CodemirrorFoldGutterConfig,
  CodemirrorFoldedRange,
  CodemirrorGutterConfig,
  CodemirrorHoverTooltipOptions,
  CodemirrorHoverTooltipSource,
  CodemirrorLintConfig,
  CodemirrorMarkedRange,
  CodemirrorSearchConfig,
  CodemirrorTooltipConfig,
  KeymapInput
} from '@ks89/ngx-codemirror6';
```

These types mirror the underlying CodeMirror APIs, so your Angular code can stay type-safe while still using native CodeMirror configuration objects.

## 12. Current API Design Notes

This section documents current wrapper behavior that is important when comparing the library with the official CodeMirror documentation.

### 12.1 Explicit Inputs

There is no wrapper preset API. Inputs are direct feature toggles: `true` enables the related CodeMirror extension and `false` leaves it out. For native CodeMirror behavior that is not exposed as an input, pass extensions through `[appendExtensions]`.

### 12.2 Custom Autocomplete Sources

`[completions]` is additive with language completions. Use `[autocompletionConfig]="{ override: [...] }"` only when your Angular application should fully own the suggestion list.

### 12.3 Stateful Positions

`[breakpoints]` and `[markedRanges]` are Angular-friendly inputs, but their document positions are tracked with CodeMirror state internally. Editor transactions map those positions through document changes. Updating the Angular input explicitly replaces the wrapper-managed state with the new input value.

### 12.4 Advanced Native CodeMirror Configuration

Some native CodeMirror options are intentionally simplified as booleans in this wrapper. Related CodeMirror keymaps and common config objects are exposed where the wrapper has a corresponding feature input, such as `[foldKeymap]`, `[lintKeymap]`, `[lintConfig]`, `[searchKeymap]`, and `[autocompletionConfig]`. For deeper configuration, pass native CodeMirror extensions through `[appendExtensions]`.

Use `resetEditor(config)` only when you need to recreate the whole editor state. It keeps wrapper-managed behavior and appends your custom extensions after the wrapper extensions.

## 13. Official CodeMirror References

Use these links when you want to go deeper into native CodeMirror behavior:

- Main site: [CodeMirror](https://codemirror.net/)
- Documentation index: [CodeMirror documentation](https://codemirror.net/docs/)
- System guide: [CodeMirror guide](https://codemirror.net/docs/guide/)
- Full API reference: [CodeMirror reference manual](https://codemirror.net/docs/ref/)
- Examples: [CodeMirror examples](https://codemirror.net/examples/)
- Core extension list: [CodeMirror core extensions](https://codemirror.net/docs/extensions/)
- State package: [@codemirror/state](https://codemirror.net/docs/ref/#state)
- View package: [@codemirror/view](https://codemirror.net/docs/ref/#view)
- Language package: [@codemirror/language](https://codemirror.net/docs/ref/#language)
- Commands package: [@codemirror/commands](https://codemirror.net/docs/ref/#commands)
- Search package: [@codemirror/search](https://codemirror.net/docs/ref/#search)
- Autocomplete package: [@codemirror/autocomplete](https://codemirror.net/docs/ref/#autocomplete)
- Lint package: [@codemirror/lint](https://codemirror.net/docs/ref/#lint)
