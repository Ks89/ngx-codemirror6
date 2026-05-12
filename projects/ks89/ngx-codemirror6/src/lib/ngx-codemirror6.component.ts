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

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { EditorView, lineNumbers } from '@codemirror/view';
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state';
import { basicSetup } from 'codemirror';

/**
 * CodeMirror component
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
  @Input() content: string = '';
  @Input() appendExtensions: Extension[] = [];
  @Input() language: Extension = [];
  @Input() readOnly: boolean = true;

  @ViewChild('host') host: ElementRef<HTMLElement> | undefined;

  private editorView: EditorView | undefined;
  private disabled: boolean = false;
  private updatingContentFromModel: boolean = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngAfterViewInit(): void {
    this.createEditor(this.content);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editorView) {
      return;
    }

    if (changes['content'] && Object.keys(changes).length === 1) {
      this.setEditorContent(this.content);
      return;
    }

    if (changes['content'] || changes['appendExtensions'] || changes['language'] || changes['readOnly']) {
      this.createEditor(this.content);
    }
  }

  ngOnDestroy(): void {
    this.destroyEditor();
  }

  writeValue(value: string | null | undefined): void {
    this.content = value ?? '';
    this.setEditorContent(this.content);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.editorView) {
      this.createEditor(this.editorView.state.doc.toString());
    }
  }

  codemirrorInit(config: EditorStateConfig): void {
    if (!this.host) {
      throw new Error('Internal ngx-codemirror6 error - host must be defined');
    }
    this.destroyEditor();
    this.editorView = new EditorView({
      parent: this.host.nativeElement,
      state: EditorState.create(config)
    });
  }

  private createEditor(doc: string): void {
    const extensions: Extension[] = [
      lineNumbers(),
      this.language,
      basicSetup,
      EditorState.readOnly.of(this.readOnly || this.disabled),
      EditorView.editable.of(!this.readOnly && !this.disabled),
      EditorView.domEventHandlers({
        blur: () => {
          this.onTouched();
        }
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !this.updatingContentFromModel) {
          this.content = update.state.doc.toString();
          this.onChange(this.content);
        }
      }),
      ...this.appendExtensions
    ];
    const config: EditorStateConfig = {
      doc,
      extensions
    };
    this.codemirrorInit(config);
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
