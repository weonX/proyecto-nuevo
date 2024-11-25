import { Component, AfterViewInit, OnInit } from '@angular/core';
import { IonicModule, AnimationController, AlertController } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { PeliculasService } from '../services/peliculas.service'; 
import { Storage } from '@ionic/storage-angular'; 
import { HttpClientModule } from '@angular/common/http'; 
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; 
import { TmdbService } from '../services/tmdb.service'; 
import { Pelicula } from '../services/pelicula.interface'; 
import { FavoritosService } from '../services/favoritos.service'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, MatCardModule, CommonModule, HttpClientModule],
})
export class HomePage implements AfterViewInit, OnInit {
  iniciado: boolean = false;
  peliculas: Pelicula[] = []; 
  favoritos: Pelicula[] = []; 
  username: string = ''; 
  userLocation: string = ''; 
  userPhoto: string | null = null; 
  generos: { [id: number]: string } = {}; 

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private authService: AuthService,
    private peliculasService: PeliculasService, 
    private storage: Storage,
    private alertController: AlertController,
    private tmdbService: TmdbService, 
    private favoritosService: FavoritosService 
  ) {}

  async ngOnInit() {
    await this.storage.create(); 
    this.favoritos = (await this.storage.get('favoritos')) || [];

    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const state = navigation.extras.state as { username: string };
      this.username = state.username;
    } else {
      this.username = (await this.storage.get('email')) || 'Usuario';
    }

    this.tmdbService.getGenres().subscribe((data) => {
      this.generos = data.genres.reduce((acc: { [id: number]: string }, genre: any) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});

      this.tmdbService.getPopularMovies().subscribe((data) => {
        this.peliculas = data.results.map((pelicula: any) => ({
          id: pelicula.id,
          titulo: pelicula.title,
          descripcion: pelicula.overview,
          genero: pelicula.genre_ids.map((id: number) => this.generos[id] || 'Desconocido').join(', '),
          imagen: `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`,
          poster_path: pelicula.poster_path
        }));
      });
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

  async agregarAFavoritos(pelicula: Pelicula) {
    this.favoritos = (await this.storage.get('favoritos')) || [];

    const existe = this.favoritos.some(fav => fav.id === pelicula.id);

    if (!existe) {
      this.favoritos.push(pelicula);
      await this.storage.set('favoritos', this.favoritos);

      this.favoritosService.agregarFavorito(pelicula).subscribe(
        () => alert('Película agregada a favoritos.'),
        (error) => alert('Error al agregar la película a favoritos.')
      );
    } else {
      alert('Esta película ya está en tus favoritos.');
    }
  }

  async eliminarFavorito(pelicula: Pelicula) {
    this.favoritos = this.favoritos.filter(fav => fav.id !== pelicula.id); 
    await this.storage.set('favoritos', this.favoritos); 
    alert('Película eliminada de favoritos.');

    this.favoritosService.eliminarFavorito(pelicula.id).subscribe(
      () => alert('Película eliminada de favoritos en el servidor.'),
      (error) => alert('Error al eliminar la película de favoritos.')
    );
  }

  async guardarCalificacion(pelicula: Pelicula) {
    if (!pelicula.calificacion || !pelicula.nota) {
      alert('Por favor, ingresa una calificación y una nota.');
      return;
    }

    const peliculaActualizada = { ...pelicula, calificacion: pelicula.calificacion, nota: pelicula.nota };

    this.favoritosService.actualizarFavorito(pelicula.id, peliculaActualizada).subscribe(
      () => {
        alert('Calificación y nota guardadas.');
      },
      (error) => {
        console.error('Error al guardar la calificación y nota:', error);
        alert('Hubo un problema al guardar la calificación y nota.');
      }
    );
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
