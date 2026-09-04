import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import RouteMap from '$lib/components/route/RouteMap.svelte';
import type { IRoute } from '$lib/types';

const fitBounds = vi.fn();
const on = vi.fn();
const addSource = vi.fn();
const addLayer = vi.fn();
const remove = vi.fn();

class MockMap {
	fitBounds = fitBounds;
	on = on;
	addSource = addSource;
	addLayer = addLayer;
	remove = remove;
}

vi.mock('maplibre-gl', () => ({ Map: MockMap }));
vi.mock('$app/environment', () => ({ browser: true }));

// This fixture is hand-built, not derived from the real Fernie trip data —
// proving the component isn't coupled to any one route's shape.
const fixtureRoute: IRoute = {
	points: [
		{ lat: 51.5, lon: -116.5, ele: 1000, distance: 0 },
		{ lat: 51.6, lon: -116.4, ele: 1200, distance: 500 },
		{ lat: 51.7, lon: -116.3, ele: 900, distance: 1000 }
	],
	distance: 1000,
	elevationGain: 200
};

describe('RouteMap', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the plain-text fallback with name, distance, and elevation gain', () => {
		render(RouteMap, { props: { route: fixtureRoute, name: 'Test Route' } });

		expect(screen.getByText(/Test Route/)).toBeInTheDocument();
		expect(screen.getByText(/1\.0 km/)).toBeInTheDocument();
		expect(screen.getByText(/200 m/)).toBeInTheDocument();
	});

	it('renders an accessible map region', () => {
		render(RouteMap, { props: { route: fixtureRoute, name: 'Test Route' } });

		expect(screen.getByRole('img', { name: /map of test route/i })).toBeInTheDocument();
	});

	it('renders an elevation chart with a computed path', () => {
		const { container } = render(RouteMap, { props: { route: fixtureRoute, name: 'Test Route' } });

		const path = container.querySelector('.route-map-elevation path');
		expect(path?.getAttribute('d')).toMatch(/^M0,/);
	});

	it('initializes a MapLibre map fitted to the route bounds on mount', async () => {
		render(RouteMap, { props: { route: fixtureRoute, name: 'Test Route' } });

		await waitFor(() => expect(fitBounds).toHaveBeenCalled());
		expect(fitBounds).toHaveBeenCalledWith(
			[
				[-116.5, 51.5],
				[-116.3, 51.7]
			],
			expect.any(Object)
		);
	});

	it('draws the route as a line source once the map loads', async () => {
		render(RouteMap, { props: { route: fixtureRoute, name: 'Test Route' } });

		await waitFor(() => expect(on).toHaveBeenCalledWith('load', expect.any(Function)));
		const loadHandler = on.mock.calls.find(([event]) => event === 'load')?.[1];
		loadHandler();

		expect(addSource).toHaveBeenCalledWith(
			'route',
			expect.objectContaining({
				type: 'geojson',
				data: expect.objectContaining({
					geometry: expect.objectContaining({
						type: 'LineString',
						coordinates: [
							[-116.5, 51.5],
							[-116.4, 51.6],
							[-116.3, 51.7]
						]
					})
				})
			})
		);
		expect(addLayer).toHaveBeenCalled();
	});
});
