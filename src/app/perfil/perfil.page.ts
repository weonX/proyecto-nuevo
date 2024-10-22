import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CameraService } from '../services/camera.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  async takePicture() {
    const photo = await this.cameraService.takePicture();
    if (photo) {
      this.profilePhotoUrl = photo;
    }
  }
}