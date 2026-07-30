<script lang="ts">
	import ProjectDetail from '$lib/components/project/ProjectDetail.svelte';
	import BackToProjects from '$lib/components/project/BackToProjects.svelte';
	import type { IProject } from '$lib/types';

	let { data }: { data: { project: IProject | null } } = $props();
</script>

<svelte:head>
	<title>{data.project?.title ?? 'Project'} — harrywillis.dev</title>
</svelte:head>

<div class="flex flex-col">
	{#if data.project}
		<ProjectDetail project={data.project} />
	{:else}
		<div class="border-t border-gray-200 pt-6">
			<h1 class="mb-4 font-serif text-3xl leading-snug font-semibold text-gray-900">
				Project not found
			</h1>
			<p class="text-sm leading-relaxed text-gray-500">
				The project you are looking for does not exist.
			</p>
		</div>
	{/if}
	<BackToProjects />
</div>
