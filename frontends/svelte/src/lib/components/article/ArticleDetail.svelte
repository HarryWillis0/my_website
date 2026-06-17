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
	marked.use({
		renderer: {
			image({ href, text }: { href: string; text: string }) {
				return `<figure class="prose-figure"><img src="${href}" alt="${text}"><figcaption>${text}</figcaption></figure>`;
			},
			paragraph({ tokens }: { tokens: { type: string; href?: string; text?: string }[] }) {
				const meaningful = tokens.filter((t) => !(t.type === 'text' && !t.text?.trim()));
				if (!meaningful.length || !meaningful.every((t) => t.type === 'image')) return false;
				const figures = meaningful
					.map(
						(t) =>
							`<figure class="prose-figure"><img src="${t.href}" alt="${t.text}"><figcaption>${t.text}</figcaption></figure>`
					)
					.join('');
				return meaningful.length > 1 ? `<div class="image-row">${figures}</div>` : figures;
			}
		}
	});

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
