import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // Ionic Storage para persistencia
import { HttpClient } from '@angular/common/http'; // Necesario para las solicitudes HTTP
import { Observable } from 'rxjs'; // Necesario para trabajar con observables
import { catchError } from 'rxjs/operators'; // Para capturar errores en las solicitudes HTTP

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://192.168.18.157:3000/usuarios'; // URL para interactuar con json-server

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  // Inicializa el almacenamiento de Ionic
  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

  // Método para registrar un nuevo usuario
  async register(email: string, password: string): Promise<boolean> {
    try {
      let users = await this.getUsuarios(); // Obtenemos los usuarios de json-server

      // Verificar si el usuario ya existe
      const userExists = users.some((user: any) => user.email === email);
      if (userExists) {
        return false;
      }

      // Crear el nuevo usuario
      const nuevoUsuario = { email, password };
      
      // Guardamos el nuevo usuario en json-server
      await this.http.post(this.apiUrl, nuevoUsuario).toPromise(); 

      // También guardamos el usuario en el almacenamiento local
      users.push(nuevoUsuario);
      await this.storage.set('users', users);

      return true;
    } catch (error) {
      this.handleServerError(error); // Manejamos el error si no se puede conectar al servidor
      return false;
    }
  }

  // Obtener todos los usuarios desde json-server
  async getUsuarios(): Promise<any[]> {
    try {
      const users = await this.http.get<any[]>(this.apiUrl).toPromise();
      return users || [];
    } catch (error) {
      this.handleServerError(error); // Manejamos el error si no se puede conectar al servidor
      return [];
    }
  }

  // Método para validar el login con email y contraseña
  async login(email: string, password: string): Promise<boolean> {
    try {
      let users = await this.getUsuarios(); // Obtenemos los usuarios de json-server

      const userExists = users.find(
        (user: any) => user.email === email && user.password === password
      );

      if (userExists) {
        await this.setUserSession(email); // Guarda sesión
        return true;
      }
      return false;
    } catch (error) {
      this.handleServerError(error); // Manejamos el error si no se puede conectar al servidor
      return false;
    }
  }

  // Guarda la sesión del usuario en Ionic Storage
  async setUserSession(email: string): Promise<void> {
    await this.storage.set('isLoggedIn', true);
    await this.storage.set('email', email);
  }

  // Verifica si el usuario está autenticado
  async isLoggedIn(): Promise<boolean> {
    const loggedIn = await this.storage.get('isLoggedIn');
    return loggedIn === true;
  }

  // Cierra la sesión del usuario
  async logout(): Promise<void> {
    await this.storage.remove('isLoggedIn');
    await this.storage.remove('email');
  }

  // Obtiene el email del usuario actualmente autenticado
  async getUserEmail(): Promise<string | null> {
    return await this.storage.get('email');
  }

  // Manejo de errores cuando no hay conexión al servidor
  private handleServerError(error: any) {
    alert(
      'Disculpe, tenemos problemas técnicos. Si persiste, contacte a moviesupport@gmail.com.'
    );
    console.error('Error en la conexión con el servidor:', error);
  }
}
