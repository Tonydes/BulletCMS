import { Component, inject, signal, AfterViewInit, WritableSignal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { HttpResourceRef } from '@angular/common/http';
import { ArticleService, Article } from 'src/app/core/services';

@Component({
  selector: 'bcms-edit-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, EditorModule, ToastModule],
  providers: [MessageService, ArticleService],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements AfterViewInit {
  private articleService = inject(ArticleService);
  private fb = inject(FormBuilder);
  private toast = inject(MessageService);
  private route = inject(ActivatedRoute);

  get articleId(): number {
    return +this.route.snapshot.params['id'];
  }

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  isLoading = signal(false);

  articleSignal: WritableSignal<HttpResourceRef<any> | null> = signal<HttpResourceRef<any> | null>(null);

  constructor() {
    effect(() => {
      if (this.articleSignal()?.hasValue && !this.articleSignal()?.isLoading()) {
        console.log(this.articleSignal()?.value());
        this.form.patchValue(this.articleSignal()?.value()!);
        this.isLoading.set(false);
      }
    });
  }

  ngAfterViewInit() {
    if (this.articleId) {
      this.loadArticle();
    }
  }

  private loadArticle() {
    this.isLoading.set(true);
    const article = this.articleService.getArticle(this.articleId);
    this.articleSignal.set(article);
  }

  saveArticle() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    let articleData: Article = this.form.value;

    try {
      if (this.articleId) {
        articleData = { ...articleData, id: this.articleId };
        this.articleService.updateArticle(articleData);
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Article updated' });
      } else {
        this.articleService.createArticle(articleData);
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Article created' });
      }
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save article' });
    } finally {
      this.isLoading.set(false);
    }
  }
}
