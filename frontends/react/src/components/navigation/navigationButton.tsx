import React from "react";
import { NavLink } from "react-router-dom";

export interface INavigationButtonProps {
	label: string;
	href: string;
}

export const NavigationButton: React.FC<INavigationButtonProps> = ({ label, href }) => {
	return (
		<NavLink
			to={href}
			className={({ isActive }) =>
				`mx-5 text-xs tracking-widest uppercase transition-colors duration-200 ${
					isActive ? "text-gray-900 border-b border-gray-900 pb-0.5" : "text-gray-400 hover:text-gray-900"
				}`
			}
		>
			{label}
		</NavLink>
	);
};
