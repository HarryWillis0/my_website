<script>
	import { resolve } from '$app/paths';

	let { article, index } = $props();
</script>

<a
	href={resolve(`/articles/${article.id}`)}
	class="group flex gap-3 border-b border-gray-100 py-6 text-inherit no-underline transition-colors duration-200 hover:bg-gray-50"
>
	<span class="mt-1 shrink-0 font-serif text-xs text-gray-300 italic">
		{String(index + 1).padStart(2, '0')}
	</span>

	<div class="flex min-w-0 flex-col">
		<h2
			class="mb-1.5 font-serif text-lg leading-snug font-semibold text-gray-900 group-hover:underline"
		>
			{article.title}
		</h2>
		<p class="line-clamp-2 text-sm leading-relaxed text-gray-500">{article.summary}</p>
		<span class="mt-3 text-xs tracking-widest text-gray-300 uppercase">Read more →</span>
	</div>
</a>
