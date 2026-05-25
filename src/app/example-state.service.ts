/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2023-2026 Stefano Cappa (Ks89)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Injectable } from '@angular/core';
import { CompletionSource } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { angular } from '@codemirror/lang-angular';
import { css } from '@codemirror/lang-css';
import { cpp } from '@codemirror/lang-cpp';
import { go } from '@codemirror/lang-go';
import { html as htmlLang } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { php } from '@codemirror/lang-php';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { sass } from '@codemirror/lang-sass';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { EditorSelection, Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, KeyBinding, Panel, PanelConstructor, Tooltip, ViewUpdate, keymap } from '@codemirror/view';
import { Diagnostic, LintSource } from '@codemirror/lint';
import { aura as ddAura } from '@ddietr/codemirror-themes/aura';
import { dracula as ddDracula } from '@ddietr/codemirror-themes/dracula';
import { githubDark } from '@ddietr/codemirror-themes/github-dark';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import { materialDark } from '@ddietr/codemirror-themes/material-dark';
import { materialLight } from '@ddietr/codemirror-themes/material-light';
import { solarizedDark as ddSolarizedDark } from '@ddietr/codemirror-themes/solarized-dark';
import { solarizedLight as ddSolarizedLight } from '@ddietr/codemirror-themes/solarized-light';
import { tokyoNight } from '@ddietr/codemirror-themes/tokyo-night';
import { tokyoNightDay } from '@ddietr/codemirror-themes/tokyo-night-day';
import { tokyoNightStorm } from '@ddietr/codemirror-themes/tokyo-night-storm';
import {
  amy,
  ayuLight,
  barf,
  bespin,
  birdsOfParadise,
  boysAndGirls,
  clouds,
  cobalt,
  coolGlow,
  dracula as tmDracula,
  espresso,
  noctisLilac,
  rosePineDawn,
  smoothy,
  solarizedLight as tmSolarizedLight,
  tomorrow
} from 'thememirror';
import {
  CodemirrorBaseTheme,
  CodemirrorCodeFoldingConfig,
  CodemirrorComponent,
  CodemirrorFoldGutterConfig,
  CodemirrorGutterConfig,
  CodemirrorHoverTooltipSource,
  CodemirrorLintConfig,
  CodemirrorMarkedRange,
  CodemirrorSearchConfig
} from '@ks89/ngx-codemirror6';

interface CodeExample {
  title: string;
  installCommand: string;
  content: string;
  language: Extension;
}

type ExampleTabId =
  | 'languages'
  | 'themes'
  | 'display'
  | 'events'
  | 'folding'
  | 'gutters'
  | 'tooltips'
  | 'autocomplete'
  | 'commands'
  | 'lint'
  | 'search';

interface ExampleTab {
  id: ExampleTabId;
  label: string;
}

interface ThemeExample {
  id: string;
  label: string;
  packageHint: string;
  extensions: Extension[];
}

@Injectable({ providedIn: 'root' })
export class ExampleStateService {
  activeTab: ExampleTabId = 'languages';
  tabs: readonly ExampleTab[] = [
    { id: 'languages', label: 'Languages' },
    { id: 'themes', label: 'Themes' },
    { id: 'display', label: 'Display and editing' },
    { id: 'events', label: 'Events and methods' },
    { id: 'folding', label: 'Folding' },
    { id: 'gutters', label: 'Gutters and decorations' },
    { id: 'tooltips', label: 'Panels and tooltips' },
    { id: 'autocomplete', label: '@codemirror/autocomplete' },
    { id: 'commands', label: '@codemirror/commands' },
    { id: 'lint', label: '@codemirror/lint' },
    { id: 'search', label: '@codemirror/search' }
  ];

