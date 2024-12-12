import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  fotoPerfil: string | null = null;

  constructor(
    private storage: Storage,
    private router: Router,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create();
    const isLoggedIn = await this.storage.get('isLoggedIn');
    if (isLoggedIn) {
      this.fotoPerfil = await this.storage.get('fotoPerfil');
    }
  }

  async cerrarSesion() {
    await this.storage.remove('isLoggedIn');
    await this.storage.remove('email');
    await this.menuCtrl.close();
    this.router.navigate(['/login']);
  }

  async navigateToHome() {
    await this.menuCtrl.close();
    this.router.navigate(['/home']);
  }

  async navigateToFavoritos() {
    await this.menuCtrl.close();
    this.router.navigate(['/favoritos']);
  }

  async navigateToPerfil() {
    await this.menuCtrl.close();
    this.router.navigate(['/perfil']);
  }
}
