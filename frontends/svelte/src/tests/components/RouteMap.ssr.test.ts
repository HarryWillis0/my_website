import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';

import RouteMap from '$lib/components/route/RouteMap.svelte';
import type { IRoute } from '$lib/types';

const mapConstructor = vi.fn();

vi.mock('maplibre-gl', () => ({ Map: mapConstructor }));
// Simulates server rendering, where onMount never fires but the component
// script still runs — the map must not attempt to initialize here.
vi.mock('$app/environment', () => ({ browser: false }));

const fixtureRoute: IRoute = {
	points: [
		{ lat: 51.5, lon: -116.5, ele: 1000, distance: 0 },
		{ lat: 51.6, lon: -116.4, ele: 1200, distance: 500 }
	],
	distance: 500,
	elevationGain: 200
};

describe('RouteMap (server-side rendering)', () => {
	it('renders the fallback content without constructing a MapLibre map', () => {
		render(RouteMap, { props: { route: fixtureRoute, name: 'Test Route' } });

		expect(screen.getByText(/Test Route/)).toBeInTheDocument();
		expect(mapConstructor).not.toHaveBeenCalled();
	});
});
