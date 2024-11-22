import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainservicesPage } from './mainservices.page';

describe('MainservicesPage', () => {
  let component: MainservicesPage;
  let fixture: ComponentFixture<MainservicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MainservicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
