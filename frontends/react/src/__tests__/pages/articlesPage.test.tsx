import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

import { ArticlesPage } from "../../pages";
import * as FileArticleServiceModule from "../../services";

jest.mock("react-router-dom", () => ({
	useNavigate: jest.fn(),
	Link: ({ to, children, ...props }: any) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

jest.mock("../../services", () => ({
	FileArticleService: jest.fn(),
}));

import { useNavigate } from "react-router-dom";
import { IArticle } from "../../types";

const mockNavigate = jest.mocked(useNavigate);
const MockFileArticleService = jest.mocked(FileArticleServiceModule.FileArticleService);

describe(ArticlesPage, () => {
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
	];

	beforeEach(() => {
		jest.clearAllMocks();
		const mockNavigateFn = jest.fn();
		mockNavigate.mockReturnValue(mockNavigateFn);
	});

	test("fetches and displays articles on mount", async () => {
		const mockGetArticles = jest.fn<() => Promise<IArticle[]>>().mockResolvedValue(mockArticles);
		MockFileArticleService.mockImplementation(
			() =>
				({
					getArticles: mockGetArticles,
				}) as any
		);

		render(<ArticlesPage />);

		await waitFor(() => {
			expect(screen.getByTestId("article-list")).toBeInTheDocument();
		});

		expect(mockGetArticles).toHaveBeenCalled();
	});

	test("navigates to error page when fetching fails", async () => {
		const mockNavigateFn = jest.fn();
		mockNavigate.mockReturnValue(mockNavigateFn);

		const mockGetArticles = jest.fn<() => Promise<IArticle[]>>().mockRejectedValue(new Error("Fetch failed"));
		MockFileArticleService.mockImplementation(
			() =>
				({
					getArticles: mockGetArticles,
				}) as any
		);

		render(<ArticlesPage />);

		await waitFor(() => {
			expect(mockNavigateFn).toHaveBeenCalledWith("/error");
		});
	});

	test("renders ArticleList with correct props", async () => {
		const mockGetArticles = jest.fn<() => Promise<IArticle[]>>().mockResolvedValue(mockArticles);
		MockFileArticleService.mockImplementation(
			() =>
				({
					getArticles: mockGetArticles,
				}) as any
		);

		render(<ArticlesPage />);

		await waitFor(() => {
			expect(screen.getByTestId("article-list")).toBeInTheDocument();
		});

		const articleList = screen.getByTestId("article-list");
		expect(articleList).toHaveAccessibleName("Article List");
	});
});
