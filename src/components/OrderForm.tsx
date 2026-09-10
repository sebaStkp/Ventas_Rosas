"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ANTICIPO_LAMPARA,
  COLORES,
  FECHA_INICIO_RECOJO,
  HORARIOS_RECOJO,
  PRECIO_LAMPARA,
  PUNTOS_ENTREGA,
} from "@/libs/constants";
import MapaEntrega from "./MapaEntrega";
import { crearReservaAction } from "@/features/orden/actions";

export default function OrderForm() {
  const [colorSel, setColorSel] = useState(COLORES[0].id);
  const [cantidad, setCantidad] = useState(1);
  const [puntoSel, setPuntoSel] = useState(PUNTOS_ENTREGA[0].id);
  const [ciudad, setCiudad] = useState("Cochabamba");
  const [nombre, setNombre] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaRecojo, setFechaRecojo] = useState(FECHA_INICIO_RECOJO);
  const [horaRecojo, setHoraRecojo] = useState("");

  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const puntoActual = PUNTOS_ENTREGA.find((p) => p.id === puntoSel)!;
  const colorActual = COLORES.find((c) => c.id === colorSel)!;

  // Validamos si la ciudad es Cochabamba para mostrar u ocultar opciones
  const esCochabamba = ciudad === "Cochabamba";
  const diaRecojo = fechaRecojo
    ? new Date(`${fechaRecojo}T12:00:00`).getDay()
    : null;
  const horarioDelDia = diaRecojo === null ? null : HORARIOS_RECOJO[diaRecojo];

  function generarHoras(inicio: string, fin: string) {
    const [horaInicio, minutoInicio] = inicio.split(":").map(Number);
    const [horaFin, minutoFin] = fin.split(":").map(Number);
    const minutosInicio = horaInicio * 60 + minutoInicio;
    const minutosFin = horaFin * 60 + minutoFin;

    return Array.from(
      { length: Math.floor((minutosFin - minutosInicio) / 15) + 1 },
      (_, index) => {
        const minutos = minutosInicio + index * 15;
        const horas = Math.floor(minutos / 60)
          .toString()
          .padStart(2, "0");
        const minutosFormateados = (minutos % 60).toString().padStart(2, "0");
        return `${horas}:${minutosFormateados}`;
      },
    );
  }

  const horasDisponibles = horarioDelDia
    ? generarHoras(horarioDelDia.inicio, horarioDelDia.fin)
    : [];
  const fechaRecojoLegible = fechaRecojo
    ? new Intl.DateTimeFormat("es-BO", {
        dateStyle: "medium",
        timeZone: "America/La_Paz",
      }).format(new Date(`${fechaRecojo}T12:00:00`))
    : "Por elegir";

  useEffect(() => {
    setHoraRecojo(horasDisponibles[0] ?? "");
  }, [fechaRecojo]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);

    try {
      const lugarEntregaFinal = esCochabamba
        ? `${puntoActual.nombre} (${puntoActual.horario})`
        : `Envío a ${ciudad} (Por coordinar)`;
      const latitudFinal = esCochabamba ? (puntoActual.latitud ?? 0) : 0;
      const longitudFinal = esCochabamba ? (puntoActual.longitud ?? 0) : 0;
      const horaEntregaFinal =
        esCochabamba && fechaRecojo && horaRecojo
          ? new Date(`${fechaRecojo}T${horaRecojo}:00-04:00`)
          : undefined;

      await crearReservaAction(
        {
          nombre,
          ci,
          telefono,
        },
        {
          ciudad,
          lugar_entrega: lugarEntregaFinal,
          latitud: latitudFinal,
          longitud: longitudFinal,
          hora_entrega: horaEntregaFinal,
        },
        [
          {
            color: colorSel,
            cantidad: cantidad,
            precio_unitario: PRECIO_LAMPARA,
          },
        ],
      );

      setEnviado(true);
    } catch (error) {
      console.error("Error al registrar el pedido:", error);
      alert("Hubo un error al procesar tu pedido. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="bg-[#0f0f0f] w-full">
      <div className="max-w-[720px] mx-auto py-20 px-6">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#d4607a] mb-3">
          Reserva tu unidad
        </p>
        <h2 className="text-[clamp(28px,4vw,42px)] font-normal leading-[1.2] text-[#f0ede6] mb-4">
          Formulario de pedido
        </h2>
        <p className="font-sans text-[15px] text-[#a09890] leading-[1.8] mb-10">
          Nos ponemos en contacto por WhatsApp para confirmar tu pedido (El
          pedido se confirmará cuando se haga el pago adelantado de{" "}
          {ANTICIPO_LAMPARA} Bs).
        </p>

        <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 sm:p-10">
          {enviado ? (
            <div className="text-center py-12 px-6">
              <div className="text-6xl mb-4">🌹</div>
              <h3 className="text-[28px] text-[#f0ede6] mb-2.5">
                ¡Pedido registrado!
              </h3>
              <p className="font-sans text-[14px] text-[#7a7068]">
                Te contactamos pronto al WhatsApp que dejaste.
                <br />
                Gracias, {nombre}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] placeholder:text-[#3a3530]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ci"
                    className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                  >
                    Cédula de identidad
                  </label>
                  <input
                    id="ci"
                    type="text"
                    placeholder="Tu CI..."
                    value={ci}
                    onChange={(e) => setCi(e.target.value)}
                    required
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] placeholder:text-[#3a3530]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                >
                  WhatsApp de contacto
                </label>
                <input
                  id="telefono"
                  type="tel"
                  placeholder="Ej. 70000000"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] placeholder:text-[#3a3530]"
                />
              </div>

              <div>
                <label
                  htmlFor="ciudad"
                  className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                >
                  Ciudad
                </label>
                <select
                  id="ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] appearance-none"
                >
                  <option value="Cochabamba" className="bg-[#141414]">
                    Cochabamba
                  </option>
                  <option value="La Paz" className="bg-[#141414]">
                    La Paz
                  </option>
                  <option value="Santa Cruz" className="bg-[#141414]">
                    Santa Cruz
                  </option>
                  <option value="Oruro" className="bg-[#141414]">
                    Oruro
                  </option>
                </select>
              </div>

              <div className="pb-4">
                <label className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">
                  Color de la lámpara
                </label>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {COLORES.map((c) => (
                    <div
                      key={c.id}
                      className="flex min-w-16 flex-col items-center gap-2"
                    >
                      <button
                        type="button"
                        className={`w-9 h-9 rounded-full border-2 transition-all ${colorSel === c.id ? "border-[#f0ede6] scale-110" : "border-transparent"}`}
                        style={{ background: c.hex }}
                        onClick={() => setColorSel(c.id)}
                        aria-label={`Seleccionar color ${c.label}`}
                      />
                      <span className="font-mono text-[11px] text-gray-300 whitespace-nowrap tracking-[0.05em]">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4 sm:p-6">
                  <div className="relative mx-auto aspect-square w-full max-w-70">
                    <Image
                      key={colorActual.imagen}
                      src={colorActual.imagen}
                      alt={`Lámpara de rosas color ${colorActual.label}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 280px"
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-[#a09890]">
                    Lámpara color {colorActual.label}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="w-9 h-9 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#f0ede6] text-lg flex items-center justify-center transition-colors hover:border-[#d4607a]"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  >
                    −
                  </button>
                  <span className="text-[22px] font-sans text-[#f0ede6] min-w-[28px] text-center">
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    className="w-9 h-9 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#f0ede6] text-lg flex items-center justify-center transition-colors hover:border-[#d4607a]"
                    onClick={() => setCantidad(cantidad + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Renderizado condicional para opciones de entrega u otros departamentos */}
              {esCochabamba ? (
                <>
                  <div>
                    <label
                      htmlFor="entrega"
                      className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                    >
                      Punto de entrega y horario
                    </label>
                    <select
                      id="entrega"
                      value={puntoSel}
                      onChange={(e) => setPuntoSel(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] appearance-none"
                    >
                      {PUNTOS_ENTREGA.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          className="bg-[#141414]"
                        >
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4 sm:p-5">
                    <p className="font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400">
                      ¿Cuándo recogerás tu pedido?
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#a09890]">
                      Primero elige el día. Después podrás escoger una hora
                      disponible para ese día.
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="fecha-recojo"
                          className="mb-2 block text-[12px] text-[#d7d0c7]"
                        >
                          1. Día de recojo
                        </label>
                        <input
                          id="fecha-recojo"
                          type="date"
                          min={FECHA_INICIO_RECOJO}
                          value={fechaRecojo}
                          onChange={(event) =>
                            setFechaRecojo(event.target.value)
                          }
                          required
                          className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] [color-scheme:dark]"
                        />
                        <p className="mt-2 text-[11px] text-[#766b61]">
                          Recojos disponibles desde el{" "}
                          {new Intl.DateTimeFormat("es-BO", {
                            dateStyle: "long",
                            timeZone: "America/La_Paz",
                          }).format(
                            new Date(`${FECHA_INICIO_RECOJO}T12:00:00`),
                          )}
                          .
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="hora-recojo"
                          className="mb-2 block text-[12px] text-[#d7d0c7]"
                        >
                          2. Hora de recojo
                        </label>
                        <select
                          id="hora-recojo"
                          value={horaRecojo}
                          onChange={(event) =>
                            setHoraRecojo(event.target.value)
                          }
                          required
                          disabled={
                            !fechaRecojo || horasDisponibles.length === 0
                          }
                          className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {horasDisponibles.map((hora) => (
                            <option
                              key={hora}
                              value={hora}
                              className="bg-[#141414]"
                            >
                              {hora}
                            </option>
                          ))}
                        </select>
                        {horarioDelDia && (
                          <p className="mt-2 text-[11px] text-[#766b61]">
                            Horario disponible: {horarioDelDia.inicio} a{" "}
                            {horarioDelDia.fin}.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <MapaEntrega punto={puntoActual} />
                </>
              ) : (
                <div className="bg-[#1a1510] border border-[#d4607a]/30 rounded-lg p-4 mt-2">
                  <p className="text-[#f0ede6] font-sans text-[13px] leading-relaxed text-center">
                    Para envíos a otros departamentos nos contactaremos contigo
                    para coordinar la entrega.
                  </p>
                </div>
              )}

              <div className="bg-[#0d0d0d] border border-[#222] rounded-lg p-5 mt-5 font-sans text-[13px]">
                <div className="flex justify-between py-1.5 text-[#7a7068]">
                  <span>Lámpara de Rosas — {colorActual.label}</span>
                  <span>Bs. {PRECIO_LAMPARA.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-[#7a7068]">
                  <span>Cantidad</span>
                  <span>× {cantidad}</span>
                </div>
                <div className="flex justify-between py-1.5 text-[#7a7068]">
                  <span>Entrega</span>
                  <span>
                    {esCochabamba
                      ? `${puntoActual.nombre}`
                      : `Envío a ${ciudad}`}
                  </span>
                </div>
                {esCochabamba && horaRecojo && (
                  <div className="flex justify-between py-1.5 text-[#7a7068]">
                    <span>Recojo</span>
                    <span>
                      {fechaRecojoLegible} a las {horaRecojo}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 mt-2 border-t border-[#222] text-[#f0ede6] text-[16px]">
                  <span>Total</span>
                  <span>Bs. {(PRECIO_LAMPARA * cantidad).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[#d4607a] hover:bg-[#bf4d66] active:scale-[0.99] transition-all rounded-lg p-4 text-white font-sans text-[15px] tracking-[0.05em] mt-7 disabled:opacity-50"
              >
                {cargando ? "Procesando pedido..." : "Confirmar pedido →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