  darkTheme: boolean = true;
  darkExtensions: Extension[] = [oneDark];
  lightExtensions: Extension[] = [];
  selectedThemeExampleId: string = 'one-dark';
  themeExamples: readonly ThemeExample[] = [
    {
      id: 'one-dark',
      label: 'One Dark',
      packageHint: 'Official package: npm install @codemirror/theme-one-dark',
      extensions: [oneDark]
    },
    {
      id: 'dd-material-light',
      label: 'Material Light',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [materialLight]
    },
    {
      id: 'dd-material-dark',
      label: 'Material Dark',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [materialDark]
    },
    {
      id: 'dd-solarized-light',
      label: 'Solarized Light',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [ddSolarizedLight]
    },
    {
      id: 'dd-solarized-dark',
      label: 'Solarized Dark',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [ddSolarizedDark]
    },
    {
      id: 'dd-dracula',
      label: 'Dracula',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [ddDracula]
    },
    {
      id: 'dd-github-light',
      label: 'GitHub Light',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [githubLight]
    },
    {
      id: 'dd-github-dark',
      label: 'GitHub Dark',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [githubDark]
    },
    {
      id: 'dd-aura',
      label: 'Aura',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [ddAura]
    },
    {
      id: 'dd-tokyo-night',
      label: 'Tokyo Night',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [tokyoNight]
    },
    {
      id: 'dd-tokyo-night-storm',
      label: 'Tokyo Night Storm',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [tokyoNightStorm]
    },
    {
      id: 'dd-tokyo-night-day',
      label: 'Tokyo Night Day',
      packageHint: 'Community package: npm install @ddietr/codemirror-themes',
      extensions: [tokyoNightDay]
    },
    {
      id: 'tm-amy',
      label: 'Amy',
      packageHint: 'Community package: npm install thememirror',
      extensions: [amy]
    },
    {
      id: 'tm-ayu-light',
      label: 'Ayu Light',
      packageHint: 'Community package: npm install thememirror',
      extensions: [ayuLight]
    },
    {
      id: 'tm-barf',
      label: 'Barf',
      packageHint: 'Community package: npm install thememirror',
      extensions: [barf]
    },
    {
      id: 'tm-bespin',
      label: 'Bespin',
      packageHint: 'Community package: npm install thememirror',
      extensions: [bespin]
    },
    {
      id: 'tm-birds-of-paradise',
      label: 'Birds of Paradise',
      packageHint: 'Community package: npm install thememirror',
      extensions: [birdsOfParadise]
    },
    {
      id: 'tm-boys-and-girls',
      label: 'Boys and Girls',
      packageHint: 'Community package: npm install thememirror',
      extensions: [boysAndGirls]
    },
    {
      id: 'tm-clouds',
      label: 'Clouds',
      packageHint: 'Community package: npm install thememirror',
      extensions: [clouds]
    },
    {
      id: 'tm-cobalt',
      label: 'Cobalt',
      packageHint: 'Community package: npm install thememirror',
      extensions: [cobalt]
    },
    {
      id: 'tm-cool-glow',
      label: 'Cool Glow',
      packageHint: 'Community package: npm install thememirror',
      extensions: [coolGlow]
    },
    {
      id: 'tm-dracula',
      label: 'Dracula (ThemeMirror)',
      packageHint: 'Community package: npm install thememirror',
      extensions: [tmDracula]
    },
    {
      id: 'tm-espresso',
      label: 'Espresso',
      packageHint: 'Community package: npm install thememirror',
      extensions: [espresso]
    },
    {
      id: 'tm-noctis-lilac',
      label: 'Noctis Lilac',
      packageHint: 'Community package: npm install thememirror',
      extensions: [noctisLilac]
    },
    {
      id: 'tm-rose-pine-dawn',
      label: 'Rose Pine Dawn',
      packageHint: 'Community package: npm install thememirror',
      extensions: [rosePineDawn]
    },
    {
      id: 'tm-smoothy',
      label: 'Smoothy',
      packageHint: 'Community package: npm install thememirror',
      extensions: [smoothy]
    },
    {
      id: 'tm-solarized-light',
      label: 'Solarized Light (ThemeMirror)',
      packageHint: 'Community package: npm install thememirror',
      extensions: [tmSolarizedLight]
    },
    {
      id: 'tm-tomorrow',
      label: 'Tomorrow',
      packageHint: 'Community package: npm install thememirror',
      extensions: [tomorrow]
    }
  ];
  typescriptLanguage: Extension = javascript({ typescript: true, jsx: false });
  htmlSnippetLanguage: Extension = htmlLang();
  assistExampleContent: string = `interface User {
  id: string;
  email: string;
}

var currentUser: User = {
  id: 'user-1',
  email: 'admin@example.test'
};

function saveUser(user: User): void {
  console.log(user.email);
}

saveUser(currentUser);
`;
  assistCompletions: CompletionSource = (context) => {
    const word = context.matchBefore(/\w*/);

    if (!word || (word.from === word.to && !context.explicit)) {
      return null;
    }

    return {
      from: word.from,
      options: [
        { label: 'const', type: 'keyword', detail: 'block scoped constant' },
        { label: 'let', type: 'keyword', detail: 'block scoped variable' },
        { label: 'interface', type: 'keyword', detail: 'TypeScript object shape' },
        { label: 'currentUser', type: 'variable', detail: 'demo user object' },
        { label: 'saveUser', type: 'function', detail: '(user: User) => void' },
        { label: 'console.log', type: 'function', detail: 'write to the console' }
      ]
    };
  };
  assistLinter: LintSource = (view) => {
    const diagnostics: Diagnostic[] = [];
    const text = view.state.doc.toString();
    const varIndex = text.indexOf('var ');
    const consoleIndex = text.indexOf('console.log');

    if (varIndex >= 0) {
      diagnostics.push({
        from: varIndex,
        to: varIndex + 3,
        severity: 'warning',
        message: 'Prefer const or let instead of var.'
      });
    }

    if (consoleIndex >= 0) {
      diagnostics.push({
        from: consoleIndex,
        to: consoleIndex + 'console.log'.length,
        severity: 'info',
        message: 'Demo lint: remove console logging before production.'
      });
    }

    return diagnostics;
  };
  eventExampleContent: string = `type EditorEvent = 'ready' | 'content' | 'update' | 'selection';

const message: string = 'Edit this code to emit contentChange.';

function describeEvent(event: EditorEvent): string {
  return 'CodeMirror emitted: ' + event;
}

console.log(describeEvent('ready'));
`;
  eventLog: string[] = [];
  eventContentLength: number = this.eventExampleContent.length;
  eventUpdateCount: number = 0;
  eventSelectionSummary: string = 'No selection changes yet';
  eventCurrentValuePreview: string = '';
  savedEventEditorState: unknown = null;
  savedEventEditorStatePreview: string = 'No state saved yet';
  assistKeymaps: readonly KeyBinding[] = [
    {
      key: 'Mod-s',
      run: () => {
        this.addEventLog('keymap: Mod-s handled by the example');
        return true;
      }
    }
  ];
  commandHistoryExtensions: Extension[] = [history(), keymap.of([...defaultKeymap, ...historyKeymap])];
  advancedExampleContent: string = `function calculateTotal(items: number[]): number {
  // TODO: replace this demo implementation
  return items.reduce((total, item) => total + item, 0);
}

const total = calculateTotal([4, 8, 15, 16, 23, 42]);
console.log(total);
`;
  advancedTodoPosition: number = this.advancedExampleContent.indexOf('TODO');
  themeExampleContent: string = `const selectedTheme = 'CodeMirror theme demo';

function describeTheme(name: string): string {
  return selectedTheme + ': ' + name;
}
`;
  displayExampleContent: string = `function formatUser(user: { name: string; active: boolean }): string {
  return user.active ? user.name.toUpperCase() : user.name.toLowerCase();
}

const formatted = formatUser({ name: 'Angular developer', active: true });
console.log(formatted);
`;
  displayLongLineContent: string = `const message = 'This is a deliberately long line used to show why lineWrapping is useful when your editor is placed inside a narrow panel, a documentation page, or a settings form where horizontal scrolling would be annoying.';

function logMessage(): void {
  console.log(message);
}
`;
  displayWhitespaceContent: string = `function hasWhitespaceIssues(): void {
  const name = 'Angular';
  console.log(name);
}
`;
  displayIndentationContent: string = `interface Settings {
  theme: 'dark' | 'light';
  tabSize: number;
}

const settings: Settings = {
  theme: 'dark',
  tabSize: 2
};
`;
  languagesDocSnippet: string = `<ks-codemirror
  [content]="code"
  [language]="javascript({ typescript: true })"
  [readOnly]="false"
  [lineNumbers]="true"
  [highlightActiveLine]="true">
</ks-codemirror>`;
  themesDocSnippet: string = `<ks-codemirror
  [content]="code"
  [language]="typescriptLanguage"
  [theme]="selectedTheme.extensions"
  [lineNumbers]="true">
</ks-codemirror>`;
  themesTypeScriptDocSnippet: string = `import { oneDark } from '@codemirror/theme-one-dark';
import { githubDark } from '@ddietr/codemirror-themes/github-dark';
import { dracula } from 'thememirror';

officialDarkTheme = [oneDark];
communityTheme = [githubDark];
anotherCommunityTheme = [dracula];
defaultLightTheme = [];
// in this case we assign and use 'oneDark' theme
selectedTheme = officialDarkTheme;`;
  displayDocSnippet: string = `<ks-codemirror
  [content]="code"
  [lineWrapping]="true"
  [lineNumbers]="true"
  [highlightActiveLine]="true"
  [readOnly]="false">
</ks-codemirror>`;
  eventsDocSnippet: string = `<ks-codemirror
  [content]="code"
  [readOnly]="false"
  [lineNumbers]="true"
  (contentChange)="onContentChange($event)"
  (selectionChange)="onSelectionChange($event)">
</ks-codemirror>`;
  eventsTypeScriptDocSnippet: string = `onContentChange(content: string): void {
  this.contentLength = content.length;
}

onSelectionChange(selection: EditorSelection): void {
  const range = selection.main;
  this.selectionSummary = \`from \${range.from} to \${range.to}\`;
}`;
  foldingDocSnippet: string = `<ks-codemirror
  #editor
  [content]="code"
  [language]="typescriptLanguage"
  [lineNumbers]="true"
  [codeFolding]="true"
  [codeFoldingConfig]="codeFoldingConfig"
  [foldGutter]="true"
  [foldGutterConfig]="foldGutterConfig"
  [foldKeymap]="true">
</ks-codemirror>

<button type="button" (click)="editor.foldAll()">Fold all</button>
<button type="button" (click)="editor.unfoldAll()">Unfold all</button>
<button type="button" (click)="readFoldedRanges(editor)">Read folded ranges</button>`;
  foldingTypeScriptDocSnippet: string = `codeFoldingConfig: CodemirrorCodeFoldingConfig = {
  placeholderText: ' folded '
};

foldGutterConfig: CodemirrorFoldGutterConfig = {
  openText: 'v',
  closedText: '>'
};

foldAll(editor: CodemirrorComponent): void {
  editor.foldAll();
}

unfoldAll(editor: CodemirrorComponent): void {
  editor.unfoldAll();
}

readFoldedRanges(editor: CodemirrorComponent): CodemirrorFoldedRange[] {
  return editor.getFoldedRanges();
}`;
  guttersDocSnippet: string = `<ks-codemirror
  [content]="code"
  [lineNumbers]="true"
  [breakpointGutter]="true"
  [breakpoints]="breakpoints"
  [markedRanges]="markedRanges"
  (breakpointsChange)="onBreakpointsChange($event)">
</ks-codemirror>`;
  guttersTypeScriptDocSnippet: string = `breakpoints: number[] = [2];

markedRanges: readonly CodemirrorMarkedRange[] = [
  { from: 0, to: 8, class: 'highlighted-range' }
];

onBreakpointsChange(breakpoints: number[]): void {
  this.breakpoints = breakpoints;
}`;
  tooltipsDocSnippet: string = `<ks-codemirror
  #editor
  [content]="code"
  [panels]="panel"
  [tooltips]="tooltip"
  [tooltipConfig]="tooltipConfig"
  [hoverTooltip]="hoverTooltip"
  [hoverTooltipOptions]="hoverTooltipOptions">
</ks-codemirror>

<button type="button" (click)="showHoverTooltip(editor)">
  Show hover tooltip
</button>
<button type="button" (click)="closeHoverTooltips(editor)">
  Close hover tooltips
</button>`;
  tooltipsTypeScriptDocSnippet: string = `
panel: PanelConstructor = (): Panel => {
  const dom = document.createElement('div');
  dom.className = 'advanced-cm-panel';
  dom.textContent = 'Panel API: top panel supplied by Angular input';
  return { dom, top: true };
};

tooltip: Tooltip = {
  pos: 45,
  above: true,
  create: () => {
    const dom = document.createElement('div');
    dom.className = 'advanced-cm-tooltip';
    dom.textContent = 'Static tooltip API';
    return { dom };
  }
};

tooltipConfig: CodemirrorTooltipConfig = { position: 'absolute' };
hoverTooltipOptions: CodemirrorHoverTooltipOptions = { hoverTime: 150 };

hoverTooltip: CodemirrorHoverTooltipSource = (view, pos) => {
  const line = view.state.doc.lineAt(pos);
  const todoIndex = line.text.indexOf('TODO');
  if (todoIndex < 0) return null;
  const from = line.from + todoIndex;
  const to = from + 'TODO'.length;
  if (pos < from || pos > to) return null;
  return {
    pos: from,
    end: to,
    above: true,
    create: () => {
      const dom = document.createElement('div');
      dom.className = 'advanced-cm-tooltip';
      dom.textContent = 'Hover tooltip API';
      return { dom };
    }
  };
};

showHoverTooltip(editor: CodemirrorComponent): void {
  editor.activateHover(this.todoPosition);
}

closeHoverTooltips(editor: CodemirrorComponent): void {
  editor.closeHoverTooltips();
}`;
  autocompleteDocSnippet: string = `<ks-codemirror
  #editor
  [content]="code"
  [lineNumbers]="true"
  [autocompletion]="true"
  [completions]="completionSource">
</ks-codemirror>`;
  autocompleteTypeScriptDocSnippet: string = `completionSource: CompletionSource = (context) => {
  const word = context.matchBefore(/\\w*/);

  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  return {
    from: word.from,
    options: [{ label: 'saveUser', type: 'function' }]
  };
};`;
  commandsDocSnippet: string = `<ks-codemirror
  #editor
  [content]="code"
  [lineNumbers]="true"
  [appendExtensions]="commandHistoryExtensions"
  [indentWithTab]="true">
</ks-codemirror>

<button type="button" (click)="editor.undo()">Undo</button>
<button type="button" (click)="editor.redo()">Redo</button>
<button type="button" (click)="editor.addCursorBelow()">Add cursor below</button>`;
  commandsTypeScriptDocSnippet: string = `import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

commandHistoryExtensions = [history(), keymap.of([...defaultKeymap, ...historyKeymap])];

async formatSelection(editor: CodemirrorComponent): Promise<void> {
  await editor.selectLine();
  await editor.toggleLineComment();
  await editor.indentMore();
}`;
  lintDocSnippet: string = `<ks-codemirror
  [content]="code"
  [lineNumbers]="true"
  [lint]="true"
  [linter]="linter"
  [lintConfig]="lintConfig"
  [lintGutter]="true"
  [lintKeymap]="true">
</ks-codemirror>`;
  lintTypeScriptDocSnippet: string = `lintConfig: CodemirrorLintConfig = {
  delay: 300
};

linter: LintSource = (view) => {
  const diagnostics: Diagnostic[] = [];
  const index = view.state.doc.toString().indexOf('var ');

  if (index >= 0) {
    diagnostics.push({
      from: index,
      to: index + 3,
      severity: 'warning',
      message: 'Prefer const or let.'
    });
  }

  return diagnostics;
};`;
  searchDocSnippet: string = `<ks-codemirror
  #editor
  [content]="code"
  [lineNumbers]="true"
  [search]="true"
  [searchKeymap]="true">
</ks-codemirror>

<button type="button" (click)="editor.openSearchPanel()">Open search</button>
<button type="button" (click)="editor.findNext()">Find next</button>
<button type="button" (click)="editor.closeSearchPanel()">Close search</button>`;
  searchTypeScriptDocSnippet: string = `searchConfig: CodemirrorSearchConfig = {
  top: true,
  caseSensitive: false,
  literal: true
};

async openSearch(editor: CodemirrorComponent): Promise<void> {
  await editor.openSearchPanel();
}`;
  advancedBreakpoints: number[] = [2];
  advancedMarkedRanges: readonly CodemirrorMarkedRange[] = [
    { from: 45, to: 49, class: 'cm-demo-warning' },
    { from: 157, to: 168, class: 'cm-demo-info' }
  ];
  advancedSearchConfig: CodemirrorSearchConfig = {
    top: true,
    caseSensitive: false,
    literal: true
  };
  advancedLintConfig: CodemirrorLintConfig = {
    delay: 300
  };
  advancedAutocompletionConfig = {
    activateOnTyping: false,
    icons: false
  };
  advancedCodeFoldingConfig: CodemirrorCodeFoldingConfig = {
    placeholderText: ' folded '
  };
  advancedFoldGutterConfig: CodemirrorFoldGutterConfig = {
    openText: 'v',
    closedText: '>'
  };
  advancedTooltipConfig = {
    position: 'absolute' as const
  };
  advancedHoverTooltipOptions = {
    hoverTime: 150
  };
  advancedCustomGutters: readonly CodemirrorGutterConfig[] = [
    {
      class: 'cm-demo-gutter',
      renderEmptyElements: true
    }
  ];
  advancedEditorAttributes = { 'data-example': 'advanced-editor' };
  advancedContentAttributes = { 'aria-label': 'Advanced CodeMirror API example' };
  advancedBaseTheme: CodemirrorBaseTheme = {
    '.cm-breakpoint-gutter .cm-gutterElement': {
      cursor: 'pointer',
      paddingLeft: '6px',
      paddingRight: '6px'
    },
    '.cm-breakpoint-marker': {
      display: 'inline-block',
      width: '9px',
      height: '9px',
      borderRadius: '50%',
      backgroundColor: '#cf222e'
    },
    '.cm-demo-warning': {
      backgroundColor: 'rgba(251, 188, 5, 0.28)',
      borderBottom: '1px solid #9a6700'
    },
    '.cm-demo-info': {
      backgroundColor: 'rgba(84, 174, 255, 0.24)',
      borderBottom: '1px solid #0969da'
    },
    '.cm-demo-gutter .cm-gutterElement': {
      minWidth: '10px'
    }
  };
  advancedCompletions: CompletionSource = (context) => {
    const word = context.matchBefore(/\w*/);

    if (!word || (word.from === word.to && !context.explicit)) {
      return null;
    }

    return {
      from: word.from,
      options: [
        { label: 'calculateTotal', type: 'function', detail: '(items: number[]) => number' },
        { label: 'items', type: 'variable', detail: 'number[]' },
        { label: 'reduce', type: 'method', detail: 'Array reducer' }
      ]
    };
  };
  advancedPanel: PanelConstructor = (): Panel => {
    const dom = document.createElement('div');
    dom.className = 'advanced-cm-panel';
    dom.textContent = 'Panel API: top panel supplied by Angular input';
    return { dom, top: true };
  };
  advancedTooltip: Tooltip = {
    pos: 45,
    above: true,
    create: () => {
      const dom = document.createElement('div');
      dom.className = 'advanced-cm-tooltip';
      dom.textContent = 'Static tooltip API';
      return { dom };
    }
  };
  advancedHoverTooltip: CodemirrorHoverTooltipSource = (view, pos) => {
    const line = view.state.doc.lineAt(pos);
    const text = line.text;
    const todoIndex = text.indexOf('TODO');

    if (todoIndex < 0) {
      return null;
    }

    const from = line.from + todoIndex;
    const to = from + 'TODO'.length;

    if (pos < from || pos > to) {
      return null;
    }

    return {
      pos: from,
      end: to,
      above: true,
      create: () => {
        const dom = document.createElement('div');
        dom.className = 'advanced-cm-tooltip';
        dom.textContent = 'Hover tooltip API';
        return { dom };
      }
    };
  };
  advancedApiLog: string[] = [];

