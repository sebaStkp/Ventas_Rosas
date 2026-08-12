import { ARGUMENTOS } from "@/libs/constants";

export default function Arguments() {
  return (
    <section className="max-w-[960px] mx-auto py-20 px-6">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#d4607a] mb-3">Por qué elegirla</p>
      <h2 className="text-[clamp(28px,4vw,42px)] font-normal leading-[1.2] text-[#f0ede6] mb-4">
        Tres razones que hablan por sí solas.
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {ARGUMENTOS.map((a) => (
          <div className="bg-[#141414] border border-[#222] rounded-xl p-7 transition-colors hover:border-[#d4607a]/40" key={a.titulo}>
            <div className="text-[28px] mb-3.5">{a.icon}</div>
            <h3 className="text-[18px] text-[#f0ede6] font-normal mb-2.5">{a.titulo}</h3>
            <p className="font-sans text-[14px] text-[#7a7068] leading-[1.75]">{a.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}