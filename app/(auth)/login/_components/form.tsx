"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { getAuthCallbackURL, signIn } from "@/lib/auth";

const schema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export function LoginForm() {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const router = useRouter();

	const onSubmit = async (data: z.infer<typeof schema>) => {
		await signIn.email({
			email: data.email,
			password: data.password,
			callbackURL: getAuthCallbackURL("/"),
			fetchOptions: {
				onError: async (error) => {
					if (process.env.NODE_ENV === "development") {
						console.error(error.error);
					}

					if (error.error.status === 403) {
						toast.add({
							title: "Email não verificado",
							description:
								"Verifique sua caixa de entrada. Enviamos um novo link de confirmação.",
						});
						return;
					}

					toast.add({
						title: "Erro ao fazer login",
						description:
							error.error.message ||
							"Houve um erro desconhecido ao fazer login.",
					});
				},
				onSuccess: () => {
					toast.add({
						title: "Sucesso",
						description:
							"Você vai ser redirecionado(a) para a página inicial",
					});
					router.push("/");
				},
			},
		});
	};

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="flex flex-col gap-2"
		>
			<FieldGroup>
				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field aria-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Email</FieldLabel>
							<Input
								{...field}
								id={field.name}
								aria-invalid={fieldState.invalid}
								type="email"
								placeholder="email@exemplo.com"
								required
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
				<Controller
					name="password"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field aria-invalid={fieldState.invalid}>
							<div className="flex items-center">
								<FieldLabel htmlFor={field.name}>
									Senha
								</FieldLabel>
								<Link
									href="/forgot-password"
									className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
								>
									Esqueceu sua senha?
								</Link>
							</div>
							<Input
								{...field}
								id={field.name}
								aria-invalid={fieldState.invalid}
								type="password"
								placeholder="********"
								required
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
				<Field>
					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? <Spinner /> : null}
						Entrar
					</Button>
					<FieldDescription className="text-center">
						Não tem uma conta?{" "}
						<Link href="/register">Cadastre-se</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
