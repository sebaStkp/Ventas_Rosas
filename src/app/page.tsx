import Hero from "@/components/Hero";
import Specs from "@/components/Specs";
import Arguments from "@/components/Arguments";
import OrderForm from "@/components/OrderForm";

export default function Home() {
  return (
    <main className="bg-[#0d0d0d] text-[#f0ede6] font-serif min-h-screen">
      <Hero />
      
      <hr className="border-t border-[#1e1e1e] m-0" />
      
      <Specs />
      
      <hr className="border-t border-[#1e1e1e] m-0" />
      
      <Arguments />
      
      <hr className="border-t border-[#1e1e1e] m-0" />
      
      <OrderForm />
      
      <footer className="text-center py-10 px-6 font-mono text-[10px] tracking-[0.15em] text-[#2a2520] uppercase bg-[#0d0d0d]">
        © 2025 · Lámpara de Rosas · Cochabamba, Bolivia
      </footer>
    </main>
  );
}