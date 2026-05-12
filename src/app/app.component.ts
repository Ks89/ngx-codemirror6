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

import { Component } from '@angular/core';
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
import { Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeExample {
  title: string;
  content: string;
  language: Extension;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  darkExtensions: Extension[] = [oneDark];

  examples: CodeExample[] = [
    {
      title: 'Angular template',
      language: angular({ base: htmlLang() }),
      content: `
<section *ngIf="user as currentUser">
  <h2>Hello {{ currentUser.name }}</h2>
  <button type="button" (click)="save(currentUser)">Save</button>
</section>
      `
    },
    {
      title: 'C++',
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
      language: javascript({ typescript: false, jsx: false }),
      content: `
let x = 6;
document.getElementById("demo").innerHTML = x;
      `
    },
    {
      title: 'TypeScript',
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
      language: javascript({ typescript: false, jsx: true }),
      content: `
const x = 5;
const myElement = <h1>{(x) < 10 ? "Hello" : "Goodbye"}</h1>;
      `
    },
    {
      title: 'JSON',
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
      language: php(),
      content: `
<?php

$message = 'Hello from PHP';
echo $message;
      `
    },
    {
      title: 'Python',
      language: python(),
      content: `
def greet(name: str) -> str:
    return f"Hello, {name}"

print(greet("Python"))
      `
    },
    {
      title: 'Rust',
      language: rust(),
      content: `
fn main() {
    println!("Hello from Rust");
}
      `
    },
    {
      title: 'CSS',
      language: css(),
      content: `
p {
  border-style: solid;
}
      `
    },
    {
      title: 'SCSS',
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
}
