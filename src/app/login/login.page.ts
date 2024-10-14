import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Servicio de autenticación
import { LoginSuccessModalComponent } from './login-success-modal.component'; // Modal opcional

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = ''; // Variable para almacenar el correo electrónico ingresado
  password: string = ''; // Variable para almacenar la contraseña ingresada

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService, // Servicio de autenticación
    private modalController: ModalController
  ) {}

  // Método para manejar el inicio de sesión
  async login() {
    const isAuthenticated = await this.authService.login(this.email, this.password);

    if (isAuthenticated) {
      // Si el inicio de sesión es exitoso, mostramos el modal de éxito (opcional)
      await this.presentModal();

      // Pasar el nombre de usuario (email en este caso) a la página de inicio
      const navigationExtras: NavigationExtras = {
        state: {
          username: this.email
        }
      };

      // Redirigir a la página de inicio con el nombre de usuario
      this.router.navigate(['/home'], navigationExtras);
    } else {
      // Si el inicio de sesión falla, mostramos una alerta de error
      await this.presentAlert('Error', 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  }

  // Método para mostrar una alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header, 
      message, 
      buttons: ['OK'],
    });
    await alert.present(); 
  }

  // Método para mostrar el modal de éxito al iniciar sesión (opcional)
  async presentModal() {
    const modal = await this.modalController.create({
      component: LoginSuccessModalComponent, 
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  // Método para navegar a la página de registro
  navigateToRegistro() {
    this.router.navigate(['/registro']);
  }

  // Método para navegar a la página de restablecimiento de contraseña
  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
