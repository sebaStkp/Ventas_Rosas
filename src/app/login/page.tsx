import { loginAdminAction } from "@/features/auth/actions";

type LoginPageProps = {
	searchParams: Promise<{ error?: string }>;
};

const messages = {
	config: "El login no está configurado. Revisa las variables de entorno.",
	invalid: "Usuario o contraseña incorrectos.",
	locked: "Has alcanzado el máximo de 3 intentos. Inténtalo de nuevo en 15 minutos.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { error } = await searchParams;
	const message = error ? messages[error as keyof typeof messages] : undefined;

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6 text-[#f0ede6]">
			<section className="w-full max-w-md border border-[#2a2520] bg-[#151515] p-8 shadow-2xl">
				<p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#b89162]">
					Lámpara de Rosas
				</p>
				<h1 className="font-serif text-4xl">Panel de admin</h1>
				<p className="mt-3 text-sm text-[#aaa29a]">Ingresa tus credenciales para continuar.</p>

				{message && (
					<p className="mt-6 border border-[#7d493b] bg-[#2b1b18] p-3 text-sm text-[#f0c4b8]" role="alert">
						{message}
					</p>
				)}

				<form action={loginAdminAction} className="mt-8 space-y-5">
					<label className="block text-sm text-[#d7d0c7]">
						Usuario
						<input
							name="username"
							type="text"
							autoComplete="username"
							required
							className="mt-2 block w-full border border-[#3a332d] bg-[#0d0d0d] px-4 py-3 text-[#f0ede6] outline-none focus:border-[#b89162]"
						/>
					</label>

					<label className="block text-sm text-[#d7d0c7]">
						Contraseña
						<input
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="mt-2 block w-full border border-[#3a332d] bg-[#0d0d0d] px-4 py-3 text-[#f0ede6] outline-none focus:border-[#b89162]"
						/>
					</label>

					<button
						type="submit"
						className="w-full bg-[#b89162] px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[#15110e] transition-colors hover:bg-[#d2ad7c]"
					>
						Entrar al panel
					</button>
				</form>
			</section>
		</main>
	);
}
