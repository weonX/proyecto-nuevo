import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    // Llamamos al método de autenticación en el servicio AuthService
    const isAuthenticated = await this.authService.login(this.email, this.password);

    if (isAuthenticated) {
      // Si el inicio de sesión es exitoso, mostramos el modal de éxito (opcional)
      await this.presentModal(); // Muestra un modal opcional de éxito (puedes omitir esto si prefieres)
      
      // Después de mostrar el modal, redirigimos al usuario a la página de inicio
      this.router.navigate(['/home']);
    } else {
      // Si el inicio de sesión falla, mostramos una alerta de error
      await this.presentAlert('Error', 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  }

  // Método para navegar a la página de registro
  navigateToRegistro() {
    this.router.navigate(['/registro']);
  }

  // Método para navegar a la página de restablecimiento de contraseña
  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  // Método para mostrar una alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header, // Título de la alerta
      message, // Mensaje de la alerta
      buttons: ['OK'], // Botón de confirmación
    });
    await alert.present(); // Presenta la alerta en la pantalla
  }

  // Método para mostrar el modal de éxito al iniciar sesión
  async presentModal() {
    const modal = await this.modalController.create({
      component: LoginSuccessModalComponent, // Especifica el componente del modal
      cssClass: 'my-custom-class', // Clase CSS opcional para estilizar el modal
    });
    return await modal.present(); // Muestra el modal
  }
}
