import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { HttpResourceRef } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from 'src/app/core/services';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'bcms-pages-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule
  ],
  providers: [PageService],
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent {
  private pageService = inject(PageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  cols!: Column[];

  deletePageSignal: WritableSignal<HttpResourceRef<any> | null> = signal<HttpResourceRef<any> | null>(null);
  pages = this.pageService.pages;

  constructor() {
    effect(() => {
      if (this.deletePageSignal()?.hasValue && !this.deletePageSignal()?.isLoading()) {
        this.pages.reload();
      }
    });
  }

  deletePage(pageId: number) {
    const deletedPage = this.pageService.deletePage(pageId);
    this.deletePageSignal.set(deletedPage);
  }

  ngOnInit() {}

  selectedPages!: any[] | null;

  deleteSelectedPages() {}

  openNew() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editPage(pageId: number) {
    this.router.navigate([pageId, 'edit'], { relativeTo: this.route });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
