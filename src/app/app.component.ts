import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private menuCtrl: MenuController
  ) {}

  async navegarAInicio() {
    await this.router.navigate(['/home']);
    this.menuCtrl.close();
  }

  async navegarAFavoritos() {
    await this.router.navigate(['/favoritos']);
    this.menuCtrl.close();
  }

  async navegarAPerfil() {
    await this.router.navigate(['/perfil']);
    this.menuCtrl.close();
  }

  async cerrarSesion() {
    await this.authService.logout();
    await this.router.navigate(['/login']);
    this.menuCtrl.close();
  }
}