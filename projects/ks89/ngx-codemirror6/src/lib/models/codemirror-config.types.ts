import type { CompletionSource } from '@codemirror/autocomplete';
import type { LintSource } from '@codemirror/lint';
import { codeFolding as codemirrorCodeFolding, foldGutter as codemirrorFoldGutter } from '@codemirror/language';
import { linter as codemirrorLinter } from '@codemirror/lint';
import {
  DecorationSet,
  EditorView,
  KeyBinding,
  gutter as codemirrorGutter,
  hoverTooltip as codemirrorHoverTooltip,
  tooltips as codemirrorTooltips
} from '@codemirror/view';

type SearchModule = typeof import('@codemirror/search');
type AutocompleteModule = typeof import('@codemirror/autocomplete');

/** Key binding input accepted by the wrapper, either a flat keymap or grouped keymaps. */
export type KeymapInput = readonly KeyBinding[] | readonly (readonly KeyBinding[])[];
/** Configuration accepted by @codemirror/search's search extension. */
export type CodemirrorSearchConfig = Parameters<SearchModule['search']>[0];
/** Configuration accepted by @codemirror/autocomplete's autocompletion extension. */
export type CodemirrorAutocompletionConfig = Parameters<AutocompleteModule['autocompletion']>[0];
/** Configuration accepted by @codemirror/language's codeFolding extension. */
export type CodemirrorCodeFoldingConfig = Parameters<typeof codemirrorCodeFolding>[0];
/** Configuration accepted by @codemirror/language's foldGutter extension. */
export type CodemirrorFoldGutterConfig = Parameters<typeof codemirrorFoldGutter>[0];
/** Configuration accepted by @codemirror/lint's linter extension. */
export type CodemirrorLintConfig = Parameters<typeof codemirrorLinter>[1];
/** Configuration accepted by @codemirror/view's gutter extension. */
export type CodemirrorGutterConfig = Parameters<typeof codemirrorGutter>[0];
/** Static or computed attributes for CodeMirror editor/content DOM elements. */
export type CodemirrorAttributeSource = Record<string, string> | ((view: EditorView) => Record<string, string> | null);
/** Style spec accepted by EditorView.baseTheme. */
export type CodemirrorBaseTheme = Parameters<typeof EditorView.baseTheme>[0];
/** Configuration accepted by @codemirror/view's tooltips extension. */
export type CodemirrorTooltipConfig = Parameters<typeof codemirrorTooltips>[0];
/** Source function accepted by @codemirror/view's hoverTooltip extension. */
export type CodemirrorHoverTooltipSource = Parameters<typeof codemirrorHoverTooltip>[0];
/** Options accepted by @codemirror/view's hoverTooltip extension. */
export type CodemirrorHoverTooltipOptions = Parameters<typeof codemirrorHoverTooltip>[1];
/** Decoration source accepted by EditorView.decorations. */
export type CodemirrorDecorationSource = DecorationSet | ((view: EditorView) => DecorationSet);

/** Simple mark decoration range used by the wrapper markedRanges input. */
export interface CodemirrorMarkedRange {
  /** Inclusive start document offset, clamped to zero by the wrapper. */
  from: number;
  /** Exclusive end document offset, clamped to the document length by the wrapper. */
  to: number;
  /** CSS class applied to the marked range. */
  class?: string;
  /** DOM attributes applied to the generated mark. */
  attributes?: Record<string, string>;
  /** Optional tag name used for the mark element. */
  tagName?: string;
  /** Whether the mark is inclusive on both sides. */
  inclusive?: boolean;
  /** Whether the mark includes inserted content at the start boundary. */
  inclusiveStart?: boolean;
  /** Whether the mark includes inserted content at the end boundary. */
  inclusiveEnd?: boolean;
}

/** Folded range returned by getFoldedRanges. */
export interface CodemirrorFoldedRange {
  /** Fold start document offset. */
  from: number;
  /** Fold end document offset. */
  to: number;
}

/** Internal configuration used to build autocompletion extensions. */
export interface AutocompletionInputConfig {
  /** Whether the completion UI should be enabled. */
  autocompletion: boolean;
  /** Optional completion sources added through CodeMirror language data. */
  completions: CompletionSource | CompletionSource[] | null;
  /** Optional @codemirror/autocomplete configuration. */
  autocompletionConfig: CodemirrorAutocompletionConfig | null;
}

/** Internal configuration used to build lint extensions. */
export interface LintInputConfig {
  /** Whether lint diagnostics should be enabled when a source is present. */
  lint: boolean;
  /** Diagnostic source used by @codemirror/lint. */
  linter: LintSource | null;
  /** Optional @codemirror/lint configuration. */
  lintConfig: CodemirrorLintConfig | null;
  /** Whether the lint gutter should be enabled. */
  lintGutter: boolean;
  /** Whether the default @codemirror/lint keymap should be enabled. */
  lintKeymap: boolean;
}
