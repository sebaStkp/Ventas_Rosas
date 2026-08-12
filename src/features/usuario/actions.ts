"use server";

import { CreateUsuarioDTO } from "./types";
import { getUsuariosDB, upsertUsuarioDB } from "./queries";
import { revalidatePath } from "next/cache";

export async function obtenerUsuariosAction() {
  const usuarios = await getUsuariosDB();
  return { data: usuarios };
}

export async function guardarUsuarioAction(datos: CreateUsuarioDTO) {
  const usuario = await upsertUsuarioDB(datos);
  revalidatePath("/admin/usuarios");
  return { mensaje: "Usuario guardado", data: usuario };
}