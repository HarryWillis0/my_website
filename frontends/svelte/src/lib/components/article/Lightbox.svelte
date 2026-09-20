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

	const goToNext = () => {
		if (openIndex === null) return;
		openIndex = (openIndex + 1) % images.length;
	};

	const goToPrevious = () => {
		if (openIndex === null) return;
		openIndex = (openIndex - 1 + images.length) % images.length;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowRight') goToNext();
		else if (event.key === 'ArrowLeft') goToPrevious();
	};

	const handleBackdropClick = (event: MouseEvent) => {
		if (event.target === dialog) {
			handleClose();
		}
	};
</script>

<dialog
	bind:this={dialog}
	onclose={handleClose}
	onkeydown={handleKeydown}
	onclick={handleBackdropClick}
	class="lightbox-dialog"
>
	{#if openIndex !== null}
		<button type="button" class="close-button" onclick={handleClose} aria-label="Close">
			&times;
		</button>
		<img src={images[openIndex].src} alt={images[openIndex].alt} />
		<button type="button" class="lightbox-prev" onclick={goToPrevious} aria-label="Previous image"
			>‹</button
		>
		<button type="button" class="lightbox-next" onclick={goToNext} aria-label="Next image">›</button
		>
		<p class="lightbox-counter">{openIndex + 1} / {images.length}</p>
		<p class="caption">{images[openIndex].alt}</p>
	{/if}
</dialog>

<style>
	.lightbox-dialog {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
		border: none;
		padding: 0;
		background: transparent;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.lightbox-dialog::backdrop {
		background: rgb(0 0 0 / 0.85);
	}

	.lightbox-dialog img {
		display: block;
		max-width: 90vw;
		max-height: 75vh;
		object-fit: contain;
	}

	.close-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: 50%;
		background: rgb(0 0 0 / 0.5);
		color: white;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
	}

	.caption {
		margin: 0.75rem 0 0;
		padding: 0 1rem;
		color: white;
		text-align: center;
	}

	.lightbox-prev,
	.lightbox-next {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		background: rgb(0 0 0 / 0.5);
		color: white;
		border: none;
		border-radius: 9999px;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
	}

	.lightbox-prev {
		left: 1rem;
	}

	.lightbox-next {
		right: 1rem;
	}

	.lightbox-counter {
		position: fixed;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		font-size: 0.875rem;
		letter-spacing: 0.05em;
	}
</style>
