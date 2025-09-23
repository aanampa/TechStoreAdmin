import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEstadoSolicitud, ISolicitud } from '../model/solicitud.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private httpClient = inject(HttpClient)

  url = `${environment.API_BASE}/solicitudes`
  urlEstados = `${environment.API_BASE}/estados`

  getAll(): Observable<ISolicitud[]> {
    return this.httpClient.get<ISolicitud[]>(this.url);
  }

  getById(idSolicitud: number): Observable<ISolicitud> {
    const urlGetById = `${environment.API_BASE}/solicitudes/${idSolicitud}`;
    return this.httpClient.get<ISolicitud>(urlGetById);
  }

  save(solicitud: ISolicitud): Observable<ISolicitud> {
    return this.httpClient.post<ISolicitud>(this.url, solicitud);
  }

  update(idSolicitud: number, solicitud: ISolicitud): Observable<ISolicitud> {
    const url_put = `${environment.API_BASE}/solicitudes/${idSolicitud}`;
    return this.httpClient.put<ISolicitud>(url_put, solicitud);
  }

  getEstadoSolicitud(): Observable<IEstadoSolicitud[]> {
    return this.httpClient.get<IEstadoSolicitud[]>(this.urlEstados);
  }

  findByLikeTitulo(titulo: string): Observable<ISolicitud[]> {
    const vurl = `${environment.API_BASE}/solicitudes?titulo_like=${titulo}`;
    return this.httpClient.get<ISolicitud[]>(vurl);
  }

  delete(codigo?:number):Observable<ISolicitud>{
     const url_local=`${this.url}/${codigo}`
    return this.httpClient.delete<ISolicitud>(url_local);
  }

}
