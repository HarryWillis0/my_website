<script lang="ts">
	let {
		images,
		openIndex = $bindable(null)
	}: { images: { src: string; alt: string }[]; openIndex: number | null } = $props();

	let dialog: HTMLDialogElement;

	// Keeps the last-open image rendered while the dialog plays its close
	// transition, since openIndex (and the {#if}) go null immediately on close.
	let shownIndex = $state<number | null>(null);

	$effect(() => {
		if (openIndex !== null) shownIndex = openIndex;
	});

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
	class="lightbox-dialog m-auto max-h-[92vh] max-w-[92vw] border-none bg-transparent p-0 sm:px-14"
>
	{#if shownIndex !== null}
		<div class="relative flex flex-col items-center rounded-2xl bg-white p-3 shadow-2xl">
			<button
				type="button"
				class="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-colors hover:text-gray-900"
				onclick={handleClose}
				aria-label="Close"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>

			<img
				src={images[shownIndex].src}
				alt={images[shownIndex].alt}
				class="block max-h-[70vh] max-w-[80vw] rounded-lg object-contain"
			/>

			<div class="mt-3 max-w-[80vw] text-center">
				<p class="font-serif text-xs text-gray-400 italic">{images[shownIndex].alt}</p>
				{#if images.length > 1}
					<p class="mt-1 text-xs tracking-widest text-gray-300 uppercase">
						{shownIndex + 1} / {images.length}
					</p>
				{/if}
			</div>
		</div>

		{#if images.length > 1}
			<!-- Positioned relative to the dialog itself, not the card: a modal
			     dialog clips content to its own box even with overflow: visible,
			     so these can't be nudged outside the card via negative offsets.
			     The dialog's sm:px-14 gives them room to sit clear of the card
			     on wider screens; on mobile they land near the card's edge. -->
			<button
				type="button"
				class="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-colors hover:text-gray-900"
				onclick={goToPrevious}
				aria-label="Previous image"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
			</button>
			<button
				type="button"
				class="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-colors hover:text-gray-900"
				onclick={goToNext}
				aria-label="Next image"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="9 18 15 12 9 6" />
				</svg>
			</button>
		{/if}
	{/if}
</dialog>

<style>
	/* Everything here is the open/close animation mechanism (::backdrop and
	   @starting-style aren't reachable as clean Tailwind utilities); all
	   other styling lives in the markup above. */
	.lightbox-dialog {
		opacity: 0;
		transform: scale(0.96);
		transition:
			opacity 200ms ease,
			transform 200ms ease,
			overlay 200ms ease allow-discrete,
			display 200ms ease allow-discrete;
	}

	.lightbox-dialog[open] {
		opacity: 1;
		transform: scale(1);
	}

	@starting-style {
		.lightbox-dialog[open] {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	.lightbox-dialog::backdrop {
		background: rgb(255 255 255 / 55%);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		opacity: 0;
		transition:
			opacity 200ms ease,
			overlay 200ms ease allow-discrete,
			display 200ms ease allow-discrete;
	}

	.lightbox-dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		.lightbox-dialog[open]::backdrop {
			opacity: 0;
		}
	}
</style>
