"use client";

import { useState } from "react";
import { COLORES, PUNTOS_ENTREGA } from "@/libs/constants";
import MapaEntrega from "./MapaEntrega";
import { guardarUsuarioAction } from "@/features/usuario/actions";
import { crearOrdenAction } from "@/features/orden/actions";

export default function OrderForm() {
  const [colorSel, setColorSel] = useState(COLORES[0].id);
  const [cantidad, setCantidad] = useState(1);
  const [puntoSel, setPuntoSel] = useState(PUNTOS_ENTREGA[0].id);
  const [ciudad, setCiudad] = useState("Cochabamba");
  const [nombre, setNombre] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const puntoActual = PUNTOS_ENTREGA.find((p) => p.id === puntoSel)!;
  const colorActual = COLORES.find((c) => c.id === colorSel)!;
  
  // Validamos si la ciudad es Cochabamba para mostrar u ocultar opciones
  const esCochabamba = ciudad === "Cochabamba";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);

    try {
      // 1. Guardamos o actualizamos al usuario por su CI
      const usuarioRes = await guardarUsuarioAction({
        nombre,
        ci,
        telefono,
      });

      const usuarioId = usuarioRes.data.id;

      // Configuramos los datos de entrega dependiendo de la ciudad, ahora incluyendo el horario
      const lugarEntregaFinal = esCochabamba 
        ? `${puntoActual.nombre} (${puntoActual.horario})` 
        : `Envío a ${ciudad} (Por coordinar)`;
      const latitudFinal = esCochabamba ? (puntoActual.latitud ?? 0) : 0;
      const longitudFinal = esCochabamba ? (puntoActual.longitud ?? 0) : 0;

      // 2. Creamos la orden conectada con los datos del formulario y el detalle del producto
      await crearOrdenAction(
        {
          usuario_id: usuarioId,
          ciudad,
          lugar_entrega: lugarEntregaFinal,
          latitud: latitudFinal,
          longitud: longitudFinal,
        },
        [
          {
            color: colorSel,
            cantidad: cantidad,
            precio_unitario: 90.00,
          },
        ]
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
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#d4607a] mb-3">Reserva tu unidad</p>
        <h2 className="text-[clamp(28px,4vw,42px)] font-normal leading-[1.2] text-[#f0ede6] mb-4">Formulario de pedido</h2>
        <p className="font-sans text-[15px] text-[#a09890] leading-[1.8] mb-10">
          Nos ponemos en contacto por WhatsApp para confirmar tu pedido (El pedido se confirmará cuando se haga el pago adelantado de 10bs).
        </p>

        <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 sm:p-10">
          {enviado ? (
            <div className="text-center py-12 px-6">
              <div className="text-6xl mb-4">🌹</div>
              <h3 className="text-[28px] text-[#f0ede6] mb-2.5">¡Pedido registrado!</h3>
              <p className="font-sans text-[14px] text-[#7a7068]">
                Te contactamos pronto al WhatsApp que dejaste.<br />
                Gracias, {nombre}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="nombre" className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Nombre completo</label>
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
                  <label htmlFor="ci" className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Cédula de identidad</label>
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
                <label htmlFor="telefono" className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">WhatsApp de contacto</label>
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
                <label htmlFor="ciudad" className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Ciudad</label>
                <select 
                  id="ciudad" 
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] appearance-none"
                >
                  <option value="Cochabamba" className="bg-[#141414]">Cochabamba</option>
                  <option value="La Paz" className="bg-[#141414]">La Paz</option>
                  <option value="Santa Cruz" className="bg-[#141414]">Santa Cruz</option>
                  <option value="Oruro" className="bg-[#141414]">Oruro</option>
                </select>
              </div>

              <div className="pb-4">
                <label className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Color de la lámpara</label>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {COLORES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`w-9 h-9 rounded-full border-2 transition-all relative group ${colorSel === c.id ? "border-[#f0ede6] scale-110" : "border-transparent"}`}
                      style={{ background: c.hex }}
                      onClick={() => setColorSel(c.id)}
                      aria-label={c.label}
                    >
                      {/* Tooltip de color */}
                      <span className="absolute top-10 left-1/2 -translate-x-1/2 font-mono text-[9px] text-[#5a5248] whitespace-nowrap tracking-[0.05em] opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Cantidad</label>
                <div className="flex items-center gap-4">
                  <button type="button" className="w-9 h-9 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#f0ede6] text-lg flex items-center justify-center transition-colors hover:border-[#d4607a]" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
                  <span className="text-[22px] font-sans text-[#f0ede6] min-w-[28px] text-center">{cantidad}</span>
                  <button type="button" className="w-9 h-9 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#f0ede6] text-lg flex items-center justify-center transition-colors hover:border-[#d4607a]" onClick={() => setCantidad(cantidad + 1)}>+</button>
                </div>
              </div>

              {/* Renderizado condicional para opciones de entrega u otros departamentos */}
              {esCochabamba ? (
                <>
                  <div>
                    <label htmlFor="entrega" className="block font-bold text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Punto de entrega y horario</label>
                    <select id="entrega" value={puntoSel} onChange={(e) => setPuntoSel(e.target.value)} className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-[#f0ede6] font-sans text-[14px] outline-none transition-colors focus:border-[#d4607a] appearance-none">
                      {PUNTOS_ENTREGA.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#141414]">
                          {p.nombre} ({p.horario})
                        </option>
                      ))}
                    </select>
                  </div>

                  <MapaEntrega punto={puntoActual} />
                </>
              ) : (
                <div className="bg-[#1a1510] border border-[#d4607a]/30 rounded-lg p-4 mt-2">
                  <p className="text-[#f0ede6] font-sans text-[13px] leading-relaxed text-center">
                    Para envíos a otros departamentos nos contactaremos contigo para coordinar la entrega.
                  </p>
                </div>
              )}

              <div className="bg-[#0d0d0d] border border-[#222] rounded-lg p-5 mt-5 font-sans text-[13px]">
                <div className="flex justify-between py-1.5 text-[#7a7068]">
                  <span>Lámpara de Rosas — {colorActual.label}</span>
                  <span>Bs. 90.00</span>
                </div>
                <div className="flex justify-between py-1.5 text-[#7a7068]">
                  <span>Cantidad</span>
                  <span>× {cantidad}</span>
                </div>
                <div className="flex justify-between py-1.5 text-[#7a7068]">
                  <span>Entrega</span>
                  <span>{esCochabamba ? `${puntoActual.nombre} (${puntoActual.horario})` : `Envío a ${ciudad}`}</span>
                </div>
                <div className="flex justify-between pt-3 mt-2 border-t border-[#222] text-[#f0ede6] text-[16px]">
                  <span>Total</span>
                  <span>Bs. {(90 * cantidad).toFixed(2)}</span>
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