import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';

import ArticleDetail from '$lib/components/article/ArticleDetail.svelte';
import type { IArticle, IRoute } from '$lib/types';

vi.mock('maplibre-gl', () => ({
	Map: vi.fn(() => ({ fitBounds: vi.fn(), on: vi.fn(), remove: vi.fn() }))
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

	// RouteMap rendering is temporarily disabled (crashes on unmount) — skipped
	// until that's fixed and the component is re-enabled in ArticleDetail.svelte.
	it.skip('renders the route map when the article has a route', () => {
		render(ArticleDetail, {
			props: { article: { ...mockArticle, route: mockRoute }, viewCount: 0 }
		});
		expect(screen.getByRole('img', { name: /map of test article/i })).toBeInTheDocument();
	});

	it.skip('positions the route map after the header and before the prose body', () => {
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
});