  examples: CodeExample[] = [
    {
      title: 'Angular template',
      installCommand: 'npm install @codemirror/lang-angular @codemirror/lang-html',
      language: angular({ base: htmlLang() }),
      content: `
@if (user; as currentUser) {
  <section>
    <h2>Hello {{ currentUser.name }}</h2>
    <button type="button" (click)="save(currentUser)">Save</button>
  </section>
}
      `
    },
    {
      title: 'C++',
      installCommand: 'npm install @codemirror/lang-cpp',
      language: cpp(),
      content: `
#include <iostream>

int main() {
  std::cout << "Hello from C++" << std::endl;
  return 0;
}
      `
    },
    {
      title: 'Go',
      installCommand: 'npm install @codemirror/lang-go',
      language: go(),
      content: `
package main

import "fmt"

func main() {
  fmt.Println("Hello from Go")
}
      `
    },
    {
      title: 'HTML',
      installCommand: 'npm install @codemirror/lang-html',
      language: htmlLang(),
      content: `
<!DOCTYPE html>
<html>
  <body style="background-color:powderblue;">
    <h1>This is a heading</h1>
  </body>
</html>
      `
    },
    {
      title: 'Java',
      installCommand: 'npm install @codemirror/lang-java',
      language: java(),
      content: `
public class Example {
  public static void main(String[] args) {
    System.out.println("Hello from Java");
  }
}
      `
    },
    {
      title: 'JavaScript',
      installCommand: 'npm install @codemirror/lang-javascript',
      language: javascript({ typescript: false, jsx: false }),
      content: `
let x = 6;
document.getElementById("demo").innerHTML = x;
      `
    },
    {
      title: 'TypeScript',
      installCommand: 'npm install @codemirror/lang-javascript',
      language: javascript({ typescript: true, jsx: false }),
      content: `
interface Point {
  x: number;
  y: number;
}
const point = { x: 12, y: 26 };
console.log(point);
      `
    },
    {
      title: 'JSX',
      installCommand: 'npm install @codemirror/lang-javascript',
      language: javascript({ typescript: false, jsx: true }),
      content: `
const x = 5;
const myElement = <h1>{(x) < 10 ? "Hello" : "Goodbye"}</h1>;
      `
    },
    {
      title: 'JSON',
      installCommand: 'npm install @codemirror/lang-json',
      language: json(),
      content: `
{
  "name": "ngx-codemirror6",
  "language": "json",
  "enabled": true
}
      `
    },
    {
      title: 'Markdown',
      installCommand: 'npm install @codemirror/lang-markdown',
      language: markdown(),
      content: `
# ngx-codemirror6

- Angular wrapper
- CodeMirror 6 editor

~~~ts
const enabled = true;
~~~
      `
    },
    {
      title: 'PHP',
      installCommand: 'npm install @codemirror/lang-php',
      language: php(),
      content: `
<?php

$message = 'Hello from PHP';
echo $message;
      `
    },
    {
      title: 'Python',
      installCommand: 'npm install @codemirror/lang-python',
      language: python(),
      content: `
def greet(name: str) -> str:
    return f"Hello, {name}"

print(greet("Python"))
      `
    },
    {
      title: 'Rust',
      installCommand: 'npm install @codemirror/lang-rust',
      language: rust(),
      content: `
fn main() {
    println!("Hello from Rust");
}
      `
    },
    {
      title: 'CSS',
      installCommand: 'npm install @codemirror/lang-css',
      language: css(),
      content: `
p {
  border-style: solid;
}
      `
    },
    {
      title: 'SCSS',
      installCommand: 'npm install @codemirror/lang-sass',
      language: sass(),
      content: `
nav {
  ul {
    list-style: none;
  }
  a {
    padding: 6px 12px;
  }
}
      `
    },
    {
      title: 'SASS',
      installCommand: 'npm install @codemirror/lang-sass',
      language: sass({ indented: true }),
      content: `
nav
  ul
    list-style: none

  a
    padding: 6px 12px
      `
    },
    {
      title: 'SQL',
      installCommand: 'npm install @codemirror/lang-sql',
      language: sql(),
      content: `
SELECT id, email, created_at
FROM users
WHERE active = true
ORDER BY created_at DESC;
      `
    },
    {
      title: 'XML',
      installCommand: 'npm install @codemirror/lang-xml',
      language: xml(),
      content: `
<?xml version="1.0" encoding="UTF-8"?>
<project name="ngx-codemirror6">
  <language>xml</language>
</project>
      `
    },
    {
      title: 'YAML',
      installCommand: 'npm install @codemirror/lang-yaml',
      language: yaml(),
      content: `
name: ngx-codemirror6
languages:
  - yaml
  - angular
enabled: true
      `
    }
  ];

