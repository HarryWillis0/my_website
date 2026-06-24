import React from "react";

import { NavigationButton } from ".";

export const Navigation: React.FC = () => {
	return (
		<nav id="nav" className="flex flex-row justify-center mb-10">
			<NavigationButton href="/" label="ABOUT" />
			<NavigationButton href="/articles" label="ARTICLES" />
		</nav>
	);
};
