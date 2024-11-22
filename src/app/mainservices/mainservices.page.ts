// mainservices.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceModalComponent } from '../service-modal/service-modal/service-modal.component';


interface Material {
  id: string;
  quantity: number;
  name: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  materials: Material[];
}

@Component({
  selector: 'app-mainservices',
  templateUrl: './mainservices.page.html',
  styleUrls: ['./mainservices.page.scss'],
})
export class MainservicesPage implements OnInit {
  services: Service[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    const storedServices = localStorage.getItem('servicios');
    if (storedServices) {
      this.services = JSON.parse(storedServices);
    }
  }

  async openServiceModal(service?: Service) {
    const modal = await this.modalController.create({
      component: ServiceModalComponent,
      componentProps: {
        service: service ? { ...service } : undefined
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (service) {
          // Editar servicio existente
          const index = this.services.findIndex(s => s.id === service.id);
          this.services[index] = result.data;
        } else {
          // Agregar nuevo servicio
          this.services.push({
            ...result.data,
            id: Date.now().toString()
          });
        }
        localStorage.setItem('servicios', JSON.stringify(this.services));
        this.loadServices();
      }
    });

    return await modal.present();
  }

  deleteService(service: Service) {
    this.services = this.services.filter(s => s.id !== service.id);
    localStorage.setItem('servicios', JSON.stringify(this.services));
  }
}