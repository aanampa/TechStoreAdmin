export interface ISolicitud {
  id: number,
  titulo: string,
  descripcion: string
  fecha: string,
  servicio: number,
  anexo: string,
  email: string,
  telefono: string,
  estado: number,
  estadoNombre?: string
}

export interface IEstadoSolicitud {
  id: number,
  descripcion: string
}
