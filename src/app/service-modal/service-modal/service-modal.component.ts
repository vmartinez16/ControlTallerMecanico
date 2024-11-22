// service-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
})
export class ServiceModalComponent implements OnInit {
  @Input() service: any;
  serviceForm: FormGroup;
  inventory: any[] = [];

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      materials: this.fb.array([])
    });
  }

  ngOnInit() {
    // Cargar inventario
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
      this.inventory = JSON.parse(storedInventory);
    }

    // Si es edición, cargar datos del servicio
    if (this.service) {
      this.serviceForm.patchValue({
        name: this.service.name,
        price: this.service.price
      });
      
      this.service.materials.forEach((material: any) => {
        this.addMaterial(material);
      });
    }
  }

  get materials() {
    return this.serviceForm.get('materials') as FormArray;
  }

  addMaterial(material?: any) {
    const materialForm = this.fb.group({
      id: [material?.id || '', Validators.required],
      quantity: [material?.quantity || '', [Validators.required, Validators.min(1)]],
      name: [material?.name || '']
    });

    this.materials.push(materialForm);
  }

  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      this.modalController.dismiss(this.serviceForm.value);
    }
  }
}