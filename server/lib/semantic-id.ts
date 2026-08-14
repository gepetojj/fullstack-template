import { createId, isCuid } from "@paralleldrive/cuid2";

/**
 * Valida um ID semântico verificando se ele contém pelo menos um underscore e
 * se a parte após o último underscore é um CUID2 válido.
 * @param id A string do ID semântico a ser validada.
 * @returns `true` se for um ID semântico válido, `false` caso contrário.
 */
export function isValidSemanticId(id: string): boolean {
	if (typeof id !== "string") return false;

	const parts = id.split("_");
	if (parts.length < 2) return false;

	const prefix = parts.slice(0, -1).join("_");
	const cuid = parts[parts.length - 1];

	if (!cuid) return false;
	return prefix.length > 0 && isCuid(cuid);
}

/**
 * Gera um ID semântico combinando um prefixo com um CUID2.
 * @param prefix O prefixo para o ID semântico.
 * @returns Uma string contendo o prefixo seguido por um underscore e um CUID2.
 */
export function semanticId(prefix: string): string {
	return `${prefix}_${createId()}`;
}
