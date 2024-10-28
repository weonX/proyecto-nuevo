import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { Storage } from '@ionic/storage-angular'; // Importa Storage para manejar el estado de la sesión
import { MenuController } from '@ionic/angular'; // Importa MenuController para cerrar el menú

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  fotoPerfil: string | null = null; // Propiedad para almacenar la URL de la foto de perfil

  constructor(
    private storage: Storage,
    private router: Router,
    private menuCtrl: MenuController // Inyecta MenuController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create(); // Inicializa el almacenamiento

    // Verificar si el usuario está autenticado
    const isLoggedIn = await this.storage.get('isLoggedIn');
    if (isLoggedIn) {
      this.fotoPerfil = await this.storage.get('fotoPerfil'); // Carga la foto desde el almacenamiento solo si el usuario está autenticado
    }
  }

  // Función para cerrar la sesión del usuario
  async cerrarSesion() {
    await this.storage.remove('isLoggedIn'); // Elimina el estado de sesión
    await this.storage.remove('email'); // Elimina el email almacenado
    await this.menuCtrl.close(); // Cierra el menú
    this.router.navigate(['/login']); // Redirige al usuario al login
    console.log('Sesión cerrada');
  }

  // Función para navegar a la página de inicio
  async navigateToHome() {
    await this.menuCtrl.close(); // Cierra el menú
    this.router.navigate(['/home']); // Navega a la página de inicio
  }

  // Función para navegar a la página de favoritos
  async navigateToFavoritos() {
    await this.menuCtrl.close(); // Cierra el menú
    this.router.navigate(['/favoritos']); // Navega a la página de favoritos
  }

  // Función para navegar a la página de perfil
  async navigateToPerfil() {
    await this.menuCtrl.close(); // Cierra el menú
    this.router.navigate(['/perfil']); // Navega a la página de perfil
  }
}
