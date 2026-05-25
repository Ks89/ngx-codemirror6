import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { CompletionSource } from '@codemirror/autocomplete';
import { history } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { foldEffect } from '@codemirror/language';
import type { Diagnostic, LintSource } from '@codemirror/lint';
import { EditorSelection, EditorState, Extension } from '@codemirror/state';
import { Decoration, EditorView, KeyBinding, Panel, PanelConstructor, Tooltip } from '@codemirror/view';

import {
  CodemirrorComponent,
  type CodemirrorAttributeSource,
  type CodemirrorAutocompletionConfig,
  type CodemirrorBaseTheme,
  type CodemirrorCodeFoldingConfig,
  type CodemirrorDecorationSource,
  type CodemirrorFoldGutterConfig,
  type CodemirrorGutterConfig,
  type CodemirrorHoverTooltipOptions,
  type CodemirrorHoverTooltipSource,
  type CodemirrorLintConfig,
  type CodemirrorMarkedRange,
  type CodemirrorSearchConfig,
  type CodemirrorTooltipConfig
} from './ngx-codemirror6.component';

@Component({
  template: `<ks-codemirror [content]="content" [language]="language" [readOnly]="readOnly"></ks-codemirror>`,
  standalone: false
})
class HostComponent {
  content = 'const value = 1;';
  language: Extension = javascript();
  readOnly = true;
}

@Component({
  template: `<ks-codemirror [formControl]="control" [readOnly]="false"></ks-codemirror>`,
  standalone: false
})
class FormHostComponent {
  control = new FormControl('initial value', { nonNullable: true });
}

@Component({
  template: `
    <ks-codemirror
      [content]="content"
      [appendExtensions]="appendExtensions"
      [language]="language"
      [readOnly]="readOnly"
      [editable]="editable"
      [theme]="theme"
      [lineWrapping]="lineWrapping"
      [placeholder]="placeholder"
      [lineNumbers]="lineNumbers"
      [lineNumberFormatter]="lineNumberFormatter"
      [highlightActiveLine]="highlightActiveLine"
      [highlightActiveLineGutter]="highlightActiveLineGutter"
      [highlightSelectionMatches]="highlightSelectionMatches"
      [bracketMatching]="bracketMatching"
      [closeBrackets]="closeBrackets"
      [highlightSpecialChars]="highlightSpecialChars"
      [highlightWhitespace]="highlightWhitespace"
      [highlightTrailingWhitespace]="highlightTrailingWhitespace"
      [scrollPastEnd]="scrollPastEnd"
      [tabSize]="tabSize"
      [indentUnit]="indentUnit"
      [indentOnInput]="indentOnInput"
      [indentWithTab]="indentWithTab"
      [keymaps]="keymaps"
      [multipleSelections]="multipleSelections"
      [drawSelection]="drawSelection"
      [autocompletion]="autocompletion"
      [completions]="completions"
      [autocompletionConfig]="autocompletionConfig"
      [lint]="lint"
      [linter]="linter"
      [lintConfig]="lintConfig"
      [lintGutter]="lintGutter"
      [lintKeymap]="lintKeymap"
      [cspNonce]="cspNonce"
      [search]="search"
      [searchConfig]="searchConfig"
      [searchKeymap]="searchKeymap"
      [codeFolding]="codeFolding"
      [codeFoldingConfig]="codeFoldingConfig"
      [foldGutter]="foldGutter"
      [foldGutterConfig]="foldGutterConfig"
      [foldKeymap]="foldKeymap"
      [customGutters]="customGutters"
      [guttersFixed]="guttersFixed"
      [breakpointGutter]="breakpointGutter"
      [breakpoints]="breakpoints"
      [decorations]="decorations"
      [markedRanges]="markedRanges"
      [panels]="panels"
      [tooltips]="tooltips"
      [tooltipConfig]="tooltipConfig"
      [hoverTooltip]="hoverTooltip"
      [hoverTooltipOptions]="hoverTooltipOptions"
      [editorAttributes]="editorAttributes"
      [contentAttributes]="contentAttributes"
      [baseTheme]="baseTheme">
    </ks-codemirror>
  `,
  standalone: false
})
class ReconfigureHostComponent {
  @ViewChild(CodemirrorComponent) codemirror!: CodemirrorComponent;

