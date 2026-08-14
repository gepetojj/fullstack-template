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
import { getAuthCallbackURL, requestPasswordReset } from "@/lib/auth";

const schema = z.object({
	email: z.email(),
});

export function ForgotPasswordForm() {
	const [pendingEmail, setPendingEmail] = useState<string | null>(null);
	const [isResending, setIsResending] = useState(false);
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
		},
	});

	const sendResetLink = async (email: string) => {
		await requestPasswordReset({
			email,
			redirectTo: getAuthCallbackURL("/reset-password"),
			fetchOptions: {
				onError: async (error) => {
					if (process.env.NODE_ENV === "development") {
						console.error(error.error);
					}

					toast.add({
						title: "Erro ao enviar email",
						description:
							error.error.message ||
							"Não foi possível enviar o link de recuperação.",
					});
				},
				onSuccess: () => {
					setPendingEmail(email);
					toast.add({
						title: "Email enviado",
						description:
							"Se existir uma conta com esse endereço, você receberá o link em instantes.",
					});
				},
			},
		});
	};

	const onSubmit = async (data: z.infer<typeof schema>) => {
		await sendResetLink(data.email);
	};

	const onResend = async () => {
		if (!pendingEmail) return;

		setIsResending(true);
		try {
			await sendResetLink(pendingEmail);
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
						Se existir uma conta com esse endereço, enviamos um link
						para redefinir a senha.
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
				<CardTitle>Recuperar senha</CardTitle>
				<CardDescription>
					Informe seu email para receber o link de redefinição
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
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
									<FieldDescription>
										Você receberá um email se houver uma
										conta com esse endereço.
									</FieldDescription>
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
								Enviar link
							</Button>
							<FieldDescription className="text-center">
								Lembrou a senha?{" "}
								<Link href="/login">Entrar</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
