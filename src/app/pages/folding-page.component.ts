import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-folding-page',
  templateUrl: './folding-page.component.html',
  standalone: false
})
export class FoldingPageComponent {
  readonly state = inject(ExampleStateService);
}
