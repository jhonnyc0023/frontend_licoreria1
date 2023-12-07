import type { Producto } from './producto'
import type { Cliente } from './cliente'

export interface Detalle {
  id: number
  cantidad: number
  precioUnitario: number
  totalVenta: number
  idCliente: number
  idProducto: number
  fechaCreacion: Date
  producto: Producto
  cliente: Cliente

  clientes: Cliente[]
}
