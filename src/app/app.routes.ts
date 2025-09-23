import { Routes } from '@angular/router';
import { SolicitudesListado } from './features/solicitudes/components/components/solicitudes-listado/solicitudes-listado';
import { SolicitudesRegistro } from './features/solicitudes/components/components/solicitudes-registro/solicitudes-registro';
import { CategoriaListadoComponent } from './features/categorias/components/categoria-listado-component/categoria-listado-component';
import { LoginComponent } from './features/auth/components/login-component/login-component';
import { ProductoListadoComponent } from './features/productos/components/producto-listado-component/producto-listado-component';
import { ProductoRegistroComponent } from './features/productos/components/producto-registro-component/producto-registro-component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'productos',
    component: ProductoListadoComponent
  },
  {
    path: 'productos/registro',
    component: ProductoRegistroComponent
  },
  {
    path: 'productos/registro/:id',
    component: ProductoRegistroComponent
  },
  {
    path: 'categorias',
    component: CategoriaListadoComponent
  }

];
