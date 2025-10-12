"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Providers as ReduxProvider } from "@/redux/provider";
import { useViewportHeight } from "@/hooks/useViewportHeight";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
	interface RouterConfig {
		routerOptions: NonNullable<
			Parameters<ReturnType<typeof useRouter>["push"]>[1]
		>;
	}
}

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();

	// Update CSS variable for viewport height to improve mobile layout behavior
	useViewportHeight();

	return (
		<ReduxProvider>
			<HeroUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
			</HeroUIProvider>
		</ReduxProvider>
	);
}
