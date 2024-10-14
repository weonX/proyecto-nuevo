import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login-success-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Inicio de sesión exitoso</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>Has iniciado sesión correctamente.</p>
      <ion-button expand="block" (click)="dismissModal()">Cerrar</ion-button>
    </ion-content>
  `
})
export class LoginSuccessModalComponent {
  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
