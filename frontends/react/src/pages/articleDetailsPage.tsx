import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { IArticle } from "src/types";
import { IArticleService } from "src/services/IArticleService";
import { FileArticleService } from "src/services";
import { ArticleDetail } from "src/components/article/articleDetail";
import { BackToArticles } from "src/components/article/backToArticles";

export const ArticleDetailsPage: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [article, setArticle] = React.useState<IArticle | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		const fetch = async (idToFetch: string) => {
			setIsLoading(true);

			try {
				const articleService: IArticleService = new FileArticleService();
				const found = await articleService.getArticleById(idToFetch);
				if (found) {
					setArticle(found);
				}
			} catch (error) {
				navigate("/error");
			} finally {
				setIsLoading(false);
			}
		};

		if (id) {
			fetch(id);
		}
	}, [id]);

	if (isLoading) {
		return null;
	}

	if (!article) {
		return (
			<div className="flex flex-col">
				<div className="border-t border-gray-200 pt-6">
					<h1 className="font-serif text-3xl font-semibold text-gray-900 mb-4 leading-snug">
						Article not found
					</h1>
					<p className="text-sm text-gray-500 leading-relaxed">
						The article you are looking for does not exist.
					</p>
				</div>
				<BackToArticles />
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<ArticleDetail article={article} />
			<BackToArticles />
		</div>
	);
};
