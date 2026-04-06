import { IArticle } from "src/types/article";

export interface IArticleService {
	getArticles: () => Promise<IArticle[]>;
	getArticleById: (id: string) => Promise<IArticle | null>;
}
