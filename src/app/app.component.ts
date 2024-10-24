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

  constructor(
    private storage: Storage,
    private router: Router,
    private menuCtrl: MenuController // Inyecta MenuController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create(); // Inicializa el almacenamiento
  }

  // Función para cerrar la sesión del usuario
  async cerrarSesion() {
    await this.storage.remove('isLoggedIn'); // Elimina el estado de sesión
    await this.storage.remove('email');      // Elimina el email almacenado
    await this.menuCtrl.close();             // Cierra el menú
    this.router.navigate(['/login']);        // Redirige al usuario al login
  }

  // Función para navegar a la página de inicio
  async navigateToHome() {
    await this.menuCtrl.close();             // Cierra el menú
    this.router.navigate(['/home']);         // Navega a la página de inicio
  }

  // Función para navegar a la página de favoritos
  async navigateToFavoritos() {
    await this.menuCtrl.close();             // Cierra el menú
    this.router.navigate(['/favoritos']);    // Navega a la página de favoritos
  }
}
