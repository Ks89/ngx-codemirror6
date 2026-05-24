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

import {
  AfterViewInit,
  Component,
  ElementRef,
  ErrorHandler,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
  inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { Completion, CompletionSource } from '@codemirror/autocomplete';
import type { LintSource } from '@codemirror/lint';
import {
  foldAll as codemirrorFoldAll,
  foldCode as codemirrorFoldCode,
  foldState,
  foldedRanges as codemirrorFoldedRanges,
  toggleFold as codemirrorToggleFold,
  unfoldAll as codemirrorUnfoldAll,
  unfoldCode as codemirrorUnfoldCode
} from '@codemirror/language';
import {
  EditorView,
  Panel,
  PanelConstructor,
  Tooltip,
  ViewUpdate,
  activateHover as codemirrorActivateHover,
  closeHoverTooltips as codemirrorCloseHoverTooltips,
  getPanel as codemirrorGetPanel,
  hasHoverTooltips as codemirrorHasHoverTooltips,
  repositionTooltips as codemirrorRepositionTooltips,
  type DecorationSet
} from '@codemirror/view';
import { Compartment, EditorSelection, EditorState, EditorStateConfig, Extension, StateEffect, StateField, TransactionSpec } from '@codemirror/state';

import {
  DecorationExtensionConfig,
  DisplayExtensionConfig,
  FoldingExtensionConfig,
  GutterExtensionConfig,
  IndentationExtensionConfig,
  KeymapExtensionConfig,
  SearchExtensionConfig,
  SelectionExtensionConfig,
  StylingExtensionConfig,
  TooltipExtensionConfig,
  createAutocompletionExtensions,
  createCspNonceExtensions,
  createDecorationExtensions,
  createDisplayExtensions,
  createEditableExtensions,
  createFoldingExtensions,
  createGutterExtensions,
  createIndentationExtensions,
  createKeymapExtensions,
  createLintExtensions,
  createMarkedRangeDecorations,
  createPanelExtensions,
  createPendingEditorJSON,
  createReadOnlyExtensions,
  createSearchExtensions,
  createSelectionExtensions,
  createStylingExtensions,
  createThemeExtensions,
  createTooltipExtensions
} from './internal/extension-factories';
import { OptionalCodemirrorPackages, type AutocompleteModule } from './internal/optional-codemirror-packages';
import {
  AutocompletionInputConfig,
  CodemirrorAttributeSource,
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
  KeymapInput,
  LintInputConfig
} from './models/codemirror-config.types';

export type {
  CodemirrorAttributeSource,
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
} from './models/codemirror-config.types';

/**
 * Angular wrapper component for CodeMirror 6.
 * Provides declarative inputs for common CodeMirror extensions plus imperative methods for editor commands.
 */
@Component({
  selector: 'ks-codemirror',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodemirrorComponent),
      multi: true
    }
  ],
  template: `<div #host></div>`,
  standalone: false
})
export class CodemirrorComponent implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy {
  /** Initial and externally controlled editor document text. */
  @Input() content: string = '';
  /** Additional CodeMirror extensions appended after the wrapper-managed extensions. */
  @Input() appendExtensions: Extension[] = [];
  /** Language support extension, such as one returned by a @codemirror/lang-* package. */
  @Input() language: Extension = [];
  /**
   * Main switch for read-only mode.
   * Maps to CodeMirror's EditorState.readOnly facet, which editing commands and extensions consult before changing the document.
   * In most applications this is the only input you need: true makes the editor read-only, false makes it editable.
   */
  @Input() readOnly: boolean = true;
  /**
   * Advanced DOM editability override.
   * Maps to CodeMirror's EditorView.editable facet, which controls whether the content DOM is browser-editable/focusable.
   * Leave null for normal use; the wrapper then derives it from readOnly with editable = !readOnly.
   */
  @Input() editable: boolean | null = null;
  /** Theme extension or extensions applied to the editor view. */
  @Input() theme: Extension | Extension[] = [];
  /** Enables CodeMirror's line wrapping extension for long visual lines. */
  @Input() lineWrapping: boolean = false;
  /** Placeholder text shown when the editor document is empty. */
  @Input() placeholder: string = '';
  /** Shows a line-number gutter. */
  @Input() lineNumbers: boolean = false;
  /** Custom formatter for displayed line numbers in the line-number gutter. */
  @Input() lineNumberFormatter: ((lineNo: number, state: EditorState) => string) | null = null;
  /** Highlights the visual line containing the primary selection. */
  @Input() highlightActiveLine: boolean = false;
  /** Highlights the gutter for the active line when a gutter is visible. */
  @Input() highlightActiveLineGutter: boolean = false;
  /** Enables bracket matching around the cursor through @codemirror/language. */
  @Input() bracketMatching: boolean = false;
  /** Highlights unusual or special characters with CodeMirror's special-character highlighter. */
  @Input() highlightSpecialChars: boolean = false;
  /** Renders visible markers for whitespace characters. */
  @Input() highlightWhitespace: boolean = false;
  /** Renders visible markers for trailing whitespace at line ends. */
  @Input() highlightTrailingWhitespace: boolean = false;
  /** Allows scrolling past the end of the document. */
  @Input() scrollPastEnd: boolean = false;
  /** Number of columns used to display tab characters in the editor state. */
  @Input() tabSize: number = 4;
  /** Indentation unit used by language-aware indentation services. */
  @Input() indentUnit: string = '  ';
  /** Custom key bindings or groups of key bindings registered with CodeMirror's keymap extension. */
  @Input() keymaps: KeymapInput = [];
  /** Allows the editor state to hold multiple selection ranges. */
  @Input() multipleSelections: boolean = false;
  /** Draws the selection with editor-managed DOM so multiple selections and custom selection rendering are visible. */
  @Input() drawSelection: boolean = false;

