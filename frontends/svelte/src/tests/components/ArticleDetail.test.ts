import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';

import ArticleDetail from '$lib/components/article/ArticleDetail.svelte';
import type { IArticle, IRoute } from '$lib/types';

vi.mock('maplibre-gl', () => ({
	Map: vi.fn(() => ({ fitBounds: vi.fn(), on: vi.fn(), remove: vi.fn() })),
	setWorkerUrl: vi.fn()
}));
vi.mock('$app/environment', () => ({ browser: true }));

const mockArticle: IArticle = {
	id: 'test-1',
	title: 'Test Article',
	summary: 'A test summary',
	body: 'Some body text',
	created: new Date('2024-01-01'),
	lastModifiedAt: new Date('2024-01-01')
};

const articleWithImages: IArticle = {
	...mockArticle,
	body: '![First image](/first.jpg)\n\n![Second image](/second.jpg)'
};

const mockRoute: IRoute = {
	points: [
		{ lat: 51.5, lon: -116.5, ele: 1000, distance: 0 },
		{ lat: 51.6, lon: -116.4, ele: 1200, distance: 500 }
	],
	distance: 500,
	elevationGain: 200
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

	it('does not render a route map when the article has no route', () => {
		render(ArticleDetail, { props: { article: mockArticle, viewCount: 0 } });
		expect(screen.queryByRole('img', { name: /map of/i })).not.toBeInTheDocument();
	});

	it('renders the route map when the article has a route', () => {
		render(ArticleDetail, {
			props: { article: { ...mockArticle, route: mockRoute }, viewCount: 0 }
		});
		expect(screen.getByRole('img', { name: /map of test article/i })).toBeInTheDocument();
	});

	it('positions the route map after the header and before the prose body', () => {
		const { container } = render(ArticleDetail, {
			props: { article: { ...mockArticle, route: mockRoute }, viewCount: 0 }
		});

		const header = container.querySelector('h1')?.closest('div');
		const routeMap = container.querySelector('.route-map');
		const prose = container.querySelector('.prose-custom');

		const headerToRouteMap = header!.compareDocumentPosition(routeMap!);
		const routeMapToProse = routeMap!.compareDocumentPosition(prose!);

		expect(headerToRouteMap & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(routeMapToProse & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('writes a data-index attribute onto each rendered image', () => {
		const { container } = render(ArticleDetail, {
			props: { article: articleWithImages, viewCount: 0 }
		});

		const images = container.querySelectorAll('.prose-custom img');
		expect(images[0]).toHaveAttribute('data-index', '0');
		expect(images[1]).toHaveAttribute('data-index', '1');
	});

	it('opens the lightbox on the clicked image when an image in the body is clicked', async () => {
		const { container } = render(ArticleDetail, {
			props: { article: articleWithImages, viewCount: 0 }
		});

		const secondImage = container.querySelectorAll('.prose-custom img')[1];
		await fireEvent.click(secondImage);

		const dialog = container.querySelector('dialog');
		expect(dialog?.open).toBe(true);
		const lightboxImg = dialog!.querySelector('img');
		expect(lightboxImg).toHaveAttribute('src', '/second.jpg');
		expect(lightboxImg).toHaveAttribute('alt', 'Second image');
	});

	it('does not open the lightbox when clicking outside an image', async () => {
		const { container } = render(ArticleDetail, {
			props: { article: articleWithImages, viewCount: 0 }
		});

		await fireEvent.click(container.querySelector('.prose-custom')!);

		expect(container.querySelector('dialog')?.open).toBe(false);
	});
});
