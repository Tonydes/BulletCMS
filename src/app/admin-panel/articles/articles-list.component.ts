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
import { ArticleService } from 'src/app/core/services';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'bcms-articles-list',
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
  providers: [ArticleService],
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesComponent {
  private articleService = inject(ArticleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  cols!: Column[];

  deleteArticleSignal: WritableSignal<HttpResourceRef<any> | null> = signal<HttpResourceRef<any> | null>(null);
  posts = this.articleService.articles;

  constructor() {
    effect(() => {
      if (this.deleteArticleSignal()?.hasValue && !this.deleteArticleSignal()?.isLoading()) {
        this.posts.reload();
      }
    });
  }

  deletePost(articleId: number) {
    const deletedArticle = this.articleService.deleteArticle(articleId);
    this.deleteArticleSignal.set(deletedArticle);
  }

  ngOnInit() {}

  selectedPosts!: any[] | null;

  deleteSelectedProducts() {}

  openNew() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editPost(postId: number) {
    this.router.navigate([postId, 'edit'], { relativeTo: this.route });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
