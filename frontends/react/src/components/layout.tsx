import React from "react";
import { Outlet } from "react-router-dom";

import { Shell } from "./shell";

export const Layout: React.FC = () => {
	return (
		<Shell>
			<Outlet />
		</Shell>
	);
};
