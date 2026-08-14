import "dotenv/config";
import { z } from "zod/v4-mini";

/**
 * Definição segura das variáveis de ambiente necessárias.
 *
 * Detalhe: o consumo deve ser feito apenas no servidor, nunca no cliente. Variáveis públicas opcionalmente também podem ser definidas para garantir existência,
 * mas no client devem ser chamadas por outro objeto específico ou diretamente com `process.env.NEXT_PUBLIC_*`
 */
export const env = z.object({}).parse(process.env);
