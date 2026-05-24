import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';

import { ExampleStateService } from './example-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class AppComponent {
  private readonly state = inject(ExampleStateService);

  @HostBinding('class.light-theme')
  get lightTheme(): boolean {
    return !this.state.darkTheme;
  }
}
