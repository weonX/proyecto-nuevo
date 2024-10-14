import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.page.html',
  styleUrls: ['./peliculas.page.scss'],
})
export class PeliculasPage implements OnInit {
  pelicula: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation && navigation.extras && navigation.extras.state) {
      const state = navigation.extras.state as { pelicula: any };
      if (state.pelicula) {
        this.pelicula = state.pelicula;
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

  // Función para redirigir al home
  volverAlHome() {
    this.router.navigate(['/home']);
  }
}
