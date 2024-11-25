import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private apiUrl = 'http://192.168.18.157:3000/favoritos'; // Asegúrate de que esta sea la URL correcta

  constructor(private http: HttpClient) { }

  // Eliminar un favorito desde el backend (API REST)
  eliminarFavorito(id: number): Observable<any> {
    console.log('Eliminando favorito con ID:', id);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error en la eliminación del favorito:', error);
        return throwError(error); // Devolver el error para que sea manejado en el componente
      })
    );
  }

  // Actualizar un favorito en el backend (API REST)
  actualizarFavorito(id: number, favorito: any): Observable<any> {
    console.log('Actualizando favorito con ID:', id);
    console.log('Datos de la película:', favorito);
    return this.http.put(`${this.apiUrl}/${id}`, favorito).pipe(
      catchError((error) => {
        console.error('Error en la actualización del favorito:', error);
        return throwError(error); // Devolver el error para que sea manejado en el componente
      })
    );
  }

  // Agregar un nuevo favorito
  agregarFavorito(favorito: any): Observable<any> {
    console.log('Agregando favorito:', favorito);
    if (!favorito.id) {
      favorito.id = new Date().getTime();  // Generar un ID basado en el tiempo
    }
    return this.http.post(this.apiUrl, favorito).pipe(
      catchError((error) => {
        console.error('Error al agregar favorito:', error);
        return throwError(error);
      })
    );
  }
}
