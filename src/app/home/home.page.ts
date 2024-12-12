import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../services/peliculas.service'; 
import { FavoritosService } from '../services/favoritos.service'; 
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  peliculas: any[] = []; 
  favoritos: any[] = []; 

  constructor(
    private peliculasService: PeliculasService,
    private favoritosService: FavoritosService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.peliculasService.getPopularMovies().subscribe((data: any) => {
      this.peliculas = data.results.map((pelicula: any) => ({
        id: pelicula.id,
        titulo: pelicula.title, 
        descripcion: pelicula.overview, 
        imagen: `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
      }));
    }, (error: any) => {
      console.error('Error al cargar películas:', error);
    });
  }

  agregarAFavoritos(pelicula: any) {
    this.favoritosService.addFavorito(pelicula).subscribe(() => {
      this.mostrarAlerta('Éxito', 'Película agregada a favoritos.');
    }, (error: any) => {
      this.mostrarAlerta('Error', 'No se pudo agregar la película a favoritos.');
    });
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