  /**
   * Non-read-only editing inputs.
   * These inputs affect editing behavior and are useful only when the editor can accept document edits.
   */
  /** Enables automatic indentation when typed input matches language indentation rules. */
  @Input() indentOnInput: boolean = false;

  /**
   * Optional package: @codemirror/autocomplete.
   * Install @codemirror/autocomplete in the consuming application to use these inputs.
   * These inputs are also non-read-only editing inputs.
   */
  /** Enables automatic closing of brackets through @codemirror/autocomplete when that optional package is installed. */
  @Input() closeBrackets: boolean = false;
  /** Enables the completion UI through @codemirror/autocomplete. */
  @Input() autocompletion: boolean = false;
  /** Completion source or sources added to language completions through CodeMirror language data. */
  @Input() completions: CompletionSource | CompletionSource[] | null = null;
  /** Configuration object forwarded to @codemirror/autocomplete's autocompletion extension. */
  @Input() autocompletionConfig: CodemirrorAutocompletionConfig | null = null;

  /**
   * Optional package: @codemirror/commands.
   * Install @codemirror/commands in the consuming application to use these inputs.
   * These inputs are also non-read-only editing inputs.
   */
  /** Adds CodeMirror's Tab indentation key binding through @codemirror/commands. */
  @Input() indentWithTab: boolean = false;

  /**
   * Optional package: @codemirror/lint.
   * Install @codemirror/lint in the consuming application to use these inputs.
   */
  /** Enables lint diagnostics when a linter source is provided. */
  @Input() lint: boolean = false;
  /** Lint source used by @codemirror/lint to produce diagnostics for the current editor view. */
  @Input() linter: LintSource | null = null;
  /** Configuration object forwarded to @codemirror/lint's linter extension. */
  @Input() lintConfig: CodemirrorLintConfig | null = null;
  /** Shows CodeMirror's lint gutter for diagnostic markers. */
  @Input() lintGutter: boolean = false;
  /** Registers CodeMirror's default lint key bindings. */
  @Input() lintKeymap: boolean = false;

  /**
   * Optional package: @codemirror/search.
   * Install @codemirror/search in the consuming application to use these inputs.
   */
  /** Highlights other occurrences of the current selection through @codemirror/search. */
  @Input() highlightSelectionMatches: boolean = false;
  /** Enables CodeMirror's search state and search panel support through @codemirror/search. */
  @Input() search: boolean = false;
  /** Configuration object forwarded to @codemirror/search's search extension. */
  @Input() searchConfig: CodemirrorSearchConfig | null = null;
  /** Registers the default search key bindings. */
  @Input() searchKeymap: boolean = false;

  /**
   * Core dependency: @codemirror/language.
   * These inputs do not require optional packages.
   */
  /** Enables code folding commands and folded range state through @codemirror/language. */
  @Input() codeFolding: boolean = false;
  /** Configuration object forwarded to CodeMirror's codeFolding extension. */
  @Input() codeFoldingConfig: CodemirrorCodeFoldingConfig | null = null;
  /** Shows a gutter with fold controls. */
  @Input() foldGutter: boolean = false;
  /** Configuration object forwarded to CodeMirror's foldGutter extension. */
  @Input() foldGutterConfig: CodemirrorFoldGutterConfig | null = null;
  /** Registers CodeMirror's default folding key bindings. */
  @Input() foldKeymap: boolean = false;

  /**
   * Core dependency: @codemirror/view gutters, decorations, panels, and tooltips.
   * These inputs do not require optional packages.
   */
  /** Custom gutter configurations forwarded to CodeMirror's gutter extension. */
  @Input() customGutters: readonly CodemirrorGutterConfig[] = [];
  /** Controls whether configured gutters are fixed during horizontal scrolling; null keeps CodeMirror's default. */
  @Input() guttersFixed: boolean | null = null;
  /** Adds the wrapper's clickable breakpoint gutter. */
  @Input() breakpointGutter: boolean = false;
  /** One-based line numbers that should display breakpoint markers in the breakpoint gutter. */
  @Input() breakpoints: readonly number[] = [];
  /** Decoration set or dynamic decoration sources registered with EditorView.decorations. */
  @Input() decorations: CodemirrorDecorationSource | readonly CodemirrorDecorationSource[] | null = null;
  /** Simple marked document ranges converted to CodeMirror mark decorations. */
  @Input() markedRanges: readonly CodemirrorMarkedRange[] = [];
  /** Panel constructor or constructors shown with CodeMirror's showPanel facet. */
  @Input() panels: PanelConstructor | readonly PanelConstructor[] | null = null;
  /** Tooltip descriptor or descriptors shown with CodeMirror's showTooltip facet. */
  @Input() tooltips: Tooltip | readonly (Tooltip | null)[] | null = null;
  /** Tooltip positioning configuration forwarded to CodeMirror's tooltips extension. */
  @Input() tooltipConfig: CodemirrorTooltipConfig | null = null;
  /** Hover tooltip source used to create contextual tooltips from document positions. */
  @Input() hoverTooltip: CodemirrorHoverTooltipSource | null = null;
  /** Options forwarded to CodeMirror's hoverTooltip extension, such as hover delay. */
  @Input() hoverTooltipOptions: CodemirrorHoverTooltipOptions | null = null;

