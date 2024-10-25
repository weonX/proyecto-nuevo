import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = [];

  constructor(
    private storage: Storage,
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.favoritos = (await this.storage.get('favoritos')) || [];
  }

  async ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.favoritos = (await this.storage.get('favoritos')) || [];
  }

  eliminarFavorito(pelicula: any) {
    this.favoritos = this.favoritos.filter(fav => fav.id !== pelicula.id);
    this.storage.set('favoritos', this.favoritos);
  }

  async editarFavorito(pelicula: any) {
    const alert = await this.alertController.create({
      header: 'Editar favorito',
      inputs: [
        {
          name: 'nota',
          type: 'text',
          placeholder: 'Agregar una nota personal',
          value: pelicula.nota || ''
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
            pelicula.nota = data.nota;
            this.storage.set('favoritos', this.favoritos);
          }
        }
      ]
    });

    await alert.present();
  }

  guardarEdicion(pelicula: any) {
    pelicula.editing = false;
    this.storage.set('favoritos', this.favoritos);
  }

  habilitarEdicion(pelicula: any) {
    pelicula.editing = true;
  }

  irAHome() {
    this.router.navigate(['/home']);
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}