import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IArticleDto } from '$lib/types';

import { FileArticleService } from '$lib/services/FileArticleService';

vi.mock('$lib/data/articles.json', () => ({
	default: {
		articles: [
			{
				id: '1',
				title: 'First Article',
				summary: 'First summary',
				body: 'First body',
				created: '2024-01-01T12:00:00Z',
				lastModifiedAt: '2024-01-01T12:00:00Z'
			},
			{
				id: '2',
				title: 'Second Article',
				summary: 'Second summary',
				body: 'Second body',
				created: '2024-01-02T12:00:00Z',
				lastModifiedAt: '2024-01-02T12:00:00Z'
			}
		]
	} as { articles: IArticleDto[] }
}));

describe('FileArticleService', () => {
	let service: FileArticleService;

	beforeEach(() => {
		service = new FileArticleService();
	});

	describe('getArticles', () => {
		it('returns all articles', async () => {
			const articles = await service.getArticles();
			expect(articles).toHaveLength(2);
		});

		it('maps dto dates to Date objects', async () => {
			const articles = await service.getArticles();
			expect(articles[0].created).toBeInstanceOf(Date);
			expect(articles[0].lastModifiedAt).toBeInstanceOf(Date);
		});

		it('returns articles with correct data', async () => {
			const articles = await service.getArticles();
			expect(articles[0].title).toBe('First Article');
			expect(articles[1].title).toBe('Second Article');
		});
	});

	describe('getArticleById', () => {
		it('returns article when found', async () => {
			const article = await service.getArticleById('1');
			expect(article).not.toBeNull();
			expect(article?.title).toBe('First Article');
		});

		it('returns null when article not found', async () => {
			const article = await service.getArticleById('999');
			expect(article).toBeNull();
		});

		it('maps dto dates to Date objects', async () => {
			const article = await service.getArticleById('1');
			expect(article?.created).toBeInstanceOf(Date);
			expect(article?.lastModifiedAt).toBeInstanceOf(Date);
		});
	});
});