  /**
   * Core dependency: @codemirror/view styling and security.
   * These inputs do not require optional packages.
   */
  /** CSP nonce attached to CodeMirror style elements created by the editor view. */
  @Input() cspNonce: string | null = null;
  /** Static attributes or an attribute provider applied to the outer .cm-editor element. */
  @Input() editorAttributes: CodemirrorAttributeSource | null = null;
  /** Static attributes or an attribute provider applied to the editable content element. */
  @Input() contentAttributes: CodemirrorAttributeSource | null = null;
  /** Base theme rules applied with EditorView.baseTheme for structural or feature-specific styling. */
  @Input() baseTheme: CodemirrorBaseTheme | null = null;

  /** Emits the created CodeMirror EditorView after the editor is initialized. */
  @Output() editorReady: EventEmitter<EditorView> = new EventEmitter<EditorView>();
  /** Emits the full document text after user/editor transactions change the document. */
  @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
  /** Emits every CodeMirror ViewUpdate produced by the editor view. */
  @Output() update: EventEmitter<ViewUpdate> = new EventEmitter<ViewUpdate>();
  /** Emits the current EditorSelection whenever a transaction changes the selection. */
  @Output() selectionChange: EventEmitter<EditorSelection> = new EventEmitter<EditorSelection>();
  /** Emits the updated one-based breakpoint line numbers after the breakpoint gutter toggles a marker. */
  @Output() breakpointsChange: EventEmitter<number[]> = new EventEmitter<number[]>();

  @ViewChild('host') host: ElementRef<HTMLElement> | undefined;

  private editorView: EditorView | undefined;
  private languageCompartment: Compartment = new Compartment();
  private readOnlyCompartment: Compartment = new Compartment();
  private editableCompartment: Compartment = new Compartment();
  private themeCompartment: Compartment = new Compartment();
  private displayCompartment: Compartment = new Compartment();
  private indentationCompartment: Compartment = new Compartment();
  private keymapCompartment: Compartment = new Compartment();
  private selectionCompartment: Compartment = new Compartment();
  private autocompleteCompartment: Compartment = new Compartment();
  private lintCompartment: Compartment = new Compartment();
  private searchCompartment: Compartment = new Compartment();
  private foldingCompartment: Compartment = new Compartment();
  private gutterCompartment: Compartment = new Compartment();
  private decorationCompartment: Compartment = new Compartment();
  private panelCompartment: Compartment = new Compartment();
  private tooltipCompartment: Compartment = new Compartment();
  private stylingCompartment: Compartment = new Compartment();
  private appendExtensionsCompartment: Compartment = new Compartment();
  private cspNonceCompartment: Compartment = new Compartment();
  private readonly breakpointSetEffect = StateEffect.define<readonly number[]>();
  private readonly breakpointToggleEffect = StateEffect.define<number>();
  private readonly breakpointStateField = StateField.define<readonly number[]>({
    create: (state) => this.createBreakpointPositions(state, this.breakpoints),
    update: (positions, tr) => {
      let next: readonly number[] = positions.map((position) => tr.changes.mapPos(position, 1));

      for (const effect of tr.effects) {
        if (effect.is(this.breakpointSetEffect)) {
          next = this.createBreakpointPositions(tr.state, effect.value);
        } else if (effect.is(this.breakpointToggleEffect)) {
          const line = effect.value;
          if (Number.isInteger(line) && line >= 1 && line <= tr.state.doc.lines) {
            const position = tr.state.doc.line(line).from;
            next = this.toggleBreakpointPosition(next, position);
          }
        }
      }

      return this.normalizeBreakpointPositions(next);
    }
  });
  private readonly markedRangesSetEffect = StateEffect.define<readonly CodemirrorMarkedRange[]>();
  private readonly markedRangesStateField = StateField.define<DecorationSet>({
    create: (state) => createMarkedRangeDecorations(this.markedRanges, state.doc.length),
    update: (decorations, tr) => {
      let next = decorations.map(tr.changes);

      for (const effect of tr.effects) {
        if (effect.is(this.markedRangesSetEffect)) {
          next = createMarkedRangeDecorations(effect.value, tr.state.doc.length);
        }
      }

      return next;
    },
    provide: (field) => EditorView.decorations.from(field)
  });
  private disabled: boolean = false;
  private destroyed: boolean = false;
  private editorCreationVersion: number = 0;
  private reconfigureVersion: number = 0;
  private updatingContentFromModel: boolean = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private optionalPackages: OptionalCodemirrorPackages = new OptionalCodemirrorPackages();
  private readonly errorHandler: ErrorHandler = inject(ErrorHandler);

  /** Creates the CodeMirror editor after Angular has initialized the host element. */
  ngAfterViewInit(): void {
    this.destroyed = false;
    void this.createEditor(this.content).catch((error: unknown) => this.errorHandler.handleError(error));
  }

  /** Reconfigures the live editor when Angular input bindings change. */
  ngOnChanges(changes: SimpleChanges): void {
    void this.reconfigureEditor(changes).catch((error: unknown) => this.errorHandler.handleError(error));
  }

  private async reconfigureEditor(changes: SimpleChanges): Promise<void> {
    if (this.destroyed || !this.editorView) {
      return;
    }

    if (changes['content']) {
      this.setEditorContent(this.content);
    }

    const reconfigureVersion = ++this.reconfigureVersion;
    const effects = await this.getReconfigureEffects(changes);
    if (!this.destroyed && reconfigureVersion === this.reconfigureVersion && this.editorView && effects.length > 0) {
      this.editorView.dispatch({ effects });
    }
  }

