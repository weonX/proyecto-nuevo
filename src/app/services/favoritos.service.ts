import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private apiUrl = 'http://192.168.18.157:3000/favoritos'; // URL para interactuar con json-server

  constructor(private http: HttpClient) { }

  // Obtener todos los favoritos del servidor
  getFavoritos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Agregar un nuevo favorito al servidor
  agregarFavorito(favorito: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, favorito);
  }

  // Eliminar un favorito del servidor
  eliminarFavorito(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
