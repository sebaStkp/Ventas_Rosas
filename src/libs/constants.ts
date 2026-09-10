export const PRECIO_LAMPARA = 100;
export const ANTICIPO_LAMPARA = 20;
export const FECHA_INICIO_RECOJO = "2026-09-14";

export const HORARIOS_RECOJO: Record<number, { inicio: string; fin: string }> = {
  0: { inicio: "09:00", fin: "16:00" },
  1: { inicio: "17:30", fin: "19:00" },
  2: { inicio: "17:30", fin: "18:45" },
  3: { inicio: "17:30", fin: "19:00" },
  4: { inicio: "17:30", fin: "18:45" },
  5: { inicio: "17:30", fin: "19:00" },
  6: { inicio: "15:30", fin: "19:00" },
};

export const COLORES = [
  { id: "amarillo", label: "Amarillo", hex: "#FFC800", imagen: "/amarillo.png" },
  { id: "naranja", label: "Naranja", hex: "#FF6B4A", imagen: "/naranja.jpg" },
  { id: "verde", label: "Verde", hex: "#42E8D2", imagen: "/verde.avif" },
];

export const PUNTOS_ENTREGA = [
  {
    id: "plaza-colon",
    nombre: "Plaza Colón",
    direccion: "Plaza Colón, Cochabamba",
    latitud: -17.388547495751524,
    longitud: -66.15608416320218,
    horario: "",
  },
  {
    id: "correo",
    nombre: "Correo",
    direccion: "Avenida Ayacucho entre Heroínas y Gral. Achá",
    latitud: -17.392291203932537,
    longitud: -66.15874062240208,
    horario: "",
  },
  {
    id: "hupermall",
    nombre: "HuperMall",
    direccion: "Avenida Pando entre Av. Portales y Hermogenes Sejas A.",
    latitud: -17.375424439421998,
    longitud: -66.15097051656238,
    horario: "",
  },
];

export const SPECS = [
  { icon: "📏", label: "Altura", value: "40 cm" },
  { icon: "💡", label: "LEDs", value: "24 luces" },
  { icon: "🔌", label: "Alimentación", value: "USB 5V" },
  { icon: "🌡️", label: "Color luz", value: "2700K cálido" },
  { icon: "⏱️", label: "Vida útil", value: "50,000 hrs" },
  { icon: "🛡️", label: "Protección", value: "IP44" },
];

export const ARGUMENTOS = [
  {
    icon: "🌹",
    titulo: "Diseño romántico",
    texto: "24 rosas artificiales con iluminación LED cálida integrada. Perfecto para regalar en aniversarios, San Valentín o decorar cualquier espacio.",
  },
  {
    icon: "🔧",
    titulo: "Fácil armado DIY",
    texto: "Viene desarmada tipo kit. Sin herramientas, solo tus manos. El proceso de armado forma parte de la experiencia.",
  },
  {
    icon: "🏡",
    titulo: "Para todos los espacios",
    texto: "Clasificación IP44: resistente al polvo y salpicaduras. Ideal para dormitorios, salas, escritorios y eventos especiales.",
  },
];