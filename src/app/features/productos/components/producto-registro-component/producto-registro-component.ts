import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/components/header-component/header-component';
import Swal from 'sweetalert2';
import { ProductoModel } from '../../models/producto.interface';

@Component({
  selector: 'app-producto-registro-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './producto-registro-component.html',
  styleUrl: './producto-registro-component.css'
})
export class ProductoRegistroComponent {

  private router = inject(Router); //Para navegar entre componentes
  private activatedRoute = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private toastr = inject(ToastrService); // Toast

  private fb = inject(FormBuilder);
  public frmRegistro: FormGroup = this.fb.group({});

  public idProducto: string = "";
  public archivoSeleccionado: File | null = null;
  public previewUrl: string | null = null;
  public isLoading: boolean = false;
  public imagenActual: string = "";

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {

    console.log(this.activatedRoute);

    this.activatedRoute.params.subscribe({
      next: params => {
        console.log(params);
        this.idProducto = params['id']
        console.log(this.idProducto);

        if (this.idProducto)
          this.getById(this.idProducto);

      }
    });

    this.createFormSolicitud();

  }

  //---
  getById(idProducto: string) {

    console.log("getById() => ");
    console.log("idProducto => " + idProducto);

    this.productoService.getById(idProducto).subscribe({

      next: (res) => {
        console.log(res);
        console.log("Exito en registro");

        this.fcm['id'].setValue(res.id);
        this.fcm['nombre'].setValue(res.nombre);
        this.fcm['descripcion'].setValue(res.descripcion);
        this.fcm['precio'].setValue(res.precio);
        this.fcm['categoria'].setValue(res.categoria);
        this.fcm['stock'].setValue(res.stock);
        this.fcm['activo'].setValue(res.activo);

        if (res.imagenUrl) {
          this.imagenActual = res.imagenUrl;
          this.previewUrl = res.imagenUrl;
        }

      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al recuperar registro del centro medico', 'Error');
      }

    })

  }

  //---

  grabar(event: Event) {

    event.preventDefault(); // Esto previene el refresh
    /*
    if (this.frmSolicitudRegistro.invalid) {
      console.log('frmSolicitudRegistro => invalid');
      return;
    }
    */
    const nombre = this.fcm['nombre'].value;
    const descripcion = this.fcm['descripcion'].value;
    const precio = this.fcm['precio'].value;
    const categoria = this.fcm['categoria'].value;
    const stock = this.fcm['stock'].value;
    const activo = this.fcm['activo'].value;
    //const imagenUrl = this.fcm['imagenUrl'].value;

    let msgerror = [];

    if (nombre == '') {
      msgerror.push("Ingrese nombre del producto");
    }

    if (descripcion == '') {
      msgerror.push("Ingrese descripción breve del producto");
    }

    if (msgerror.length > 0) {

      let shtml = "<div align='left'><ul>";
      msgerror.forEach(function (item, index) {
        shtml = shtml + "<li>" + item + "</li>";
      });

      shtml = shtml + "</ul></div>";

      Swal.fire({
        title: 'Advertencia',
        html: shtml,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-primary' // Clases de Bootstrap
        },
        buttonsStyling: false // Importante: deshabilitar estilos por defecto
      });

      return;
    }


    const productoModel: ProductoModel = {
      id: "",
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      categoria: categoria,
      stock: stock,
      activo: activo,
      imagenUrl: this.imagenActual
    }


    console.log('solicitud =>' + JSON.stringify(productoModel));