  trackExample(index: number, example: CodeExample): string {
    return `${index}-${example.title}`;
  }

  get themeExtensions(): Extension[] {
    return this.darkTheme ? this.darkExtensions : this.lightExtensions;
  }

  get selectedThemeExample(): ThemeExample {
    return this.themeExamples.find((theme) => theme.id === this.selectedThemeExampleId) ?? this.themeExamples[0];
  }

  get selectedThemeExampleExtensions(): Extension[] {
    return this.selectedThemeExample.extensions;
  }

  onThemeExampleChange(event: Event): void {
    this.selectedThemeExampleId = (event.target as HTMLSelectElement).value;
  }

  onEditorReady(view: EditorView): void {
    this.eventContentLength = view.state.doc.length;
    this.addEventLog(`editorReady: ${view.state.doc.lines} lines`);
  }

  onContentChange(content: string): void {
    this.eventContentLength = content.length;
    this.addEventLog(`contentChange: ${content.length} characters`);
  }

  onEditorUpdate(update: ViewUpdate): void {
    this.eventUpdateCount += 1;
    if (update.docChanged) {
      this.addEventLog(`update: document changed (${update.changes.empty ? 'empty' : 'non-empty'} changes)`);
    }
  }

  onSelectionChange(selection: EditorSelection): void {
    const mainRange = selection.main;
    this.eventSelectionSummary = `from ${mainRange.from} to ${mainRange.to}`;
    this.addEventLog(`selectionChange: ${this.eventSelectionSummary}`);
  }

