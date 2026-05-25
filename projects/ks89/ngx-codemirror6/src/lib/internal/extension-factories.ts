import {
  bracketMatching as codemirrorBracketMatching,
  codeFolding as codemirrorCodeFolding,
  defaultHighlightStyle,
  foldKeymap,
  foldGutter as codemirrorFoldGutter,
  indentOnInput as codemirrorIndentOnInput,
  indentUnit,
  syntaxHighlighting
} from '@codemirror/language';
import { EditorSelection, EditorState, Extension, StateField } from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  GutterMarker,
  KeyBinding,
  PanelConstructor,
  Tooltip,
  drawSelection as codemirrorDrawSelection,
  gutter as codemirrorGutter,
  gutters as codemirrorGutters,
  highlightActiveLine as codemirrorHighlightActiveLine,
  highlightActiveLineGutter as codemirrorHighlightActiveLineGutter,
  highlightSpecialChars as codemirrorHighlightSpecialChars,
  highlightTrailingWhitespace as codemirrorHighlightTrailingWhitespace,
  highlightWhitespace as codemirrorHighlightWhitespace,
  keymap,
  lineNumbers as codemirrorLineNumbers,
  placeholder as codemirrorPlaceholder,
  scrollPastEnd as codemirrorScrollPastEnd,
  showPanel as codemirrorShowPanel,
  showTooltip as codemirrorShowTooltip,
  tooltips as codemirrorTooltips,
  hoverTooltip as codemirrorHoverTooltip
} from '@codemirror/view';
import {
  AutocompletionInputConfig,
  CodemirrorAttributeSource,
  CodemirrorBaseTheme,
  CodemirrorCodeFoldingConfig,
  CodemirrorDecorationSource,
  CodemirrorFoldGutterConfig,
  CodemirrorGutterConfig,
  CodemirrorHoverTooltipOptions,
  CodemirrorHoverTooltipSource,
  CodemirrorMarkedRange,
  CodemirrorSearchConfig,
  CodemirrorTooltipConfig,
  KeymapInput,
  LintInputConfig
} from '../models/codemirror-config.types';

// import optional packages
import { OptionalCodemirrorPackages } from './optional-codemirror-packages';

/** Configuration used to build display and text-rendering extensions. */
export interface DisplayExtensionConfig {
  lineWrapping: boolean;
  placeholder: string;
  lineNumbers: boolean;
  lineNumberFormatter: ((lineNo: number, state: EditorState) => string) | null;
  highlightActiveLine: boolean;
  highlightActiveLineGutter: boolean;
  highlightSelectionMatches: boolean;
  bracketMatching: boolean;
  closeBrackets: boolean;
  highlightSpecialChars: boolean;
  highlightWhitespace: boolean;
  highlightTrailingWhitespace: boolean;
  scrollPastEnd: boolean;
}

/** Configuration used to build indentation extensions. */
export interface IndentationExtensionConfig {
  tabSize: number;
  indentUnit: string;
  indentOnInput: boolean;
}

/** Configuration used to build keymap extensions. */
export interface KeymapExtensionConfig {
  indentWithTab: boolean;
  keymaps: KeymapInput;
}

/** Configuration used to build selection extensions. */
export interface SelectionExtensionConfig {
  multipleSelections: boolean;
  drawSelection: boolean;
}

/** Configuration used to build @codemirror/search extensions. */
export interface SearchExtensionConfig {
  search: boolean;
  searchConfig: CodemirrorSearchConfig | null;
  searchKeymap: boolean;
}

/** Configuration used to build folding extensions. */
export interface FoldingExtensionConfig {
  codeFolding: boolean;
  codeFoldingConfig: CodemirrorCodeFoldingConfig | null;
  foldGutter: boolean;
  foldGutterConfig: CodemirrorFoldGutterConfig | null;
  foldKeymap: boolean;
}

/** Configuration used to build gutter and breakpoint gutter extensions. */
export interface GutterExtensionConfig {
  customGutters: readonly CodemirrorGutterConfig[];
  guttersFixed: boolean | null;
  breakpointGutter: boolean;
  breakpointField: StateField<readonly number[]>;
  toggleBreakpoint: (line: number) => void;
}

