import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Extension } from '@codemirror/state';

import { AppComponent } from './app.component';

@Component({
  selector: 'ks-codemirror',
  template: '',
  standalone: false
})
export class CodemirrorStubComponent {
  @Input() content: string = '';
  @Input() language: Extension = [];
  @Input() appendExtensions: Extension[] = [];
  @Input() readOnly: boolean = true;
}

@NgModule({
  declarations: [AppComponent, CodemirrorStubComponent],
  imports: [CommonModule]
})
export class AppTestingModule {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('creates the app component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defines examples for all installed CodeMirror language packages', () => {
    const requiredExamples = [
      'Angular template',
      'C++',
      'Go',
      'HTML',
      'Java',
      'JavaScript',
      'JSON',
      'Markdown',
      'PHP',
      'Python',
      'Rust',
      'SCSS',
      'SASS',
      'SQL',
      'XML',
      'YAML'
    ];
    const exampleTitles = fixture.componentInstance.examples.map((example) => example.title);

    expect(exampleTitles).toEqual(jasmine.arrayContaining(requiredExamples));
  });

  it('defines the One Dark extension for dark examples', () => {
    expect(fixture.componentInstance.darkExtensions.length).toBe(1);
  });

  it('renders read-only and editable light and dark CodeMirror components for each example', () => {
    const codemirrorDebugElements = fixture.debugElement.queryAll(By.directive(CodemirrorStubComponent));

    expect(codemirrorDebugElements.length).toBe(fixture.componentInstance.examples.length * 4);
  });

  it('passes each example content, language extension, theme extension, and read-only mode to CodeMirror', () => {
    const codemirrorComponents = fixture.debugElement
      .queryAll(By.directive(CodemirrorStubComponent))
      .map((debugElement) => debugElement.componentInstance as CodemirrorStubComponent);

    fixture.componentInstance.examples.forEach((example, index) => {
      const lightReadOnlyComponent = codemirrorComponents[index * 4];
      const darkReadOnlyComponent = codemirrorComponents[index * 4 + 1];
      const lightEditableComponent = codemirrorComponents[index * 4 + 2];
      const darkEditableComponent = codemirrorComponents[index * 4 + 3];

      expectExampleBinding(lightReadOnlyComponent, example.content, example.language, true, 0);
      expectExampleBinding(
        darkReadOnlyComponent,
        example.content,
        example.language,
        true,
        fixture.componentInstance.darkExtensions
      );
      expectExampleBinding(lightEditableComponent, example.content, example.language, false, 0);
      expectExampleBinding(
        darkEditableComponent,
        example.content,
        example.language,
        false,
        fixture.componentInstance.darkExtensions
      );
    });
  });

  it('renders read-only and editable labels for every light and dark example', () => {
    fixture.componentInstance.examples.forEach((example, index) => {
      expect(getExampleHeadingText(fixture, index)).toBe(`${example.title} example`);
      expect(getThemeLabelText(fixture, index, 0)).toBe('Light read-only');
      expect(getThemeLabelText(fixture, index, 1)).toBe('Dark read-only');
      expect(getThemeLabelText(fixture, index, 2)).toBe('Light editable');
      expect(getThemeLabelText(fixture, index, 3)).toBe('Dark editable');
    });
  });
});

function expectExampleBinding(
  component: CodemirrorStubComponent,
  content: string,
  language: Extension,
  readOnly: boolean,
  extensions: Extension[] | 0
): void {
  expect(component.content).toBe(content);
  expect(component.language as unknown).toBe(language as unknown);
  expect(component.readOnly).toBe(readOnly);

  if (extensions === 0) {
    expect(component.appendExtensions.length).toBe(0);
  } else {
    expect(component.appendExtensions).toBe(extensions);
  }
}

function getExampleHeadingText(fixture: ComponentFixture<AppComponent>, index: number): string {
  return getText(fixture, `article.example:nth-of-type(${index + 1}) h2`);
}

function getThemeLabelText(fixture: ComponentFixture<AppComponent>, exampleIndex: number, themeIndex: number): string {
  return getText(fixture, `article.example:nth-of-type(${exampleIndex + 1}) .code h3:nth-of-type(1)`, themeIndex);
}

function getText(fixture: ComponentFixture<AppComponent>, selector: string, index: number = 0): string {
  const element = fixture.nativeElement.querySelectorAll(selector).item(index) as HTMLElement | null;

  if (!element) {
    throw new Error(`Expected ${selector} to be rendered`);
  }

  return element.textContent?.trim() ?? '';
}
