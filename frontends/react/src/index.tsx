import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Layout } from "src/components/layout";
import { ArticlesPage, AboutPage, ErrorPage, ArticleDetailsPage } from "src/pages";

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
			{
				path: "articles/:id",
				element: <ArticleDetailsPage />,
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
