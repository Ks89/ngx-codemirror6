import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { javascript } from '@codemirror/lang-javascript';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { CodemirrorComponent } from './ngx-codemirror6.component';

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

describe('CodemirrorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodemirrorComponent, HostComponent, FormHostComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  it('renders without a language extension when no language input is provided', () => {
    const fixture = TestBed.createComponent(CodemirrorComponent);
    fixture.componentInstance.content = 'const value = 1;';

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(getEditorText(fixture)).toContain('const value = 1;');
  });

  it('updates the editor document when the content input changes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.componentInstance.content = 'const value = 2;';
    fixture.detectChanges();

    expect(getEditorText(fixture)).toContain('const value = 2;');
    expect(getEditorText(fixture)).not.toContain('const value = 1;');
  });

  it('exposes readOnly as an input', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(getEditorContentElement(fixture).getAttribute('contenteditable')).toBe('false');

    fixture.componentInstance.readOnly = false;
    fixture.detectChanges();

    expect(getEditorContentElement(fixture).getAttribute('contenteditable')).toBe('true');
  });

  it('destroys the CodeMirror view with the component', () => {
    const destroySpy = spyOn(EditorView.prototype, 'destroy').and.callThrough();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.destroy();

    expect(destroySpy).toHaveBeenCalled();
  });

  it('implements ControlValueAccessor for reactive forms', () => {
    const fixture = TestBed.createComponent(FormHostComponent);
    fixture.detectChanges();

    expect(getEditorText(fixture)).toContain('initial value');

    fixture.componentInstance.control.setValue('model update');
    fixture.detectChanges();

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
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('editor update');
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

function getEditorContentElement<T>(fixture: ComponentFixture<T>): HTMLElement {
  const element = fixture.nativeElement.querySelector('.cm-content') as HTMLElement | null;
  if (!element) {
    throw new Error('Expected CodeMirror content element to be rendered');
  }
  return element;
}
