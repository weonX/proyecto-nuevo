import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = ''; 
  password: string = ''; 

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  // Método para manejar el inicio de sesión
  async login() {
    if (!this.email || !this.password) {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      const navigationExtras: NavigationExtras = {
        state: { username: this.email }
      };
      this.mostrarAlerta('Éxito', 'Inicio de sesión exitoso.');
      this.router.navigate(['/home'], navigationExtras);
    } catch (error: any) {
      this.mostrarAlerta('Error', this.obtenerMensajeDeError(error));
      console.error('Error al iniciar sesión:', error);
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header, 
      message, 
      buttons: ['OK'],
    });
    await alert.present(); 
  }

  obtenerMensajeDeError(error: any): string {
    if (error.code === 'auth/wrong-password') {
      return 'La contraseña es incorrecta.';
    } else if (error.code === 'auth/user-not-found') {
      return 'No se encontró una cuenta con este correo.';
    } else if (error.code === 'auth/invalid-email') {
      return 'El formato de correo no es válido.';
    } else {
      return 'Ocurrió un error desconocido. Inténtalo de nuevo.';
    }
  }

  navigateToRegistro() {
    this.router.navigate(['/registro']);
  }

  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
