import type { IArticle, IArticleDto } from '$lib/types';
import { mapDtoToArticle } from '$lib/utils/mapDtoToArticle';
import type { IArticleService } from '$lib/services/IArticleService';

import rawArticles from '$lib/data/articles.json';

const articlesData = rawArticles as { articles: IArticleDto[] };

export class FileArticleService implements IArticleService {
	async getArticles(): Promise<IArticle[]> {
		if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
			throw new Error('Invalid articles data format');
		}

		return articlesData.articles.map(mapDtoToArticle);
	}

	async getArticleById(id: string): Promise<IArticle | null> {
		if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
			throw new Error('Invalid articles data format');
		}

		const articleDto = articlesData.articles.find((article) => article.id === id);
		return articleDto ? mapDtoToArticle(articleDto) : null;
	}
}
