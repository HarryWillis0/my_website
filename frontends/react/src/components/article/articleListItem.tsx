import React from "react";
import { Link } from "react-router-dom";

import { IArticle } from "../../types";

interface IArticleItemProps {
	article: IArticle;
	index: number;
}

export const ArticleListItem: React.FC<IArticleItemProps> = (props) => {
	const { article, index } = props;

	return (
		<Link
			to={`/articles/${article.id}`}
			className="flex gap-3 py-6 border-b border-gray-100 no-underline text-inherit group hover:bg-gray-50 transition-colors duration-200"
		>
			<span className="text-xs text-gray-300 mt-1 shrink-0 italic font-serif">
				{String(index + 1).padStart(2, "0")}
			</span>

			<div className="flex flex-col min-w-0">
				<h2 className="font-serif text-lg font-semibold leading-snug text-gray-900 mb-1.5 group-hover:underline">
					{article.title}
				</h2>
				<p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{article.summary}</p>
				<span className="text-xs tracking-widest uppercase text-gray-300 mt-3">Read more →</span>
			</div>
		</Link>
	);
};
