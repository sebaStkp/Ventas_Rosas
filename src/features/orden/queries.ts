import { prisma } from "@/libs/prisma";
import { CreateOrdenDTO, DetalleParaOrdenCreate } from "./types";

export async function getOrdenesDB() {
  return prisma.orden.findMany({
    orderBy: { fecha_creacion: "desc" },
    include: { usuario: true },
  });
}

export async function getOrdenByIdDB(id: string) {
  return prisma.orden.findUnique({
    where: { id},
    include: {
      usuario: true,
      detalles: true
    },
  });
}

export async function createOrdenConDetallesDB(
  ordenData: CreateOrdenDTO, 
  detallesData: DetalleParaOrdenCreate[]
) {
  return prisma.orden.create({
    data: {
      ...ordenData,
      detalles: {
        create: detallesData,
      },
    },
    include: { detalles: true }
  });
}

export async function updateEstadoOrdenDB(id: string, estado: string) {
  return prisma.orden.update({
    where: { id },
    data: { estado },
  });
}