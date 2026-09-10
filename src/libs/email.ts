import nodemailer from "nodemailer";

type PedidoNotificacion = {
  id: string;
  ciudad: string;
  lugar_entrega: string;
  hora_entrega?: Date | string | null;
  usuario: {
    nombre: string;
    ci: string;
    telefono: string;
  };
  detalles: {
    color: string;
    cantidad: number;
    precio_unitario: number | string | { toString(): string };
  }[];
};

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;

  if (!user || !password) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: password },
  });
}

export async function enviarNotificacionPedido(pedido: PedidoNotificacion) {
  const recipient = process.env.NOTIFICATION_EMAIL;
  const transporter = getTransporter();

  if (!transporter || !recipient) {
    console.warn("Notificación de pedido omitida: faltan variables de correo.");
    return;
  }

  const total = pedido.detalles.reduce(
    (sum, detalle) => sum + Number(detalle.precio_unitario) * detalle.cantidad,
    0,
  );
  const detalles = pedido.detalles
    .map(
      (detalle) =>
        `- ${detalle.color} x ${detalle.cantidad}: Bs. ${(Number(detalle.precio_unitario) * detalle.cantidad).toFixed(2)}`,
    )
    .join("\n");

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: `Nuevo pedido de ${pedido.usuario.nombre}`,
    text: [
      "Se registró un nuevo pedido.",
      `Pedido: ${pedido.id}`,
      `Cliente: ${pedido.usuario.nombre}`,
      `CI: ${pedido.usuario.ci}`,
      `WhatsApp: ${pedido.usuario.telefono}`,
      `Ciudad: ${pedido.ciudad}`,
      `Entrega: ${pedido.lugar_entrega}`,
      `Recojo: ${pedido.hora_entrega ? new Intl.DateTimeFormat("es-BO", { dateStyle: "full", timeStyle: "short", timeZone: "America/La_Paz" }).format(new Date(pedido.hora_entrega)) : "Por coordinar"}`,
      "",
      "Productos:",
      detalles,
      `Total: Bs. ${total.toFixed(2)}`,
    ].join("\n"),
  });
}