"use server";

import { revalidatePath } from "next/cache";
import { CreateDetalleOrdenDTO, UpdateDetalleOrdenDTO } from "./types";
import { createDetalleOrdenDB, getDetallesByOrdenIdDB, updateDetalleOrdenDB } from "./queries";

export async function obtenerDetallesPorOrdenAction(orden_id: string) {
  const detalles = await getDetallesByOrdenIdDB(orden_id);
  return { data: detalles };
}

export async function agregarDetalleAction(datos: CreateDetalleOrdenDTO) {
  const detalle = await createDetalleOrdenDB(datos);
  revalidatePath(`/admin/ordenes/${datos.orden_id}`);
  return { mensaje: "Detalle agregado", data: detalle };
}

export async function actualizarCantidadDetalleAction(datos: UpdateDetalleOrdenDTO) {
  const detalle = await updateDetalleOrdenDB(datos.id, datos.cantidad);
  // Asumiendo que quieres revalidar la orden padre pero necesitas el ID
  // Si no tienes el orden_id en el DTO, puedes devolverlo del DB y usarlo.
  return { mensaje: "Cantidad actualizada", data: detalle };
}