import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ArticleList } from "../../../components/article/articleList";
import { IArticle } from "../../../types";

jest.mock("react-router-dom", () => ({
	Link: ({ to, children, ...props }: any) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

describe(ArticleList, () => {
	const mockArticles: IArticle[] = [
		{
			id: "1",
			title: "Test Article 1",
			summary: "This is a test article",
			body: "# Body",
			created: new Date("2025-01-01"),
			lastModifiedAt: new Date("2025-01-01"),
		},
		{
			id: "2",
			title: "Test Article 2",
			summary: "Another test article",
			body: "# Body 2",
			created: new Date("2025-01-02"),
			lastModifiedAt: new Date("2025-01-02"),
		},
		{
			id: "3",
			title: "Test Article 3",
			summary: "Third test article",
			body: "# Body 3",
			created: new Date("2025-01-03"),
			lastModifiedAt: new Date("2025-01-03"),
		},
	];

	test("renders correct container attributes", () => {
		render(<ArticleList articles={mockArticles} />);

		const articleList = screen.getByTestId("article-list");

		expect(articleList).toBeInTheDocument();
		expect(articleList).toHaveAttribute("aria-label", "Article List");
		expect(articleList).toHaveClass("flex", "flex-col", "border-t", "border-gray-200");
	});

	test("renders ArticleListItem for each article", () => {
		render(<ArticleList articles={mockArticles} />);

		mockArticles.forEach((article) => {
			expect(screen.getByText(article.title)).toBeInTheDocument();
			expect(screen.getByText(article.summary)).toBeInTheDocument();
		});
	});

	test("renders Footer component", () => {
		render(<ArticleList articles={mockArticles} />);

		const githubLink = screen.getByRole("link", { name: "github" });
		expect(githubLink).toBeInTheDocument();
	});

	test("renders with correct article links", () => {
		render(<ArticleList articles={mockArticles} />);

		mockArticles.forEach((article) => {
			const link = screen.getByRole("link", { name: new RegExp(article.title) });
			expect(link).toHaveAttribute("href", `/articles/${article.id}`);
		});
	});

	test("renders article index numbers correctly", () => {
		render(<ArticleList articles={mockArticles} />);

		mockArticles.forEach((_, index) => {
			const indexText = String(index + 1).padStart(2, "0");
			expect(screen.getByText(indexText)).toBeInTheDocument();
		});
	});

	test("renders empty list message when no articles provided", () => {
		render(<ArticleList articles={[]} />);

		const articleList = screen.getByTestId("article-list-empty");
		expect(articleList).toBeInTheDocument();

		const emptyMessage = screen.getByText("No articles yet — check back soon.");
		expect(emptyMessage).toBeInTheDocument();
		expect(emptyMessage).toHaveClass("text-sm", "text-gray-400", "italic", "font-serif");
	});
});
