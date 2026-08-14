import { adminClient, lastLoginMethodClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
	plugins: [lastLoginMethodClient(), adminClient()],
});

export const {
	signIn,
	signUp,
	sendVerificationEmail,
	requestPasswordReset,
	resetPassword,
	useSession,
} = authClient;

export function getAuthCallbackURL(path: `/${string}` = "/") {
	const origin =
		typeof window !== "undefined"
			? window.location.origin
			: process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

	return `${origin}${path}`;
}
