import { prisma } from "@/libs/prisma";
import { CreateDetalleOrdenDTO, UpdateDetalleOrdenDTO } from "./types";

export async function getDetallesByOrdenIdDB(orden_id: string) {
  return prisma.detalleOrden.findMany({
    where: { orden_id },
    include: { variante: true },
  });
}

export async function createDetalleOrdenDB(data: CreateDetalleOrdenDTO) {
  return prisma.detalleOrden.create({ data });
}

export async function updateDetalleOrdenDB(id: string, cantidad: number) {
  return prisma.detalleOrden.update({
    where: { id },
    data: { cantidad },
  });
}