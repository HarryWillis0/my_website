import React from "react";
import { useNavigate } from "react-router-dom";

import { IArticle } from "../types";
import { FileArticleService, type IArticleService } from "../services";
import { ArticleList } from "../components/article/articleList";

export const ArticlesPage: React.FC = () => {
	const [articles, setArticles] = React.useState<IArticle[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const navigate = useNavigate();

	React.useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			try {
				const articleService: IArticleService = new FileArticleService();
				const articles = await articleService.getArticles();

				setArticles(articles);
			} catch (error) {
				navigate("/error");
			} finally {
				setIsLoading(false);
			}
		};

		if (!isLoading) {
			fetch();
		}
	}, [isLoading]);

	return (
		<div className="max-w-[800px] mx-auto flex-1">
			<ArticleList articles={articles} />
		</div>
	);
};