  setMethodExample(editor: CodemirrorComponent): void {
    editor.setValue(`interface PublicMethodExample {
  method: 'setValue';
  timestamp: string;
}

const example: PublicMethodExample = {
  method: 'setValue',
  timestamp: '${new Date().toISOString()}'
};

console.log(example);
`);
    this.addEventLog('setValue: replaced the full document');
  }

  readMethodExample(editor: CodemirrorComponent): void {
    this.eventCurrentValuePreview = editor.getValue().slice(0, 120);
    this.addEventLog(`getValue: read ${editor.getValue().length} characters`);
  }

  insertMethodExample(editor: CodemirrorComponent): void {
    editor.replaceSelection('/* replaceSelection inserted this text */');
    this.addEventLog('replaceSelection: inserted text at the selection');
  }

  dispatchMethodExample(editor: CodemirrorComponent): void {
    const value = editor.getValue();
    editor.dispatch({
      changes: {
        from: value.length,
        insert: `

console.log('dispatch appended this line');`
      }
    });
    this.addEventLog('dispatch: appended a console.log statement');
  }

  async undoMethodExample(editor: CodemirrorComponent): Promise<void> {
    this.addEventLog((await editor.undo()) ? 'undo: reverted one history event' : 'undo: no history event available');
  }

  async redoMethodExample(editor: CodemirrorComponent): Promise<void> {
    this.addEventLog((await editor.redo()) ? 'redo: restored one history event' : 'redo: no history event available');
  }

