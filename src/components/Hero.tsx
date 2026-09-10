"use client";
import { useState, useEffect } from "react";
import { PRECIO_LAMPARA } from "@/libs/constants";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 relative overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#3a0e1e_0%,#0d0d0d_70%)] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg_width=%2760%27_height=%2760%27_viewBox=%270_0_60_60%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg_fill=%27none%27_fill-rule=%27evenodd%27%3E%3Cg_fill=%27%23ffffff%27_fill-opacity=%270.015%27%3E%3Cpath_d=%27M36_34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6_34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6_4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]">
      
      <span className={`text-7xl mb-6 block transition-all duration-1000 ease-out transform ${visible ? "opacity-100 scale-100 rotate-0 animate-[flotar_4s_ease-in-out_1s_infinite]" : "opacity-0 scale-75 -rotate-12"}`}>
        🌹
      </span>
      
      <p className={`font-mono text-[11px] tracking-[0.25em] uppercase text-[#d4607a] mb-5 transition-all duration-700 ease-out delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        Venta en Cochabamba
      </p>
      
      <h1 className={`text-[clamp(42px,8vw,88px)] font-normal leading-[1.05] text-[#f0ede6] mb-2 transition-all duration-700 ease-out delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
        Lámpara de <em className="italic text-[#d4607a]">Rosas</em>
      </h1>
      
      <div className={`inline-block bg-[#d4607a] text-white font-bold text-md tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-sm mb-7 transition-all duration-700 ease-out delay-500 ${visible ? "opacity-100" : "opacity-0"}`}>
        ESTA OFERTA SOLO TENTRA VALIDES HASTA EL 30 DE JULIO
      </div>
      
      <p className={`font-sans text-[16px] text-[#a09890] max-w-[420px] mx-auto leading-relaxed mb-9 transition-all duration-700 ease-out delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        24 luces LED cálidas entre rosas. Diseño artesanal tipo DIY, conexión USB. Un objeto que transforma cualquier espacio.
      </p>
      
      <div className={`font-sans text-[13px] text-[#a09890] tracking-[0.1em] transition-all duration-700 ease-out delay-500 mb-8 ${visible ? "opacity-100" : "opacity-0"}`}>
        Precio de venta
        <strong className="text-[28px] font-light text-[#f0ede6] block mt-1">Bs. {PRECIO_LAMPARA.toFixed(2)}</strong>
      </div>
      
      <p className={`font-sans text-[14px] text-[#a09890] max-w-[480px] mx-auto transition-all duration-700 ease-out delay-700 ${visible ? "opacity-100" : "opacity-0"}`}>
        Haz un depósito en QR de únicamente <strong className="text-xl text-[#f0ede6]">Bs. 20.00</strong> para reservar tu unidad, el producto se podrá entregar aproximadamente desde el <strong className="text-xl text-[#f0ede6]">14 de Julio</strong>, ¡la ubicación la decides tú en el formulario!
      </p>
    </div>
  );
}