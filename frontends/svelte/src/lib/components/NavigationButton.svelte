<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { href, label } = $props();
</script>

<a
	href={resolve(href)}
	class="mx-5 text-xs tracking-widest uppercase transition-colors duration-200 {page.url
		.pathname === href
		? 'border-b border-gray-900 pb-0.5 text-gray-900'
		: 'text-gray-400 hover:text-gray-900'}"
>
	{label}
</a>
