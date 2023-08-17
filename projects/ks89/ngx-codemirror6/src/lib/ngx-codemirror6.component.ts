/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2023 Stefano Cappa (Ks89)
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
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef,
  AfterViewInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { EditorView, lineNumbers } from '@codemirror/view';
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state';
import { LanguageSupport } from '@codemirror/language';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { sass } from '@codemirror/lang-sass';
import { materialDark } from '@ddietr/codemirror-themes/material-dark';

/**
 * CodeMirror component
 */
@Component({
  selector: 'codemirror',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodemirrorComponent),
      multi: true
    }
  ],
  template: `<div #host></div>`
})
export class CodemirrorComponent implements AfterViewInit {
  @Input() content: string = 'placeholder text';
  @Input() appendExtensions: Extension[] = [];
  @Input() language: string = '';

  @ViewChild('host') host: ElementRef | undefined;

  ngAfterViewInit(): void {
    let lang: LanguageSupport;
    switch(this.language) {
      case 'html':
        lang = html();
        break;
      case 'javascript':
        lang = javascript({typescript: false, jsx: false});
        break;
      case 'typescript':
        lang = javascript({typescript: true, jsx: false});
        break;
      case 'jsx':
        lang = javascript({typescript: false, jsx: true});
        break;
      case 'css':
        lang = css();
        break;
      case 'scss':
        lang = sass();
        break;
      case 'sass':
        lang = sass({indented: true});
        break;
      default:
        throw new Error('Internal ngx-codemirror6 error - unrecognized language');
    }

    const extensions: Extension[] = [
      lineNumbers(),
      lang,
      materialDark,
      EditorState.readOnly.of(true),
      ...this.appendExtensions
    ];
    const config: EditorStateConfig = {
      doc: this.content,
      extensions: extensions
    };
    this.codemirrorInit(config);
  }

  codemirrorInit(config: EditorStateConfig): void {
    if (!this.host) {
      throw new Error('Internal ngx-codemirror6 error - host must be defined');
    }
    new EditorView({
      parent: this.host.nativeElement,
      state: EditorState.create(config)
    });
  }
}
