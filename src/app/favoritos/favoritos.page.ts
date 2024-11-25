import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FavoritosService } from '../services/favoritos.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = [];
  stars: number[] = [1, 2, 3, 4, 5];  // Definimos el array stars aquí

  constructor(
    private storage: Storage,
    private router: Router,
    private alertController: AlertController,
    private favoritosService: FavoritosService,
    private cdRef: ChangeDetectorRef  
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.favoritos = (await this.storage.get('favoritos')) || [];
  }

  async ionViewWillEnter() {
    this.favoritos = (await this.storage.get('favoritos')) || [];
  }

  async eliminarFavorito(pelicula: any) {
    console.log('Eliminando favorito con ID:', pelicula.id);

    this.favoritosService.eliminarFavorito(pelicula.id).subscribe(
      async () => {
        this.favoritos = this.favoritos.filter(f => f.id !== pelicula.id);
        await this.storage.set('favoritos', this.favoritos);

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Película eliminada de favoritos',
          buttons: ['OK']
        });
        await alert.present();
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error al eliminar el favorito:', error);
        alert('Hubo un problema al eliminar la película de favoritos.');
      }
    );
  }

  async guardarCalificacion(pelicula: any) {
    const peliculaActualizada = {
      id: pelicula.id,
      titulo: pelicula.titulo,
      genero: pelicula.genero,
      descripcion: pelicula.descripcion,
      imagen: pelicula.imagen,
      calificacion: pelicula.calificacion,
      nota: pelicula.nota
    };

    this.favoritosService.actualizarFavorito(pelicula.id, peliculaActualizada).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Calificación y nota guardadas correctamente',
          buttons: ['OK']
        });
        await alert.present();
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error al guardar la calificación y nota:', error);
        alert('Hubo un problema al guardar la calificación y nota.');
      }
    );
  }

  cambiarCalificacion(pelicula: any, calificacion: number) {
    pelicula.calificacion = calificacion;
  }

  cambiarNota(pelicula: any, nota: string) {
    pelicula.nota = nota;
  }
}
