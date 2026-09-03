"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, CheckCircle2, Eye, MessageCircle, Search, X, XCircle } from "lucide-react";
import { cambiarEstadoOrdenAction } from "@/features/orden/actions";
import { ANTICIPO_LAMPARA, COLORES } from "@/libs/constants";

type AdminOrder = {
  id: string;
  ciudad: string;
  lugar_entrega: string;
  estado: string;
  fecha_creacion: string;
  hora_entrega: string | null;
  usuario: {
    nombre: string;
    ci: string;
    telefono: string;
  };
  detalles: {
    id: string;
    color: string;
    cantidad: number;
    precio_unitario: number;
  }[];
};

type AdminOrdersProps = {
  orders: AdminOrder[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/La_Paz",
  }).format(new Date(value));
}

function whatsappPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("591") ? digits : `591${digits}`;
}

function colorInfo(colorId: string) {
  return COLORES.find((color) => color.id === colorId) ?? {
    label: colorId,
    hex: "#766b61",
  };
}

function whatsappUrl(order: AdminOrder) {
  const units = order.detalles.reduce((total, detail) => total + detail.cantidad, 0);
  const products = order.detalles
    .map((detail) => `${detail.color} x ${detail.cantidad}`)
    .join(", ");
  const total = order.detalles.reduce(
    (sum, detail) => sum + detail.precio_unitario * detail.cantidad,
    0,
  );
  const message = [
    `Hola ${order.usuario.nombre}, hemos recibido tu petición: ${products} (${units} unidad${units === 1 ? "" : "es"}).`,
    `El costo será de Bs. ${total.toFixed(2)}, pero el anticipo será de Bs. ${ANTICIPO_LAMPARA.toFixed(2)}.`,
    `Una vez hagas la transferencia, confirmaremos tu pedido y te entregaremos en ${order.lugar_entrega}${order.hora_entrega ? `, a horas ${formatDate(order.hora_entrega)}` : ", a horas por coordinar"}.`,
    "No olvides que la entrega será el día ....... Gracias.",
  ].join("\n\n");

  return `https://wa.me/${whatsappPhone(order.usuario.telefono)}?text=${encodeURIComponent(message)}`;
}

