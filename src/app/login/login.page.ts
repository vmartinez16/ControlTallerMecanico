// login.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { RegistroPage } from '../registro/registro.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  correo = '';
  contrasena = '';
  recordar = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.cargarCredenciales();
  }

  cargarCredenciales() {
    const credenciales = localStorage.getItem('credenciales');
    if (credenciales) {
      const { correo, contrasena } = JSON.parse(credenciales);
      this.correo = correo;
      this.contrasena = contrasena;
      this.recordar = true;
    }
  }

  async iniciarSesion() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioValido = usuarios.find(
      (user: any) => user.correo === this.correo && user.contrasena === this.contrasena
    );

    if (usuarioValido) {
      if (this.recordar) {
        localStorage.setItem('credenciales', JSON.stringify({ correo: this.correo, contrasena: this.contrasena }));
      } else {
        localStorage.removeItem('credenciales');
      }

      localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));

      this.router.navigate(['/home']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o contraseña incorrectos',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async abrirRegistro() {
    const modal = await this.modalController.create({
      component: RegistroPage,
    });
    return await modal.present();
  }
}
