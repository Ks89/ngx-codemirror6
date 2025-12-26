import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  contentHtml = `
<!DOCTYPE html>
<html>
  <body style="background-color:powderblue;">
    <h1>This is a heading</h1>
  </body>
</html>
  `;
  contentJs = `
let x = 6;
document.getElementById("demo").innerHTML = x;
  `;
  contentTs = `
interface Point {
  x: number;
  y: number;
}
const point = { x: 12, y: 26 };
console.log(point);
  `;
  contentJsx = `
const x = 5;
const myElement = <h1>{(x) < 10 ? "Hello" : "Goodbye"}</h1>;
  `;
  contentCss = `
p {
  border-style: solid;
}
  `;
  contentScss = `
nav {
  ul {
    list-style: none;
  }
  a {
    padding: 6px 12px;
  }
}
  `;
  contentSass = `
nav
  ul
    list-style: none

  a
    padding: 6px 12px
  `;
}
