<script lang="ts">
	import { marked } from 'marked';
	import type { IProject } from '$lib/types';

	let { project }: { project: IProject } = $props();

	const renderedBody = () => marked(project.body);
</script>

<!-- Header -->
<div class="mb-8 border-t border-gray-200 pt-6">
	<h1 class="mb-3 font-serif text-3xl leading-snug font-semibold text-gray-900">{project.title}</h1>
	<p class="mb-3 font-serif text-sm text-gray-400 italic">{project.description}</p>
	<div class="mb-4 flex flex-wrap gap-4 text-xs tracking-widest text-gray-300 uppercase">
		{#each project.tags as tag (tag)}
			<span>{tag}</span>
		{/each}
	</div>
	<div class="flex gap-4 text-xs tracking-widest uppercase">
		{#if project.repoUrl}
			<a
				href={project.repoUrl}
				target="_blank"
				rel="noopener noreferrer external"
				class="text-gray-400 no-underline hover:text-gray-900">Repo</a
			>
		{/if}
		{#if project.liveUrl}
			<a
				href={project.liveUrl}
				target="_blank"
				rel="noopener noreferrer external"
				class="text-gray-400 no-underline hover:text-gray-900">Live</a
			>
		{/if}
	</div>
</div>

<!-- Body -->
<div class="prose-custom">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html renderedBody()}
</div>
