import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  standalone: false
})
export class SearchPageComponent {
  readonly state = inject(ExampleStateService);
}
