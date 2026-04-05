import { IArticle } from "../types";
import { mapDtoToArticle } from "../utils/mapDtoToArticle";
import { IArticleService } from "./IArticleService";
import articlesData from "../data/articles.json";

export class FileArticleService implements IArticleService {
	async getArticles(): Promise<IArticle[]> {
		if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
			throw new Error("Invalid articles data format");
		}

		return articlesData.articles.map(mapDtoToArticle);
	}
}
