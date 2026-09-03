import { isAdminAuthenticated, logoutAdminAction } from "@/features/auth/actions";
import { getOrdenesDB } from "@/features/orden/queries";
import AdminOrders from "@/components/AdminOrders";
import { redirect } from "next/navigation";

export default async function AdminPage() {
	if (!(await isAdminAuthenticated())) {
		redirect("/login");
	}

	const orders = await getOrdenesDB();
	const serializedOrders = orders.map((order) => ({
		...order,
		fecha_creacion: order.fecha_creacion.toISOString(),
		hora_entrega: order.hora_entrega?.toISOString() ?? null,
		detalles: order.detalles.map((detail) => ({
			...detail,
			precio_unitario: Number(detail.precio_unitario),
		})),
	}));

	return (
		<main className="min-h-screen bg-[#0d0d0d] px-6 py-12 text-[#f0ede6]">
			<div className="mx-auto flex max-w-5xl items-center justify-between border-b border-[#2a2520] pb-6">
				<div>
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-[#b89162]">Administración</p>
					<h1 className="mt-2 font-serif text-4xl">Panel de admin</h1>
				</div>
				<form action={logoutAdminAction}>
					<button
						type="submit"
						className="border border-[#4a4037] px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-[#d7d0c7] hover:border-[#b89162] hover:text-[#b89162]"
					>
						Cerrar sesión
					</button>
				</form>
			</div>
			<section className="mx-auto mt-10 max-w-5xl border border-[#2a2520] bg-[#151515] p-8">
				<h2 className="font-serif text-2xl">Reservas recibidas</h2>
				<p className="mt-2 text-[#aaa29a]">Consulta los datos del cliente y gestiona el estado de cada pedido.</p>
			</section>
			<AdminOrders orders={serializedOrders} />
		</main>
	);
}
