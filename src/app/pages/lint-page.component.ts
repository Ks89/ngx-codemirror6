import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-lint-page',
  templateUrl: './lint-page.component.html',
  standalone: false
})
export class LintPageComponent {
  readonly state = inject(ExampleStateService);
}
