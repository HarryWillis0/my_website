import React from "react";
import { Outlet } from "react-router-dom";

import { Navigation } from "./navigation";

import "../styles/main.css";

export const Layout: React.FC = () => {
	return (
		<div className="min-h-screen p-8 font-sans">
			<Navigation />
			<main className="max-w-2xl mx-auto mt-8">
				<Outlet />
			</main>
		</div>
	);
};
