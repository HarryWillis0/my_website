import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Footer } from "../../components/footer";

describe(Footer, () => {
    test("renders GitHub icon link with correct attributes", () => {
        render(<Footer />);

        const githubLink = screen.getByRole("link", { name: "github" });

        expect(githubLink).toHaveAttribute(
            "href",
            "https://github.com/HarryWillis0"
        );
        expect(githubLink).toHaveAttribute("target", "_blank");
        expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    test("renders Strava icon link with correct attributes", () => {
        render(<Footer />);

        const stravaLink = screen.getByRole("link", { name: "strava" });

        expect(stravaLink).toHaveAttribute(
            "href",
            "https://www.strava.com/athletes/17003155"
        );
        expect(stravaLink).toHaveAttribute("target", "_blank");
        expect(stravaLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    test("renders GitHub icon link", () => {
        render(<Footer />);

        const githubIcon = screen
            .getByRole("link", { name: "github" })
            .querySelector("i");

        expect(githubIcon).toHaveClass("fa-brands", "fa-github");
    });

    test("renders Strava icon link", () => {
        render(<Footer />);

        const stravaIcon = screen
            .getByRole("link", { name: "strava" })
            .querySelector("i");

        expect(stravaIcon).toHaveClass("fab", "fa-strava");
    });
});
