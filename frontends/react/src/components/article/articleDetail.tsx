import React from "react";
import ReactMarkdown from "react-markdown";

import { IArticle } from "src/types";

interface IArticleDetailProps {
	article: IArticle;
}

const formatDate = (date: Date) =>
	date.toLocaleDateString("en-CA", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

export const ArticleDetail: React.FC<IArticleDetailProps> = ({ article }) => {
	const showUpdated = article.lastModifiedAt !== article.lastModifiedAt;
	return (
		<>
			{/* Header */}
			<div className="border-t border-gray-200 pt-6 mb-8">
				<h1 className="font-serif text-3xl font-semibold text-gray-900 leading-snug mb-3">{article.title}</h1>
				<p className="text-sm text-gray-400 italic font-serif mb-3">{article.summary}</p>
				<div className="flex gap-4 text-xs tracking-widest uppercase text-gray-300">
					<span>{formatDate(article.created)}</span>
					{showUpdated && <span>Updated {formatDate(article.lastModifiedAt)}</span>}
				</div>
			</div>

			{/* Body */}
			<ReactMarkdown
				components={{
					p: ({ children }) => <p className="text-sm text-gray-500 leading-relaxed mb-4">{children}</p>,
					h2: ({ children }) => (
						<h2 className="font-serif text-xl font-semibold text-gray-900 mt-8 mb-3 leading-snug">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="font-serif text-lg font-semibold text-gray-900 mt-6 mb-2 leading-snug">
							{children}
						</h3>
					),
					ul: ({ children }) => (
						<ul className="list-disc list-inside text-sm text-gray-500 leading-relaxed mb-4 space-y-1">
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol className="list-decimal list-inside text-sm text-gray-500 leading-relaxed mb-4 space-y-1">
							{children}
						</ol>
					),
					blockquote: ({ children }) => (
						<blockquote className="border-l-2 border-gray-200 pl-4 my-4 text-sm text-gray-400 italic font-serif">
							{children}
						</blockquote>
					),
					code: ({ children }) => (
						<code className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 font-mono">{children}</code>
					),
					pre: ({ children }) => (
						<pre className="bg-gray-50 text-gray-600 text-xs font-mono p-4 mb-4 overflow-x-auto">
							{children}
						</pre>
					),
					a: ({ href, children }) => (
						<a
							href={href}
							className="text-gray-900 underline hover:text-gray-500 transition-colors duration-200"
						>
							{children}
						</a>
					),
					hr: () => <hr className="border-gray-100 my-8" />,
				}}
			>
				{article.body}
			</ReactMarkdown>
		</>
	);
};
