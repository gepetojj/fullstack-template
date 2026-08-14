"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { resetPassword } from "@/lib/auth";

const schema = z
	.object({
		password: z
			.string()
			.min(8, "A senha deve ter pelo menos 8 caracteres")
			.max(128, "A senha deve ter no máximo 128 caracteres"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

function isInvalidToken(error?: string) {
	return error?.toUpperCase() === "INVALID_TOKEN";
}

export function ResetPasswordForm({
	token,
	error,
}: {
	token?: string;
	error?: string;
}) {
	const router = useRouter();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof schema>) => {
		if (!token) return;

		await resetPassword({
			newPassword: data.password,
			token,
			fetchOptions: {
				onError: async (ctx) => {
					if (process.env.NODE_ENV === "development") {
						console.error(ctx.error);
					}

					toast.add({
						title: "Erro ao redefinir senha",
						description:
							ctx.error.message ||
							"Não foi possível salvar a nova senha. Solicite um novo link.",
					});
				},
				onSuccess: () => {
					toast.add({
						title: "Senha redefinida",
						description:
							"Entre com a nova senha. Sessões anteriores foram encerradas.",
					});
					router.push("/login?reset=success");
				},
			},
		});
	};

	if (!token || isInvalidToken(error)) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Link inválido ou expirado</CardTitle>
					<CardDescription>
						Solicite um novo email para redefinir sua senha.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<div className="flex flex-col items-center gap-3 text-center">
							<div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
								<IconAlertTriangle className="size-5" />
							</div>
							<p className="text-pretty text-muted-foreground text-sm">
								O link de recuperação vale por uma hora e só
								pode ser usado uma vez.
							</p>
						</div>
						<Field>
							<Button
								nativeButton={false}
								render={<Link href="/forgot-password" />}
							>
								Solicitar novo link
							</Button>
							<FieldDescription className="text-center">
								Lembrou a senha?{" "}
								<Link href="/login">Entrar</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Redefinir senha</CardTitle>
				<CardDescription>
					Escolha uma nova senha para a sua conta
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Nova senha
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										autoComplete="new-password"
										type="password"
										placeholder="********"
										required
									/>
									<FieldDescription>
										Mínimo de 8 caracteres. Evite senhas que
										já vazaram.
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						<Controller
							name="confirmPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Confirmar senha
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										autoComplete="new-password"
										type="password"
										placeholder="********"
										required
									/>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						<Field>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? (
									<Spinner />
								) : null}
								Salvar nova senha
							</Button>
							<FieldDescription className="text-center">
								<Link href="/login">Voltar ao login</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
