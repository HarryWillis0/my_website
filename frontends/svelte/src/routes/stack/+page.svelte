<script>
	import { PUBLIC_FRONTEND } from '$env/static/public';

	const frontendName = PUBLIC_FRONTEND === 'react' ? 'React' : 'SvelteKit';

	const stack = [
		{ label: 'Frontend', value: frontendName },
		{ label: 'Hosting', value: 'Google Cloud Run' },
		{ label: 'Registry', value: 'Google Artifact Registry' },
		{ label: 'Container', value: 'Docker' }
	];
</script>

<svelte:head>
	<title>Stack</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-8 text-2xl font-bold">Stack</h1>
	<dl class="divide-y divide-gray-200">
		{#each stack as { label, value }}
			<div class="flex py-4">
				<dt class="w-40 shrink-0 text-gray-500">{label}</dt>
				<dd>{value}</dd>
			</div>
		{/each}
	</dl>
</div>
