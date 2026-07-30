<script lang="ts">
	import ProjectList from '$lib/components/project/ProjectList.svelte';
	import { projects } from '$lib/data/projects';
</script>

<svelte:head>
	<title>Projects — harrywillis.dev</title>
</svelte:head>

<div class="mx-auto max-w-200 flex-1">
	<ProjectList {projects} />
</div>
