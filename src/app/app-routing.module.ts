import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutocompletePageComponent } from './pages/autocomplete-page.component';
import { CommandsPageComponent } from './pages/commands-page.component';
import { DisplayPageComponent } from './pages/display-page.component';
import { EventsPageComponent } from './pages/events-page.component';
import { FoldingPageComponent } from './pages/folding-page.component';
import { GuttersPageComponent } from './pages/gutters-page.component';
import { LanguagesPageComponent } from './pages/languages-page.component';
import { LintPageComponent } from './pages/lint-page.component';
import { SearchPageComponent } from './pages/search-page.component';
import { ThemesPageComponent } from './pages/themes-page.component';
import { TooltipsPageComponent } from './pages/tooltips-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'languages' },
  { path: 'languages', component: LanguagesPageComponent },
  { path: 'themes', component: ThemesPageComponent },
  { path: 'display', component: DisplayPageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'folding', component: FoldingPageComponent },
  { path: 'gutters', component: GuttersPageComponent },
  { path: 'tooltips', component: TooltipsPageComponent },
  { path: 'autocomplete', component: AutocompletePageComponent },
  { path: 'commands', component: CommandsPageComponent },
  { path: 'lint', component: LintPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: '**', redirectTo: 'languages' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
