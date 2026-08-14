import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { admin, haveIBeenPwned, lastLoginMethod } from "better-auth/plugins";
import { after } from "next/server";

import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { env } from "@/server/env";
import { semanticId } from "@/server/lib/semantic-id";

export const auth = betterAuth({
	appName: "Template App",
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url }) =>
			after(async () => {
				// TODO: Enviar email de reset de senha
				console.log(
					`[better-auth] Usuário '${user.email}' solicitou reset de senha. URL: ${url}`,
				);
			}),
		onExistingUserSignUp: async ({ user }) =>
			after(async () => {
				// TODO: Notificar o dono do email sobre a tentativa de cadastro
				console.log(
					`[better-auth] Tentativa de cadastro com email já registrado: '${user.email}'`,
				);
			}),
		customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
			...coreFields,
			role: "user",
			banned: false,
			banReason: null,
			banExpires: null,
			...additionalFields,
			id,
		}),
	},
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) =>
			after(async () => {
				// TODO: Enviar email de verificação
				console.log(
					`[better-auth] Usuário '${user.email}' solicitou verificação após registro. URL: ${url}`,
				);
			}),
	},
	// socialProviders: {
	// 	google: {
	// 		clientId: "",
	// 		clientSecret: ""
	// 	},
	// },
	plugins: [
		lastLoginMethod(),
		admin(),
		haveIBeenPwned({
			customPasswordCompromisedMessage:
				"Esta senha já apareceu em vazamentos de dados. Escolha outra mais segura.",
		}),
		nextCookies(), // ! Sempre mantenha como último plugin da lista
	],
	user: {
		deleteUser: {
			enabled: false,
		},
	},
	advanced: {
		backgroundTasks: { handler: after },
		database: {
			generateId: ({ model }) => semanticId(model),
		},
	},
});
