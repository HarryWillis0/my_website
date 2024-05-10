import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

import { NavigationButton } from "../../../components/navigation";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useRouteMatch: jest.fn(() => ({
        isExact: true,
        url: "/home", // Set the URL to match with NavLink's "to" prop
    })),
}));

describe(NavigationButton, () => {
    test("renders propped label", () => {
        const label = "HOME";
        const href = "/home";

        render(
            <Router>
                <NavigationButton href={href} label={label} />
            </Router>
        );

        const button: HTMLButtonElement = screen.getByText(label);

        expect(button).toBeInTheDocument();
    });

    test("sets correct href", () => {
        const label = "HOME";
        const href = "/home";

        render(
            <Router>
                <NavigationButton href={href} label={label} />
            </Router>
        );

        const navLink: HTMLAnchorElement | null = screen
            .getByText(label)
            .closest("a");

        expect(navLink).toHaveAttribute("href", href);
    });

    test('applies "active" class when URL matches NavLink "to" prop', () => {
        const label = "HOME";
        const href = "/home";

        render(
            <Router>
                <NavigationButton href={href} label={label} />
            </Router>
        );

        const navLink = screen.getByText(label).closest("a") as Element;

        fireEvent.click(navLink);

        expect(navLink).toHaveClass("active");
    });

    test('does not apply "active" when not clicked', () => {
        const label = "ABOUT";
        const href = "/about";

        render(
            <Router>
                <NavigationButton href={href} label={label} />
            </Router>
        );

        const navLink = screen.getByText(label).closest("a") as Element;

        expect(navLink).not.toHaveClass("active");
    });
});
