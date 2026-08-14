import "dotenv/config";
import { z } from "zod/v4-mini";

/**
 * Definição segura das variáveis de ambiente necessárias.
 *
 * Detalhe: o consumo deve ser feito apenas no servidor, nunca no cliente. Variáveis públicas opcionalmente também podem ser definidas para garantir existência,
 * mas no client devem ser chamadas por outro objeto específico ou diretamente com `process.env.NEXT_PUBLIC_*`
 */
export const env = z
	.object({
		DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string(),
		NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
	})
	.parse(process.env);
