<script lang="ts">
	let {
		images,
		openIndex = $bindable(null)
	}: { images: { src: string; alt: string }[]; openIndex: number | null } = $props();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (openIndex !== null && !dialog.open) {
			dialog.showModal();
		} else if (openIndex === null && dialog.open) {
			dialog.close();
		}
	});

	const handleClose = () => {
		openIndex = null;
	};
</script>

<dialog bind:this={dialog} onclose={handleClose} class="lightbox-dialog">
	{#if openIndex !== null}
		<img src={images[openIndex].src} alt={images[openIndex].alt} />
	{/if}
</dialog>

<style>
	.lightbox-dialog {
		max-width: 90vw;
		max-height: 90vh;
		border: none;
		padding: 0;
		background: transparent;
	}

	.lightbox-dialog::backdrop {
		background: rgb(0 0 0 / 0.85);
	}

	.lightbox-dialog img {
		display: block;
		max-width: 90vw;
		max-height: 90vh;
	}
</style>
