import { Component, AfterViewInit, OnInit } from '@angular/core';
import { IonicModule, AnimationController } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { PeliculasService } from '../services/peliculas.service'; 
import { Storage } from '@ionic/storage-angular'; 
import { HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, MatCardModule, CommonModule, HttpClientModule],
})
export class HomePage implements AfterViewInit, OnInit {
  iniciado: boolean = false;
  peliculas: any[] = [];
  favoritos: any[] = [];
  username: string = ''; // Variable para almacenar el nombre de usuario

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private authService: AuthService,
    private peliculasService: PeliculasService, 
    private storage: Storage 
  ) {}

  async ngOnInit() {
    await this.storage.create(); 
    this.favoritos = (await this.storage.get('favoritos')) || [];

    // Obtener el nombre del usuario mediante NavigationExtras o Storage
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const state = navigation.extras.state as { username: string };
      this.username = state.username;
    } else {
      // Si no hay un nombre de usuario en NavigationExtras, cargarlo del Storage
      this.username = await this.storage.get('email') || 'Usuario'; // Cargar desde el Storage
    }

    // Cargar las películas
    this.peliculasService.getPeliculas().subscribe((data) => {
      this.peliculas = data;
    });
  }

  async cerrarSesion() {
    await this.authService.logout(); 
    this.iniciado = false;
    this.router.navigate(['/login']); 
  }

  comenzar() {
    this.iniciado = true;
  }

  // Agregar una película a favoritos
  async agregarAFavoritos(pelicula: any) {
    // Recargar favoritos desde el storage para asegurarse de que están actualizados
    this.favoritos = (await this.storage.get('favoritos')) || [];
    const existe = this.favoritos.some(fav => fav.id === pelicula.id);

    if (!existe) {
      this.favoritos.push(pelicula);
      await this.storage.set('favoritos', this.favoritos);
      alert('Película agregada a favoritos.');
    } else {
      alert('Esta película ya está en tus favoritos.');
    }
  }

  // Eliminar una película de favoritos
  async eliminarFavorito(pelicula: any) {
    this.favoritos = this.favoritos.filter(fav => fav.id !== pelicula.id); 
    await this.storage.set('favoritos', this.favoritos); 
    alert('Película eliminada de favoritos.');
  }

  irAPeliculas(pelicula: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        pelicula: pelicula
      }
    };
    this.router.navigate(['/peliculas'], navigationExtras);
  }

  irAFavoritos() {
    this.router.navigate(['/favoritos']);
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
