<script lang="ts">
	import { resolve } from '$app/paths';
	import type { IProject } from '$lib/types';

	let { project }: { project: IProject } = $props();
</script>

<a
	href={resolve(`/projects/${project.id}`)}
	class="group flex flex-col gap-1.5 border-b border-gray-100 py-6 text-inherit no-underline transition-colors duration-200 hover:bg-gray-50"
>
	<h2 class="font-serif text-lg leading-snug font-semibold text-gray-900 group-hover:underline">
		{project.title}
	</h2>
	<p class="line-clamp-2 text-sm leading-relaxed text-gray-500">{project.description}</p>
	<div class="mt-1 flex flex-wrap gap-2">
		{#each project.tags as tag (tag)}
			<span class="text-xs tracking-widest text-gray-300 uppercase">{tag}</span>
		{/each}
	</div>
</a>