/** Configuration used to build decoration extensions. */
export interface DecorationExtensionConfig {
  decorations: CodemirrorDecorationSource | readonly CodemirrorDecorationSource[] | null;
}

/** Configuration used to build panel extensions. */
export interface PanelExtensionConfig {
  panels: PanelConstructor | readonly PanelConstructor[] | null;
}

/** Configuration used to build tooltip and hover tooltip extensions. */
export interface TooltipExtensionConfig {
  tooltips: Tooltip | readonly (Tooltip | null)[] | null;
  tooltipConfig: CodemirrorTooltipConfig | null;
  hoverTooltip: CodemirrorHoverTooltipSource | null;
  hoverTooltipOptions: CodemirrorHoverTooltipOptions | null;
}

/** Configuration used to build editor/content attributes and base theme extensions. */
export interface StylingExtensionConfig {
  editorAttributes: CodemirrorAttributeSource | null;
  contentAttributes: CodemirrorAttributeSource | null;
  baseTheme: CodemirrorBaseTheme | null;
}

class BreakpointMarker extends GutterMarker {
  override toDOM(): HTMLElement {
    const marker = document.createElement('span');
    marker.className = 'cm-breakpoint-marker';
    marker.setAttribute('aria-hidden', 'true');
    return marker;
  }
}

const breakpointMarker = new BreakpointMarker();

/** Creates the EditorState.readOnly facet extension from readOnly and disabled state. */
export function createReadOnlyExtensions(readOnly: boolean, disabled: boolean): Extension[] {
  return [EditorState.readOnly.of(readOnly || disabled)];
}

/** Creates the EditorView.editable facet extension from readOnly, editable override, and disabled state. */
export function createEditableExtensions(readOnly: boolean, editable: boolean | null, disabled: boolean): Extension[] {
  return [EditorView.editable.of((editable ?? !readOnly) && !disabled)];
}

/** Normalizes a single theme extension or a theme extension array. */
export function createThemeExtensions(theme: Extension | Extension[]): Extension[] {
  return [syntaxHighlighting(defaultHighlightStyle, { fallback: true }), ...(Array.isArray(theme) ? theme : [theme])];
}

/** Creates display-related extensions such as line wrapping, line numbers, active line, and whitespace markers. */
export async function createDisplayExtensions(config: DisplayExtensionConfig, optionalPackages: OptionalCodemirrorPackages): Promise<Extension[]> {
  const extensions: Extension[] = [];

  if (config.lineWrapping) {
    extensions.push(EditorView.lineWrapping);
  }
  if (config.placeholder) {
    extensions.push(codemirrorPlaceholder(config.placeholder));
  }
  if (config.lineNumbers) {
    extensions.push(codemirrorLineNumbers(config.lineNumberFormatter ? { formatNumber: config.lineNumberFormatter } : undefined));
  }
  if (config.highlightActiveLine) {
    extensions.push(codemirrorHighlightActiveLine());
  }
  if (config.highlightActiveLineGutter) {
    extensions.push(codemirrorHighlightActiveLineGutter());
  }
  if (config.highlightSelectionMatches) {
    extensions.push((await optionalPackages.loadSearch()).highlightSelectionMatches());
  }
  if (config.bracketMatching) {
    extensions.push(codemirrorBracketMatching());
  }
  if (config.closeBrackets) {
    const autocomplete = await optionalPackages.loadAutocomplete();
    extensions.push(autocomplete.closeBrackets(), keymap.of(autocomplete.closeBracketsKeymap));
  }
  if (config.highlightSpecialChars) {
    extensions.push(codemirrorHighlightSpecialChars());
  }
  if (config.highlightWhitespace) {
    extensions.push(codemirrorHighlightWhitespace());
  }
  if (config.highlightTrailingWhitespace) {
    extensions.push(codemirrorHighlightTrailingWhitespace());
  }
  if (config.scrollPastEnd) {
    extensions.push(codemirrorScrollPastEnd());
  }

  return extensions;
}

