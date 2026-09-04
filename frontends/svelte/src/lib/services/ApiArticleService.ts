import type { IArticle, IArticleDetailDto, IArticleDto } from '$lib/types';
import { mapDtoToArticle } from '$lib/utils/mapDtoToArticle';
import type { IArticleService } from '$lib/services/IArticleService';

export class ApiArticleService implements IArticleService {
	constructor(private readonly baseUrl: string) {}

	async getArticles(): Promise<IArticle[]> {
		const response = await fetch(`${this.baseUrl}/articles`);
		if (!response.ok) {
			throw new Error(`Failed to fetch articles: ${response.status}`);
		}
		const dtos: IArticleDto[] = await response.json();
		return dtos.map((dto) => mapDtoToArticle(dto));
	}

	async getArticleById(id: string): Promise<IArticle | null> {
		const response = await fetch(`${this.baseUrl}/articles/${id}`);
		if (response.status === 404) {
			return null;
		}
		if (!response.ok) {
			throw new Error(`Failed to fetch article: ${response.status}`);
		}
		const { article, route }: IArticleDetailDto = await response.json();
		return mapDtoToArticle(article, route);
	}
}
