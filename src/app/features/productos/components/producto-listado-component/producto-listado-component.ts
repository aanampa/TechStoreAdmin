import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProductoModel } from '../../models/producto.interface';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/components/header-component/header-component';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-producto-listado-component',
  imports: [
    CommonModule, // para el pag
    FormsModule, //para el pag
    PaginationModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './producto-listado-component.html',
  styleUrl: './producto-listado-component.css'
})
export class ProductoListadoComponent implements OnInit {

  private productoService = inject(ProductoService);
  private toastr = inject(ToastrService); // Toast
  private router = inject(Router); //Para navegar entre componentes

  public productosLista: ProductoModel[] = [];
  public productosListaPaginados: ProductoModel[] = []; //pag

  public totalItems = 0;
  public paginaItems = 10;
  public currentPage = 1;

  private fb = inject(FormBuilder);
  public frmBusqueda: FormGroup = this.fb.group({});

  public imagenUrl = `${environment.API_BASE}/api/Upload/imagen`;

  ngOnInit(): void {
    // Lógica de inicialización del componente
    this.getAll();
    this.createFormBusqueda();

  }

  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  getAll() {
    this.productoService.getAll().subscribe({
      next: (res) => {

        console.log(res);

        this.toastr.info(
          `${res.length} registros listados`,
          'Info'
        );

        this.productosLista = res;
        console.log(res);

        this.totalItems = this.productosLista.length; //pag
        this.productosListaPaginados = this.productosLista.slice(0, this.paginaItems); //pag

      },
      error: (err) => {

        console.log(err);

        this.toastr.error(
          'Error al consultar productos',
          'Error'
        );

      },
    });
  }

  buscar() {


    const textoBusqueda = this.fcm['nombre'].value;
    console.log('textoBusqueda =>' + textoBusqueda);

    this.productoService.findByLikeTitulo(textoBusqueda).subscribe({
      next: (res) => {

        this.productosLista = res;
        console.log(res);

        this.totalItems = this.productosLista.length; //pag
        this.productosListaPaginados = this.productosLista.slice(0, this.paginaItems); //pag


      },
      error: (err) => {

        console.log(err);

      },
    });

  }

  nuevo() {
    this.router.navigate(['productos/registro']);
  }

  modificar(producto: ProductoModel) {
    console.log('solicitud =>' + JSON.stringify(producto));
    this.router.navigate(['productos/registro', producto.id]);
  }

  confirmarEliminar(producto: ProductoModel) {

    Swal.fire({
      title: '¿Eliminar producto?',
      html: `<strong>${producto.nombre}</strong>`,
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
        this.productoService.delete(producto.id).subscribe({
          next: (res) => {

            this.toastr.success(
              'Exito al eliminar el producto' + producto.nombre,
              'Aviso'
            );

            //this.router.navigate(['productos']);
            this.getAll();

          },
          error: (err) => {
            this.toastr.error(
              'Error al registrar al eliminar el producto',
              'Error'
            );
          },
        });

        //---
      }
    });

  }


  createFormBusqueda() {
    this.frmBusqueda = this.fb.group({
      nombre: ['']
    });
  }

  get fcm(): { [key: string]: AbstractControl } {
    return this.frmBusqueda.controls;
  }


  //pag
  pageChanged(event: PageChangedEvent): void {
    //this.currentPage = event.page;
    const startItem = (event.page - 1) * this.paginaItems;
    const endItem = event.page * this.paginaItems;
    this.productosListaPaginados = this.productosLista.slice(startItem, endItem);
  }

}
