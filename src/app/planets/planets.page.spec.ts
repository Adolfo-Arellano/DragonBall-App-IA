import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetsPage } from './planets.page';

describe('PlanetsPage', () => {
  let component: PlanetsPage;
  let fixture: ComponentFixture<PlanetsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
