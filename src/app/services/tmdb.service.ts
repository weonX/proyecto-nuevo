import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  private apiKey = '8931871dde36da93a3e1eb5cf632c4a2';  // Sustituye con tu clave de API de TMDb
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  // Obtener películas populares
  getPopularMovies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES`);
  }

  // Obtener todos los géneros
  getGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}&language=es-ES`);
  }

  // Obtener detalles de una película
  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}&language=es-ES`);
  }
}
