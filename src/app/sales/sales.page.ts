import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';

interface SaleCalculation {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}
interface Material {
  id: string;
  partNumber: string;
  name: string;
  quantity: number;
}

interface Service {
  name: string;
  price: number;
  materials: Material[];
}

interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  stock: number;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {
  services: any[] = [];
  clients: any[] = [];
  selectedClient: any;
  selectedVehicle: any;
  selectedItems: Service[] = [];
  discount: number = 0;
  paymentMethod: string = '';
  additionalDetails: string = '';
  saleCalculation: SaleCalculation = {
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0
  };

  constructor() {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    const servicesData = localStorage.getItem('servicios');
    const clientsData = localStorage.getItem('clients');
    this.services = servicesData ? JSON.parse(servicesData) : [];
    this.clients = clientsData ? JSON.parse(clientsData) : [];
  }

  onClientChange() {
    // Resetear el vehículo seleccionado cuando cambia el cliente
    this.selectedVehicle = null;
    this.calcularTotal();
  }

  // Formatea la información del vehículo para mostrar
  formatVehicleInfo(vehicle: any): string {
    return `${vehicle.brand} ${vehicle.model} - ${vehicle.color} (${vehicle.engine})`;
  }

  onSelectionChange() {
    this.calcularTotal();
  }

  calcularTotal() {
    const subtotal = this.selectedItems.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = subtotal * (this.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * 0.16; // IVA 16%
    const total = afterDiscount + taxAmount;

    this.saleCalculation = {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  }

  finalizarVenta() {
    if (!this.selectedClient || !this.selectedVehicle || this.selectedItems.length === 0 || !this.paymentMethod) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
  
    // Reducir el inventario
    this.actualizarInventario();
  
    // Generar el ticket en PDF
    const doc = new jsPDF();
    const lineHeight = 10;
    let yPosition = 10;
  
    // Encabezado del ticket
    doc.setFontSize(16);
    doc.text('Nota de Venta', 10, yPosition);
    yPosition += lineHeight * 2;
  
    // Información del cliente y vehículo
    doc.setFontSize(12);
    doc.text(`Cliente: ${this.selectedClient.name}`, 10, yPosition);
    yPosition += lineHeight;
    doc.text(`Vehículo: ${this.formatVehicleInfo(this.selectedVehicle)}`, 10, yPosition);
    yPosition += lineHeight;
    doc.text(`Método de Pago: ${this.paymentMethod}`, 10, yPosition);
    yPosition += lineHeight;
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, yPosition);
    yPosition += lineHeight * 1.5;
  
    // Detalles de los servicios
    doc.text('Detalle de Servicios:', 10, yPosition);
    yPosition += lineHeight;
  
    this.selectedItems.forEach(item => {
      doc.text(`${item.name} - $${item.price.toFixed(2)}`, 20, yPosition);
      yPosition += lineHeight;
    });
    yPosition += lineHeight / 2;
  
    // Detalles adicionales
    if (this.additionalDetails) {
      doc.text('Detalles Adicionales:', 10, yPosition);
      yPosition += lineHeight;
      const splitText = doc.splitTextToSize(this.additionalDetails, 180);
      doc.text(splitText, 20, yPosition);
      yPosition += (splitText.length * lineHeight) + lineHeight;
    }
  
    // Resumen financiero
    doc.text(`Subtotal: $${this.saleCalculation.subtotal.toFixed(2)}`, 10, yPosition);
    yPosition += lineHeight;
    doc.text(`Descuento (${this.discount}%): $${this.saleCalculation.discountAmount.toFixed(2)}`, 10, yPosition);
    yPosition += lineHeight;
    doc.text(`IVA (16%): $${this.saleCalculation.taxAmount.toFixed(2)}`, 10, yPosition);
    yPosition += lineHeight;
  
    // Total final
    doc.setFontSize(14);
    doc.text(`Total: $${this.saleCalculation.total.toFixed(2)}`, 10, yPosition);
  
    // Guardar el PDF
    doc.save('nota-venta.pdf');
  
    // Registrar la venta
    this.guardarVenta();
  
    alert('Venta registrada, inventario actualizado y ticket generado.');
  
    // Limpiar formulario
    this.limpiarFormulario();
  }
  
  actualizarInventario() {
    // Obtener el inventario del localStorage
    const inventory: InventoryItem[] = JSON.parse(localStorage.getItem('inventory') || '[]');
  
    // Recorrer los servicios seleccionados
    this.selectedItems.forEach((service: Service) => {
      if (service.materials && service.materials.length > 0) {
        service.materials.forEach((material: Material) => {
          const inventoryItem = inventory.find((item: InventoryItem) => item.id === material.id);
  
          if (inventoryItem) {
            // Reducir el stock del inventario
            inventoryItem.stock -= material.quantity;
  
            // Validar que el stock no sea negativo
            if (inventoryItem.stock < 0) {
              alert(`El stock de ${inventoryItem.name} es insuficiente para completar esta venta.`);
              inventoryItem.stock = 0; // Prevenir valores negativos
            }
          } else {
            alert(`El material ${material.name} no existe en el inventario.`);
          }
        });
      }
    });
  
    // Guardar el inventario actualizado en localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }
  
  

  guardarVenta() {
    const venta = {
      fecha: new Date(),
      cliente: this.selectedClient,
      vehiculo: this.selectedVehicle,
      items: this.selectedItems,
      detalles: this.additionalDetails,
      descuento: this.discount,
      metodoPago: this.paymentMethod,
      calculos: this.saleCalculation
    };

    const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    ventas.push(venta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
  }
  
  limpiarFormulario() {
    this.selectedClient = null;
    this.selectedVehicle = null;
    this.selectedItems = [];
    this.discount = 0;
    this.paymentMethod = '';
    this.additionalDetails = '';
    this.saleCalculation = {
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      total: 0
    };
  }
}