import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://192.168.18.157:3000/usuarios'; // URL para interactuar con json-server

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios del servidor
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Agregar un nuevo usuario al servidor
  agregarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  // Verificar si un usuario existe (por email)
  verificarUsuario(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`);
  }
}
