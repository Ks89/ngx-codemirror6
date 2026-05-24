import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  standalone: false
})
export class EventsPageComponent {
  readonly state = inject(ExampleStateService);
}
