import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-autocomplete-page',
  templateUrl: './autocomplete-page.component.html',
  standalone: false
})
export class AutocompletePageComponent {
  readonly state = inject(ExampleStateService);
}
