import { Component, ElementRef } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

const ADMIN_PREFIX = '/bcms-admin';

@Component({
  selector: 'bcms-sidebar',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(public el: ElementRef) {}
}
