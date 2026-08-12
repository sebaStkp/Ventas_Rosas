import { SPECS } from "@/libs/constants";

export default function Specs() {
  return (
    <section className="max-w-[960px] mx-auto py-20 px-6">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#d4607a] mb-3">El producto</p>
      <h2 className="text-[clamp(28px,4vw,42px)] font-normal leading-[1.2] text-[#f0ede6] mb-4">
        Hecho para durar.<br />Diseñado para emocionar.
      </h2>
      <p className="font-sans text-[15px] text-[#a09890] leading-[1.8] max-w-[560px]">
        Material PVC con alambre de cobre flexible. 24 microfocos LED a 2700K — la temperatura de una vela — distribuidos entre las rosas. Alimentación por USB, sin pilas.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-[#222] border border-[#222] rounded-xl overflow-hidden mt-12">
        {SPECS.map((s) => (
          <div className="bg-[#141414] py-6 px-5 text-center" key={s.label}>
            <div className="text-[22px] mb-2">{s.icon}</div>
            <div className="text-[16px] font-normal text-[#f0ede6] mb-1 font-sans">{s.value}</div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-[#5a5248] uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}