import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FavoritosService } from '../services/favoritos.service';  // Importa el servicio
import { ChangeDetectorRef } from '@angular/core'; // Importa ChangeDetectorRef

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = []; // Lista de favoritos

  constructor(
    private storage: Storage,
    private router: Router,
    private alertController: AlertController,
    private favoritosService: FavoritosService, // Inyecta el servicio
    private cdRef: ChangeDetectorRef  // Inyecta ChangeDetectorRef
  ) {}

  // Método que se ejecuta cuando el componente es inicializado
  async ngOnInit() {
    await this.storage.create();
    this.favoritos = (await this.storage.get('favoritos')) || []; // Cargar favoritos desde Storage
    this.syncFavoritosWithServer(); // Sincronizar con el servidor
  }

  // Cargar los favoritos cada vez que la página se activa
  async ionViewWillEnter() {
    this.favoritos = (await this.storage.get('favoritos')) || [];
    this.syncFavoritosWithServer(); // Sincroniza los favoritos con el servidor al cargar
  }

  // Sincronizar los favoritos con el servidor (json-server)
  async syncFavoritosWithServer() {
    try {
      const favoritosServidor = await this.favoritosService.getFavoritos().toPromise();
      console.log('Favoritos del servidor:', favoritosServidor);  // Verifica la respuesta del servidor

      if (favoritosServidor && Array.isArray(favoritosServidor)) {
        favoritosServidor.forEach(fav => {
          if (!this.favoritos.find(f => f.id === fav.id)) {
            this.favoritos.push(fav); // Agregar si no existe en los favoritos locales
          }
        });

        // Guardar los favoritos sincronizados en Storage
        await this.storage.set('favoritos', this.favoritos);
      } else {
        console.warn('La respuesta de favoritos del servidor es vacía o no válida');
      }
    } catch (error) {
      console.error('Error al sincronizar los favoritos con el servidor:', error);
    }
  }

  // Eliminar una película de favoritos
  async eliminarFavorito(pelicula: any) {
    // Eliminar de la base de datos local (SQLite)
    this.favoritos = this.favoritos.filter(fav => fav.id !== pelicula.id);
    await this.storage.set('favoritos', this.favoritos); // Actualiza favoritos en almacenamiento local

    // Eliminar de json-server
    this.favoritosService.eliminarFavorito(pelicula.id).subscribe(
      () => {
        alert('Película eliminada de favoritos.');
        this.cdRef.detectChanges();  // Forzar la actualización de la vista
      },
      (error) => {
        console.error('Error al eliminar el favorito:', error);
        alert('Hubo un problema al eliminar la película de favoritos.');
      }
    );
  }

  // Agregar una película a favoritos
  async agregarAFavoritos(pelicula: any) {
    const existe = this.favoritos.some(fav => fav.id === pelicula.id);
    if (!existe) {
      // Agregar al almacenamiento local (SQLite)
      this.favoritos.push(pelicula);
      await this.storage.set('favoritos', this.favoritos);

      // Agregar a json-server
      this.favoritosService.agregarFavorito(pelicula).subscribe(
        () => {
          alert('Película agregada a favoritos.');
          this.cdRef.detectChanges();  // Forzar la actualización de la vista
        },
        (error) => {
          console.error('Error al agregar el favorito:', error);
          alert('Hubo un problema al agregar la película a favoritos.');
        }
      );
    } else {
      alert('Esta película ya está en tus favoritos.');
    }
  }

  // Redirigir al home
  irAHome() {
    this.router.navigate(['/home']); // Navega a la página de inicio
  }

  // Cerrar sesión
  cerrarSesion() {
    this.storage.remove('isLoggedIn'); // Cierra sesión
    this.router.navigate(['/login']); // Redirige a la página de login
  }

  // Habilitar el modo de edición para una película
  habilitarEdicion(pelicula: any) {
    pelicula.editing = true; // Activar el modo de edición
  }

  // Guardar los cambios en la edición de una película
  guardarEdicion(pelicula: any) {
    pelicula.editing = false; // Desactivar el modo de edición
    this.storage.set('favoritos', this.favoritos); // Actualizar el almacenamiento con los cambios
    alert('Cambios guardados exitosamente.');
  }
}
