import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-languages-page',
  templateUrl: './languages-page.component.html',
  standalone: false
})
export class LanguagesPageComponent {
  readonly state = inject(ExampleStateService);
}
