import React from "react";
import { NavLink } from "react-router-dom";

export interface INavigationButtonProps {
	label: string;
	href: string;
}

export const NavigationButton: React.FC<INavigationButtonProps> = ({ label, href }) => {
	return (
		<NavLink to={href} className={({ isActive }) => (isActive ? "mx-5 border-b border-gray-800" : "mx-5")}>
			{label}
		</NavLink>
	);
};
