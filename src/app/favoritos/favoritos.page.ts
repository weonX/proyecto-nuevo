import { Component, OnInit } from '@angular/core';
import { FavoritosService } from '../services/favoritos.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = []; // Lista de favoritos

  constructor(
    private favoritosService: FavoritosService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarFavoritos();
  }

  // ✅ Cargar los favoritos del usuario actual
  cargarFavoritos() {
    this.favoritosService.getFavoritos().subscribe(favoritos => {
      // Evitar duplicados de favoritos
      this.favoritos = favoritos.filter((fav, index, self) => 
        index === self.findIndex((f) => f.id === fav.id)
      );
      console.log('Favoritos cargados:', this.favoritos);
    }, error => {
      console.error('Error al cargar los favoritos:', error);
    });
  }

  // ✅ Eliminar un favorito de Firebase y de la lista local
  async eliminarFavorito(favoritoId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar este favorito?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          handler: () => {
            this.favoritosService.deleteFavorito(favoritoId).subscribe(() => {
              this.favoritos = this.favoritos.filter(fav => fav.id !== favoritoId);
              console.log(`Favorito con ID ${favoritoId} eliminado correctamente`);
            }, error => {
              console.error('Error al eliminar el favorito:', error);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // ✅ Calificar un favorito de 1 a 5 estrellas
  calificarFavorito(favoritoId: string, calificacion: number) {
    this.favoritosService.updateFavorito(favoritoId, { calificacion }).subscribe(() => {
      const favorito = this.favoritos.find(fav => fav.id === favoritoId);
      if (favorito) favorito.calificacion = calificacion;
      console.log(`Calificación de la película con id ${favoritoId} guardada: ${calificacion}`);
    }, error => {
      console.error('Error al calificar el favorito:', error);
    });
  }
}
