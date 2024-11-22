import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerolesPageRoutingModule } from './manageroles-routing.module';

import { ManagerolesPage } from './manageroles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerolesPageRoutingModule
  ],
  declarations: [ManagerolesPage]
})
export class ManagerolesPageModule {}
