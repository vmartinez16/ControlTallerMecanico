// reports.page.ts
import { Component, OnInit } from '@angular/core';
// Primero actualizamos las interfaces para que coincidan con tus datos
interface Material {
  id: number;
  quantity: number;
  name: string;
}

interface Item {
  name: string;
  price: number;
  materials: Material[];
}

interface Calculos {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

interface Cliente {
  id: string;
  name: string;
  contact: string;
}

interface Vehiculo {
  brand: string;
  model: string;
  engine: string;
  color: string;
  id: string;
}

interface Venta {
  fecha: string;
  calculos: Calculos;
  cliente: Cliente;
  descuento: number;
  detalles: string;
  items: Item[];
  metodoPago: string;
  vehiculo: Vehiculo;
}

interface ResumenMensual {
  totalVentas: number;
  numeroServicios: number;
  promedioVenta: number;
  totalClientes: number;
  serviciosPopulares: Array<{
    nombre: string;
    cantidad: number;
    total: number;
  }>;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  mesSeleccionado: number | null = null;
  mostrarModal = false;
  ventaSeleccionada: Venta | null = null;
  resumenMensual: ResumenMensual | null = null;

  constructor() {}

  ngOnInit() {
    try {
      const ventasStorage = localStorage.getItem('ventas');
      if (ventasStorage) {
        this.ventas = JSON.parse(ventasStorage);
        this.ventasFiltradas = this.ventas;
        this.generarResumen();
      }
    } catch (error) {
      console.error('Error al cargar las ventas:', error);
      this.ventas = [];
      this.ventasFiltradas = [];
    }
  }

  filtrarPorMes() {
    if (this.mesSeleccionado === null) {
      this.ventasFiltradas = this.ventas;
    } else {
      this.ventasFiltradas = this.ventas.filter(venta => {
        const fecha = new Date(venta.fecha);
        return fecha.getMonth() === this.mesSeleccionado;
      });
    }
    this.generarResumen();
  }

  generarResumen() {
    if (this.ventasFiltradas.length === 0) {
      this.resumenMensual = {
        totalVentas: 0,
        numeroServicios: 0,
        promedioVenta: 0,
        totalClientes: 0,
        serviciosPopulares: []
      };
      return;
    }

    // Calcular totales
    const totalVentas = this.ventasFiltradas.reduce((sum, venta) => sum + venta.calculos.total, 0);
    const numeroServicios = this.ventasFiltradas.reduce((sum, venta) => sum + venta.items.length, 0);
    
    // Calcular clientes únicos
    const clientesUnicos = new Set(this.ventasFiltradas.map(venta => venta.cliente.id));
    
    // Calcular servicios populares
    const serviciosMap = new Map<string, { cantidad: number; total: number }>();
    
    this.ventasFiltradas.forEach(venta => {
      venta.items.forEach(item => {
        const servicioActual = serviciosMap.get(item.name) || { cantidad: 0, total: 0 };
        serviciosMap.set(item.name, {
          cantidad: servicioActual.cantidad + 1,
          total: servicioActual.total + item.price
        });
      });
    });

    const serviciosPopulares = Array.from(serviciosMap.entries())
      .map(([nombre, stats]) => ({
        nombre,
        cantidad: stats.cantidad,
        total: stats.total
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5); // Top 5 servicios

    this.resumenMensual = {
      totalVentas,
      numeroServicios,
      promedioVenta: totalVentas / this.ventasFiltradas.length,
      totalClientes: clientesUnicos.size,
      serviciosPopulares
    };
  }

  mostrarDetalle(venta: Venta) {
    this.ventaSeleccionada = venta;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.ventaSeleccionada = null;
  }
}