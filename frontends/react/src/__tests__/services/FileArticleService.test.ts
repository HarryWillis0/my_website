import { jest } from "@jest/globals";

const mockJson: { articles: any[] } = { articles: [] };

jest.mock("../../data/articles.json", () => mockJson);
jest.mock("../../utils/mapDtoToArticle", () => ({
	mapDtoToArticle: jest.fn(),
}));

import { FileArticleService } from "../../services/FileArticleService";
import { mapDtoToArticle } from "../../utils/mapDtoToArticle";

const mockMap = jest.mocked(mapDtoToArticle);

describe("FileArticleService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockJson.articles = [];
	});

	it("throws error when data.articles is not defined", async () => {
		mockJson.articles = {} as any;

		const service = new FileArticleService();
		await expect(service.getArticles()).rejects.toThrow("Invalid articles data format");
	});

	it("throws error when data.articles is not an array", async () => {
		mockJson.articles = "not an array" as any;

		const service = new FileArticleService();
		await expect(service.getArticles()).rejects.toThrow("Invalid articles data format");
	});

	it("returns array of correct length when data.articles is fine", async () => {
		const mockArticle = {
			id: "1",
			title: "Test",
			summary: "Summary",
			body: "# Body",
			created: new Date(),
			lastModifiedAt: new Date(),
		};

		mockMap.mockReturnValue(mockArticle);
		mockJson.articles = [
			{
				...mockArticle,
				created: mockArticle.created.toISOString(),
				lastModifiedAt: mockArticle.lastModifiedAt.toISOString(),
			},
		];

		const service = new FileArticleService();
		const result = await service.getArticles();

		expect(result).toHaveLength(1);
	});
});
