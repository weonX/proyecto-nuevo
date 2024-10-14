import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // Ionic Storage para persistencia

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: any[] = [
    {
      email: 'usuario@example.com',
      password: 'Password1234', // Ejemplo de usuario registrado
    }
  ];

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa el almacenamiento de Ionic
  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

  // Comprueba si un usuario ya existe en el sistema
  checkUserExists(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  // Método para validar el login con email y contraseña
  async login(email: string, password: string): Promise<boolean> {
    // Expresión regular para validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Expresión regular para validar la contraseña:
    const passwordRegex = /^(?=.*\d{4})(?=.*[a-z]{3})(?=.*[A-Z]).{8,}$/;

    // Valida si el email y la contraseña cumplen con los requisitos
    const isValidEmail = emailRegex.test(email);
    const isValidPassword = passwordRegex.test(password);

    if (!isValidEmail || !isValidPassword) {
      return false; // Retorna false si el formato de email o contraseña es incorrecto
    }

    // Comprobamos si las credenciales coinciden con un usuario registrado
    const userExists = this.users.find(user => user.email === email && user.password === password);
    if (userExists) {
      await this.setUserSession(email); // Llamada asíncrona a setUserSession
      return true; // Autenticación exitosa
    }

    return false; // Usuario o contraseña incorrectos
  }

  // Guarda la sesión del usuario en Ionic Storage
  async setUserSession(email: string): Promise<void> {
    await this.storage.set('isLoggedIn', true); // Guarda el estado de autenticación
    await this.storage.set('email', email);     // Guarda el email del usuario autenticado
  }

  // Verifica si el usuario está autenticado (para AuthGuard)
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
