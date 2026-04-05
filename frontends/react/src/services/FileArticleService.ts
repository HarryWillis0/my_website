import { IArticle } from "src/types";
import { mapDtoToArticle } from "src/utils/mapDtoToArticle";
import { IArticleService } from "src/services/IArticleService";
import articlesData from "src/data/articles.json";

export class FileArticleService implements IArticleService {
	async getArticles(): Promise<IArticle[]> {
		if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
			throw new Error("Invalid articles data format");
		}

		return articlesData.articles.map(mapDtoToArticle);
	}
}
