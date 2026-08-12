import { PUNTOS_ENTREGA } from "@/libs/constants";

export default function MapaEntrega({ punto }: { punto: (typeof PUNTOS_ENTREGA)[0] }) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${punto.longitud - 0.005},${punto.latitud - 0.003},${punto.longitud + 0.005},${punto.latitud + 0.003}&layer=mapnik&marker=${punto.latitud},${punto.longitud}`;
  
  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-[#222]">
      <iframe
        title={`Mapa ${punto.nombre}`}
        src={mapUrl}
        width="100%"
        height="220"
        className="border-none"
        loading="lazy"
      />
      <p className="font-mono text-[10px] tracking-[0.1em] text-[#5a5248] py-2.5 px-3.5 bg-[#141414]">
        📍 {punto.nombre} — {punto.direccion}
      </p>
    </div>
  );
}