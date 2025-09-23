import { Component, inject, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { IEstadoSolicitud, ISolicitud } from '../../../model/solicitud.interface';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { HeaderComponent } from '../../../../header/components/header-component/header-component';

@Component({
  selector: 'app-solicitudes-listado',
  imports: [
    CommonModule, // para el pag
    FormsModule, //para el pag
    PaginationModule,
    ReactiveFormsModule,
    HeaderComponent
],
  templateUrl: './solicitudes-listado.html',
  styleUrl: './solicitudes-listado.css'
})
export class SolicitudesListado implements OnInit {

  private solicitudesService = inject(SolicitudesService);
  private toastr = inject(ToastrService); // Toast
  private router = inject(Router); //Para navegar entre componentes

  public solicitudesLista: ISolicitud[] = [];
  public solicitudesListaPaginados: ISolicitud[] = []; //pag
  public estadoLista: IEstadoSolicitud[] = [];

  public totalItems = 0;
  public paginaItems = 10;
  public currentPage = 4;

  private fb = inject(FormBuilder);
  public frmBusqueda: FormGroup = this.fb.group({});

  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  ngOnInit(): void {

    this.getEstadoSolicitud();
    this.getAll();
    this.createFormBuequda();
  }

  getAll() {
    this.solicitudesService.getAll().subscribe({
      next: (res) => {

        console.log("estadoLista: " + this.estadoLista.length);

        this.toastr.info(
          `${res.length} registros listados`,
          'Info'
        );

        this.solicitudesLista = res;
        console.log(res);

        this.totalItems = this.solicitudesLista.length; //pag
        this.solicitudesListaPaginados = this.solicitudesLista.slice(0, this.paginaItems); //pag

        this.solicitudesListaPaginados.forEach(item => {
          item.estadoNombre = this.estadoLista.find(estado => estado.id === item.estado)?.descripcion || 'Desconocido';
        });

      },
      error: (err) => {

        console.log(err);

        this.toastr.error(
          'Error al consultar solicitudes de soporte',
          'Error'
        );

      },
    });
  }

  nuevo() {
    this.router.navigate(['solicitudes/registro']);
  }

  modificar(solicitud: ISolicitud) {
    console.log(solicitud);
    console.log('solicitud =>' + JSON.stringify(solicitud));
    this.router.navigate(['solicitudes/registro', solicitud.id]);
  }

  confirmarEliminar(solicitud: ISolicitud) {

    console.log(solicitud)

    Swal.fire({
      title: '¿Eliminar la solicitud?',
      html: `<strong>${solicitud.titulo}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-danger ml-2',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        //---
        this.solicitudesService.delete(solicitud.id).subscribe({
          next: (res) => {
            this.toastr.success(
              'Exito al eliminar el centro médico' + solicitud.titulo,
              'Aviso'
            );
          },
          error: (err) => {
            this.toastr.error(
              'Error al registrar al consultar centros médicos',
              'Error'
            );
          },
        });

        //---
      }
    });
  }


  //pag
  pageChanged(event: PageChangedEvent): void {
    //this.currentPage = event.page;
    const startItem = (event.page - 1) * this.paginaItems;
    const endItem = event.page * this.paginaItems;
    this.solicitudesListaPaginados = this.solicitudesLista.slice(startItem, endItem);
  }

  //
  getEstadoSolicitud() {
    this.solicitudesService.getEstadoSolicitud().subscribe({
      next: (res) => {
        this.estadoLista = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  createFormBuequda() {
    this.frmBusqueda = this.fb.group({
      titulo: ['']
    });
  }

  get fcm(): { [key: string]: AbstractControl } {
    return this.frmBusqueda.controls;
  }


  buscar() {

    const titulo = this.fcm['titulo'].value;
    console.log('titulo =>' + titulo);

    this.solicitudesService.findByLikeTitulo(titulo).subscribe({
      next: (res) => {

        this.solicitudesLista = res;
        console.log(res);

        this.totalItems = this.solicitudesLista.length; //pag
        this.solicitudesListaPaginados = this.solicitudesLista.slice(0, this.paginaItems); //pag


      },
      error: (err) => {

        console.log(err);

      },
    });

  }



}
