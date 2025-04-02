import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuItemComponent } from './menu-item.component';

const ADMIN_PREFIX = '/bcms-admin';

@Component({
  selector: 'bcms-menu',
  standalone: true,
  imports: [CommonModule, MenuItemComponent, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'GENERALE',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: `${ADMIN_PREFIX}/dashboard` },
          { label: 'Utenti', icon: 'pi pi-users', routerLink: `${ADMIN_PREFIX}/users` },
          { label: 'Impostazioni', icon: 'pi pi-cog', routerLink: `${ADMIN_PREFIX}/settings` }
        ]
      },
      {
        label: 'CONTENT',
        items: [
          { label: 'Articoli', icon: 'pi pi-file', routerLink: `${ADMIN_PREFIX}/articles` },
          { label: 'Pagine', icon: 'pi pi-copy', routerLink: `${ADMIN_PREFIX}/pages` },
          { label: 'Media', icon: 'pi pi-image', routerLink: `${ADMIN_PREFIX}/media` }
        ]
      },
      {
        label: 'APPEARENCE',
        items: [
          { label: 'Headers', icon: 'pi pi-crown', routerLink: `${ADMIN_PREFIX}/headers` },
          { label: 'Sidebars', icon: 'pi pi-objects-column', routerLink: `${ADMIN_PREFIX}/sidebars` },
          { label: 'Footer', icon: 'pi pi-server', routerLink: `${ADMIN_PREFIX}/footer` }
        ]
      },
      {
        label: 'SEO',
        items: [
          { label: 'Google', icon: 'pi pi-google', routerLink: `${ADMIN_PREFIX}/google` },
          { label: 'Sitemap', icon: 'pi pi-map', routerLink: `${ADMIN_PREFIX}/sitemap` },
          { label: 'Robots', icon: 'pi pi-android', routerLink: `${ADMIN_PREFIX}/robots` }
        ]
      }
      // {
      //   label: 'Hierarchy',
      //   items: [
      //     {
      //       label: 'Submenu 1',
      //       icon: 'pi pi-fw pi-bookmark',
      //       items: [
      //         {
      //           label: 'Submenu 1.1',
      //           icon: 'pi pi-fw pi-bookmark',
      //           items: [
      //             { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
      //             { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
      //             { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
      //           ]
      //         },
      //         {
      //           label: 'Submenu 1.2',
      //           icon: 'pi pi-fw pi-bookmark',
      //           items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
      //         }
      //       ]
      //     },
      //     {
      //       label: 'Submenu 2',
      //       icon: 'pi pi-fw pi-bookmark',
      //       items: [
      //         {
      //           label: 'Submenu 2.1',
      //           icon: 'pi pi-fw pi-bookmark',
      //           items: [
      //             { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
      //             { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
      //           ]
      //         },
      //         {
      //           label: 'Submenu 2.2',
      //           icon: 'pi pi-fw pi-bookmark',
      //           items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
      //         }
      //       ]
      //     }
      //   ]
      // }
    ];
  }
}
