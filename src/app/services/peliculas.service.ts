import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private apiUrl = 'http://localhost:3000/peliculas'; // URL de la API

  constructor(private http: HttpClient) {}

  // Obtener la lista de películas
  getPeliculas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Agregar una nueva película
  addPelicula(pelicula: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pelicula);
  }

  // Eliminar una película por ID
  deletePelicula(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
