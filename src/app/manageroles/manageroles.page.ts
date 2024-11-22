import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manageroles',
  templateUrl: './manageroles.page.html',
  styleUrls: ['./manageroles.page.scss'],
})
export class ManagerolesPage implements OnInit {
  usuarios: any[] = []; // Array para almacenar los usuarios desde localStorage
  isModalOpen = false; // Estado del modal
  usuarioSeleccionado: any = null; // Usuario actualmente seleccionado para editar

  constructor() {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    const storedUsers = localStorage.getItem('usuarios');
    this.usuarios = storedUsers ? JSON.parse(storedUsers) : [];
  }

  editarUsuario(user: any, index: number) {
    this.usuarioSeleccionado = { ...user, index }; // Clonamos para no modificar directamente
    this.isModalOpen = true; // Abre el modal
  }

  guardarCambios() {
    if (this.usuarioSeleccionado) {
      const index = this.usuarioSeleccionado.index;
      this.usuarios[index].rol = this.usuarioSeleccionado.rol; // Actualiza el rol
      this.guardarUsuarios();
      this.cerrarModal();
      alert('Cambios guardados correctamente');
    }
  }

  eliminarUsuario(index: number) {
    const confirmacion = confirm(`¿Estás seguro de eliminar a ${this.usuarios[index].nombre}?`);
    if (confirmacion) {
      this.usuarios.splice(index, 1);
      this.guardarUsuarios();
      alert('Usuario eliminado con éxito');
    }
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.usuarioSeleccionado = null;
  }

  guardarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }
}
