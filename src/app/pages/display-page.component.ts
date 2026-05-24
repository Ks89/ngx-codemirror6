import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-display-page',
  templateUrl: './display-page.component.html',
  standalone: false
})
export class DisplayPageComponent {
  readonly state = inject(ExampleStateService);
}
