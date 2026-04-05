import { IArticle } from "../types/article";

export interface IArticleService {
	getArticles: () => Promise<IArticle[]>;
}
