import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import { useNavigate } from "react-router-dom";

const mockJson: { articles: any[] } = { articles: [] };

jest.mock("src/data/articles.json", () => mockJson);

import { FileArticleService } from "src/services";
import { ArticleDetailsPage } from "src/pages";
import { IArticle } from "src/types";

jest.mock("react-router-dom", () => ({
	useNavigate: jest.fn(),
	useParams: jest.fn().mockReturnValue({ id: "1" }),
	Link: ({ to, children, ...props }: any) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

jest.mock("react-markdown", () => {
	return function DummyMarkdown({ children }: { children: React.ReactNode }) {
		return <>{children}</>;
	};
});

jest.mock("src/services", () => ({
	FileArticleService: jest.fn(),
}));

const mockNavigate = jest.mocked(useNavigate);
const MockFileArticleService = jest.mocked(FileArticleService);

describe(ArticleDetailsPage, () => {
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

	test("displays article details on mount when article exists", async () => {
		const mockGetArticleById = jest
			.fn<(id: string) => Promise<IArticle | null>>()
			.mockResolvedValue(mockArticles[0]);
		MockFileArticleService.mockImplementation(
			() =>
				({
					getArticleById: mockGetArticleById,
				}) as any
		);

		render(<ArticleDetailsPage />);

		await waitFor(() => {
			expect(mockGetArticleById).toHaveBeenCalledWith("1");
			expect(screen.getByText("Test Article 1")).toBeInTheDocument();
			expect(screen.getByText("This is a test article")).toBeInTheDocument();
		});
	});

	test("displays article not found message when article does not exist", async () => {
		const mockGetArticleById = jest.fn<(id: string) => Promise<IArticle | null>>().mockResolvedValue(null);
		MockFileArticleService.mockImplementation(
			() =>
				({
					getArticleById: mockGetArticleById,
				}) as any
		);

		render(<ArticleDetailsPage />);

		await waitFor(() => {
			expect(screen.getByText("Article not found")).toBeInTheDocument();
			expect(screen.getByText("The article you are looking for does not exist.")).toBeInTheDocument();
		});
	});

	test("navigates to error page when fetching fails", async () => {
		const mockNavigateFn = jest.fn();
		mockNavigate.mockReturnValue(mockNavigateFn);

		const mockGetArticleById = jest
			.fn<(id: string) => Promise<IArticle | null>>()
			.mockRejectedValue(new Error("Fetch failed"));
		MockFileArticleService.mockImplementation(
			() =>
				({
					getArticleById: mockGetArticleById,
				}) as any
		);

		render(<ArticleDetailsPage />);

		await waitFor(() => {
			expect(mockNavigateFn).toHaveBeenCalledWith("/error");
		});
	});
});
