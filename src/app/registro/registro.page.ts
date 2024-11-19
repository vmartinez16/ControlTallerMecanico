import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nuevoUsuario = {
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
  };

  constructor(private modalController: ModalController) {}

  registrarUsuario() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push(this.nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    this.cerrarModal();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }
}