  async clearHistoryMethodExample(editor: CodemirrorComponent): Promise<void> {
    await editor.clearHistory();
    this.addEventLog('clearHistory: reset undo and redo history');
  }

  saveStateMethodExample(editor: CodemirrorComponent): void {
    this.savedEventEditorState = editor.toJSON();
    this.savedEventEditorStatePreview = JSON.stringify(this.savedEventEditorState).slice(0, 160);
    this.addEventLog('toJSON: saved editor state');
  }

  async restoreStateMethodExample(editor: CodemirrorComponent): Promise<void> {
    if (!this.savedEventEditorState) {
      this.addEventLog('restoreFromJSON: no saved state available');
      return;
    }

    await editor.restoreFromJSON(this.savedEventEditorState);
    this.addEventLog('restoreFromJSON: restored editor state');
  }

  onAdvancedBreakpointsChange(breakpoints: number[]): void {
    this.advancedBreakpoints = breakpoints;
    this.addAdvancedApiLog(`breakpointsChange: ${breakpoints.join(', ') || 'none'}`);
  }

  async runAdvancedSearch(editor: CodemirrorComponent): Promise<void> {
    await editor.openSearchPanel();
    this.addAdvancedApiLog(`search: panel open = ${editor.isSearchPanelOpen()}`);
  }

  runAdvancedFolding(editor: CodemirrorComponent): void {
    const folded = editor.foldAll();
    this.addAdvancedApiLog(`foldAll: ${folded ? editor.getFoldedRanges().length + ' ranges' : 'no ranges'}`);
  }

  async runAdvancedCompletion(editor: CodemirrorComponent): Promise<void> {
    await editor.startCompletion();
    this.addAdvancedApiLog(`completion: ${editor.completionStatus() ?? 'closed'}`);
  }

  async runAdvancedCommands(editor: CodemirrorComponent): Promise<void> {
    await editor.selectLine();
    await editor.toggleLineComment();
    await editor.indentMore();
    this.addAdvancedApiLog('commands: selectLine, toggleLineComment, indentMore');
  }

  trackEventLog(index: number, item: string): string {
    return `${index}-${item}`;
  }

  private addEventLog(message: string): void {
    this.eventLog = [message, ...this.eventLog].slice(0, 8);
  }

  private addAdvancedApiLog(message: string): void {
    this.advancedApiLog = [message, ...this.advancedApiLog].slice(0, 6);
  }
}
