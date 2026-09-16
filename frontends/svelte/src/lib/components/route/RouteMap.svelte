<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import type { IRoute } from '$lib/types';
	import {
		buildElevationAreaPath,
		buildElevationPath,
		computeBounds,
		formatDistanceKm,
		formatElevationGainMeters
	} from '$lib/utils/routeMapMath';

	let { route, name }: { route: IRoute; name: string } = $props();

	const ROUTE_COLOR = '#374151';
	const CHART_WIDTH = 100;
	const CHART_HEIGHT = 40;

	let mapContainer: HTMLDivElement;
	let map: import('maplibre-gl').Map | undefined;
	let mapFailed = $state(false);

	const elevationPath = () => buildElevationPath(route.points, CHART_WIDTH, CHART_HEIGHT);
	const elevationAreaPath = () => buildElevationAreaPath(route.points, CHART_WIDTH, CHART_HEIGHT);

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

			instance.on('error', (err: unknown) => {
				console.error('MapLibre failed to load the route map', err);
				mapFailed = true;
			});

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
					paint: { 'line-color': ROUTE_COLOR, 'line-width': 3 }
				});
			});
		})();

		return () => {
			cancelled = true;
		};
	});

	onDestroy(() => {
		try {
			map?.remove();
		} catch (err) {
			console.error('Failed to clean up the MapLibre map', err);
		}
	});
</script>

<div class="route-map rounded-lg border border-gray-200 p-4">
	<p class="mb-2 text-xs tracking-widest text-gray-300 uppercase">Route</p>
	<p class="route-map-fallback mb-3 text-sm text-gray-500">
		{name} — {formatDistanceKm(route.distance)}, {formatElevationGainMeters(route.elevationGain)} elevation
		gain
	</p>

	{#if mapFailed}
		<p
			class="route-map-error flex h-80 w-full items-center justify-center rounded-md bg-gray-50 text-sm text-gray-400"
		>
			Map unavailable
		</p>
	{:else}
		<div
			bind:this={mapContainer}
			class="route-map-canvas h-80 w-full overflow-hidden rounded-md"
			role="img"
			aria-label={`Map of ${name}`}
		></div>
	{/if}

	<details class="route-map-elevation-details mt-3">
		<summary
			class="flex cursor-pointer list-none items-center gap-1 text-xs tracking-widest text-gray-300 uppercase"
		>
			<span class="chevron inline-block transition-transform">▶</span> Elevation
		</summary>
		<svg
			class="route-map-elevation mt-2 w-full"
			viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
			preserveAspectRatio="none"
			role="img"
			aria-label={`Elevation profile of ${name}`}
		>
			<path d={elevationAreaPath()} fill={ROUTE_COLOR} fill-opacity="0.08" stroke="none" />
			<path
				d={elevationPath()}
				fill="none"
				stroke={ROUTE_COLOR}
				stroke-width="1"
				vector-effect="non-scaling-stroke"
			/>
		</svg>
	</details>
</div>

<style>
	.route-map-elevation-details[open] .chevron {
		transform: rotate(90deg);
	}
</style>
