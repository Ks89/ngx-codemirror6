import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

// ********************** ngx-codemirror6 *****************************
import { CodemirrorModule } from '@ks89/ngx-codemirror6'; // <------ ngx-codemirror6 library import
// **************************************************************************

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CodemirrorModule // <---------- @ks89/ngx-codemirror6 module import
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
