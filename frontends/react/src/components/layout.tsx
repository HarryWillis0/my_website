import React from "react";
import { Outlet } from "react-router-dom";

import { Navigation } from "./navigation/navigation";

import "../styles/main.css";

export const Layout: React.FC = () => {
    return (
        <div className="p-8">
            <Navigation />
            <div className="flex flex-row justify-center h-full">
                <Outlet />
            </div>
        </div>
    );
};
