import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { IArticle } from "../../../types";
import { ArticleListItem } from "../../../components/article/articleListItem";

jest.mock("react-router-dom", () => ({
	Link: ({ to, children, ...props }: any) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

describe(ArticleListItem, () => {
	const mockArticle: IArticle = {
		id: "1",
		title: "Test Article",
		summary: "This is a test article",
		body: "# Body",
		created: new Date("2025-01-01"),
		lastModifiedAt: new Date("2025-01-01"),
	};

	test("renders article title and summary", () => {
		render(<ArticleListItem article={mockArticle} index={0} />);

		const titleElement = screen.getByText(mockArticle.title);
		const summaryElement = screen.getByText(mockArticle.summary);

		expect(titleElement).toBeInTheDocument();
		expect(summaryElement).toBeInTheDocument();
	});

	test("renders link with correct href", () => {
		render(<ArticleListItem article={mockArticle} index={0} />);

		const linkElement = screen.getByRole("link");

		expect(linkElement).toHaveAttribute("href", `/articles/${mockArticle.id}`);
	});
});
