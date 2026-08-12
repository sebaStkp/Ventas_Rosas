import { prisma } from "@/libs/prisma";
import { CreateUsuarioDTO, UpdateUsuarioDTO } from "./types";

export async function getUsuariosDB() {
  return prisma.usuario.findMany();
}

export async function getUsuarioByCiDB(ci: string) {
  return prisma.usuario.findUnique({ where: { ci } });
}

export async function upsertUsuarioDB(data: CreateUsuarioDTO) {
  return prisma.usuario.upsert({
    where: { ci: data.ci },
    update: { nombre: data.nombre, telefono: data.telefono },
    create: data,
  });
}