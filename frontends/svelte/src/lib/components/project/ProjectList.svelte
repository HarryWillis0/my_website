<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import ProjectListItem from '$lib/components/project/ProjectListItem.svelte';
	import { type IProject } from '$lib/types';

	let { projects }: { projects: IProject[] } = $props();
</script>

{#if projects.length === 0}
	<section class="border-t border-gray-200 pt-6" aria-label="Project List">
		<p class="font-serif text-sm text-gray-400 italic">No projects yet — check back soon.</p>
	</section>
{:else}
	<section class="flex flex-col border-t border-gray-200" aria-label="Project List">
		{#each projects as project (project.id)}
			<ProjectListItem {project} />
		{/each}
	</section>
{/if}
<Footer />
