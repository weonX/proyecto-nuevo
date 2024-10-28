import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  profilePhotoUrl: string | null = null;

  constructor(
    private menuCtrl: MenuController,
    private cameraService: CameraService
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async takePicture() {
    const photo = await this.cameraService.takePicture();
    if (photo) {
      this.profilePhotoUrl = photo;
    }
  }
}