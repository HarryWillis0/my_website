<script lang="ts">
	import ArticleDetail from '$lib/components/article/ArticleDetail.svelte';
	import BackToArticles from '$lib/components/article/BackToArticles.svelte';
	import type { IArticle } from '$lib/types/article.js';

	let { data }: { data: { article: IArticle | null } } = $props();
</script>

<div class="flex flex-col">
	{#if data.article}
		<ArticleDetail article={data.article} />
	{:else}
		<div class="border-t border-gray-200 pt-6">
			<h1 class="mb-4 font-serif text-3xl leading-snug font-semibold text-gray-900">
				Article not found
			</h1>
			<p class="text-sm leading-relaxed text-gray-500">
				The article you are looking for does not exist.
			</p>
		</div>
	{/if}
	<BackToArticles />
</div>
