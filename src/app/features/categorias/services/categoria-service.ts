import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICategoria } from '../models/categoria.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private httpClient = inject(HttpClient)

  url = `${environment.API_BASE}/servicios`

  getAll(): Observable<ICategoria[]> {
    return this.httpClient.get<ICategoria[]>(this.url);
  }

}
