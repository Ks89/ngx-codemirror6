import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocompletePageComponent } from './pages/autocomplete-page.component';
import { CommandsPageComponent } from './pages/commands-page.component';
import { DisplayPageComponent } from './pages/display-page.component';
import { EventsPageComponent } from './pages/events-page.component';
import { FoldingPageComponent } from './pages/folding-page.component';
import { GuttersPageComponent } from './pages/gutters-page.component';
import { LanguagesPageComponent } from './pages/languages-page.component';
import { LintPageComponent } from './pages/lint-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchPageComponent } from './pages/search-page.component';
import { ThemesPageComponent } from './pages/themes-page.component';
import { TooltipsPageComponent } from './pages/tooltips-page.component';

// ********************** ngx-codemirror6 *****************************
import { CodemirrorModule } from '@ks89/ngx-codemirror6'; // <------ ngx-codemirror6 library import
// **************************************************************************

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LanguagesPageComponent,
    ThemesPageComponent,
    DisplayPageComponent,
    EventsPageComponent,
    FoldingPageComponent,
    GuttersPageComponent,
    TooltipsPageComponent,
    AutocompletePageComponent,
    CommandsPageComponent,
    LintPageComponent,
    SearchPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CodemirrorModule // <---------- @ks89/ngx-codemirror6 module import
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
