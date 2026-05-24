import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-gutters-page',
  templateUrl: './gutters-page.component.html',
  standalone: false
})
export class GuttersPageComponent {
  readonly state = inject(ExampleStateService);
}
