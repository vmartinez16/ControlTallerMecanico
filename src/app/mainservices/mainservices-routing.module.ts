import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainservicesPage } from './mainservices.page';

const routes: Routes = [
  {
    path: '',
    component: MainservicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainservicesPageRoutingModule {}
