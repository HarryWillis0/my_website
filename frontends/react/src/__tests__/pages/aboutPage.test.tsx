import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AboutPage } from "src/pages";

describe(AboutPage, () => {
	test("displays expected content", () => {
		render(<AboutPage />);

		expect(screen.getByText(/About/i)).toBeInTheDocument();
		expect(screen.getByText(/full stack developer/i)).toBeInTheDocument();
		expect(screen.getByText(/traditional territories of the peoples of Treaty 7/i)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "github" })).toBeInTheDocument();
	});

	test("applies correct CSS classes", () => {
		render(<AboutPage />);

		expect(screen.getByTestId("about-page")).toHaveClass("flex", "flex-col");
		expect(screen.getByText(/About/i)).toHaveClass(
			"font-serif",
			"text-3xl",
			"font-semibold",
			"text-gray-900",
			"mb-4",
			"leading-snug"
		);
	});

	test("includes appropriate accessibility attributes", () => {
		render(<AboutPage />);

		expect(screen.getByTestId("about-page")).toHaveAccessibleName("About Page");
	});
});
