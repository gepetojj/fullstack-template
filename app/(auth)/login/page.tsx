import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "./_components/form";

function firstParam(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function Page({ searchParams }: PageProps<"/login">) {
	const params = await searchParams;
	const error = firstParam(params.error);
	const reset = firstParam(params.reset);

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					{error === "invalid_token" ? (
						<Alert variant="destructive">
							<IconAlertTriangle />
							<AlertTitle>Link inválido ou expirado</AlertTitle>
							<AlertDescription>
								Solicite um novo email de verificação ao tentar
								entrar.
							</AlertDescription>
						</Alert>
					) : null}
					{reset === "success" ? (
						<Alert>
							<IconCircleCheck />
							<AlertTitle>Senha redefinida</AlertTitle>
							<AlertDescription>
								Entre com a nova senha. As sessões anteriores
								foram encerradas.
							</AlertDescription>
						</Alert>
					) : null}
					<Card>
						<CardHeader>
							<CardTitle>Entre na sua conta</CardTitle>
							<CardDescription>
								Digite seu email abaixo para entrar na sua conta
							</CardDescription>
						</CardHeader>
						<CardContent>
							<LoginForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
