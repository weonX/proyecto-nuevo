import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login-success-modal',
  templateUrl: './login-success-modal.component.html',
  styleUrls: ['./login-success-modal.component.scss'],
})
export class LoginSuccessModalComponent {
  constructor(private modalController: ModalController) {}

  // Método para cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }
}
