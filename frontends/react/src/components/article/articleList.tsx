import React from "react";

import { IArticle } from "src/types";
import { ArticleListItem } from "src/components/article/articleListItem";
import { Footer } from "src/components/footer";

interface IArticleListProps {
	articles: IArticle[];
}

export const ArticleList: React.FC<IArticleListProps> = ({ articles }) => {
	if (articles.length === 0) {
		return (
			<section className="border-t border-gray-200 pt-6" data-testid="article-list-empty" aria-label="Article List">
				<p className="text-sm text-gray-400 italic font-serif">No articles yet — check back soon.</p>
			</section>
		);
	}

	return (
		<section className="flex flex-col border-t border-gray-200" data-testid="article-list" aria-label="Article List">
			{articles.map((article, index) => (
				<ArticleListItem key={article.id} article={article} index={index} />
			))}
			<Footer />
		</section>
	);
};
