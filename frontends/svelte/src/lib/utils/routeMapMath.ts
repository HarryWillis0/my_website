import type { IRoutePoint } from '$lib/types';

// SVG path for a hand-rolled elevation profile: x from cumulative distance,
// y from elevation (inverted, since SVG y grows downward).
export function buildElevationPath(points: IRoutePoint[], width: number, height: number): string {
	if (points.length < 2) return '';

	const minDistance = points[0].distance;
	const maxDistance = points[points.length - 1].distance;
	const distanceRange = maxDistance - minDistance || 1;

	const elevations = points.map((p) => p.ele);
	const minEle = Math.min(...elevations);
	const maxEle = Math.max(...elevations);
	const eleRange = maxEle - minEle;

	const toX = (distance: number) => ((distance - minDistance) / distanceRange) * width;
	const toY = (ele: number) =>
		eleRange === 0 ? height / 2 : height - ((ele - minEle) / eleRange) * height;

	return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.distance)},${toY(p.ele)}`).join(' ');
}

export function computeBounds(points: IRoutePoint[]): {
	minLon: number;
	minLat: number;
	maxLon: number;
	maxLat: number;
} {
	const lons = points.map((p) => p.lon);
	const lats = points.map((p) => p.lat);

	return {
		minLon: Math.min(...lons),
		minLat: Math.min(...lats),
		maxLon: Math.max(...lons),
		maxLat: Math.max(...lats)
	};
}

export function formatDistanceKm(meters: number): string {
	return `${(meters / 1000).toFixed(1)} km`;
}

export function formatElevationGainMeters(meters: number): string {
	return `${Math.round(meters)} m`;
}