export default function AdminOrders({ orders }: AdminOrdersProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [color, setColor] = useState("Todos");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = status === "Todos" || order.estado === status;
      const matchesColor = color === "Todos" || order.detalles.some((detail) => detail.color === color);
      const searchableText = `${order.usuario.nombre} ${order.usuario.ci} ${order.usuario.telefono}`.toLowerCase();
      return matchesStatus && matchesColor && searchableText.includes(normalizedQuery);
    });
  }, [orders, query, status, color]);

  function confirmOrder(order: AdminOrder) {
    startTransition(async () => {
      await cambiarEstadoOrdenAction({ id: order.id, estado: "Confirmado" });
      setSelectedOrder(null);
    });
  }

  function cancelOrder(order: AdminOrder) {
    startTransition(async () => {
      await cambiarEstadoOrdenAction({ id: order.id, estado: "Cancelado" });
      setSelectedOrder(null);
    });
  }

  return (
    <>
      <section className="mx-auto mt-8 max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-[#2a2520] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#766b61]" aria-hidden="true" />
            <label htmlFor="buscar-reservas" className="sr-only">Buscar reservas</label>
            <input
              id="buscar-reservas"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, CI o teléfono"
              className="w-full border border-[#3a332d] bg-[#151515] py-3 pl-10 pr-4 text-sm text-[#f0ede6] outline-none placeholder:text-[#766b61] focus:border-[#b89162]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1 border border-[#3a332d] bg-[#151515] p-1">
              {["Todos", "Pendiente", "Confirmado"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`px-3 py-2 text-xs transition-colors ${status === option ? "bg-[#b89162] text-[#15110e]" : "text-[#aaa29a] hover:text-[#f0ede6]"}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1 border border-[#3a332d] bg-[#151515] p-1">
              {[{ id: "Todos", label: "Todos", hex: "" }, ...COLORES].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setColor(option.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs transition-colors ${color === option.id ? "bg-[#b89162] text-[#15110e]" : "text-[#aaa29a] hover:text-[#f0ede6]"}`}
                >
                  {option.hex && <span className="size-2.5 rounded-full" style={{ backgroundColor: option.hex }} />}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto border border-[#2a2520]">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-[#191714] font-mono text-[10px] uppercase tracking-[0.14em] text-[#8f8378]">
              <tr>
                <th className="px-5 py-4">Cliente</th>
                <th className="px-5 py-4">Contacto</th>
                <th className="px-5 py-4">Reserva</th>
                <th className="px-5 py-4">Color</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2520]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="bg-[#151515] text-[#d7d0c7] hover:bg-[#1b1917]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#f0ede6]">{order.usuario.nombre}</p>
                    <p className="mt-1 text-xs text-[#8f8378]">CI: {order.usuario.ci}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#aaa29a]">{order.usuario.telefono}</td>
                  <td className="px-5 py-4 text-xs text-[#aaa29a]">
                    <p>{order.detalles.reduce((total, detail) => total + detail.cantidad, 0)} unidad(es)</p>
                    <p className="mt-1 text-[#766b61]">{formatDate(order.fecha_creacion)}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#aaa29a]">
                    <div className="flex flex-wrap gap-2">
                      {order.detalles.map((detail) => {
                        const selectedColor = colorInfo(detail.color);
                        return (
                          <span key={detail.id} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <span className="size-3 rounded-full border border-white/20" style={{ backgroundColor: selectedColor.hex }} />
                            {selectedColor.label} x {detail.cantidad}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${order.estado === "Confirmado" ? "text-[#9bc49c]" : "text-[#d8b77b]"}`}>
                      <span className={`size-1.5 rounded-full ${order.estado === "Confirmado" ? "bg-[#9bc49c]" : "bg-[#d8b77b]"}`} />
                      {order.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        title="Ver detalle de la reserva"
                        aria-label={`Ver detalle de ${order.usuario.nombre}`}
                        className="border border-[#4a4037] p-2 text-[#c7b59f] hover:border-[#b89162] hover:text-[#b89162]"
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </button>
                      <a
                        href={whatsappUrl(order)}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir WhatsApp con mensaje preparado"
                        aria-label={`Escribir por WhatsApp a ${order.usuario.nombre}`}
                        className="border border-[#315b4b] p-2 text-[#82c9a4] hover:bg-[#1b352a]"
                      >
                        <MessageCircle className="size-4" aria-hidden="true" />
                      </a>
                      {order.estado !== "Confirmado" && (
                        <button
                          type="button"
                          onClick={() => confirmOrder(order)}
                          disabled={isPending}
                          title="Confirmar reserva"
                          aria-label={`Confirmar reserva de ${order.usuario.nombre}`}
                          className="border border-[#416044] p-2 text-[#9bc49c] hover:bg-[#203522] disabled:opacity-50"
                        >
                          <Check className="size-4" aria-hidden="true" />
                        </button>
                      )}
                      {order.estado !== "Cancelado" && (
                        <button
                          type="button"
                          onClick={() => cancelOrder(order)}
                          disabled={isPending}
                          title="Cancelar pedido"
                          aria-label={`Cancelar pedido de ${order.usuario.nombre}`}
                          className="border border-[#70434a] p-2 text-[#d9959d] hover:bg-[#3a2025] disabled:opacity-50"
                        >
                          <XCircle className="size-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <p className="border-t border-[#2a2520] px-5 py-12 text-center text-sm text-[#8f8378]">No se encontraron reservas.</p>
          )}
        </div>
        <p className="mt-4 text-xs text-[#766b61]">{filteredOrders.length} reserva(s) mostrada(s)</p>
      </section>

      {selectedOrder && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/75 px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="detalle-reserva-titulo">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto border border-[#3a332d] bg-[#151515] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#2a2520] pb-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b89162]">Detalle de reserva</p>
                <h2 id="detalle-reserva-titulo" className="mt-2 font-serif text-3xl text-[#f0ede6]">{selectedOrder.usuario.nombre}</h2>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} title="Cerrar detalle" aria-label="Cerrar detalle" className="p-1 text-[#aaa29a] hover:text-[#f0ede6]"><X className="size-5" /></button>
            </div>

            <div className="grid gap-6 py-6 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#b89162]">Información del cliente</h3>
                <dl className="mt-3 space-y-2 text-sm text-[#d7d0c7]">
                  <div><dt className="inline text-[#766b61]">Nombre: </dt><dd className="inline">{selectedOrder.usuario.nombre}</dd></div>
                  <div><dt className="inline text-[#766b61]">CI: </dt><dd className="inline">{selectedOrder.usuario.ci}</dd></div>
                  <div><dt className="inline text-[#766b61]">Teléfono: </dt><dd className="inline">{selectedOrder.usuario.telefono}</dd></div>
                </dl>
              </div>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#b89162]">Información de entrega</h3>
                <dl className="mt-3 space-y-2 text-sm text-[#d7d0c7]">
                  <div><dt className="inline text-[#766b61]">Ciudad: </dt><dd className="inline">{selectedOrder.ciudad}</dd></div>
                  <div><dt className="inline text-[#766b61]">Lugar: </dt><dd className="inline">{selectedOrder.lugar_entrega}</dd></div>
                  <div><dt className="inline text-[#766b61]">Creada: </dt><dd className="inline">{formatDate(selectedOrder.fecha_creacion)}</dd></div>
                </dl>
              </div>
            </div>

            <div className="border-t border-[#2a2520] pt-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#b89162]">Detalle del pedido</h3>
              <div className="mt-3 divide-y divide-[#2a2520] border border-[#2a2520]">
                {selectedOrder.detalles.map((detail) => (
                  <div key={detail.id} className="flex items-center justify-between px-4 py-3 text-sm text-[#d7d0c7]">
                    <span>{detail.color} x {detail.cantidad}</span>
                    <span>Bs. {(detail.precio_unitario * detail.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setSelectedOrder(null)} className="border border-[#4a4037] px-4 py-3 text-sm text-[#aaa29a] hover:text-[#f0ede6]">Cerrar</button>
              {selectedOrder.estado !== "Confirmado" && selectedOrder.estado !== "Cancelado" && (
                <>
                  <button type="button" onClick={() => cancelOrder(selectedOrder)} disabled={isPending} className="inline-flex items-center justify-center gap-2 border border-[#70434a] px-4 py-3 text-sm text-[#d9959d] hover:bg-[#3a2025] disabled:opacity-50">
                    <XCircle className="size-4" /> Cancelar pedido
                  </button>
                  <button type="button" onClick={() => confirmOrder(selectedOrder)} disabled={isPending} className="inline-flex items-center justify-center gap-2 bg-[#b89162] px-4 py-3 text-sm text-[#15110e] hover:bg-[#d2ad7c] disabled:opacity-50">
                    <CheckCircle2 className="size-4" /> Confirmar reserva
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}