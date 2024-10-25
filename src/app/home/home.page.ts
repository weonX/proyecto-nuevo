import { Component, AfterViewInit, OnInit } from '@angular/core';
import { IonicModule, AnimationController, AlertController } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PeliculasService } from '../services/peliculas.service';
import { Storage } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, MatCardModule, CommonModule, HttpClientModule],
})
export class HomePage implements AfterViewInit, OnInit {
  iniciado: boolean = false;
  peliculas: any[] = [];
  favoritos: any[] = [];
  username: string = '';

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private authService: AuthService,
    private peliculasService: PeliculasService,
    private storage: Storage,
    private alertController: AlertController
  ) {}

  ngAfterViewInit() {
    // Implementation of AfterViewInit
  }

  async ngOnInit() {
    await this.storage.create();
    this.favoritos = (await this.storage.get('favoritos')) || [];

    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const state = navigation.extras.state as { username: string };
      this.username = state.username;
    } else {
      this.username = (await this.storage.get('email')) || 'Usuario';
    }

    this.peliculasService.getPeliculas().subscribe((data) => {
      this.peliculas = data;
    });
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.iniciado = false;
    this.router.navigate(['/login']);
  }

  comenzar() {
    this.iniciado = true;
  }

  irAPeliculas(pelicula: any) {
    const navigationExtras: NavigationExtras = {
      state: { pelicula: pelicula }
    };
    this.router.navigate(['/peliculas'], navigationExtras);
  }

  async agregarAFavoritos(pelicula: any) {
    if (!this.favoritos.some(fav => fav.id === pelicula.id)) {
      this.favoritos.push(pelicula);
      await this.storage.set('favoritos', this.favoritos);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Película agregada a favoritos',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  irAHome() {
    this.router.navigate(['/home']);
  }
}