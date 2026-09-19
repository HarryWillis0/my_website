<script lang="ts">
	import { marked } from 'marked';
	import type { IArticle } from '$lib/types';
	import RouteMap from '$lib/components/route/RouteMap.svelte';
	import Lightbox from './Lightbox.svelte';

	let { article, viewCount }: { article: IArticle; viewCount: number } = $props();

	const formatViewCount = (n: number) => `${n.toLocaleString('en-US')} VIEWS`;

	const formatDate = (date: Date) =>
		new Date(date).toLocaleDateString('en-CA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

	const showUpdated = () => article.lastModifiedAt !== article.created;

	let collectedImages: { src: string; alt: string }[] = [];

	const buildFigureHtml = (href: string, text: string) => {
		const index = collectedImages.length;
		collectedImages.push({ src: href, alt: text });
		return `<figure class="prose-figure"><img src="${href}" alt="${text}" data-index="${index}" tabindex="0" role="button"><figcaption>${text}</figcaption></figure>`;
	};

	marked.use({
		renderer: {
			image({ href, text }: { href: string; text: string }) {
				return buildFigureHtml(href, text);
			},
			paragraph({ tokens }: { tokens: { type: string; href?: string; text?: string }[] }) {
				const meaningful = tokens.filter((t) => !(t.type === 'text' && !t.text?.trim()));
				if (!meaningful.length || !meaningful.every((t) => t.type === 'image')) return false;
				const figures = meaningful.map((t) => buildFigureHtml(t.href!, t.text!)).join('');
				return meaningful.length > 1 ? `<div class="image-row">${figures}</div>` : figures;
			}
		}
	});

	const rendered = $derived.by(() => {
		collectedImages = [];
		const html = marked(article.body);
		return { html, images: collectedImages };
	});

	let openIndex = $state<number | null>(null);

	const openFromElement = (target: HTMLElement) => {
		const img = target.closest('img[data-index]');
		if (!img) return;
		openIndex = Number(img.getAttribute('data-index'));
	};

	const handleProseClick = (event: MouseEvent) => {
		openFromElement(event.target as HTMLElement);
	};

	const handleProseKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		const target = event.target as HTMLElement;
		if (!target.closest('img[data-index]')) return;
		event.preventDefault();
		openFromElement(target);
	};
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
		<span>{formatViewCount(viewCount)}</span>
	</div>
</div>

{#if article.route}
	<div class="mb-8">
		<RouteMap route={article.route} name={article.title} />
	</div>
{/if}

<!-- Body -->
<!-- Click/key handling is delegated from here to the {@html} images below; onkeydown gives
     keyboard parity, but no ARIA role describes this container's interactivity honestly. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="prose-custom" onclick={handleProseClick} onkeydown={handleProseKeydown}>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html rendered.html}
</div>

<Lightbox images={rendered.images} bind:openIndex />
