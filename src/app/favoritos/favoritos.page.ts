import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = [];

  constructor(private storage: Storage, private router: Router) {}

  async ngOnInit() {
    await this.storage.create();
  }

  // Este método se ejecuta cada vez que la página de favoritos es visitada
  ionViewWillEnter() {
    this.cargarFavoritos();
  }

  // Método para cargar favoritos desde el almacenamiento
  async cargarFavoritos() {
    this.favoritos = (await this.storage.get('favoritos')) || [];
  }

  async eliminarFavorito(pelicula: any) {
    this.favoritos = this.favoritos.filter(fav => fav.titulo !== pelicula.titulo);
    await this.storage.set('favoritos', this.favoritos);
    this.cargarFavoritos(); // Actualiza la lista de favoritos después de eliminar
    alert('Película eliminada de favoritos.');
  }

  irAHome() {
    this.router.navigate(['/home']); 
  }

  cerrarSesion() {
    this.storage.remove('isLoggedIn'); 
    this.router.navigate(['/login']); 
  }
}
