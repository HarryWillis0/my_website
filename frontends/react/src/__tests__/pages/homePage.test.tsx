import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { HomePage } from "../../pages";

describe(HomePage, () => {
    test("renders image with correct attributes", () => {
        render(<HomePage />);

        const image = screen.getByAltText("The sea");

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
            "src",
            "https://storage.googleapis.com/personal_website_harry/000392990028.jpg"
        );
    });

    test("applies correct CSS classes", () => {
        render(<HomePage />);
        expect(screen.getByTestId("home-page-img")).toHaveClass("w-4/6");
    });

    test("is accessible", () => {
        render(<HomePage />);
        
        const image = screen.getByAltText("The sea");

        expect(image).toHaveAccessibleName("The sea");
    });
});
