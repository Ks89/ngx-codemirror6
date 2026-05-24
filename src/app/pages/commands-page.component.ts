import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-commands-page',
  templateUrl: './commands-page.component.html',
  standalone: false
})
export class CommandsPageComponent {
  readonly state = inject(ExampleStateService);
}
