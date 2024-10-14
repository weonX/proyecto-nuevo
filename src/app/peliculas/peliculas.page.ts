import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PeliculasService } from '../services/peliculas.service'; // Importar el servicio

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.page.html',
  styleUrls: ['./peliculas.page.scss'],
})
export class PeliculasPage implements OnInit {
  pelicula: any;
  esFavorito: boolean = false; // Verifica si es favorito

  constructor(private route: ActivatedRoute, private router: Router, private peliculasService: PeliculasService) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation && navigation.extras && navigation.extras.state) {
      const state = navigation.extras.state as { pelicula: any };
      if (state.pelicula) {
        this.pelicula = state.pelicula;
        this.esFavorito = await this.verificarFavorito(this.pelicula);
      }
    }

    if (!this.pelicula) {
      this.pelicula = {
        titulo: 'Sin título',
        genero: 'Desconocido',
        descripcion: 'Sin descripción',
        imagen: 'assets/inception.jpg'
      };
    }
  }

  // Verificar si la película está en favoritos
  async verificarFavorito(pelicula: any): Promise<boolean> {
    const favoritos = await this.peliculasService.getFavoritos();
    return favoritos.some(fav => fav.id === pelicula.id);
  }

  // Agregar o eliminar de favoritos
  async alternarFavorito() {
    if (this.esFavorito) {
      await this.peliculasService.eliminarDeFavoritos(this.pelicula);
    } else {
      await this.peliculasService.addPeliculaAFavoritos(this.pelicula);
    }
    this.esFavorito = !this.esFavorito; // Cambia el estado
  }

  // Función para redirigir al home
  volverAlHome() {
    this.router.navigate(['/home']);
  }
}
