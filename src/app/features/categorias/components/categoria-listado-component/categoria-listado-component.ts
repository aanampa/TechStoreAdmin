import { Component, inject, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ICategoria } from '../../models/categoria.model';
import { HeaderComponent } from '../../../header/components/header-component/header-component';

@Component({
  selector: 'app-categoria-listado-component',
  imports: [
    HeaderComponent
  ],
  templateUrl: './categoria-listado-component.html',
  styleUrl: './categoria-listado-component.css'
})
export class CategoriaListadoComponent implements OnInit {

  private categoriaService = inject(CategoriaService);
  private toastr = inject(ToastrService); // Toast
  private router = inject(Router); //Para navegar entre componentes

  public categoriasLista: ICategoria[] = [];

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.categoriaService.getAll().subscribe({
      next: (res) => {

        this.toastr.info(
          `${res.length} registros listados`,
          'Info'
        );

        this.categoriasLista = res;
      },
      error: (err) => {

        console.log(err);

        this.toastr.error(
          'Error al consultar categorias de soporte',
          'Error'
        );

      },
    });
  }

}