  content: string = 'const value = 1;\nconst trailing = 2;   ';
  appendExtensions: Extension[] = [];
  language: Extension = [];
  readOnly: boolean = true;
  editable: boolean | null = null;
  theme: Extension | Extension[] = [];
  lineWrapping: boolean = false;
  placeholder: string = '';
  lineNumbers: boolean = false;
  lineNumberFormatter: CodemirrorComponent['lineNumberFormatter'] = null;
  highlightActiveLine: boolean = false;
  highlightActiveLineGutter: boolean = false;
  highlightSelectionMatches: boolean = false;
  bracketMatching: boolean = false;
  closeBrackets: boolean = false;
  highlightSpecialChars: boolean = false;
  highlightWhitespace: boolean = false;
  highlightTrailingWhitespace: boolean = false;
  scrollPastEnd: boolean = false;
  tabSize: number = 4;
  indentUnit: string = '  ';
  indentOnInput: boolean = false;
  indentWithTab: boolean = false;
  keymaps: readonly KeyBinding[] | readonly (readonly KeyBinding[])[] = [];
  multipleSelections: boolean = false;
  drawSelection: boolean = false;
  autocompletion: boolean = false;
  completions: CompletionSource | CompletionSource[] | null = null;
  autocompletionConfig: CodemirrorAutocompletionConfig | null = null;
  lint: boolean = false;
  linter: LintSource | null = () => [] as Diagnostic[];
  lintConfig: CodemirrorLintConfig | null = null;
  lintGutter: boolean = false;
  lintKeymap: boolean = false;
  cspNonce: string | null = null;
  search: boolean = false;
  searchConfig: CodemirrorSearchConfig | null = null;
  searchKeymap: boolean = false;
  codeFolding: boolean = false;
  codeFoldingConfig: CodemirrorCodeFoldingConfig | null = null;
  foldGutter: boolean = false;
  foldGutterConfig: CodemirrorFoldGutterConfig | null = null;
  foldKeymap: boolean = false;
  customGutters: readonly CodemirrorGutterConfig[] = [];
  guttersFixed: boolean | null = null;
  breakpointGutter: boolean = false;
  breakpoints: readonly number[] = [];
  decorations: CodemirrorDecorationSource | readonly CodemirrorDecorationSource[] | null = null;
  markedRanges: readonly CodemirrorMarkedRange[] = [];
  panels: PanelConstructor | readonly PanelConstructor[] | null = null;
  tooltips: Tooltip | readonly (Tooltip | null)[] | null = null;
  tooltipConfig: CodemirrorTooltipConfig | null = null;
  hoverTooltip: CodemirrorHoverTooltipSource | null = null;
  hoverTooltipOptions: CodemirrorHoverTooltipOptions | null = null;
  editorAttributes: CodemirrorAttributeSource | null = null;
  contentAttributes: CodemirrorAttributeSource | null = null;
  baseTheme: CodemirrorBaseTheme | null = null;
}

