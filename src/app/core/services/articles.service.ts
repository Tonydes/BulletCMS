import { inject, Injectable, Injector } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';

export interface Article {
  id?: number;
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly baseUrl = 'http://localhost:3000/posts';
  injector = inject(Injector);
  articles = httpResource<Article[]>(this.baseUrl);

  getArticle(id: number): HttpResourceRef<Article | undefined> {
    return httpResource<Article>(
      {
        url: `${this.baseUrl}/${id}`,
        method: 'GET'
      },
      {
        injector: this.injector
      }
    );
  }

  createArticle(article: Article): HttpResourceRef<Article | undefined> {
    return httpResource<Article>(
      {
        url: `${this.baseUrl}`,
        method: 'POST',
        body: article
      },
      {
        injector: this.injector
      }
    );
  }

  updateArticle(article: Article): HttpResourceRef<Article | undefined> {
    return httpResource<Article>(
      {
        url: `${this.baseUrl}/${article.id}`,
        method: 'PUT',
        body: article
      },
      {
        injector: this.injector
      }
    );
  }

  deleteArticle(id: number): HttpResourceRef<any> {
    return httpResource<any>(
      {
        url: `${this.baseUrl}/${id}`,
        method: 'DELETE',
        body: {}
      },
      {
        injector: this.injector
      }
    );
  }
}
