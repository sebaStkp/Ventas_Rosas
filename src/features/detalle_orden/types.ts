import { Prisma } from "@prisma/client";

export type DetalleOrdenDTO = {
  id: string;
  orden_id: string;
  color: string;
  cantidad: number;
  precio_unitario:number;
};

export type CreateDetalleOrdenDTO = Omit<DetalleOrdenDTO, "id">;
export type UpdateDetalleOrdenDTO = Pick<DetalleOrdenDTO, "id" | "cantidad">;