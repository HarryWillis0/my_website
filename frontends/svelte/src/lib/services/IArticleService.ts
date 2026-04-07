import { type IArticle } from '$lib/types/article';

export interface IArticleService {
	getArticles: () => Promise<IArticle[]>;
	getArticleById: (id: string) => Promise<IArticle | null>;
}