describe('CodemirrorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodemirrorComponent, HostComponent, FormHostComponent, ReconfigureHostComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  it('renders without a language extension when no language input is provided', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'const value = 1;';

    await detectChanges(fixture);
    expect(getEditorText(fixture)).toContain('const value = 1;');
  });

  it('updates the editor document when the content input changes', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await detectChanges(fixture);

    fixture.componentInstance.content = 'const value = 2;';
    await detectChanges(fixture);

    expect(getEditorText(fixture)).toContain('const value = 2;');
    expect(getEditorText(fixture)).not.toContain('const value = 1;');
  });

  it('exposes readOnly as an input', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await detectChanges(fixture);

    expect(getEditorContentElement(fixture).getAttribute('contenteditable')).toBe('false');

    fixture.componentInstance.readOnly = false;
    await detectChanges(fixture);

    expect(getEditorContentElement(fixture).getAttribute('contenteditable')).toBe('true');
  });

  it('keeps optional visual features disabled until their inputs are enabled', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'const value = 1;';
    fixture.componentInstance.lineNumbers = false;
    fixture.componentInstance.foldGutter = false;
    await detectChanges(fixture);

    expect(fixture.nativeElement.querySelector('.cm-lineNumbers')).toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-foldGutter')).toBeNull();
  });

  it('applies feature configuration when the related feature inputs are enabled', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = `function demo() {
  return true;
}
`;
    fixture.componentInstance.language = javascript();
    fixture.componentInstance.lineNumbers = true;
    fixture.componentInstance.foldGutter = true;
    fixture.componentInstance.lineNumberFormatter = (lineNo) => `L${lineNo}`;
    fixture.componentInstance.foldGutterConfig = { openText: 'OPEN', closedText: 'CLOSED' };
    await detectChanges(fixture);

    expect(fixture.nativeElement.textContent).toContain('L1');
    expect(fixture.nativeElement.textContent).toContain('OPEN');
  });

  it('applies default syntax highlighting without an explicit theme', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'const value = 1;';
    fixture.componentInstance.language = javascript();
    fixture.componentInstance.theme = [];
    await detectChanges(fixture);

    expect(fixture.nativeElement.querySelector('.cm-line span[class]')).not.toBeNull();
  });

  it('destroys the CodeMirror view with the component', async () => {
    const destroySpy = spyOn(EditorView.prototype, 'destroy').and.callThrough();
    const fixture = TestBed.createComponent(HostComponent);
    await detectChanges(fixture);

    fixture.destroy();

    expect(destroySpy).toHaveBeenCalled();
  });

  it('implements ControlValueAccessor for reactive forms', async () => {
    const fixture = TestBed.createComponent(FormHostComponent);
    await detectChanges(fixture);

    expect(getEditorText(fixture)).toContain('initial value');

    fixture.componentInstance.control.setValue('model update');
    await detectChanges(fixture);

    expect(getEditorText(fixture)).toContain('model update');

    const codemirror = getCodemirrorComponent(fixture);
    const editorView = getEditorView(codemirror);
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: 'editor update'
      }
    });
    await detectChanges(fixture);

    expect(fixture.componentInstance.control.value).toBe('editor update');

    expect(fixture.componentInstance.control.touched).toBeFalse();
    getEditorContentElement(fixture).dispatchEvent(new FocusEvent('blur'));
    await detectChanges(fixture);

    expect(fixture.componentInstance.control.touched).toBeTrue();

    fixture.componentInstance.control.disable();
    await detectChanges(fixture);

    expect(getEditorContentElement(fixture).getAttribute('contenteditable')).toBe('false');

    fixture.componentInstance.control.enable();
    await detectChanges(fixture);

    expect(getEditorContentElement(fixture).getAttribute('contenteditable')).toBe('true');
  });

  it('exposes search inputs and command methods', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'alpha beta alpha';
    fixture.componentInstance.search = true;
    fixture.componentInstance.searchConfig = { top: true, caseSensitive: true };
    fixture.componentInstance.searchKeymap = true;
    await detectChanges(fixture);

    const codemirror = fixture.componentInstance;

    expect(codemirror.isSearchPanelOpen()).toBeFalse();
    expect(await codemirror.openSearchPanel()).toBeTrue();
    expect(codemirror.isSearchPanelOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.cm-search')).not.toBeNull();
    expect(await codemirror.closeSearchPanel()).toBeTrue();
  });

  it('registers the close-brackets keymap alongside the extension', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = '()';
    fixture.componentInstance.readOnly = false;
    fixture.componentInstance.closeBrackets = true;
    await detectChanges(fixture);

    const editorView = getEditorView(fixture.componentInstance);
    editorView.focus();
    editorView.dispatch({ selection: EditorSelection.cursor(1) });
    getEditorContentElement(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true, cancelable: true }));
    await detectChanges(fixture);

    expect(fixture.componentInstance.getValue()).toBe('');
  });

  it('exposes folding inputs, methods, and folded range state', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = `function demo() {
  return true;
}
`;
    fixture.componentInstance.language = javascript();
    fixture.componentInstance.codeFolding = true;
    fixture.componentInstance.foldGutter = true;
    fixture.componentInstance.codeFoldingConfig = { placeholderText: 'folded' };
    fixture.componentInstance.foldGutterConfig = { openText: 'open', closedText: 'closed' };
    await detectChanges(fixture);

    const editorView = getEditorView(fixture.componentInstance);
    editorView.dispatch({
      effects: foldEffect.of({ from: 16, to: 32 })
    });

    expect(fixture.nativeElement.querySelector('.cm-foldGutter')).not.toBeNull();
    expect(fixture.componentInstance.getFoldedRanges()).toEqual([{ from: 16, to: 32 }]);
    expect(fixture.componentInstance.unfoldAll()).toBeTrue();
  });

  it('exposes autocompletion configuration and status helpers', async () => {
    const completionSource: CompletionSource = (context) => ({
      from: context.pos,
      options: [{ label: 'alpha', type: 'keyword' }]
    });
    const languageCompletionSource: CompletionSource = (context) => ({
      from: context.pos,
      options: [{ label: 'languageOption', type: 'keyword' }]
    });
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'a';
    fixture.componentInstance.readOnly = false;
    fixture.componentInstance.appendExtensions = [EditorState.languageData.of(() => [{ autocomplete: languageCompletionSource }])];
    fixture.componentInstance.autocompletion = true;
    fixture.componentInstance.completions = completionSource;
    fixture.componentInstance.autocompletionConfig = {
      activateOnTyping: false,
      icons: false,
      maxRenderedOptions: 20
    };
    await detectChanges(fixture);

    expect(fixture.componentInstance.completionStatus()).toBeNull();
    expect(fixture.componentInstance.currentCompletions()).toEqual([]);
    expect(fixture.componentInstance.selectedCompletion()).toBeNull();
    expect(fixture.componentInstance.selectedCompletionIndex()).toBeNull();
    const completionSources = getEditorView(fixture.componentInstance).state.languageDataAt<CompletionSource>('autocomplete', 0);
    expect(completionSources).toContain(languageCompletionSource);
    expect(completionSources).toContain(completionSource);
    expect(await fixture.componentInstance.startCompletion()).toBeTrue();
  });

  it('exposes custom gutters and breakpoint APIs', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'one\ntwo\nthree';
    fixture.componentInstance.breakpointGutter = true;
    fixture.componentInstance.breakpoints = [2];
    fixture.componentInstance.customGutters = [{ class: 'test-gutter', renderEmptyElements: true }];
    fixture.componentInstance.guttersFixed = false;
    await detectChanges(fixture);

    const breakpoints: number[][] = [];
    fixture.componentInstance.breakpointsChange.subscribe((value) => breakpoints.push(value));

    expect(fixture.nativeElement.querySelector('.cm-breakpoint-gutter')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-breakpoint-marker')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.test-gutter')).not.toBeNull();

    fixture.componentInstance.toggleBreakpoint(3);
    await fixture.whenStable();

    expect(fixture.componentInstance.hasBreakpoint(3)).toBeTrue();
    expect(breakpoints[0]).toEqual([2, 3]);

    getEditorView(fixture.componentInstance).dispatch({ changes: { from: 0, insert: 'zero\n' } });
    await fixture.whenStable();

    expect(fixture.componentInstance.hasBreakpoint(3)).toBeTrue();
    expect(fixture.componentInstance.hasBreakpoint(2)).toBeFalse();
    expect(fixture.componentInstance.hasBreakpoint(4)).toBeTrue();
    expect(fixture.componentInstance.breakpoints).toEqual([3, 4]);
    expect(breakpoints[1]).toEqual([3, 4]);

    fixture.componentInstance.toggleBreakpoint(0);
    fixture.componentInstance.toggleBreakpoint(1.5);

    expect(fixture.componentInstance.hasBreakpoint(0)).toBeFalse();
    expect(fixture.componentInstance.hasBreakpoint(1.5)).toBeFalse();
    expect(breakpoints.length).toBe(2);
  });

  it('exposes decoration and styling inputs', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'decorated text';
    fixture.componentInstance.markedRanges = [
      { from: 0, to: 9, class: 'marked-range' },
      { from: -10, to: 500, class: 'bounded-range' },
      { from: 100, to: 100, class: 'empty-range' }
    ];
    fixture.componentInstance.decorations = Decoration.set([Decoration.mark({ class: 'direct-decoration' }).range(10, 14)]);
    fixture.componentInstance.editorAttributes = { 'data-editor': 'outer' };
    fixture.componentInstance.contentAttributes = { 'data-content': 'inner' };
    fixture.componentInstance.baseTheme = {
      '.marked-range': { textDecoration: 'underline' }
    };
    await detectChanges(fixture);

    expect(fixture.nativeElement.querySelector('.marked-range')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.bounded-range')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.empty-range')).toBeNull();
    expect(fixture.nativeElement.querySelector('.direct-decoration')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-editor').getAttribute('data-editor')).toBe('outer');
    expect(getEditorContentElement(fixture).getAttribute('data-content')).toBe('inner');

    getEditorView(fixture.componentInstance).dispatch({ changes: { from: 0, insert: 'new ' } });
    await fixture.whenStable();

    const markedText = [...fixture.nativeElement.querySelectorAll('.marked-range')]
      .map((element) => element.textContent ?? '')
      .join('');
    expect(markedText).toBe('decorated');
  });

  it('exposes panels and tooltip inputs and methods', async () => {
    const panelConstructor: PanelConstructor = (): Panel => {
      const dom = document.createElement('div');
      dom.className = 'test-panel';
      return { dom, top: true };
    };
    const tooltip: Tooltip = {
      pos: 1,
      create: () => {
        const dom = document.createElement('div');
        dom.className = 'test-tooltip';
        return { dom };
      }
    };
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'tooltip';
    fixture.componentInstance.panels = panelConstructor;
    fixture.componentInstance.tooltips = tooltip;
    fixture.componentInstance.tooltipConfig = { position: 'absolute' };
    fixture.componentInstance.hoverTooltip = () => tooltip;
    fixture.componentInstance.hoverTooltipOptions = { hoverTime: 1 };
    await detectChanges(fixture);

    expect(fixture.nativeElement.querySelector('.test-panel')).not.toBeNull();
    expect(fixture.componentInstance.getPanel(panelConstructor)).not.toBeNull();
    expect(() => fixture.componentInstance.repositionTooltips()).not.toThrow();
    fixture.componentInstance.activateHover(1);
    fixture.componentInstance.closeHoverTooltips();
  });

  it('exposes command convenience methods', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'const value = 1;\nconst next = 2;';
    fixture.componentInstance.language = javascript();
    fixture.componentInstance.readOnly = false;
    await detectChanges(fixture);

    const codemirror = fixture.componentInstance;
    const editorView = getEditorView(codemirror);
    editorView.dispatch({ selection: EditorSelection.cursor(0) });

    expect(await codemirror.selectLine()).toBeTrue();
    expect(await codemirror.toggleLineComment()).toBeTrue();
    expect(await codemirror.lineUncomment()).toBeTrue();
    expect(await codemirror.indentMore()).toBeTrue();
    expect(await codemirror.indentLess()).toBeTrue();
    expect(await codemirror.indentSelection()).toBeTrue();
    expect(await codemirror.moveLineDown()).toBeTrue();
    expect(await codemirror.moveLineUp()).toBeTrue();
    expect(await codemirror.cursorMatchingBracket()).toBeFalse();
    expect(await codemirror.toggleTabFocusMode()).toBeTrue();
    expect(await codemirror.deleteLine()).toBeTrue();
    expect(codemirror.getValue()).toContain('const');
  });

  it('keeps public methods safe before the editor is initialized', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    const codemirror = fixture.componentInstance;
    codemirror.content = 'pending content';

    expect(codemirror.getValue()).toBe('pending content');
    expect(codemirror.toJSON()).toEqual({
      doc: 'pending content',
      selection: EditorSelection.single(0).toJSON()
    });
    expect(await codemirror.openSearchPanel()).toBeFalse();
    expect(await codemirror.closeSearchPanel()).toBeFalse();
    expect(await codemirror.findNext()).toBeFalse();
    expect(await codemirror.findPrevious()).toBeFalse();
    expect(await codemirror.replaceNext()).toBeFalse();
    expect(await codemirror.replaceAll()).toBeFalse();
    expect(await codemirror.gotoLine()).toBeFalse();
    expect(await codemirror.selectNextOccurrence()).toBeFalse();
    expect(await codemirror.selectSelectionMatches()).toBeFalse();
    expect(await codemirror.selectMatches()).toBeFalse();
    expect(codemirror.foldCode()).toBeFalse();
    expect(codemirror.unfoldCode()).toBeFalse();
    expect(codemirror.toggleFold()).toBeFalse();
    expect(codemirror.foldAll()).toBeFalse();
    expect(codemirror.unfoldAll()).toBeFalse();
    expect(codemirror.getFoldedRanges()).toEqual([]);
    expect(await codemirror.closeCompletion()).toBeFalse();
    expect(await codemirror.acceptCompletion()).toBeFalse();
    expect(await codemirror.toggleComment()).toBeFalse();
    expect(await codemirror.lineComment()).toBeFalse();
    expect(await codemirror.toggleBlockComment()).toBeFalse();
    expect(codemirror.hasHoverTooltips()).toBeFalse();
    expect(codemirror.getPanel(() => ({ dom: document.createElement('div') }))).toBeNull();

    expect(() => {
      codemirror.dispatch({ changes: { from: 0, insert: 'ignored' } });
      codemirror.replaceSelection('ignored');
      codemirror.scrollToPosition(10);
      codemirror.scrollToLine(2);
      codemirror.scrollSelectionIntoView();
      codemirror.clearHistory();
      codemirror.activateHover(0);
      codemirror.closeHoverTooltips();
      codemirror.repositionTooltips();
    }).not.toThrow();
  });

  it('reconfigures CodeMirror extensions when bound inputs change', async () => {
    const fixture = TestBed.createComponent(ReconfigureHostComponent);
    await detectChanges(fixture);

    const host = fixture.componentInstance;
    const completionSource: CompletionSource = (context) => ({
      from: context.pos,
      options: [{ label: 'value', type: 'variable' }]
    });
    const panelConstructor: PanelConstructor = () => {
      const dom = document.createElement('div');
      dom.className = 'reconfigured-panel';
      return { dom };
    };
    const tooltip: Tooltip = {
      pos: 1,
      create: () => {
        const dom = document.createElement('div');
        dom.className = 'reconfigured-tooltip';
        return { dom };
      }
    };

    host.content = 'const changed = 2;\nconst other = 3;   ';
    host.appendExtensions = [EditorView.editorAttributes.of({ 'data-appended': 'true' })];
    host.language = javascript();
    host.readOnly = false;
    host.editable = true;
    host.theme = [];
    host.lineWrapping = true;
    host.placeholder = 'Type code';
    host.lineNumbers = true;
    host.lineNumberFormatter = (lineNo) => `L${lineNo}`;
    host.highlightActiveLine = true;
    host.highlightActiveLineGutter = true;
    host.highlightSelectionMatches = true;
    host.bracketMatching = true;
    host.closeBrackets = true;
    host.highlightSpecialChars = true;
    host.highlightWhitespace = true;
    host.highlightTrailingWhitespace = true;
    host.scrollPastEnd = true;
    host.tabSize = 2;
    host.indentUnit = '    ';
    host.indentOnInput = true;
    host.indentWithTab = true;
    host.keymaps = [[{ key: 'Mod-k', run: () => true }]];
    host.multipleSelections = true;
    host.drawSelection = true;
    host.autocompletion = true;
    host.completions = completionSource;
    host.autocompletionConfig = { activateOnTyping: false };
    host.lint = true;
    host.linter = () => [{ from: 0, to: 5, severity: 'warning', message: 'demo diagnostic' }];
    host.lintConfig = { delay: 10 };
    host.lintGutter = true;
    host.lintKeymap = true;
    host.cspNonce = 'nonce-value';
    host.search = true;
    host.searchConfig = { top: true };
    host.searchKeymap = true;
    host.codeFolding = true;
    host.codeFoldingConfig = { placeholderText: 'fold' };
    host.foldGutter = true;
    host.foldGutterConfig = { openText: 'open', closedText: 'closed' };
    host.foldKeymap = true;
    host.customGutters = [{ class: 'reconfigured-gutter', renderEmptyElements: true }];
    host.guttersFixed = false;
    host.breakpointGutter = true;
    host.breakpoints = [1];
    host.decorations = (view) => Decoration.set([Decoration.mark({ class: 'function-decoration' }).range(0, Math.min(5, view.state.doc.length))]);
    host.markedRanges = [{ from: -5, to: 8, class: 'reconfigured-mark' }];
    host.panels = [panelConstructor];
    host.tooltips = [tooltip, null];
    host.tooltipConfig = { position: 'absolute' };
    host.hoverTooltip = () => tooltip;
    host.hoverTooltipOptions = { hoverTime: 1 };
    host.editorAttributes = { 'data-reconfigured': 'editor' };
    host.contentAttributes = { 'data-reconfigured-content': 'content' };
    host.baseTheme = {
      '.reconfigured-mark': { fontWeight: 'bold' }
    };
    await detectChanges(fixture);

    expect(host.codemirror.getValue()).toBe(host.content);
    expect(fixture.nativeElement.querySelector('.cm-editor').getAttribute('data-reconfigured')).toBe('editor');
    expect(fixture.nativeElement.querySelector('.cm-editor').getAttribute('data-appended')).toBe('true');
    expect(getEditorContentElement(fixture).getAttribute('contenteditable')).toBe('true');
    expect(getEditorContentElement(fixture).getAttribute('data-reconfigured-content')).toBe('content');
    expect(fixture.nativeElement.querySelector('.cm-lineNumbers')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-activeLine')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-activeLineGutter')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-highlightSpace')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-trailingSpace')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-foldGutter')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cm-breakpoint-gutter')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.reconfigured-gutter')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.reconfigured-mark')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.function-decoration')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.reconfigured-panel')).not.toBeNull();
    expect(await host.codemirror.openSearchPanel()).toBeTrue();
    expect(await host.codemirror.startCompletion()).toBeTrue();
  });

  it('serializes and restores document, history, and fold state', async () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = `function demo() {
  return true;
}
`;
    fixture.componentInstance.language = javascript();
    fixture.componentInstance.appendExtensions = [history()];
    fixture.componentInstance.codeFolding = true;
    await detectChanges(fixture);

    const editorView = getEditorView(fixture.componentInstance);
    editorView.dispatch({
      changes: { from: 0, insert: '// heading\n' }
    });
    editorView.dispatch({
      effects: foldEffect.of({ from: 27, to: 43 })
    });
    await fixture.componentInstance.redo();

    const json = fixture.componentInstance.toJSON() as { doc: string; history?: unknown; fold?: unknown };

    expect(json.doc).toContain('// heading');
    expect(json.history).toBeDefined();
    expect(json.fold).toBeDefined();

    fixture.componentInstance.setValue('temporary');
    await fixture.componentInstance.restoreFromJSON(json);

    expect(fixture.componentInstance.getValue()).toContain('// heading');
    expect(fixture.componentInstance.getFoldedRanges()).toEqual([{ from: 27, to: 43 }]);
  });

  it('resets the editor with custom extensions while preserving wrapper outputs and reconfiguration', async () => {
    const fixture = TestBed.createComponent(ReconfigureHostComponent);
    const contentChanges: string[] = [];
    fixture.componentInstance.readOnly = false;
    await detectChanges(fixture);

    fixture.componentInstance.codemirror.contentChange.subscribe((content) => contentChanges.push(content));

    await fixture.componentInstance.codemirror.resetEditor({
      doc: 'let reset = true;',
      extensions: EditorView.editorAttributes.of({ 'data-reset-editor': 'true' })
    });

    expect(fixture.componentInstance.codemirror.getValue()).toBe('let reset = true;');
    expect((fixture.nativeElement.querySelector('.cm-editor') as HTMLElement).getAttribute('data-reset-editor')).toBe('true');

    getEditorView(fixture.componentInstance.codemirror).dispatch({
      changes: { from: 0, insert: '// ' }
    });

    expect(contentChanges).toEqual(['// let reset = true;']);

    fixture.componentInstance.readOnly = true;
    await detectChanges(fixture);

    expect(getEditorContentElement(fixture).getAttribute('contenteditable')).toBe('false');
  });
});

function getCodemirrorComponent<T>(fixture: ComponentFixture<T>): CodemirrorComponent {
  const debugElement = fixture.debugElement.children.find((child) => child.componentInstance instanceof CodemirrorComponent);
  if (!debugElement) {
    throw new Error('Expected CodemirrorComponent to be rendered');
  }
  return debugElement.componentInstance as CodemirrorComponent;
}

function getEditorView(component: CodemirrorComponent): EditorView {
  return (component as unknown as { editorView: EditorView }).editorView;
}

function getEditorText<T>(fixture: ComponentFixture<T>): string {
  return getEditorContentElement(fixture).textContent ?? '';
}

async function detectChanges<T>(fixture: ComponentFixture<T>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  for (let attempt = 0; attempt < 20 && !fixture.nativeElement.querySelector('.cm-content'); attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    await fixture.whenStable();
  }
}

function getEditorContentElement<T>(fixture: ComponentFixture<T>): HTMLElement {
  const element = fixture.nativeElement.querySelector('.cm-content') as HTMLElement | null;
  if (!element) {
    throw new Error('Expected CodeMirror content element to be rendered');
  }
  return element;
}