/** Creates indentation state and language-aware indentation extensions. */
export function createIndentationExtensions(config: IndentationExtensionConfig): Extension[] {
  return [
    EditorState.tabSize.of(config.tabSize),
    indentUnit.of(config.indentUnit),
    ...(config.indentOnInput ? [codemirrorIndentOnInput()] : [])
  ];
}

/** Creates keymap extensions, including optional Tab indentation when @codemirror/commands is installed. */
export async function createKeymapExtensions(config: KeymapExtensionConfig, optionalPackages: OptionalCodemirrorPackages): Promise<Extension[]> {
  const bindings = flattenKeymaps(config.keymaps);

  if (config.indentWithTab) {
    bindings.push((await optionalPackages.loadCommands()).indentWithTab);
  }

  return bindings.length > 0 ? [keymap.of(bindings)] : [];
}

/** Creates selection behavior extensions, including multiple selection and drawn selections. */
export function createSelectionExtensions(config: SelectionExtensionConfig): Extension[] {
  const extensions: Extension[] = [EditorState.allowMultipleSelections.of(config.multipleSelections)];

  if (config.drawSelection) {
    extensions.push(codemirrorDrawSelection());
  }

  return extensions;
}

/** Creates autocompletion extensions. Requires @codemirror/autocomplete when enabled. */
export async function createAutocompletionExtensions(
  config: AutocompletionInputConfig,
  optionalPackages: OptionalCodemirrorPackages
): Promise<Extension[]> {
  if (!config.autocompletion) {
    return [];
  }

  const autocomplete = await optionalPackages.loadAutocomplete();
  const customSources = Array.isArray(config.completions) ? config.completions : config.completions ? [config.completions] : [];
  const extensions: Extension[] = [autocomplete.autocompletion(config.autocompletionConfig ?? undefined)];

  if (customSources.length > 0) {
    extensions.push(EditorState.languageData.of(() => customSources.map((source) => ({ autocomplete: source }))));
  }

  return extensions;
}

/** Creates lint extensions. Requires @codemirror/lint when linting or lint gutter is enabled. */
export async function createLintExtensions(config: LintInputConfig, optionalPackages: OptionalCodemirrorPackages): Promise<Extension[]> {
  const extensions: Extension[] = [];

  if (config.lint && config.linter) {
    extensions.push((await optionalPackages.loadLint()).linter(config.linter, config.lintConfig ?? undefined));
  }
  if (config.lintGutter) {
    extensions.push((await optionalPackages.loadLint()).lintGutter());
  }
  if (config.lintKeymap) {
    extensions.push(keymap.of((await optionalPackages.loadLint()).lintKeymap));
  }

  return extensions;
}

/** Creates search extensions. Requires @codemirror/search when search features are enabled. */
export async function createSearchExtensions(config: SearchExtensionConfig, optionalPackages: OptionalCodemirrorPackages): Promise<Extension[]> {
  const extensions: Extension[] = [];

  if (config.search) {
    extensions.push((await optionalPackages.loadSearch()).search(config.searchConfig ?? undefined));
  }
  if (config.searchKeymap) {
    extensions.push(keymap.of((await optionalPackages.loadSearch()).searchKeymap));
  }

  return extensions;
}

/** Creates code folding and fold gutter extensions. */
export function createFoldingExtensions(config: FoldingExtensionConfig): Extension[] {
  const extensions: Extension[] = [];

  if (config.codeFolding) {
    extensions.push(codemirrorCodeFolding(config.codeFoldingConfig ?? undefined));
  }
  if (config.foldGutter) {
    extensions.push(codemirrorFoldGutter(config.foldGutterConfig ?? undefined));
  }
  if (config.foldKeymap) {
    extensions.push(keymap.of(foldKeymap));
  }

  return extensions;
}

/** Creates custom gutters and the wrapper breakpoint gutter extension. */
export function createGutterExtensions(config: GutterExtensionConfig): Extension[] {
  const extensions: Extension[] = [];
  const customGutterExtensions = config.customGutters.map((gutterConfig) => codemirrorGutter(gutterConfig));

  if (config.guttersFixed !== null && (customGutterExtensions.length > 0 || config.breakpointGutter)) {
    extensions.push(codemirrorGutters({ fixed: config.guttersFixed }));
  }
  if (config.breakpointGutter) {
    extensions.push(createBreakpointGutter(config));
  }

  extensions.push(...customGutterExtensions);
  return extensions;
}

