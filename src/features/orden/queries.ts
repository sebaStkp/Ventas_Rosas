import { prisma } from "@/libs/prisma";
import { CreateUsuarioDTO } from "../usuario/types";
import { CreateOrdenDTO, DetalleParaOrdenCreate } from "./types";

export async function getOrdenesDB() {
  return prisma.orden.findMany({
    orderBy: { fecha_creacion: "desc" },
    include: { usuario: true, detalles: true },
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

export async function createReservaConUsuarioDB(
  usuarioData: CreateUsuarioDTO,
  ordenData: Omit<CreateOrdenDTO, "usuario_id">,
  detallesData: DetalleParaOrdenCreate[],
) {
  return prisma.$transaction(async (transaction) => {
    const usuario = await transaction.usuario.upsert({
      where: { ci: usuarioData.ci },
      update: {
        nombre: usuarioData.nombre,
        telefono: usuarioData.telefono,
      },
      create: usuarioData,
    });

    return transaction.orden.create({
      data: {
        ...ordenData,
        usuario_id: usuario.id,
        detalles: {
          create: detallesData,
        },
      },
      include: {
        usuario: true,
        detalles: true,
      },
    });
  });
}