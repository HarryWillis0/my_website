import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

import ArticleList from '$lib/components/article/ArticleList.svelte';
import type { IArticle } from '$lib/types';

const mockArticles: IArticle[] = [
	{
		id: '1',
		title: 'First Article',
		summary: 'First summary',
		body: 'First body',
		created: new Date('2024-01-01'),
		lastModifiedAt: new Date('2024-01-01')
	},
	{
		id: '2',
		title: 'Second Article',
		summary: 'Second summary',
		body: 'Second body',
		created: new Date('2024-01-02'),
		lastModifiedAt: new Date('2024-01-02')
	}
];

describe('ArticleList', () => {
	it('renders empty state when no articles', () => {
		render(ArticleList, { props: { articles: [] } });

		expect(screen.getByText('No articles yet — check back soon.')).toBeInTheDocument();
	});

	it('renders a list when articles are provided', () => {
		render(ArticleList, { props: { articles: mockArticles } });

		expect(screen.getByText('First Article')).toBeInTheDocument();
		expect(screen.getByText('Second Article')).toBeInTheDocument();
	});

	it('renders the correct number of articles', () => {
		render(ArticleList, { props: { articles: mockArticles } });

		const links = screen.getAllByRole('link');
		const filteredLinks = links.filter((link) => link.getAttribute('href')?.includes('/articles/'));

		expect(filteredLinks).toHaveLength(mockArticles.length);
	});

	it('renders footer when articles are present', () => {
		render(ArticleList, { props: { articles: mockArticles } });

		expect(screen.getByLabelText('Footer')).toBeInTheDocument();
	});
});
