import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CameraService } from '../services/camera.service';
import { Storage } from '@ionic/storage-angular'; // Asegúrate de importar Storage

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  profilePhotoUrl: string | null = null;

  constructor(
    private menuCtrl: MenuController,
    private cameraService: CameraService,
    private storage: Storage // Inyecta Storage para manejar el almacenamiento
  ) {}

  async ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.profilePhotoUrl = await this.storage.get('fotoPerfil'); // Carga la foto almacenada
  }

  async takePicture() {
    const photo = await this.cameraService.takePicture();
    if (photo) {
      this.profilePhotoUrl = photo;
      await this.storage.set('fotoPerfil', photo); // Guarda la foto en el almacenamiento
    }
  }

  // Función para borrar la foto de perfil
  async borrarFoto() {
    this.profilePhotoUrl = null; // Elimina la referencia local
    await this.storage.remove('fotoPerfil'); // Elimina la foto del almacenamiento
  }
}
