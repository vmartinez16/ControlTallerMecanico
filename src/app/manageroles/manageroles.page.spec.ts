import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerolesPage } from './manageroles.page';

describe('ManagerolesPage', () => {
  let component: ManagerolesPage;
  let fixture: ComponentFixture<ManagerolesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
