<script lang="ts">
	import ArticleList from '$lib/components/article/ArticleList.svelte';
	import type { IArticle } from '$lib/types';

	let { data }: { data: { articles: IArticle[] } } = $props();
</script>

<svelte:head>
	<title>Articles — harrywillis.dev</title>
</svelte:head>

<div class="mx-auto max-w-200 flex-1">
	<ArticleList articles={data.articles} />
</div>
