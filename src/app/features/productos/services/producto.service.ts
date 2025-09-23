import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductoModel } from '../models/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private httpClient = inject(HttpClient)

  url = `${environment.API_BASE}/api/Productos`

  getAll(): Observable<ProductoModel[]> {
    return this.httpClient.get<ProductoModel[]>(this.url);
  }

  getById(idProducto: string): Observable<ProductoModel> {
    const urlGetById = `${this.url}/${idProducto}`;
    return this.httpClient.get<ProductoModel>(urlGetById);
  }

  save(producto: ProductoModel): Observable<ProductoModel> {
    return this.httpClient.post<ProductoModel>(this.url, producto);
  }

  update(idProducto: string, producto: ProductoModel): Observable<ProductoModel> {

    console.log("idProducto => " + idProducto);
    console.log("producto => " + JSON.stringify(producto));

    const url_put = `${this.url}/${idProducto}`;

    console.log("url_put => " + url_put);

    return this.httpClient.put<ProductoModel>(url_put, producto);

  }

  delete(idProducto: string): Observable<ProductoModel> {
    const url_delete = `${this.url}/${idProducto}`

    console.log("url_delete => " + url_delete);
    console.log("idProducto => " + idProducto);

    return this.httpClient.delete<ProductoModel>(url_delete);
  }

  findByLikeTitulo(nombre: string): Observable<ProductoModel[]> {
    const vurl = `${environment.API_BASE}/productos?nombre_like=${nombre}`;
    return this.httpClient.get<ProductoModel[]>(vurl);
  }

}
