import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AboutPage } from "../../pages";

describe(AboutPage, () => {
    test("displays expected content", () => {
        render(<AboutPage />);

        expect(screen.getByText(/Hi, I'm Harry!/i)).toBeInTheDocument();
        expect(screen.getByText(/full stack developer/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /traditional territories of the peoples of Treaty 7/i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "github" })
        ).toBeInTheDocument();
    });

    test("applies correct CSS classes", () => {
        render(<AboutPage />);

        expect(screen.getByTestId("about-page")).toHaveClass(
            "flex",
            "flex-col",
            "w-3/4"
        );
        expect(screen.getByText(/Hi, I'm Harry!/i)).toHaveClass(
            "text-3xl",
            "mb-5"
        );
    });

    test("includes appropriate accessibility attributes", () => {
        render(<AboutPage />);

        expect(screen.getByTestId("about-page")).toHaveAccessibleName(
            "About Page"
        );
    });
});
