import React from "react";

import { NavigationButton } from ".";

export const Navigation: React.FC = () => {
    return (
        <div id="nav" className="flex flex-row justify-center mb-10">
            <NavigationButton href="/" label="HOME" />
            <NavigationButton href="/about" label="ABOUT" />
            <NavigationButton href="/articles" label="ARTICLES" />
        </div>
    );
};
