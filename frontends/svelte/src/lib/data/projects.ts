import type { IProject } from '$lib/types';

export const projects: IProject[] = [
	{
		id: 'strava-wrapper',
		title: 'Strava Wrapper',
		description:
			'A Phoenix LiveView app that pulls your full Strava ride history and lets you filter by gear.',
		tags: ['Elixir', 'Phoenix LiveView'],
		repoUrl: 'https://github.com/HarryWillis0/strava_wrapper',
		liveUrl: 'https://stravawrapper.harrywillis.dev',
		body: `Strava Wrapper fetches your full Strava activity history and lets you filter it by gear — which bike, which shoes — without firing a new API call on every filter change. Everything after the initial sync happens server-side, so filtering feels instant.

## Why I built it

Strava's own gear stats are limited, and I wanted a faster way to slice my ride history by bike. It was also a chance to write a real functional web app in Elixir and lean on Phoenix LiveView for the UI — server-rendered, updated over a websocket connection, no client-side JS framework required.

## How it works

- Authenticates with Strava via OAuth and caches the full activity history in memory
- Filters activities by gear and type server-side, with the table and stats panel updating live over the LiveView socket
- Sortable columns and pagination (20 activities per page)
- Aggregate stats — distance, elevation, time — recompute for whichever gear filter is active

## Stack

Elixir and Phoenix LiveView, deployed as a Docker release to Cloud Run via GitHub Actions CI/CD, served on a custom domain.`
	}
];
