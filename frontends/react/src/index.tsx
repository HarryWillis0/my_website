import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Layout } from "./components/layout";
import { ArticlesPage, AboutPage, ErrorPage } from "./pages";

const router = createBrowserRouter([
	{
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <AboutPage />,
			},
			{
				path: "articles",
				element: <ArticlesPage />,
			},
		],
	},
]);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
