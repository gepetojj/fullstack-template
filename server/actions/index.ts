import { createSafeActionClient } from "next-safe-action";
import { ZodError } from "zod";

export const actionClient = createSafeActionClient({
	handleServerError: (error) => {
		if (!(error instanceof ZodError)) {
			console.error(error);
		}

		return error.message || "Ocorreu um erro ao processar a ação.";
	},
});

// TODO: Criar client autenticado para actions
