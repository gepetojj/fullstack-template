import { ResetPasswordForm } from "./_components/form";

function firstParam(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function Page({
	searchParams,
}: PageProps<"/reset-password">) {
	const params = await searchParams;

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<ResetPasswordForm
					token={firstParam(params.token)}
					error={firstParam(params.error)}
				/>
			</div>
		</div>
	);
}
