/** Module type for the optional @codemirror/autocomplete package. */
export type AutocompleteModule = typeof import('@codemirror/autocomplete');
/** Module type for the optional @codemirror/commands package. */
export type CommandsModule = typeof import('@codemirror/commands');
/** Module type for the optional @codemirror/lint package. */
export type LintModule = typeof import('@codemirror/lint');
/** Module type for the optional @codemirror/search package. */
export type SearchModule = typeof import('@codemirror/search');

class MissingOptionalCodemirrorDependencyError extends Error {
  constructor(packageName: string, cause: unknown) {
    super(`@ks89/ngx-codemirror6 optional feature requires ${packageName}. Install it in your application to use this API.`, {
      cause
    });
  }
}

/** Lazy loader and cache for optional CodeMirror packages used by advanced wrapper APIs. */
export class OptionalCodemirrorPackages {
  private autocompleteModule: AutocompleteModule | null = null;
  private commandsModule: CommandsModule | null = null;
  private lintModule: LintModule | null = null;
  private searchModule: SearchModule | null = null;

  /** Cached @codemirror/autocomplete module, or null until it has been loaded. */
  get autocomplete(): AutocompleteModule | null {
    return this.autocompleteModule;
  }

  /** Loads @codemirror/autocomplete or throws a package-specific installation error. */
  async loadAutocomplete(): Promise<AutocompleteModule> {
    try {
      return (this.autocompleteModule ??= await import('@codemirror/autocomplete'));
    } catch (error) {
      if (this.isModuleResolutionError(error, '@codemirror/autocomplete')) {
        throw this.createMissingOptionalDependencyError('@codemirror/autocomplete', error);
      }
      throw error;
    }
  }

  /** Cached @codemirror/commands module, or null until it has been loaded. */
  get commands(): CommandsModule | null {
    return this.commandsModule;
  }

  /** Loads @codemirror/commands or throws a package-specific installation error. */
  async loadCommands(): Promise<CommandsModule> {
    try {
      return (this.commandsModule ??= await import('@codemirror/commands'));
    } catch (error) {
      if (this.isModuleResolutionError(error, '@codemirror/commands')) {
        throw this.createMissingOptionalDependencyError('@codemirror/commands', error);
      }
      throw error;
    }
  }

  /** Cached @codemirror/lint module, or null until it has been loaded. */
  get lint(): LintModule | null {
    return this.lintModule;
  }

  /** Loads @codemirror/lint or throws a package-specific installation error. */
  async loadLint(): Promise<LintModule> {
    try {
      return (this.lintModule ??= await import('@codemirror/lint'));
    } catch (error) {
      if (this.isModuleResolutionError(error, '@codemirror/lint')) {
        throw this.createMissingOptionalDependencyError('@codemirror/lint', error);
      }
      throw error;
    }
  }

  /** Cached @codemirror/search module, or null until it has been loaded. */
  get search(): SearchModule | null {
    return this.searchModule;
  }

  /** Loads @codemirror/search or throws a package-specific installation error. */
  async loadSearch(): Promise<SearchModule> {
    try {
      return (this.searchModule ??= await import('@codemirror/search'));
    } catch (error) {
      if (this.isModuleResolutionError(error, '@codemirror/search')) {
        throw this.createMissingOptionalDependencyError('@codemirror/search', error);
      }
      throw error;
    }
  }

  private createMissingOptionalDependencyError(packageName: string, error: unknown): Error {
    return new MissingOptionalCodemirrorDependencyError(packageName, error);
  }

  private isModuleResolutionError(error: unknown, packageName: string): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    const code = this.getErrorCode(error);
    if ((code === 'ERR_MODULE_NOT_FOUND' || code === 'MODULE_NOT_FOUND') && error.message.includes(packageName)) {
      return true;
    }

    return (
      error.message.includes(packageName) &&
      [
        'Cannot find module',
        'Cannot find package',
        'Failed to resolve module specifier',
        'could not be resolved',
        'Could not resolve'
      ].some((messagePart) => error.message.includes(messagePart))
    );
  }

  private getErrorCode(error: Error): string | undefined {
    return 'code' in error && typeof error.code === 'string' ? error.code : undefined;
  }
}
