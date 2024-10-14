import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // Ionic Storage para persistencia

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa el almacenamiento de Ionic
  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

  // Método para registrar un nuevo usuario
  async register(email: string, password: string): Promise<boolean> {
    let users = (await this.storage.get('users')) || [];

    // Verificar si el usuario ya existe
    const userExists = users.some((user: any) => user.email === email);
    if (userExists) {
      return false;
    }

    // Agregar el nuevo usuario al arreglo
    users.push({ email, password });
    await this.storage.set('users', users);
    return true;
  }

  // Método para validar el login con email y contraseña
  async login(email: string, password: string): Promise<boolean> {
    let users = (await this.storage.get('users')) || [];
    const userExists = users.find(
      (user: any) => user.email === email && user.password === password
    );

    if (userExists) {
      await this.setUserSession(email); // Guarda sesión
      return true;
    }
    return false;
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
}
