<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import type { IRoute } from '$lib/types';
	import {
		buildElevationPath,
		computeBounds,
		formatDistanceKm,
		formatElevationGainMeters
	} from '$lib/utils/routeMapMath';

	let { route, name }: { route: IRoute; name: string } = $props();

	const CHART_WIDTH = 100;
	const CHART_HEIGHT = 40;

	let mapContainer: HTMLDivElement;
	let map: import('maplibre-gl').Map | undefined;

	const elevationPath = () => buildElevationPath(route.points, CHART_WIDTH, CHART_HEIGHT);

	onMount(() => {
		if (!browser || route.points.length === 0) return;

		let cancelled = false;

		(async () => {
			const { Map: MapLibreMap } = await import('maplibre-gl');
			if (cancelled) return;

			const bounds = computeBounds(route.points);
			const instance = new MapLibreMap({
				container: mapContainer,
				style: 'https://tiles.openfreemap.org/styles/liberty'
			});
			map = instance;

			instance.fitBounds(
				[
					[bounds.minLon, bounds.minLat],
					[bounds.maxLon, bounds.maxLat]
				],
				{ padding: 20, duration: 0 }
			);

			instance.on('load', () => {
				instance.addSource('route', {
					type: 'geojson',
					data: {
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'LineString',
							coordinates: route.points.map((p) => [p.lon, p.lat])
						}
					}
				});

				instance.addLayer({
					id: 'route-line',
					type: 'line',
					source: 'route',
					layout: { 'line-join': 'round', 'line-cap': 'round' },
					paint: { 'line-color': '#e11d48', 'line-width': 3 }
				});
			});
		})();

		return () => {
			cancelled = true;
		};
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div class="route-map">
	<p class="route-map-fallback mb-2 text-sm text-gray-500">
		{name} — {formatDistanceKm(route.distance)}, {formatElevationGainMeters(route.elevationGain)} elevation
		gain
	</p>

	<div
		bind:this={mapContainer}
		class="route-map-canvas h-80 w-full"
		role="img"
		aria-label={`Map of ${name}`}
	></div>

	<svg
		class="route-map-elevation mt-2 w-full"
		viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
		preserveAspectRatio="none"
		role="img"
		aria-label={`Elevation profile of ${name}`}
	>
		<path
			d={elevationPath()}
			fill="none"
			stroke="#e11d48"
			stroke-width="1"
			vector-effect="non-scaling-stroke"
		/>
	</svg>
</div>
