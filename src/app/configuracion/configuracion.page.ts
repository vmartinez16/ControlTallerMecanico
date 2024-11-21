import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage{
  mostrarCRUDServicios = false;
  servicios: { nombre: string; precio: number }[] = [];
  nuevoServicio = { nombre: '', precio: 0 };

  constructor() {
    this.cargarServicios();
  }

  // Cargar servicios almacenados
  cargarServicios() {
    const serviciosGuardados = localStorage.getItem('servicios');
    this.servicios = serviciosGuardados ? JSON.parse(serviciosGuardados) : [];
  }

  // Abrir modal para CRUD de servicios
  abrirCRUDServicios() {
    this.mostrarCRUDServicios = true;
  }

  cerrarModalServicios() {
    this.mostrarCRUDServicios = false;
  }

  // Agregar nuevo servicio
  agregarServicio() {
    if (this.nuevoServicio.nombre && this.nuevoServicio.precio > 0) {
      this.servicios.push({ ...this.nuevoServicio });
      localStorage.setItem('servicios', JSON.stringify(this.servicios));
      this.nuevoServicio = { nombre: '', precio: 0 };
    }
  }

  // Eliminar servicio
  eliminarServicio(servicio: { nombre: string; precio: number }) {
    this.servicios = this.servicios.filter((s) => s !== servicio);
    localStorage.setItem('servicios', JSON.stringify(this.servicios));
  }

  // Ajustar impuestos y descuentos
  ajustarImpuestosDescuentos() {
    alert('Abrir lógica para ajustes de impuestos y descuentos');
  }

  // Personalizar nota de venta
  personalizarNota() {
    alert('Abrir lógica para personalización de nota con nombre y logo');
  }

  // Gestión de roles de usuarios
  gestionarRoles() {
    alert('Abrir lógica para gestión de roles y permisos');
  }
}