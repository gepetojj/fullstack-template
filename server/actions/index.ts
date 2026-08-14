import { betterAuth } from "@next-safe-action/adapter-better-auth";
import { redirect } from "next/navigation";
import { createSafeActionClient } from "next-safe-action";
import { ZodError } from "zod";

import { auth } from "@/server/auth";

export const actionClient = createSafeActionClient({
	handleServerError: (error) => {
		if (!(error instanceof ZodError)) {
			console.error(error);
		}

		return error.message || "Ocorreu um erro ao processar a ação.";
	},
});

export const authClient = actionClient.use(
	betterAuth(auth, {
		authorize: ({ authData, next }) => {
			if (!authData) redirect("/login");
			return next({ ctx: { auth: authData } });
		},
	}),
);
