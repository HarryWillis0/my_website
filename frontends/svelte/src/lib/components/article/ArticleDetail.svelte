<script lang="ts">
	import { marked } from 'marked';
	import type { IArticle } from '$lib/types';

	let { article }: { article: IArticle } = $props();

	const formatDate = (date: Date) =>
		new Date(date).toLocaleDateString('en-CA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

	const showUpdated = () => article.lastModifiedAt !== article.created;
	const renderedBody = () => marked(article.body);
</script>

<!-- Header -->
<div class="mb-8 border-t border-gray-200 pt-6">
	<h1 class="mb-3 font-serif text-3xl leading-snug font-semibold text-gray-900">{article.title}</h1>
	<p class="mb-3 font-serif text-sm text-gray-400 italic">{article.summary}</p>
	<div class="flex gap-4 text-xs tracking-widest text-gray-300 uppercase">
		<span>{formatDate(article.created)}</span>
		{#if showUpdated()}
			<span>Updated {formatDate(article.lastModifiedAt)}</span>
		{/if}
	</div>
</div>

<!-- Body -->
<div class="prose-custom">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html renderedBody()}
</div>
