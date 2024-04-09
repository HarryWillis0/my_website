import React from "react";

import { NavigationButton } from "./navigationButton";

export interface INavigationProps{}

export const Navigation: React.FC<INavigationProps> = () => {
    return (
        <div id="nav" className="flex flex-row justify-center mb-10">
            <NavigationButton href="/" label="HOME" />
            <NavigationButton href="/about" label="ABOUT" />
            <NavigationButton href="/articles" label="ARTICLES" />
        </div>
    );
}