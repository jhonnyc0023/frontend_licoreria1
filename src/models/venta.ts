import type { Cliente } from "./cliente";
import type { Detalle } from "./detalle";

export interface Venta {
    id: number;
    
    fechaVenta: Date;
    idCliente: number;
    detalles: Detalle[];
    cliente: Cliente;
  }