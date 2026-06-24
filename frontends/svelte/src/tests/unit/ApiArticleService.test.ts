import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { IArticleDto } from '$lib/types';

import { ApiArticleService } from '$lib/services/ApiArticleService';

const testDtos: IArticleDto[] = [
	{
		id: '1',
		title: 'First Article',
		summary: 'First summary',
		body: 'First body',
		created: '2024-01-01T12:00:00Z',
		lastModifiedAt: '2024-01-01T12:00:00Z'
	}
];

function mockFetch(body: unknown, status = 200) {
	return vi.spyOn(global, 'fetch').mockResolvedValue(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' }
		})
	);
}

describe('ApiArticleService', () => {
	let service: ApiArticleService;

	beforeEach(() => {
		service = new ApiArticleService('http://test-api');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getArticles', () => {
		it('fetches from the correct endpoint', async () => {
			const spy = mockFetch(testDtos);
			await service.getArticles();
			expect(spy).toHaveBeenCalledWith('http://test-api/articles');
		});

		it('returns mapped articles with Date objects', async () => {
			mockFetch(testDtos);
			const articles = await service.getArticles();
			expect(articles).toHaveLength(1);
			expect(articles[0].created).toBeInstanceOf(Date);
			expect(articles[0].lastModifiedAt).toBeInstanceOf(Date);
		});

		it('throws on non-ok response', async () => {
			mockFetch({}, 500);
			await expect(service.getArticles()).rejects.toThrow();
		});
	});

	describe('getArticleById', () => {
		it('fetches from the correct endpoint', async () => {
			const spy = mockFetch(testDtos[0]);
			await service.getArticleById('1');
			expect(spy).toHaveBeenCalledWith('http://test-api/articles/1');
		});

		it('returns a mapped article with Date objects', async () => {
			mockFetch(testDtos[0]);
			const article = await service.getArticleById('1');
			expect(article?.created).toBeInstanceOf(Date);
			expect(article?.lastModifiedAt).toBeInstanceOf(Date);
		});

		it('returns null on 404', async () => {
			mockFetch({}, 404);
			const article = await service.getArticleById('missing');
			expect(article).toBeNull();
		});

		it('throws on other non-ok responses', async () => {
			mockFetch({}, 500);
			await expect(service.getArticleById('1')).rejects.toThrow();
		});
	});
});
