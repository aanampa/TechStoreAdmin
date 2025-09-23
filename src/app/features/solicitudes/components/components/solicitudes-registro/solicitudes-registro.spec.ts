import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesRegistro } from './solicitudes-registro';

describe('SolicitudesRegistro', () => {
  let component: SolicitudesRegistro;
  let fixture: ComponentFixture<SolicitudesRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
