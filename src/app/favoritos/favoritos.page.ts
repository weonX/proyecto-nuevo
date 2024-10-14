import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.storage.create(); // Inicializar el almacenamiento
    this.favoritos = (await this.storage.get('favoritos')) || []; // Cargar favoritos
  }

  // Cargar los favoritos cada vez que la página se activa
  async ionViewWillEnter() {
    this.favoritos = (await this.storage.get('favoritos')) || []; // Cargar favoritos actualizados
  }

  eliminarFavorito(pelicula: any) {
    this.favoritos = this.favoritos.filter(fav => fav.titulo !== pelicula.titulo);
    this.storage.set('favoritos', this.favoritos); // Actualiza favoritos en almacenamiento
  }

  async editarFavorito(pelicula: any) {
    const alert = await this.alertController.create({
      header: 'Editar favorito',
      inputs: [
        {
          name: 'nota',
          type: 'text',
          placeholder: 'Agregar una nota personal',
          value: pelicula.nota || '' // Mostramos la nota actual si existe
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            pelicula.nota = data.nota; // Actualizamos la nota
            this.storage.set('favoritos', this.favoritos); // Guardamos los cambios en el almacenamiento
          }
        }
      ]
    });

    await alert.present();
  }

  guardarEdicion(pelicula: any) {
    pelicula.editing = false; // Desactivar el modo de edición
    this.storage.set('favoritos', this.favoritos); // Actualizar el almacenamiento con los cambios
  }

  habilitarEdicion(pelicula: any) {
    pelicula.editing = true; // Activar el modo de edición
  }

  irAHome() {
    this.router.navigate(['/home']); // Navega a la página de inicio
  }

  cerrarSesion() {
    this.storage.remove('isLoggedIn'); // Cierra sesión
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}
