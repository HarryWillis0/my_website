import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter,  } from "react-router-dom";

import { Layout } from "./components/layout";
import { HomePage, ArticlesPage, AboutPage } from "./pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "about",
                element: <AboutPage />
            },
            { 
                path: "articles",
                element: <ArticlesPage />
            }
        ]
    },
]);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
