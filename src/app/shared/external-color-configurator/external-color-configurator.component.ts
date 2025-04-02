import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { selectIsDarkTheme } from 'src/app/core/state/theme/theme.selectors';
import { ColorConfiguratorComponent } from 'src/app/layout/topbar/color-configurator/color-configurator.component';
import * as ThemeActions from '../../core/state/theme/theme.actions';

@Component({
  selector: 'bcms-external-color-configurator',
  imports: [ButtonModule, StyleClassModule, ColorConfiguratorComponent],
  template: `
    <div class="fixed flex gap-4 top-8 right-8">
      <p-button
        type="button"
        (onClick)="toggleDarkMode()"
        [rounded]="true"
        [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'"
        severity="secondary"
      />
      <div class="relative">
        <p-button
          icon="pi pi-palette"
          pStyleClass="@next"
          enterFromClass="hidden"
          enterActiveClass="animate-scalein"
          leaveToClass="hidden"
          leaveActiveClass="animate-fadeout"
          [hideOnOutsideClick]="true"
          type="button"
          rounded
        />
        <bcms-color-configurator />
      </div>
    </div>
  `
})
export class ExternalColorConfigurator {
  private store = inject(Store);

  isDarkTheme = this.store.selectSignal(selectIsDarkTheme);

  toggleDarkMode() {
    this.store.dispatch(ThemeActions.toggleDarkMode());
  }
}
