import React from "react";
import { Link, NavLink } from "react-router-dom";

import "./navigation.css";

export interface INavigationButtonProps {
    label: string;
    href: string;
}

export const NavigationButton: React.FC<INavigationButtonProps> = ({
    label,
    href,
}) => {
    return (
        <NavLink
            to={href}
            className={({ isActive }) => (isActive ? "mx-5 active" : "mx-5")}
        >
            {label}
        </NavLink>
    );
};