/** Creates direct decoration extensions and wrapper marked range decorations. */
export function createDecorationExtensions(config: DecorationExtensionConfig): Extension[] {
  const extensions: Extension[] = [];

  for (const decoration of normalizeArray(config.decorations)) {
    extensions.push(EditorView.decorations.of(decoration));
  }

  return extensions;
}

/** Creates panel extensions from panel constructors. */
export function createPanelExtensions(config: PanelExtensionConfig): Extension[] {
  const panelConstructors = normalizeArray(config.panels);
  return panelConstructors.length > 0 ? panelConstructors.map((panel) => codemirrorShowPanel.of(panel)) : [];
}

/** Creates tooltip, tooltip configuration, and hover tooltip extensions. */
export function createTooltipExtensions(config: TooltipExtensionConfig): Extension[] {
  const extensions: Extension[] = [];

  if (config.tooltipConfig) {
    extensions.push(codemirrorTooltips(config.tooltipConfig));
  }
  for (const tooltip of normalizeArray(config.tooltips)) {
    extensions.push(codemirrorShowTooltip.of(tooltip));
  }
  if (config.hoverTooltip) {
    extensions.push(codemirrorHoverTooltip(config.hoverTooltip, config.hoverTooltipOptions ?? undefined));
  }

  return extensions;
}

/** Creates editor attributes, content attributes, and base theme extensions. */
export function createStylingExtensions(config: StylingExtensionConfig): Extension[] {
  const extensions: Extension[] = [];

  if (config.baseTheme) {
    extensions.push(EditorView.baseTheme(config.baseTheme));
  }
  if (config.editorAttributes) {
    extensions.push(EditorView.editorAttributes.of(config.editorAttributes));
  }
  if (config.contentAttributes) {
    extensions.push(EditorView.contentAttributes.of(config.contentAttributes));
  }

  return extensions;
}

/** Creates the CodeMirror CSP nonce extension when a nonce is provided. */
export function createCspNonceExtensions(cspNonce: string | null): Extension[] {
  return cspNonce ? [EditorView.cspNonce.of(cspNonce)] : [];
}

/** Creates a minimal JSON representation before an EditorView exists. */
export function createPendingEditorJSON(content: string): unknown {
  return {
    doc: content,
    selection: EditorSelection.single(0).toJSON()
  };
}

function createBreakpointGutter(config: GutterExtensionConfig): Extension {
  return codemirrorGutter({
    class: 'cm-breakpoint-gutter',
    lineMarker: (view, line) => (view.state.field(config.breakpointField).includes(line.from) ? breakpointMarker : null),
    domEventHandlers: {
      mousedown: (view, line, event) => {
        event.preventDefault();
        config.toggleBreakpoint(view.state.doc.lineAt(line.from).number);
        return true;
      }
    },
    initialSpacer: () => breakpointMarker
  });
}

export function createMarkedRangeDecorations(markedRanges: readonly CodemirrorMarkedRange[], docLength: number): DecorationSet {
  return Decoration.set(
    markedRanges.flatMap((range) => {
      const from = Math.max(0, range.from);
      const to = Math.min(docLength, Math.max(from, range.to));

      if (from >= to) {
        return [];
      }

      return Decoration.mark({
        class: range.class,
        attributes: range.attributes,
        tagName: range.tagName,
        inclusive: range.inclusive,
        inclusiveStart: range.inclusiveStart,
        inclusiveEnd: range.inclusiveEnd
      }).range(from, to);
    }),
    true
  );
}

function flattenKeymaps(keymaps: KeymapInput): KeyBinding[] {
  if (keymaps.length === 0) {
    return [];
  }

  const first = keymaps[0];
  return Array.isArray(first)
    ? (keymaps as readonly (readonly KeyBinding[])[]).flatMap((bindings) => [...bindings])
    : [...(keymaps as readonly KeyBinding[])];
}

function normalizeArray<T>(value: T | readonly T[] | null): readonly T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value as T];
}
