import { Component, inject } from '@angular/core';

import { CodemirrorComponent } from '@ks89/ngx-codemirror6';

import { ExampleStateService } from '../example-state.service';

@Component({
  selector: 'app-tooltips-page',
  templateUrl: './tooltips-page.component.html',
  standalone: false
})
export class TooltipsPageComponent {
  readonly state = inject(ExampleStateService);
  hoverTooltipsActive: boolean = false;
  tooltipActionMessage: string = 'No tooltip method called yet';

  repositionTooltips(editor: CodemirrorComponent): void {
    editor.repositionTooltips();
    this.tooltipActionMessage = 'Tooltip positions were recalculated';
    this.syncHoverTooltipState(editor);
  }

  activateHover(editor: CodemirrorComponent): void {
    editor.activateHover(this.state.advancedTodoPosition);
    this.tooltipActionMessage = 'Hover tooltip activated on the TODO marker';
    this.syncHoverTooltipState(editor);
  }

  closeHoverTooltips(editor: CodemirrorComponent): void {
    editor.closeHoverTooltips();
    this.tooltipActionMessage = 'Hover tooltips were closed';
    this.syncHoverTooltipState(editor);
  }

  private syncHoverTooltipState(editor: CodemirrorComponent): void {
    this.hoverTooltipsActive = editor.hasHoverTooltips();
  }
}