  /** Destroys the CodeMirror editor view and prevents pending async initialization from recreating it. */
  ngOnDestroy(): void {
    this.destroyed = true;
    this.editorCreationVersion += 1;
    this.reconfigureVersion += 1;
    this.destroyEditor();
  }

  /**
   * Implements ControlValueAccessor.writeValue.
   * Angular forms call this method when the external form model writes a value into the editor.
   */
  writeValue(value: string | null | undefined): void {
    this.content = value ?? '';
    this.setEditorContent(this.content);
  }

  /**
   * Implements ControlValueAccessor.registerOnChange.
   * Angular forms call this method to register the callback that receives editor document changes.
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * Implements ControlValueAccessor.registerOnTouched.
   * Angular forms call this method to register the callback emitted when the editor is touched.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Implements ControlValueAccessor.setDisabledState.
   * Angular forms call this method when the form control is enabled or disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.editorView) {
      this.editorView.dispatch({
        effects: [
          this.readOnlyCompartment.reconfigure(createReadOnlyExtensions(this.readOnly, this.disabled)),
          this.editableCompartment.reconfigure(createEditableExtensions(this.readOnly, this.editable, this.disabled))
        ]
      });
    }
  }

  /**
   * Recreates the editor from a CodeMirror state configuration while preserving wrapper-managed behavior.
   * User-provided extensions are appended after the wrapper extensions.
   */
  async resetEditor(config: EditorStateConfig): Promise<void> {
    const editorCreationVersion = ++this.editorCreationVersion;
    this.reconfigureVersion += 1;
    const state = EditorState.create({
      ...config,
      doc: config.doc ?? this.content,
      extensions: [await this.createExtensions(), config.extensions ?? []]
    });

    if (!this.destroyed && editorCreationVersion === this.editorCreationVersion) {
      this.content = state.doc.toString();
      this.mountEditorState(state);
    }
  }

  /** Moves focus to the CodeMirror editor when it exists. */
  focus(): void {
    this.editorView?.focus();
  }

  /** Returns the current editor document text, or the pending content input before initialization. */
  getValue(): string {
    return this.editorView?.state.doc.toString() ?? this.content;
  }

  /** Replaces the full editor document and synchronizes the content input cache. */
  setValue(value: string): void {
    this.content = value;
    this.setEditorContent(value);
  }

  /** Dispatches one or more raw CodeMirror transaction specs to the editor. */
  dispatch(...specs: TransactionSpec[]): void {
    this.editorView?.dispatch(...specs);
  }

  /** Replaces the current selection ranges with the provided text. */
  replaceSelection(text: string): void {
    if (!this.editorView) {
      return;
    }

    this.editorView.dispatch(this.editorView.state.replaceSelection(text));
  }

  /** Scrolls a document position into view, clamping the position to the document bounds. */
  scrollToPosition(position: number): void {
    if (!this.editorView) {
      return;
    }

    const boundedPosition = Math.max(0, Math.min(position, this.editorView.state.doc.length));
    this.editorView.dispatch({
      effects: EditorView.scrollIntoView(boundedPosition, { y: 'center' })
    });
  }

  /** Scrolls a one-based document line into view, clamping the line to the document bounds. */
  scrollToLine(line: number): void {
    if (!this.editorView) {
      return;
    }

    const boundedLine = Math.max(1, Math.min(line, this.editorView.state.doc.lines));
    this.scrollToPosition(this.editorView.state.doc.line(boundedLine).from);
  }

  /** Scrolls the primary selection range into view. */
  scrollSelectionIntoView(): void {
    if (!this.editorView) {
      return;
    }

    this.editorView.dispatch({
      effects: EditorView.scrollIntoView(this.editorView.state.selection.main, { y: 'nearest' })
    });
  }

  /** Serializes the editor state, including history and fold state when those extensions are active. */
  toJSON(): unknown {
    if (!this.editorView) {
      return createPendingEditorJSON(this.content);
    }

    const fields: Record<string, StateField<any>> = {};
    if (this.optionalPackages.commands && this.editorView.state.field(this.optionalPackages.commands.historyField, false)) {
      fields['history'] = this.optionalPackages.commands.historyField;
    }
    if (this.editorView.state.field(foldState, false)) {
      fields['fold'] = foldState;
    }

    return Object.keys(fields).length > 0 ? this.editorView.state.toJSON(fields) : this.editorView.state.toJSON();
  }

  /** Restores a serialized CodeMirror state produced by toJSON. */
  async restoreFromJSON(json: unknown): Promise<void> {
    const commands = json && typeof json === 'object' && 'history' in json ? await this.optionalPackages.loadCommands() : null;
    const fields = {
      ...(commands ? { history: commands.historyField } : {}),
      ...(json && typeof json === 'object' && 'fold' in json ? { fold: foldState } : {})
    };
    const state = EditorState.fromJSON(
      json,
      {
        extensions: await this.createExtensions()
      },
      Object.keys(fields).length > 0 ? fields : undefined
    );

    this.content = state.doc.toString();
    if (this.editorView) {
      this.editorView.setState(state);
    } else {
      this.mountEditorState(state);
    }
  }

