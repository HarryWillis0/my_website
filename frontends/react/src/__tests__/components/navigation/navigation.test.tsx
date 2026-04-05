import React from "react";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { Navigation } from "src/components/navigation";

describe(Navigation, () => {
	test('renders "ABOUT" link correctly', () => {
		render(
			<Router>
				<Navigation />
			</Router>
		);

		const aboutLink = screen.getByRole("link", { name: "ABOUT" });
		expect(aboutLink).toHaveAttribute("href", "/");
	});

	test('renders "ARTICLES" link correctly', () => {
		render(
			<Router>
				<Navigation />
			</Router>
		);

		const articlesLink = screen.getByRole("link", { name: "ARTICLES" });
		expect(articlesLink).toHaveAttribute("href", "/articles");
	});
});
