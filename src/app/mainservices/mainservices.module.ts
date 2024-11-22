import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainservicesPageRoutingModule } from './mainservices-routing.module';

import { MainservicesPage } from './mainservices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainservicesPageRoutingModule
  ],
  declarations: [MainservicesPage]
})
export class MainservicesPageModule {}
