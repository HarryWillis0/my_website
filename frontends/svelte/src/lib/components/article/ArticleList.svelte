<script lang="ts">
	import Footer from '$lib/components//Footer.svelte';
	import ArticleListItem from '$lib/components/article/ArticleListItem.svelte';
	import { type IArticle } from '$lib/types';

	let { articles }: { articles: IArticle[] } = $props();
</script>

{#if articles.length === 0}
	<div class="border-t border-gray-200 pt-6" aria-label="Article List">
		<p class="font-serif text-sm text-gray-400 italic">No articles yet — check back soon.</p>
	</div>
{:else}
	<div class="flex flex-col border-t border-gray-200" aria-label="Article List">
		{#each articles as article, index (article.id)}
			<ArticleListItem {article} {index} />
		{/each}
	</div>
{/if}
<Footer />
