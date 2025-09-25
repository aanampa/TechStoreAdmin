import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductoModel } from '../models/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private httpClient = inject(HttpClient)

  url = `${environment.API_BASE}/api/Productos`
  uploadUrl = `${environment.API_BASE}/api/Upload`
  //findUrl = `${environment.API_BASE}/api/Productos/FindProductos`

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
    const vurl_find = `${this.url}/FindProductos/${nombre}`;
    return this.httpClient.get<ProductoModel[]>(vurl_find);
  }

  // Nuevos métodos para subir imágenes
  subirImagen(archivo: File): Observable<{ imagenUrl: string }> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.httpClient.post<{ imagenUrl: string }>(`${this.uploadUrl}/imagen`, formData);
  }

  // Crear producto con imagen
  crearProductoConImagen(producto: ProductoModel, archivo: File): Observable<ProductoModel> {
    if (archivo) {
      return this.subirImagen(archivo).pipe(
        switchMap((response: any) => {
          //producto.imagenUrl = response.imagenUrl;
          producto.imagenUrl = response.nombreArchivo;
          return this.save(producto);
        })
      );
    } else {
      return this.save(producto);
    }
  }

  // Actualizar producto con imagen
  actualizarProductoConImagen(idProducto: string, producto: ProductoModel, archivo: File): Observable<ProductoModel> {
    if (archivo) {
      return this.subirImagen(archivo).pipe(
        switchMap((response: any) => {
          //producto.imagenUrl = response.imagenUrl;
          producto.imagenUrl = response.nombreArchivo;

          return this.update(idProducto, producto);
        })
      );
    } else {
      return this.update(idProducto, producto);
    }
  }
  //--
}