    if (!this.idProducto) {
      //Nuevo

      this.productoService.crearProductoConImagen(productoModel, this.archivoSeleccionado!).subscribe({
        next: res => {
          console.log(res);
          console.log("Exito en registro");

          if (res.id) {
            this.idProducto = res.id
          }

          this.toastr.info('Registro fue creado con existo', 'Info');

          this.router.navigate(['productos']);

        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Error al grabar nuevo producto', 'Error');
        }

      });


    }
    else {
      //Actualizar

      console.log(`Actualizar registro: ${this.idProducto}`);

      this.productoService.actualizarProductoConImagen(this.idProducto, productoModel, this.archivoSeleccionado!).subscribe({
        next: (res) => {
          console.log(res);
          console.log("Exito en registro");
          /*
          if (res.id) {
            this.idProducto = res.id
          }
          */
          this.toastr.info('Registro fue actualizado con existo', 'Info');

        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Error al actualizar producto', 'Error');
        },

      });
    }

  }

  grabar_v1(event: Event) {

    event.preventDefault(); // Esto previene el refresh
    /*
    if (this.frmSolicitudRegistro.invalid) {
      console.log('frmSolicitudRegistro => invalid');
      return;
    }
    */
    const nombre = this.fcm['nombre'].value;
    const descripcion = this.fcm['descripcion'].value;
    const precio = this.fcm['precio'].value;
    const categoria = this.fcm['categoria'].value;
    const stock = this.fcm['stock'].value;
    const activo = this.fcm['activo'].value;
    //const imagenUrl = this.fcm['imagenUrl'].value;

    let msgerror = [];

    if (nombre == '') {
      msgerror.push("Ingrese nombre del producto");
    }

    if (descripcion == '') {
      msgerror.push("Ingrese descripción breve del producto");
    }

    if (msgerror.length > 0) {

      let shtml = "<div align='left'><ul>";
      msgerror.forEach(function (item, index) {
        shtml = shtml + "<li>" + item + "</li>";
      });

      shtml = shtml + "</ul></div>";

      Swal.fire({
        title: 'Advertencia',
        html: shtml,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-primary' // Clases de Bootstrap
        },
        buttonsStyling: false // Importante: deshabilitar estilos por defecto
      });

      return;
    }


    const productoModel: ProductoModel = {
      id: "",
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      categoria: categoria,
      stock: stock,
      activo: activo,
      imagenUrl: this.imagenActual
    }


    console.log('solicitud =>' + JSON.stringify(productoModel));


    if (!this.idProducto) {
      //Nuevo

      this.productoService.save(productoModel).subscribe({
        next: res => {
          console.log(res);
          console.log("Exito en registro");

          if (res.id) {
            this.idProducto = res.id
          }

          this.toastr.info('Registro fue creado con existo', 'Info');

          this.router.navigate(['productos']);

        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Error al grabar nuevo producto', 'Error');
        }

      });


    }
    else {
      //Actualizar

      console.log(`Actualizar registro: ${this.idProducto}`);

      this.productoService.update(this.idProducto, productoModel).subscribe({
        next: (res) => {
          console.log(res);
          console.log("Exito en registro");
          /*
          if (res.id) {
            this.idProducto = res.id
          }
          */
          this.toastr.info('Registro fue actualizado con existo', 'Info');

        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Error al actualizar producto', 'Error');
        },

      });
    }

  }

  //---
  createFormSolicitud() {

    this.frmRegistro = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      activo: [true]
    });

  }

  get fcm(): { [key: string]: AbstractControl } {
    return this.frmRegistro.controls;
  }

  //---
  listarProductos() {
    this.router.navigate(['productos']);
  }
  //--

  limpiarArchivo(): void {
    this.archivoSeleccionado = null;
    this.previewUrl = this.imagenActual;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileSelected(event: any): void {
    const archivo: File = event.target.files[0];

    if (archivo) {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(archivo.type)) {
        this.toastr.error('Solo se permiten imágenes JPEG, PNG, GIF o WebP', 'Error');
        this.limpiarArchivo();
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        this.toastr.error('La imagen no debe superar los 5MB', 'Error');
        this.limpiarArchivo();
        return;
      }

      this.archivoSeleccionado = archivo;
      this.imagenActual = ""; // Limpiar imagen actual cuando se selecciona nueva

      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(archivo);
    }
  }

  //---------------


}
