import React from "react";
import { Link } from "react-router-dom";

export const BackToArticles: React.FC = () => {
	return (
		<div className="border-t border-gray-100 mt-8 pt-6">
			<Link
				to="/articles"
				className="text-xs tracking-widests uppercase text-gray-300 hover:text-gray-900 transition-colors duration-200 no-underline"
			>
				← All articles
			</Link>
		</div>
	);
};
