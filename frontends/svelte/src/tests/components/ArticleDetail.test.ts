import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

import ArticleDetail from '$lib/components/article/ArticleDetail.svelte';
import type { IArticle } from '$lib/types';

const mockArticle: IArticle = {
	id: 'test-1',
	title: 'Test Article',
	summary: 'A test summary',
	body: 'Some body text',
	created: new Date('2024-01-01'),
	lastModifiedAt: new Date('2024-01-01')
};

describe('ArticleDetail', () => {
	it('displays view count in the metadata row', () => {
		render(ArticleDetail, { props: { article: mockArticle, viewCount: 42 } });
		expect(screen.getByText('42 VIEWS')).toBeInTheDocument();
	});

	it('formats view count with commas', () => {
		render(ArticleDetail, { props: { article: mockArticle, viewCount: 1234 } });
		expect(screen.getByText('1,234 VIEWS')).toBeInTheDocument();
	});

	it('shows 0 VIEWS for zero count', () => {
		render(ArticleDetail, { props: { article: mockArticle, viewCount: 0 } });
		expect(screen.getByText('0 VIEWS')).toBeInTheDocument();
	});
});
