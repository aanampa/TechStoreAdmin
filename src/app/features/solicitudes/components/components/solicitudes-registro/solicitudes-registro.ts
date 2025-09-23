import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ISolicitud } from '../../../model/solicitud.interface';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../../../header/components/header-component/header-component';

@Component({
  selector: 'app-solicitudes-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './solicitudes-registro.html',
  styleUrl: './solicitudes-registro.css'
})
export class SolicitudesRegistro implements OnInit {

  private router = inject(Router); //Para navegar entre componentes
  private activatedRoute = inject(ActivatedRoute);
  private solicitudesService = inject(SolicitudesService);
  private toastr = inject(ToastrService); // Toast

  private fb = inject(FormBuilder);
  public frmSolicitudRegistro: FormGroup = this.fb.group({});

  idSolicitud: number = 0;

  ngOnInit(): void {

    console.log(this.activatedRoute);

    this.activatedRoute.params.subscribe({
      next: params => {
        console.log(params);
        this.idSolicitud = params['id']
        console.log(this.idSolicitud);

        if (this.idSolicitud)
          this.getById(this.idSolicitud);

      }
    });

    this.createFormSolicitud();

  }

  listarSolicitudes() {
    this.router.navigate(['solicitudes']);
  }

  getById(idSolicitud: number) {

    console.log("getById() => ");
    console.log("idSolicitud => " + idSolicitud);
    this.solicitudesService.getById(idSolicitud).subscribe({
      next: (res) => {
        console.log(res);
        console.log("Exito en registro");

        this.fcm['id'].setValue(res.id);
        this.fcm['titulo'].setValue(res.titulo);
        this.fcm['descripcion'].setValue(res.descripcion);
        this.fcm['fecha'].setValue(res.fecha);
        this.fcm['servicio'].setValue(res.servicio);
        this.fcm['estado'].setValue(res.estado);
        this.fcm['anexo'].setValue(res.anexo);
        this.fcm['email'].setValue(res.email);
        this.fcm['telefono'].setValue(res.telefono);

      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al recuperar registro del centro medico', 'Error');
      }

    })

  }

  grabar(event: Event) {

    event.preventDefault(); // Esto previene el refresh
    /*
    if (this.frmSolicitudRegistro.invalid) {
      console.log('frmSolicitudRegistro => invalid');
      return;
    }
    */
    const anexo = this.fcm['anexo'].value;
    const titulo = this.fcm['titulo'].value;
    const descripcion = this.fcm['descripcion'].value;
    const fecha = this.fcm['fecha'].value;
    const servicio = this.fcm['servicio'].value;
    const estado = this.fcm['estado'].value;
    const email = this.fcm['email'].value;
    const telefono = this.fcm['telefono'].value;

    let msgerror = [];

    if (titulo == '') {
      msgerror.push("Ingrese titulo de la solicitud");
    }

    if (descripcion == '') {
      msgerror.push("Ingrese descripción breve de la solicitud");
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


    const solicitud: ISolicitud = {
      id: 0,
      titulo: titulo,
      descripcion: descripcion,
      fecha: fecha,
      servicio: servicio,
      estado: estado,
      email: email,
      telefono: telefono,
      anexo: ''
    }

    console.log('titulo =>' + titulo);
    console.log('idSolicitud =>' + this.idSolicitud);
    console.log('solicitud =>' + JSON.stringify(solicitud));


    if (!this.idSolicitud) {
      //Nuevo|


    }
    else {
      //Actualizar

      console.log(`Actualizar registro: ${this.idSolicitud}`);

      this.solicitudesService.update(this.idSolicitud, solicitud).subscribe({
        next: (res) => {
          console.log(res);
          console.log("Exito en registro");

          if (res.id) {
            this.idSolicitud = res.id
          }

          this.toastr.info('Registro fue actualizado con existo', 'Info');

        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Error al actualizar centro medico', 'Error');
        },

      });
    }

  }

  createFormSolicitud() {

    this.frmSolicitudRegistro = this.fb.group({
      id: [''],
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      servicio: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      anexo: [''],
      email: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });

  }

  get fcm(): { [key: string]: AbstractControl } {
    return this.frmSolicitudRegistro.controls;
  }

}
