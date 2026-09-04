import { describe, it, expect } from 'vitest';

import type { IRoutePoint } from '$lib/types';
import {
	buildElevationPath,
	computeBounds,
	formatDistanceKm,
	formatElevationGainMeters
} from '$lib/utils/routeMapMath';

const fixturePoints: IRoutePoint[] = [
	{ lat: 51.5, lon: -116.5, ele: 1000, distance: 0 },
	{ lat: 51.6, lon: -116.4, ele: 1200, distance: 500 },
	{ lat: 51.7, lon: -116.3, ele: 900, distance: 1000 }
];

describe('buildElevationPath', () => {
	it('starts at the left edge and ends at the right edge of the given width', () => {
		const path = buildElevationPath(fixturePoints, 100, 40);
		const [firstCommand, ...rest] = path.split(' ');
		expect(firstCommand).toMatch(/^M0,/);
		expect(rest.at(-1)).toMatch(/^L100,/);
	});

	it('maps the highest point to y=0', () => {
		const path = buildElevationPath(fixturePoints, 100, 40);
		// second point (ele 1200) is the max elevation -> y should be 0
		expect(path).toContain('L50,0');
	});

	it('returns a flat horizontal line when all points share the same elevation', () => {
		const flatPoints: IRoutePoint[] = [
			{ lat: 0, lon: 0, ele: 500, distance: 0 },
			{ lat: 0, lon: 1, ele: 500, distance: 100 }
		];
		const path = buildElevationPath(flatPoints, 100, 40);
		expect(path).toBe('M0,20 L100,20');
	});

	it('returns an empty string for fewer than 2 points', () => {
		expect(buildElevationPath([], 100, 40)).toBe('');
		expect(buildElevationPath([fixturePoints[0]], 100, 40)).toBe('');
	});
});

describe('computeBounds', () => {
	it('returns the min/max lon/lat across all points', () => {
		expect(computeBounds(fixturePoints)).toEqual({
			minLon: -116.5,
			minLat: 51.5,
			maxLon: -116.3,
			maxLat: 51.7
		});
	});
});

describe('formatDistanceKm', () => {
	it('converts meters to kilometers with one decimal place', () => {
		expect(formatDistanceKm(1000)).toBe('1.0 km');
		expect(formatDistanceKm(15234)).toBe('15.2 km');
	});
});

describe('formatElevationGainMeters', () => {
	it('rounds meters to the nearest whole number', () => {
		expect(formatElevationGainMeters(542.7)).toBe('543 m');
		expect(formatElevationGainMeters(0)).toBe('0 m');
	});
});
