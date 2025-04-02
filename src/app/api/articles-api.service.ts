import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Ottieni tutti i post
  getPosts(): Observable<any> {
    return this.http.get(`${this.API_URL}/posts`);
  }

  // Aggiungi un nuovo post
  addPost(post: any): Observable<any> {
    return this.http.post(`${this.API_URL}/posts`, post);
  }

  // Modifica un post
  updatePost(post: any): Observable<any> {
    return this.http.put(`${this.API_URL}/posts/${post.id}`, post);
  }

  // Elimina un post
  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/posts/${id}`);
  }
}
