import { inject, Injectable, Injector } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { PageListItem, PageDto } from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private readonly baseUrl = 'http://localhost:3000/pages';
  injector = inject(Injector);
  pages = httpResource<PageListItem[]>(this.baseUrl);

  getPage(id: number): HttpResourceRef<PageDto | undefined> {
    return httpResource<PageDto>(
      {
        url: `${this.baseUrl}/${id}`,
        method: 'GET'
      },
      {
        injector: this.injector
      }
    );
  }

  createPage(page: PageDto): HttpResourceRef<PageDto | undefined> {
    return httpResource<PageDto>(
      {
        url: `${this.baseUrl}`,
        method: 'POST',
        body: page
      },
      {
        injector: this.injector
      }
    );
  }

  updatePage(page: PageDto): HttpResourceRef<PageDto | undefined> {
    return httpResource<PageDto>(
      {
        url: `${this.baseUrl}/${page.id}`,
        method: 'PUT',
        body: page
      },
      {
        injector: this.injector
      }
    );
  }

  deletePage(id: number): HttpResourceRef<any> {
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
