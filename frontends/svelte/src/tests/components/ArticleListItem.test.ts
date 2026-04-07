import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

import ArticleListItem from '$lib/components/article/ArticleListItem.svelte';
import type { IArticle } from '$lib/types';

const mockArticle: IArticle = {
	id: '1',
	title: 'First Article',
	summary: 'First summary',
	body: 'First body',
	created: new Date('2024-01-01'),
	lastModifiedAt: new Date('2024-01-01')
};

describe('ArticleListItem', () => {
	it('renders article title and summary', () => {
		render(ArticleListItem, { props: { article: mockArticle, index: 0 } });
		expect(screen.getByText('First Article')).toBeInTheDocument();
		expect(screen.getByText('First summary')).toBeInTheDocument();
	});

	it('links to the correct article page', () => {
		render(ArticleListItem, { props: { article: mockArticle, index: 0 } });
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/articles/1');
	});

	it('renders article index correctly', () => {
		render(ArticleListItem, { props: { article: mockArticle, index: 0 } });
		const indexElement = screen.getByText('01');
		expect(indexElement).toBeInTheDocument();
	});
});
