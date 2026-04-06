import { IArticle, IArticleDto } from "src/types";
import { mapDtoToArticle } from "src/utils/mapDtoToArticle";
import { IArticleService } from "src/services/IArticleService";
import rawData from "src/data/articles.json";

const articlesData = rawData as { articles: IArticleDto[] };

export class FileArticleService implements IArticleService {
	async getArticles(): Promise<IArticle[]> {
		if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
			throw new Error("Invalid articles data format");
		}

		return articlesData.articles.map(mapDtoToArticle);
	}

	async getArticleById(id: string): Promise<IArticle | null> {
		if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
			throw new Error("Invalid articles data format");
		}

		const articleDto = articlesData.articles.find((article) => article.id === id);
		return articleDto ? mapDtoToArticle(articleDto) : null;
	}
}
