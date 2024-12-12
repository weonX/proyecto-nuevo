import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombre: string = ''; // Variable para almacenar el nombre
  email: string = ''; // Variable para almacenar el email
  contrasena: string = ''; // Variable para almacenar la contraseña

  constructor(
    private router: Router, // Para la navegación
    private alertController: AlertController, // Para mostrar alertas
    private authService: AuthService // Servicio de autenticación
  ) {}

  // Método para registrar un nuevo usuario
  async registrar() {
    if (this.nombre && this.email && this.contrasena) {
      if (this.validarContrasena(this.contrasena) && this.validarEmail(this.email)) {
        try {
          await this.authService.register(this.email, this.contrasena);
          const alert = await this.alertController.create({
            header: 'Registro Exitoso',
            message: 'Tu cuenta ha sido creada correctamente.',
            buttons: ['OK']
          });

          await alert.present();
          this.router.navigate(['/login']); 
        } catch (error) {
          this.mostrarAlerta('Error', 'Este correo ya está registrado o no es válido.');
          console.error('Error al registrar usuario:', error);
        }
      } else {
        this.mostrarAlerta('Error', 'Por favor, verifica que la contraseña y el email sean válidos.');
      }
    } else {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
    }
  }

  // Validación de la contraseña para cumplir con ciertos requisitos
  validarContrasena(contrasena: string): boolean {
    const regex = /^(?=.*\d{4})(?=.*[a-z]{3})(?=.*[A-Z]).{8,}$/;
    return regex.test(contrasena);
  }

  // Validación del formato de email
  validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }

  // Método para mostrar una alerta personalizada
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  // ✅ Método para volver a la página de login
  volverALogin() {
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}
