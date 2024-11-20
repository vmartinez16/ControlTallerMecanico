import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ModalController, 
  AlertController, 
  ToastController 
} from '@ionic/angular';

// Interfaces
interface Vehicle {
  id?: string;
  brand: string;
  model: string;
  engine: string;
  color: string;
}

interface Client {
  id: string;
  name: string;
  contact: string;
  vehicles: Vehicle[];
  serviceHistory?: ServiceRecord[];
}

interface ServiceRecord {
  date: Date;
  description: string;
  cost: number;
  vehicleId: string;
}

@Component({
  selector: 'app-clients',
  templateUrl: 'clients.page.html',
  styleUrls: ['clients.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClientsPage implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Cargar clientes (aquí implementarías la lógica de obtener de un servicio/storage)
    this.loadClients();
  }

  loadClients() {
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      this.clients = JSON.parse(storedClients);
    } else {
      this.clients = []; // Inicializar si no hay datos
    }
    this.filteredClients = [...this.clients];
  }

  searchClient(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm) || 
      client.contact.toLowerCase().includes(searchTerm)
    );
  }

  async openClientModal(client?: Client) {
    const modal = await this.modalController.create({
      component: ClientDetailsModalComponent,
      componentProps: {
        client: client ? { ...client } : {
          id: this.generateUniqueId(),
          name: '',
          contact: '',
          vehicles: []
        }
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.saveClient(result.data);
      }
    });

    await modal.present();
  }

  saveClient(client: Client) {
    const index = this.clients.findIndex(c => c.id === client.id);
    if (index !== -1) {
      // Editar cliente existente
      this.clients[index] = client;
    } else {
      // Nuevo cliente
      this.clients.push(client);
    }
    this.updateLocalStorage();
    this.filteredClients = [...this.clients];
    this.presentToast('Cliente guardado correctamente');
  }

  deleteClient(clientId: string) {
    this.clients = this.clients.filter(c => c.id !== clientId);
    this.updateLocalStorage();
    this.filteredClients = [...this.clients];
    this.presentToast('Cliente eliminado');
  }

  async viewClientDetails(client: Client) {
    const modal = await this.modalController.create({
      component: ClientDetailsModalComponent,
      componentProps: {
        client: { ...client },
        viewMode: true
      }
    });

    await modal.present();
  }

  async addVehicleToClient(client: Client) {
    const modal = await this.modalController.create({
      component: VehicleDetailsModalComponent,
      componentProps: { client }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const updatedClient = { ...client };
        updatedClient.vehicles.push({
          ...result.data,
          id: this.generateUniqueId()
        });
        this.saveClient(updatedClient);
      }
    });
  
    await modal.present();
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  // Actualizar Local Storage
updateLocalStorage() {
  localStorage.setItem('clients', JSON.stringify(this.clients));
}
}

// Modal para detalles del cliente (sin cambios)
@Component({
  selector: 'app-client-details-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ viewMode ? 'Detalles del Cliente' : (client?.id ? 'Editar Cliente' : 'Nuevo Cliente') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">Nombre</ion-label>
        <ion-input 
          [(ngModel)]="client.name" 
          [readonly]="viewMode"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Contacto</ion-label>
        <ion-input 
          [(ngModel)]="client.contact" 
          [readonly]="viewMode"
        ></ion-input>
      </ion-item>
      
      <h3 *ngIf="client.vehicles && client.vehicles.length > 0">Vehículos</h3>
      <ion-list>
        <ion-item *ngFor="let vehicle of client.vehicles">
          <ion-label>
            {{ vehicle.brand }} {{ vehicle.model }} - {{ vehicle.color }}
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-button 
        *ngIf="!viewMode" 
        expand="block" 
        (click)="save()"
      >
        Guardar Cliente
      </ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClientDetailsModalComponent {
  client: Client = {
    id: '',
    name: '',
    contact: '',
    vehicles: []
  };
  viewMode = false;

  constructor(private modalController: ModalController) {}

  save() {
    this.modalController.dismiss(this.client);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

// Modal para detalles de vehículos (sin cambios)
@Component({
  selector: 'app-vehicle-details-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Agregar Vehículo</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">Marca</ion-label>
        <ion-input [(ngModel)]="vehicle.brand"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Modelo</ion-label>
        <ion-input [(ngModel)]="vehicle.model"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Motor</ion-label>
        <ion-input [(ngModel)]="vehicle.engine"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Color</ion-label>
        <ion-input [(ngModel)]="vehicle.color"></ion-input>
      </ion-item>
      
      <ion-button expand="block" (click)="save()">
        Guardar Vehículo
      </ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VehicleDetailsModalComponent {
  vehicle: Vehicle = {
    brand: '',
    model: '',
    engine: '',
    color: ''
  };

  constructor(private modalController: ModalController) {}

  save() {
    this.modalController.dismiss(this.vehicle);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}