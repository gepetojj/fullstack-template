import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";

import "./globals.css";

import { QueryProvider } from "@/components/context/query-provider";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const merriweatherHeading = Merriweather({
	subsets: ["latin"],
	variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Fullstack Template",
	description: "A fullstack template for Next.js",
};

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="pt-BR"
			className={cn(
				"h-full font-sans antialiased",
				inter.variable,
				merriweatherHeading.variable,
			)}
		>
			<body className="flex min-h-full flex-col">
				<QueryProvider>
					<TooltipProvider>
						{children}
						<Toaster />
					</TooltipProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
