import React, { PropsWithChildren } from "react";

import { Navigation } from "./navigation";

import "../styles/main.css";

export const Shell: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="min-h-screen p-8 font-sans">
			<Navigation />
			<main className="max-w-2xl mx-auto mt-8">{children}</main>
		</div>
	);
};
