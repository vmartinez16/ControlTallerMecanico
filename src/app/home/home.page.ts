import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class HomePage {
  constructor(private router: Router) {}

  navigateToClients() {
    this.router.navigate(['/clients']);
  }

  navigateToInventory() {
    this.router.navigate(['/inventory']);
  }

  navigateToSettings() {
    this.router.navigate(['/configuracion']);
  }
  navigateToSales() {
    this.router.navigate(['/sales']);
  }
  navigateToReports() {
    this.router.navigate(['/reports']);
  }
}