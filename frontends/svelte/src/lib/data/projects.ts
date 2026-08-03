import type { IProject } from '$lib/types';

export const projects: IProject[] = [
	{
		id: 'strava-wrapper',
		title: 'Strava Wrapper',
		description:
			'A Phoenix LiveView app that pulls your full Strava ride history and lets you filter by gear.',
		tags: ['Elixir', 'Phoenix LiveView'],
		repoUrl: 'https://github.com/HarryWillis0/strava_wrapper',
		body: `> **Note:** As of July 2, 2026, Strava requires Standard-tier API applications to be linked to an active Strava subscription. I won't be maintaining one just to keep the demo running, so the live version of this app is offline.

Strava Wrapper fetches your full Strava activity history and lets you filter it by gear — which bike, which shoes etc.

## Why I built it

Strava's own gear stats are limited, and I wanted a faster way to slice my ride history by bike. It was also a chance to write a real functional web app in Elixir and lean on Phoenix LiveView for the UI — server-rendered, updated over a websocket connection, no client-side JS framework required.

## How it works

- Authenticates with Strava via OAuth and caches the full activity history in memory
- Filters activities by gear and type server-side, with the table and stats panel updating live over the LiveView socket
- Sortable columns and pagination (20 activities per page)
- Aggregate stats — distance, elevation, time — recompute for whichever gear filter is active

## Stack

Elixir and Phoenix LiveView, deployed as a Docker release to Cloud Run via GitHub Actions CI/CD, served on a custom domain.`
	},
	{
		id: 'parlay-punk',
		title: 'Parlay Punk',
		description:
			'An AI-powered same-game parlay advisor for NHL, soccer, and MLB that reasons through legs in plain English, with a configurable leg count and risk tolerance.',
		tags: ['SvelteKit', 'TypeScript', 'Claude API'],
		liveUrl: 'https://app.parlaypunk.com',
		body: `> **Note:** For entertainment and personal research only — not gambling advice.

Parlay Punk is an AI-powered same-game parlay (SGP) advisor. Open the app, see today's games across NHL, soccer, and MLB, and get a parlay recommendation with plain-English reasoning behind each leg.

## Why I built it

Two threads came together here. I wanted to put Robert C. Martin's Clean Architecture through its paces on something built to production standards, not a toy. I also like the occasional bet on big games but don't know the details well enough to reason through them myself, so I built the tool I actually wanted to use.

## How it works

- Fetches the day's games, live odds, and team/goalie stats across three sports, then hands that context to Claude to generate a parlay with reasoning for each leg
- Leg count (2–6) and a min-odds risk tier — from Safe to Spicy — are both user-configurable
- A payout calculator on each pick card turns odds into an actual dollar figure for your stake
- Sign in with an emailed code to save your leg count and risk tier across sessions

## Stack

A pnpm monorepo split into clean-architecture layers — core (entities/ports), app (use cases), infra (adapters for the NHL API, Odds API, and Claude) — consumed by three clients: a SvelteKit web app, an Expo/React Native mobile app, and a Hono API service. The web app is deployed to Cloudflare Pages, with the API running on GCP.`
	}
];
