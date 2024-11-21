import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {
  inventory: any[] = [];
  clients: any[] = [];
  selectedClient: any;
  selectedItems: any[] = [];
  discount: number = 0;
  paymentMethod: string = '';
  total: number = 0;

  constructor() {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar inventario y clientes desde localStorage
    const inventoryData = localStorage.getItem('inventory');
    const clientsData = localStorage.getItem('clients');
    this.inventory = inventoryData ? JSON.parse(inventoryData) : [];
    this.clients = clientsData ? JSON.parse(clientsData) : [];
  }

  calcularTotal() {
    let subtotal = this.selectedItems.reduce((sum, item) => sum + item.price, 0);
    const descuentoAplicado = (subtotal * (this.discount / 100));
    const impuestos = (subtotal - descuentoAplicado) * 0.16; // IVA 16%
    this.total = subtotal - descuentoAplicado + impuestos;
  }

  finalizarVenta() {
    if (!this.selectedClient || this.selectedItems.length === 0 || !this.paymentMethod) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.calcularTotal();

    // Generar el ticket en PDF
    const doc = new jsPDF();
    doc.text('Nota de Venta', 10, 10);
    doc.text(`Cliente: ${this.selectedClient.name}`, 10, 20);
    doc.text(`Método de Pago: ${this.paymentMethod}`, 10, 30);
    doc.text('Detalle:', 10, 40);
    let yPosition = 50;
    this.selectedItems.forEach(item => {
      doc.text(`${item.name} - $${item.price}`, 10, yPosition);
      yPosition += 10;
    });
    doc.text(`Subtotal: $${(this.total / 1.16).toFixed(2)}`, 10, yPosition + 10);
    doc.text(`Impuestos (16%): $${(this.total * 0.16).toFixed(2)}`, 10, yPosition + 20);
    doc.text(`Descuento: $${(this.discount).toFixed(2)}%`, 10, yPosition + 30);
    doc.text(`Total: $${this.total.toFixed(2)}`, 10, yPosition + 40);

    // Guardar PDF
    doc.save('nota-venta.pdf');

    alert('Venta registrada y ticket generado.');

    // Limpiar datos
    this.selectedClient = null;
    this.selectedItems = [];
    this.discount = 0;
    this.paymentMethod = '';
    this.total = 0;
  }
}