  /** Runs the @codemirror/commands undo command. Requires @codemirror/commands. */
  async undo(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).undo(this.editorView) : false;
  }

  /** Runs the @codemirror/commands redo command. Requires @codemirror/commands. */
  async redo(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).redo(this.editorView) : false;
  }

  /** Opens CodeMirror's search panel. Requires @codemirror/search. */
  async openSearchPanel(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).openSearchPanel(this.editorView) : false;
  }

  /** Closes CodeMirror's search panel. Requires @codemirror/search. */
  async closeSearchPanel(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).closeSearchPanel(this.editorView) : false;
  }

  /** Returns true when the search panel is open and @codemirror/search has been loaded. */
  isSearchPanelOpen(): boolean {
    return this.editorView && this.optionalPackages.search ? this.optionalPackages.search.searchPanelOpen(this.editorView.state) : false;
  }

  /** Selects the next search match. Requires @codemirror/search. */
  async findNext(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).findNext(this.editorView) : false;
  }

  /** Selects the previous search match. Requires @codemirror/search. */
  async findPrevious(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).findPrevious(this.editorView) : false;
  }

  /** Replaces the current search match. Requires @codemirror/search. */
  async replaceNext(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).replaceNext(this.editorView) : false;
  }

  /** Replaces all search matches. Requires @codemirror/search. */
  async replaceAll(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).replaceAll(this.editorView) : false;
  }

  /** Opens CodeMirror's go-to-line command UI. Requires @codemirror/search. */
  async gotoLine(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).gotoLine(this.editorView) : false;
  }

  /** Adds the next occurrence of the current selection to the selection set. Requires @codemirror/search. */
  async selectNextOccurrence(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).selectNextOccurrence(this.editorView) : false;
  }

  /** Selects matches for the current selection. Requires @codemirror/search. */
  async selectSelectionMatches(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).selectSelectionMatches(this.editorView) : false;
  }

  /** Selects all matches for the active search query. Requires @codemirror/search. */
  async selectMatches(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadSearch()).selectMatches(this.editorView) : false;
  }

  /** Folds the foldable range at the current selection. */
  foldCode(): boolean {
    return this.editorView ? codemirrorFoldCode(this.editorView) : false;
  }

  /** Unfolds the folded range at the current selection. */
  unfoldCode(): boolean {
    return this.editorView ? codemirrorUnfoldCode(this.editorView) : false;
  }

  /** Toggles folding at the current selection. */
  toggleFold(): boolean {
    return this.editorView ? codemirrorToggleFold(this.editorView) : false;
  }

  /** Folds all foldable ranges in the document. */
  foldAll(): boolean {
    return this.editorView ? codemirrorFoldAll(this.editorView) : false;
  }

  /** Unfolds all folded ranges in the document. */
  unfoldAll(): boolean {
    return this.editorView ? codemirrorUnfoldAll(this.editorView) : false;
  }

  /** Returns the current folded document ranges. */
  getFoldedRanges(): CodemirrorFoldedRange[] {
    if (!this.editorView) {
      return [];
    }

    const ranges: CodemirrorFoldedRange[] = [];
    codemirrorFoldedRanges(this.editorView.state).between(0, this.editorView.state.doc.length, (from, to) => {
      ranges.push({ from, to });
    });
    return ranges;
  }

  /** Opens the completion UI. Requires @codemirror/autocomplete. */
  async startCompletion(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadAutocomplete()).startCompletion(this.editorView) : false;
  }

  /** Closes the completion UI. Requires @codemirror/autocomplete. */
  async closeCompletion(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadAutocomplete()).closeCompletion(this.editorView) : false;
  }

  /** Accepts the selected completion. Requires @codemirror/autocomplete. */
  async acceptCompletion(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadAutocomplete()).acceptCompletion(this.editorView) : false;
  }

  /** Returns the current completion UI status, or null before @codemirror/autocomplete is loaded. */
  completionStatus(): ReturnType<AutocompleteModule['completionStatus']> {
    return this.editorView && this.optionalPackages.autocomplete ? this.optionalPackages.autocomplete.completionStatus(this.editorView.state) : null;
  }

  /** Returns the currently available completion options, or an empty array when completion is inactive. */
  currentCompletions(): readonly Completion[] {
    return this.editorView && this.optionalPackages.autocomplete ? this.optionalPackages.autocomplete.currentCompletions(this.editorView.state) : [];
  }

  /** Returns the currently selected completion option, or null when none is selected. */
  selectedCompletion(): Completion | null {
    return this.editorView && this.optionalPackages.autocomplete ? this.optionalPackages.autocomplete.selectedCompletion(this.editorView.state) : null;
  }

  /** Returns the selected completion option index, or null when completion is inactive. */
  selectedCompletionIndex(): number | null {
    return this.editorView && this.optionalPackages.autocomplete
      ? this.optionalPackages.autocomplete.selectedCompletionIndex(this.editorView.state)
      : null;
  }

  /** Toggles a breakpoint marker for a one-based line number and emits breakpointsChange. */
  toggleBreakpoint(line: number): void {
    if (!Number.isInteger(line) || line < 1) {
      return;
    }

    if (!this.editorView) {
      const current = new Set(this.breakpoints);
      if (current.has(line)) {
        current.delete(line);
      } else {
        current.add(line);
      }
      this.breakpoints = this.normalizeBreakpointLineNumbers([...current]);
      this.breakpointsChange.emit([...this.breakpoints]);
      return;
    }

    this.editorView?.dispatch({
      effects: this.breakpointToggleEffect.of(line)
    });
  }

  /** Returns true when the one-based line number has a breakpoint marker. */
  hasBreakpoint(line: number): boolean {
    return this.getBreakpointLineNumbers().includes(line);
  }

  /** Adds a cursor on the line above the current selection. Requires @codemirror/commands. */
  async addCursorAbove(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).addCursorAbove(this.editorView) : false;
  }

  /** Adds a cursor on the line below the current selection. Requires @codemirror/commands. */
  async addCursorBelow(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).addCursorBelow(this.editorView) : false;
  }

  /** Toggles line or block comments for the current selection. Requires @codemirror/commands. */
  async toggleComment(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).toggleComment(this.editorView) : false;
  }

  /** Toggles line comments for the current selection. Requires @codemirror/commands. */
  async toggleLineComment(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).toggleLineComment(this.editorView) : false;
  }

  /** Adds line comments to the current selection. Requires @codemirror/commands. */
  async lineComment(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).lineComment(this.editorView) : false;
  }

  /** Removes line comments from the current selection. Requires @codemirror/commands. */
  async lineUncomment(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).lineUncomment(this.editorView) : false;
  }

  /** Toggles block comments for the current selection. Requires @codemirror/commands. */
  async toggleBlockComment(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).toggleBlockComment(this.editorView) : false;
  }

  /** Indents the current selection one level deeper. Requires @codemirror/commands. */
  async indentMore(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).indentMore(this.editorView) : false;
  }

  /** Reduces indentation for the current selection by one level. Requires @codemirror/commands. */
  async indentLess(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).indentLess(this.editorView) : false;
  }

  /** Applies language-aware indentation to the current selection. Requires @codemirror/commands. */
  async indentSelection(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).indentSelection(this.editorView) : false;
  }

  /** Deletes the selected lines. Requires @codemirror/commands. */
  async deleteLine(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).deleteLine(this.editorView) : false;
  }

  /** Moves the selected lines up. Requires @codemirror/commands. */
  async moveLineUp(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).moveLineUp(this.editorView) : false;
  }

  /** Moves the selected lines down. Requires @codemirror/commands. */
  async moveLineDown(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).moveLineDown(this.editorView) : false;
  }

  /** Selects the current line. Requires @codemirror/commands. */
  async selectLine(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).selectLine(this.editorView) : false;
  }

  /** Moves the cursor to the matching bracket when one is available. Requires @codemirror/commands. */
  async cursorMatchingBracket(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).cursorMatchingBracket(this.editorView) : false;
  }

  /** Toggles Tab focus mode. Requires @codemirror/commands. */
  async toggleTabFocusMode(): Promise<boolean> {
    return this.editorView ? (await this.optionalPackages.loadCommands()).toggleTabFocusMode(this.editorView) : false;
  }

  /** Returns true when hover tooltip sources are active in the editor state. */
  hasHoverTooltips(): boolean {
    return this.editorView ? codemirrorHasHoverTooltips(this.editorView.state) : false;
  }

  /** Activates hover tooltips at a document position. */
  activateHover(position: number, side: -1 | 1 = 1): void {
    if (this.editorView) {
      codemirrorActivateHover(this.editorView, position, side);
    }
  }

  /** Closes currently visible hover tooltips. */
  closeHoverTooltips(): void {
    this.editorView?.dispatch({
      effects: codemirrorCloseHoverTooltips
    });
  }

  /** Recomputes tooltip positions for the current editor layout. */
  repositionTooltips(): void {
    if (this.editorView) {
      codemirrorRepositionTooltips(this.editorView);
    }
  }

  /** Returns the active panel instance for the given panel constructor, when mounted. */
  getPanel(panel: PanelConstructor): Panel | null {
    return this.editorView ? codemirrorGetPanel(this.editorView, panel) : null;
  }

  /** Recreates the editor with the same document and selection, clearing undo/redo history. */
  async clearHistory(): Promise<void> {
    if (!this.editorView) {
      return;
    }

    const state = this.editorView.state;
    await this.createEditor(state.doc.toString(), state.selection);
  }

  private async createEditor(doc: string, selection?: EditorSelection): Promise<void> {
    const editorCreationVersion = ++this.editorCreationVersion;
    const state = EditorState.create({
      doc,
      selection,
      extensions: await this.createExtensions()
    });
    if (!this.destroyed && editorCreationVersion === this.editorCreationVersion) {
      this.mountEditorState(state);
    }
  }

  private mountEditorState(state: EditorState): void {
    if (!this.host) {
      throw new Error('Internal ngx-codemirror6 error - host must be defined');
    }
    if (this.destroyed) {
      return;
    }

    this.destroyEditor();
    this.editorView = new EditorView({
      parent: this.host.nativeElement,
      state
    });
    this.editorReady.emit(this.editorView);
  }

  private async createExtensions(): Promise<Extension[]> {
    return [
      this.languageCompartment.of(this.language),
      this.readOnlyCompartment.of(createReadOnlyExtensions(this.readOnly, this.disabled)),
      this.editableCompartment.of(createEditableExtensions(this.readOnly, this.editable, this.disabled)),
      this.themeCompartment.of(createThemeExtensions(this.theme)),
      this.displayCompartment.of(await createDisplayExtensions(this.getDisplayConfig(), this.optionalPackages)),
      this.indentationCompartment.of(createIndentationExtensions(this.getIndentationConfig())),
      this.keymapCompartment.of(await createKeymapExtensions(this.getKeymapConfig(), this.optionalPackages)),
      this.selectionCompartment.of(createSelectionExtensions(this.getSelectionConfig())),
      this.autocompleteCompartment.of(await createAutocompletionExtensions(this.getAutocompletionConfig(), this.optionalPackages)),
      this.lintCompartment.of(await createLintExtensions(this.getLintConfig(), this.optionalPackages)),
      this.searchCompartment.of(await createSearchExtensions(this.getSearchConfig(), this.optionalPackages)),
      this.foldingCompartment.of(createFoldingExtensions(this.getFoldingConfig())),
      this.breakpointStateField,
      this.gutterCompartment.of(createGutterExtensions(this.getGutterConfig())),
      this.markedRangesStateField,
      this.decorationCompartment.of(createDecorationExtensions(this.getDecorationConfig())),
      this.panelCompartment.of(createPanelExtensions({ panels: this.panels })),
      this.tooltipCompartment.of(createTooltipExtensions(this.getTooltipConfig())),
      this.stylingCompartment.of(createStylingExtensions(this.getStylingConfig())),
      this.appendExtensionsCompartment.of(this.appendExtensions),
      this.cspNonceCompartment.of(createCspNonceExtensions(this.cspNonce)),
      EditorView.domEventHandlers({
        blur: () => {
          this.onTouched();
        }
      }),
      EditorView.updateListener.of((update) => {
        this.update.emit(update);
        const breakpointLineNumbers = this.getBreakpointLineNumbers(update.state);
        if (breakpointLineNumbers.length !== this.breakpoints.length || breakpointLineNumbers.some((line, index) => line !== this.breakpoints[index])) {
          this.breakpoints = breakpointLineNumbers;
          this.breakpointsChange.emit([...this.breakpoints]);
        }
        if (update.selectionSet) {
          this.selectionChange.emit(update.state.selection);
        }
        if (update.docChanged && !this.updatingContentFromModel) {
          this.content = update.state.doc.toString();
          this.contentChange.emit(this.content);
          this.onChange(this.content);
        }
      })
    ];
  }

  private async getReconfigureEffects(changes: SimpleChanges): Promise<StateEffect<unknown>[]> {
    const effects: StateEffect<unknown>[] = [];

    if (changes['language']) {
      effects.push(this.languageCompartment.reconfigure(this.language));
    }
    if (changes['readOnly']) {
      effects.push(this.readOnlyCompartment.reconfigure(createReadOnlyExtensions(this.readOnly, this.disabled)));
      effects.push(this.editableCompartment.reconfigure(createEditableExtensions(this.readOnly, this.editable, this.disabled)));
    }
    if (changes['editable']) {
      effects.push(this.editableCompartment.reconfigure(createEditableExtensions(this.readOnly, this.editable, this.disabled)));
    }
    if (changes['theme']) {
      effects.push(this.themeCompartment.reconfigure(createThemeExtensions(this.theme)));
    }
    if (
      changes['lineWrapping'] ||
      changes['placeholder'] ||
      changes['lineNumbers'] ||
      changes['lineNumberFormatter'] ||
      changes['highlightActiveLine'] ||
      changes['highlightActiveLineGutter'] ||
      changes['highlightSelectionMatches'] ||
      changes['bracketMatching'] ||
      changes['closeBrackets'] ||
      changes['highlightSpecialChars'] ||
      changes['highlightWhitespace'] ||
      changes['highlightTrailingWhitespace'] ||
      changes['scrollPastEnd']
    ) {
      effects.push(this.displayCompartment.reconfigure(await createDisplayExtensions(this.getDisplayConfig(), this.optionalPackages)));
    }
    if (changes['tabSize'] || changes['indentUnit'] || changes['indentOnInput']) {
      effects.push(this.indentationCompartment.reconfigure(createIndentationExtensions(this.getIndentationConfig())));
    }
    if (changes['indentWithTab'] || changes['keymaps']) {
      effects.push(this.keymapCompartment.reconfigure(await createKeymapExtensions(this.getKeymapConfig(), this.optionalPackages)));
    }
    if (changes['multipleSelections'] || changes['drawSelection']) {
      effects.push(this.selectionCompartment.reconfigure(createSelectionExtensions(this.getSelectionConfig())));
    }
    if (changes['autocompletion'] || changes['completions'] || changes['autocompletionConfig']) {
      effects.push(this.autocompleteCompartment.reconfigure(await createAutocompletionExtensions(this.getAutocompletionConfig(), this.optionalPackages)));
    }
    if (changes['lint'] || changes['linter'] || changes['lintConfig'] || changes['lintGutter'] || changes['lintKeymap']) {
      effects.push(this.lintCompartment.reconfigure(await createLintExtensions(this.getLintConfig(), this.optionalPackages)));
    }
    if (changes['search'] || changes['searchConfig'] || changes['searchKeymap']) {
      effects.push(this.searchCompartment.reconfigure(await createSearchExtensions(this.getSearchConfig(), this.optionalPackages)));
    }
    if (changes['codeFolding'] || changes['codeFoldingConfig'] || changes['foldGutter'] || changes['foldGutterConfig'] || changes['foldKeymap']) {
      effects.push(this.foldingCompartment.reconfigure(createFoldingExtensions(this.getFoldingConfig())));
    }
    if (changes['customGutters'] || changes['guttersFixed'] || changes['breakpointGutter']) {
      effects.push(this.gutterCompartment.reconfigure(createGutterExtensions(this.getGutterConfig())));
    }
    if (changes['breakpoints']) {
      effects.push(this.breakpointSetEffect.of(this.breakpoints));
    }
    if (changes['markedRanges']) {
      effects.push(this.markedRangesSetEffect.of(this.markedRanges));
    }
    if (changes['decorations']) {
      effects.push(this.decorationCompartment.reconfigure(createDecorationExtensions(this.getDecorationConfig())));
    }
    if (changes['panels']) {
      effects.push(this.panelCompartment.reconfigure(createPanelExtensions({ panels: this.panels })));
    }
    if (changes['tooltips'] || changes['tooltipConfig'] || changes['hoverTooltip'] || changes['hoverTooltipOptions']) {
      effects.push(this.tooltipCompartment.reconfigure(createTooltipExtensions(this.getTooltipConfig())));
    }
    if (changes['editorAttributes'] || changes['contentAttributes'] || changes['baseTheme']) {
      effects.push(this.stylingCompartment.reconfigure(createStylingExtensions(this.getStylingConfig())));
    }
    if (changes['appendExtensions']) {
      effects.push(this.appendExtensionsCompartment.reconfigure(this.appendExtensions));
    }
    if (changes['cspNonce']) {
      effects.push(this.cspNonceCompartment.reconfigure(createCspNonceExtensions(this.cspNonce)));
    }

    return effects;
  }

  private getDisplayConfig(): DisplayExtensionConfig {
    return {
      lineWrapping: this.lineWrapping,
      placeholder: this.placeholder,
      lineNumbers: this.lineNumbers,
      lineNumberFormatter: this.lineNumberFormatter,
      highlightActiveLine: this.highlightActiveLine,
      highlightActiveLineGutter: this.highlightActiveLineGutter,
      highlightSelectionMatches: this.highlightSelectionMatches,
      bracketMatching: this.bracketMatching,
      closeBrackets: this.closeBrackets,
      highlightSpecialChars: this.highlightSpecialChars,
      highlightWhitespace: this.highlightWhitespace,
      highlightTrailingWhitespace: this.highlightTrailingWhitespace,
      scrollPastEnd: this.scrollPastEnd
    };
  }

  private getIndentationConfig(): IndentationExtensionConfig {
    return { tabSize: this.tabSize, indentUnit: this.indentUnit, indentOnInput: this.indentOnInput };
  }

  private getKeymapConfig(): KeymapExtensionConfig {
    return { indentWithTab: this.indentWithTab, keymaps: this.keymaps };
  }

  private getSelectionConfig(): SelectionExtensionConfig {
    return { multipleSelections: this.multipleSelections, drawSelection: this.drawSelection };
  }

  private getAutocompletionConfig(): AutocompletionInputConfig {
    return { autocompletion: this.autocompletion, completions: this.completions, autocompletionConfig: this.autocompletionConfig };
  }

  private getLintConfig(): LintInputConfig {
    return { lint: this.lint, linter: this.linter, lintConfig: this.lintConfig, lintGutter: this.lintGutter, lintKeymap: this.lintKeymap };
  }

  private getSearchConfig(): SearchExtensionConfig {
    return { search: this.search, searchConfig: this.searchConfig, searchKeymap: this.searchKeymap };
  }

  private getFoldingConfig(): FoldingExtensionConfig {
    return {
      codeFolding: this.codeFolding,
      codeFoldingConfig: this.codeFoldingConfig,
      foldGutter: this.foldGutter,
      foldGutterConfig: this.foldGutterConfig,
      foldKeymap: this.foldKeymap
    };
  }

  private getGutterConfig(): GutterExtensionConfig {
    return {
      customGutters: this.customGutters,
      guttersFixed: this.guttersFixed,
      breakpointGutter: this.breakpointGutter,
      breakpointField: this.breakpointStateField,
      toggleBreakpoint: (line: number) => this.toggleBreakpoint(line)
    };
  }

  private getDecorationConfig(): DecorationExtensionConfig {
    return {
      decorations: this.decorations
    };
  }

  private getTooltipConfig(): TooltipExtensionConfig {
    return {
      tooltips: this.tooltips,
      tooltipConfig: this.tooltipConfig,
      hoverTooltip: this.hoverTooltip,
      hoverTooltipOptions: this.hoverTooltipOptions
    };
  }

  private getStylingConfig(): StylingExtensionConfig {
    return { editorAttributes: this.editorAttributes, contentAttributes: this.contentAttributes, baseTheme: this.baseTheme };
  }

  private createBreakpointPositions(state: EditorState, breakpoints: readonly number[]): readonly number[] {
    return this.normalizeBreakpointPositions(
      breakpoints
        .filter((line) => Number.isInteger(line) && line >= 1 && line <= state.doc.lines)
        .map((line) => state.doc.line(line).from)
    );
  }

  private getBreakpointLineNumbers(state?: EditorState): readonly number[] {
    if (!state) {
      return this.normalizeBreakpointLineNumbers(this.breakpoints);
    }

    return this.normalizeBreakpointLineNumbers(state.field(this.breakpointStateField).map((position) => state.doc.lineAt(position).number));
  }

  private toggleBreakpointPosition(positions: readonly number[], position: number): readonly number[] {
    const current = new Set(positions);
    if (current.has(position)) {
      current.delete(position);
    } else {
      current.add(position);
    }

    return this.normalizeBreakpointPositions([...current]);
  }

  private normalizeBreakpointPositions(positions: readonly number[]): readonly number[] {
    return [...new Set(positions)].sort((left, right) => left - right);
  }

  private normalizeBreakpointLineNumbers(lines: readonly number[]): readonly number[] {
    return [...new Set(lines)].sort((left, right) => left - right);
  }

  private setEditorContent(value: string): void {
    if (!this.editorView) {
      return;
    }

    const currentValue = this.editorView.state.doc.toString();
    if (currentValue === value) {
      return;
    }

    this.updatingContentFromModel = true;
    try {
      this.editorView.dispatch({
        changes: {
          from: 0,
          to: this.editorView.state.doc.length,
          insert: value
        }
      });
    } finally {
      this.updatingContentFromModel = false;
    }
  }

  private destroyEditor(): void {
    this.editorView?.destroy();
    this.editorView = undefined;
  }
}
