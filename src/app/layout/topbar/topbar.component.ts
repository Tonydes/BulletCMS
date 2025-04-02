import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { ColorConfiguratorComponent } from './color-configurator/color-configurator.component';
import { Store } from '@ngrx/store';
import * as ThemeActions from '../../core/state/theme/theme.actions';
import { LayoutService } from 'src/app/core/services';
import { selectIsDarkTheme } from 'src/app/core/state/theme/theme.selectors';

@Component({
  selector: 'bcms-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, ColorConfiguratorComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  items!: MenuItem[];
  layoutService = inject(LayoutService);
  private store = inject(Store);

  isDarkTheme = this.store.selectSignal(selectIsDarkTheme);

  toggleDarkMode() {
    this.store.dispatch(ThemeActions.toggleDarkMode());
  }
}
