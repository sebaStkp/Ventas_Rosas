"use server";

import { revalidatePath } from "next/cache";
import {
  CreateOrdenDTO,
  DetalleParaOrdenCreate,
  UpdateEstadoOrdenDTO,
} from "./types";
import {
  getOrdenesDB,
  getOrdenByIdDB,
  createOrdenConDetallesDB,
  createReservaConUsuarioDB,
  updateEstadoOrdenDB,
} from "./queries";
import { CreateUsuarioDTO } from "../usuario/types";
import { enviarNotificacionPedido } from "@/libs/email";

export async function obtenerOrdenesAction() {
  const ordenes = await getOrdenesDB();
  return { data: ordenes };
}

export async function obtenerOrdenPorIdAction(id: string) {
  const orden = await getOrdenByIdDB(id);
  if (!orden) return null;
  return { data: orden };
}

export async function crearOrdenAction(
  datosOrden: CreateOrdenDTO,
  detalles: DetalleParaOrdenCreate[],
) {
  const nuevaOrden = await createOrdenConDetallesDB(datosOrden, detalles);

  revalidatePath("/admin/ordenes");

  return {
    ...nuevaOrden,
    detalles: nuevaOrden.detalles.map((detalle) => ({
      ...detalle,
      precio_unitario: Number(detalle.precio_unitario), 
    })),
  };
}

export async function crearReservaAction(
  usuario: CreateUsuarioDTO,
  datosOrden: Omit<CreateOrdenDTO, "usuario_id">,
  detalles: DetalleParaOrdenCreate[],
) {
  const nuevaReserva = await createReservaConUsuarioDB(usuario, datosOrden, detalles);

  try {
    await enviarNotificacionPedido({
      ...nuevaReserva,
      detalles: nuevaReserva.detalles.map((detalle) => ({
        ...detalle,
        precio_unitario: Number(detalle.precio_unitario),
      })),
    });
  } catch (error) {
    console.error("Error al enviar la notificación del pedido:", error);
  }

  revalidatePath("/admin");

  return {
    ...nuevaReserva,
    detalles: nuevaReserva.detalles.map((detalle) => ({
      ...detalle,
      precio_unitario: Number(detalle.precio_unitario),
    })),
  };
}

export async function cambiarEstadoOrdenAction(datos: UpdateEstadoOrdenDTO) {
  const ordenActualizada = await updateEstadoOrdenDB(datos.id, datos.estado);

  revalidatePath("/admin/ordenes");
  revalidatePath("/admin");

  return {
    mensaje: `Estado actualizado a ${datos.estado}`,
    data: ordenActualizada,
  };
}
