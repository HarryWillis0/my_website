import { describe, it, expect } from 'vitest';

import type { IArticleDto, IArticle } from '$lib/types';
import { mapDtoToArticle } from '$lib/utils/mapDtoToArticle';

describe('mapDtoToArticle', () => {
	it('correctly maps valid DTO to Article', () => {
		const dto = {
			id: '1',
			title: 'Test Article',
			summary: 'This is a test article',
			body: '# Body',
			created: '2025-01-01T00:00:00.000Z',
			lastModifiedAt: '2025-01-02T00:00:00.000Z'
		};

		const article = mapDtoToArticle(dto);

		expect(article).toEqual({
			id: '1',
			title: 'Test Article',
			summary: 'This is a test article',
			body: '# Body',
			created: new Date('2025-01-01T00:00:00.000Z'),
			lastModifiedAt: new Date('2025-01-02T00:00:00.000Z')
		});
	});

	it('throws error for invalid created date', () => {
		const dto = {
			id: '1',
			title: 'Test Article',
			summary: 'This is a test article',
			body: '# Body',
			created: 'invalid date',
			lastModifiedAt: '2025-01-02T00:00:00.000Z'
		};

		expect(() => mapDtoToArticle(dto)).toThrow('Invalid date in article 1');
	});

	it('throws error for invalid lastModifiedAt date', () => {
		const dto = {
			id: '1',
			title: 'Test Article',
			summary: 'This is a test article',
			body: '# Body',
			created: '2025-01-01T00:00:00.000Z',
			lastModifiedAt: 'invalid date'
		};

		expect(() => mapDtoToArticle(dto)).toThrow('Invalid date in article 1');
	});

	it('attaches route when one is provided', () => {
		const dto: IArticleDto = {
			id: '1',
			title: 'Test Article',
			summary: 'This is a test article',
			body: '# Body',
			created: '2025-01-01T00:00:00.000Z',
			lastModifiedAt: '2025-01-02T00:00:00.000Z'
		};
		const route = {
			points: [{ lat: 37.7749, lon: -122.4194, ele: 10, distance: 0 }],
			distance: 1000,
			elevationGain: 50
		};

		const article: IArticle = mapDtoToArticle(dto, route);

		expect(article.route).toEqual(route);
	});

	it('leaves route undefined when none is provided', () => {
		const dto: IArticleDto = {
			id: '1',
			title: 'Test Article',
			summary: 'This is a test article',
			body: '# Body',
			created: '2025-01-01T00:00:00.000Z',
			lastModifiedAt: '2025-01-02T00:00:00.000Z'
		};

		expect(mapDtoToArticle(dto).route).toBeUndefined();
	});

	it('leaves route undefined when explicitly null', () => {
		const dto: IArticleDto = {
			id: '1',
			title: 'Test Article',
			summary: 'This is a test article',
			body: '# Body',
			created: '2025-01-01T00:00:00.000Z',
			lastModifiedAt: '2025-01-02T00:00:00.000Z'
		};

		expect(mapDtoToArticle(dto, null).route).toBeUndefined();
	});
});
