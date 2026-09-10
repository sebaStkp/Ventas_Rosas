export type OrdenDTO = {
  id: string;
  usuario_id: string;
  ciudad: string;
  lugar_entrega: string;
  latitud: number;
  longitud: number;
  hora_entrega?: Date;
  estado: string;
  fecha_creacion: Date;
};

export type CreateOrdenDTO = Pick<OrdenDTO, "usuario_id" | "ciudad" | "lugar_entrega" | "latitud" | "longitud" | "hora_entrega">;
export type UpdateEstadoOrdenDTO = Pick<OrdenDTO, "id" | "estado">;

export type DetalleParaOrdenCreate = {
  color: string;
  cantidad: number;
  precio_unitario: number; 
};