"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
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
import { getAuthCallbackURL, sendVerificationEmail, signUp } from "@/lib/auth";

const schema = z
	.object({
		name: z.string().trim().min(1, "Informe seu nome"),
		email: z.email(),
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

export function RegisterForm() {
	const [pendingEmail, setPendingEmail] = useState<string | null>(null);
	const [isResending, setIsResending] = useState(false);
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof schema>) => {
		await signUp.email({
			name: data.name,
			email: data.email,
			password: data.password,
			callbackURL: getAuthCallbackURL("/"),
			fetchOptions: {
				onError: async (error) => {
					if (process.env.NODE_ENV === "development") {
						console.error(error.error);
					}

					toast.add({
						title: "Erro ao criar conta",
						description:
							error.error.message ||
							"Houve um erro desconhecido ao criar sua conta.",
					});
				},
				onSuccess: () => {
					setPendingEmail(data.email);
					toast.add({
						title: "Conta criada",
						description:
							"Enviamos um link de verificação para o seu email.",
					});
				},
			},
		});
	};

	const onResend = async () => {
		if (!pendingEmail) return;

		setIsResending(true);
		try {
			await sendVerificationEmail({
				email: pendingEmail,
				callbackURL: getAuthCallbackURL("/"),
				fetchOptions: {
					onError: async (error) => {
						if (process.env.NODE_ENV === "development") {
							console.error(error.error);
						}

						toast.add({
							title: "Erro ao reenviar email",
							description:
								error.error.message ||
								"Não foi possível reenviar o email de verificação.",
						});
					},
					onSuccess: () => {
						toast.add({
							title: "Email reenviado",
							description:
								"Se o endereço existir, você receberá um novo link em instantes.",
						});
					},
				},
			});
		} finally {
			setIsResending(false);
		}
	};

	if (pendingEmail) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Verifique seu email</CardTitle>
					<CardDescription>
						Clique no link que enviamos para ativar sua conta.
						Depois disso, você entra automaticamente.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<div className="flex flex-col items-center gap-3 text-center">
							<div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
								<IconMail className="size-5" />
							</div>
							<p className="text-pretty text-muted-foreground text-sm">
								Enviamos um email para{" "}
								<span className="font-medium text-foreground">
									{pendingEmail}
								</span>
								. Se não encontrar, confira a caixa de spam.
							</p>
						</div>
						<Field>
							<Button
								type="button"
								variant="outline"
								disabled={isResending}
								onClick={onResend}
							>
								{isResending ? <Spinner /> : null}
								Reenviar email
							</Button>
							<FieldDescription className="text-center">
								Já verificou? <Link href="/login">Entrar</Link>
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
				<CardTitle>Crie sua conta</CardTitle>
				<CardDescription>
					Preencha os dados abaixo para criar sua conta
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Nome
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										autoComplete="name"
										placeholder="Seu nome"
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
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Email
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										autoComplete="email"
										type="email"
										placeholder="email@exemplo.com"
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
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Senha
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
								Criar conta
							</Button>
							<FieldDescription className="text-center">
								Já tem uma conta?{" "}
								<Link href="/login">Entrar</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
