import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage {
  products: any[] = [];
  searchTerm: string = '';
  filteredProducts: any[] = [];

  constructor(
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.loadProducts();
  }

  // Load products from Local Storage
  loadProducts() {
    const storedProducts = localStorage.getItem('inventory');
    this.products = storedProducts 
      ? JSON.parse(storedProducts).map((product: any) => ({
          ...product,
          stock: Number(product.stock), // Convertir a número
        }))
      : [];
    this.filteredProducts = [...this.products];
    this.checkLowStockAlerts();
  }
  

  // Save products to Local Storage
  saveProducts() {
    localStorage.setItem('inventory', JSON.stringify(this.products));
    this.loadProducts();
  }

  // Search functionality
  searchProducts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.partNumber.toLowerCase().includes(term)
    );
  }

  // Add or Edit a Product
  async openAddProductModal(product: any = null) {
    const alert = await this.alertController.create({
      header: product ? 'Editar Producto' : 'Agregar Producto',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre del producto',
          value: product ? product.name : '',
        },
        {
          name: 'partNumber',
          type: 'text',
          placeholder: 'Número de pieza',
          value: product ? product.partNumber : '',
        },
        {
          name: 'stock',
          type: 'number',
          placeholder: 'Stock',
          value: product ? product.stock : 0,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (product) {
              product.name = data.name;
              product.partNumber = data.partNumber;
              product.stock = Number(data.stock); // Convertir a número
            } else {
              this.products.push({
                id: Date.now(),
                name: data.name,
                partNumber: data.partNumber,
                stock: Number(data.stock), // Convertir a número
                movements: [],
              });
            }
            this.saveProducts();
          },          
        },
      ],
    });
    await alert.present();
  }
  editProduct(product: any) {
    this.openAddProductModal(product);
  }
  

  // Delete Product
  deleteProduct(id: number) {
    this.products = this.products.filter((p) => p.id !== id);
    this.saveProducts();
  }

  // Check for low stock alerts
  checkLowStockAlerts() {
    this.products.forEach((product) => {
      if (product.stock < 5) {
        this.showLowStockAlert(product.name);
      }
    });
  }

  async showLowStockAlert(productName: string) {
    const alert = await this.alertController.create({
      header: 'Alerta de Stock Bajo',
      message: `El producto "${productName}" tiene un stock bajo.`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Record inventory movements (example function)
  recordMovement(product: any, type: string, quantity: number) {
    const movement = {
      type,
      quantity,
      date: new Date(),
    };
    product.movements.push(movement);
  
    if (type === 'Ingreso') {
      product.stock += Number(quantity); // Asegurar que quantity es un número
    } else if (type === 'Salida') {
      product.stock -= Number(quantity);
    }
  
    this.saveProducts();
  }
}  
