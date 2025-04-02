import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, Component } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { AuthorDto, TagDto } from 'src/app/core/models';

@Injectable()
export class EditPageService {
  private http = inject(HttpClient);

  authors = signal<AuthorDto[]>([]);
  tags = signal<TagDto[]>([]);
  availableComponents = signal<Component[]>([]);
  saving = signal(false);
  publishing = signal(false);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Load authors, tags, and components
  }

  savePage(pageData: any): Observable<any> {
    this.saving.set(true);
    return this.http.post('/api/pages/save', pageData).pipe(finalize(() => this.saving.set(false)));
  }

  publishPage(pageId: string): Observable<any> {
    this.publishing.set(true);
    return this.http.put(`/api/pages/publish/${pageId}`, {}).pipe(finalize(() => this.publishing.set(false)));
  }
}
