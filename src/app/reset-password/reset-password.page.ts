import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  async resetPassword() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.presentAlert('Error', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }

    // Aquí iría la lógica para enviar un correo de restablecimiento.
    await this.presentAlert('Éxito', 'Se ha enviado un enlace de restablecimiento a tu correo electrónico.');
    this.router.navigate(['/login']);
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
