import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Servicio de autenticación

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombre: string = '';
  email: string = '';
  contrasena: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService // Agregar el servicio de autenticación
  ) {}

  // Método para manejar el registro de un nuevo usuario
  async registrar() {
    if (this.nombre && this.email && this.contrasena) {
      if (this.validarContrasena(this.contrasena) && this.validarEmail(this.email)) {
        // Intentar registrar al usuario
        const isRegistered = await this.authService.register(this.email, this.contrasena);

        if (isRegistered) {
          const alert = await this.alertController.create({
            header: 'Registro Exitoso',
            message: 'Tu cuenta ha sido creada correctamente.',
            buttons: ['OK']
          });

          await alert.present();
          this.router.navigate(['/login']); // Redirigir al login
        } else {
          // Si el usuario ya existe
          this.mostrarAlerta('Error', 'Este correo ya está registrado.');
        }
      } else {
        this.mostrarAlerta('Error', 'Por favor, verifica que la contraseña y el email sean válidos.');
      }
    } else {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
    }
  }

  validarContrasena(contrasena: string): boolean {
    const regex = /^(?=.*\d{4})(?=.*[a-z]{3})(?=.*[A-Z]).{8,}$/;
    return regex.test(contrasena);
  }

  validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  volverALogin() {
    this.router.navigate(['/login']);
  }
}
