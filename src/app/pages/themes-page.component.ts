import { Component, inject } from '@angular/core';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-themes-page',
  templateUrl: './themes-page.component.html',
  standalone: false
})
export class ThemesPageComponent {
  readonly state = inject(ExampleStateService);
}
