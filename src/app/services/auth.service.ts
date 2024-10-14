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
    let users = await this.storage.get('users') || []; // Obtener usuarios existentes o un arreglo vacío

    // Verificar si el usuario ya existe
    const userExists = users.some((user: any) => user.email === email);
    if (userExists) {
      return false; // El usuario ya está registrado
    }

    // Agregar el nuevo usuario al arreglo
    users.push({ email, password });
    await this.storage.set('users', users); // Guardar los usuarios actualizados en el almacenamiento

    return true; // Registro exitoso
  }

  // Método para validar el login con email y contraseña
  async login(email: string, password: string): Promise<boolean> {
    let users = await this.storage.get('users') || []; // Obtener la lista de usuarios desde el almacenamiento

    // Comprobamos si las credenciales coinciden con un usuario registrado
    const userExists = users.find((user: any) => user.email === email && user.password === password);
    if (userExists) {
      await this.setUserSession(email); // Iniciar la sesión del usuario
      return true; // Autenticación exitosa
    }

    return false; // Usuario o contraseña incorrectos
  }

  // Guarda la sesión del usuario en Ionic Storage
  async setUserSession(email: string): Promise<void> {
    await this.storage.set('isLoggedIn', true); // Guarda el estado de autenticación
    await this.storage.set('email', email);     // Guarda el email del usuario autenticado
  }

  // Verifica si el usuario está autenticado
  async isLoggedIn(): Promise<boolean> {
    const loggedIn = await this.storage.get('isLoggedIn');
    return loggedIn === true;
  }

  // Cierra la sesión del usuario
  async logout(): Promise<void> {
    await this.storage.remove('isLoggedIn'); // Elimina el estado de autenticación
    await this.storage.remove('email');      // Elimina el email almacenado
  }

  // Obtiene el email del usuario actualmente autenticado
  async getUserEmail(): Promise<string | null> {
    return await this.storage.get('email');
  }
}
