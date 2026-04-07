<script lang="ts">
	import './layout.css';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen p-8 font-sans">
	<header>
		<Navigation />
	</header>
	<main class="mx-auto mt-8 max-w-2xl">
		{@render children()}
	</main>
</div>
