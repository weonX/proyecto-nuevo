import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';
  apiUrl: string = 'https://tu-api.com/api/reset-password'; // URL de la API para restablecer la contraseña

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private http: HttpClient // Inyectar HttpClient para hacer la petición
  ) {}

  async resetPassword() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.presentAlert('Error', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }

    // Hacer la solicitud a la API para restablecer la contraseña
    this.http.post(this.apiUrl, { email: this.email }).pipe(
      catchError(err => {
        // Verificar y manejar el error
        console.error('Error en la API:', err); // Mostrar el error en consola para depurar

        // Mostrar mensaje de error específico si lo devuelve la API
        let errorMessage = 'Hubo un problema al enviar el enlace de restablecimiento. Intenta nuevamente.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message; // Mostrar el mensaje de error devuelto por la API
        }

        this.presentAlert('Error', errorMessage);
        return throwError(err); // Manejar el error
      })
    ).subscribe(async (response) => {
      console.log('Respuesta de la API:', response); // Mostrar la respuesta en consola

      // Mostrar alerta de éxito si el enlace fue enviado correctamente
      await this.presentAlert('Éxito', 'Se ha enviado un enlace de restablecimiento a tu correo electrónico.');
      this.router.navigate(['/login']); // Redirigir a la página de login
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
