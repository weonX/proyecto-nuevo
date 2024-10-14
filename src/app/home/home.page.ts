import { Component, AfterViewInit } from '@angular/core';
import { IonicModule, AnimationController } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, MatCardModule, CommonModule],
})
export class HomePage implements AfterViewInit {
  iniciado: boolean = false;
  peliculas = [
    {
      titulo: 'Inception',
      genero: 'Ciencia ficción / Acción',
      descripcion: 'Un ladrón con la rara habilidad de "extracción" roba secretos del subconsciente mientras la gente sueña.',
      imagen: 'assets/inception.jpg'
    },
    {
      titulo: 'The Shawshank Redemption',
      genero: 'Drama',
      descripcion: 'Dos hombres encarcelados forjan una amistad a lo largo de varios años, encontrando consuelo y redención a través de actos de decencia común.',
      imagen: 'assets/The Shawshank Redemption.jpg'
    }
  ];

  constructor(private router: Router, private animationCtrl: AnimationController, private authService: AuthService) {}

  // Método para cerrar la sesión
  async cerrarSesion() {
    await this.authService.logout(); // Cierra la sesión
    this.iniciado = false;
    this.router.navigate(['/login']); // Redirigir a la página de login
  }

  comenzar() {
    this.iniciado = true;
  }

  irAPeliculas(pelicula: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        pelicula: pelicula
      }
    };
    this.router.navigate(['/peliculas'], navigationExtras);
  }

  ngAfterViewInit() {
    const cards = document.querySelectorAll('.mat-card');
    cards.forEach((card) => {
      const animation = this.animationCtrl.create()
        .addElement(card)
        .duration(1000)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(50px)', 'translateY(0px)');
      animation.play();
    });
  }
}
