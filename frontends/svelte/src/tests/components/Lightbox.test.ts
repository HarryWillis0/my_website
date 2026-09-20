import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

import Lightbox from '$lib/components/article/Lightbox.svelte';

const images = [
	{ src: '/a.jpg', alt: 'Image A' },
	{ src: '/b.jpg', alt: 'Image B' },
	{ src: '/c.jpg', alt: 'Image C' }
];

describe('Lightbox', () => {
	it('does not open the dialog when openIndex is null', () => {
		const { container } = render(Lightbox, { props: { images, openIndex: null } });
		expect(container.querySelector('dialog')?.open).toBe(false);
	});

	it('opens the dialog showing the image at openIndex', () => {
		const { container } = render(Lightbox, { props: { images, openIndex: 1 } });

		expect(container.querySelector('dialog')?.open).toBe(true);
		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', '/b.jpg');
		expect(img).toHaveAttribute('alt', 'Image B');
	});

	it('shows the image matching a different openIndex', () => {
		render(Lightbox, { props: { images, openIndex: 0 } });

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', '/a.jpg');
		expect(img).toHaveAttribute('alt', 'Image A');
	});

	it('renders a native dialog element for the ::backdrop overlay', () => {
		const { container } = render(Lightbox, { props: { images, openIndex: 0 } });
		expect(container.querySelector('dialog')).toBeInTheDocument();
	});

	it('shows a position counter for the current image', () => {
		render(Lightbox, { props: { images, openIndex: 0 } });
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('updates the position counter to match a different openIndex', () => {
		render(Lightbox, { props: { images, openIndex: 2 } });
		expect(screen.getByText('3 / 3')).toBeInTheDocument();
	});

	it('advances to the next image when the next button is clicked', async () => {
		render(Lightbox, { props: { images, openIndex: 0 } });

		await fireEvent.click(screen.getByRole('button', { name: /next/i }));

		expect(screen.getByText('2 / 3')).toBeInTheDocument();
		expect(screen.getByRole('img')).toHaveAttribute('src', '/b.jpg');
	});

	it('wraps to the first image when next is clicked on the last image', async () => {
		render(Lightbox, { props: { images, openIndex: 2 } });

		await fireEvent.click(screen.getByRole('button', { name: /next/i }));

		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('goes to the previous image when the previous button is clicked', async () => {
		render(Lightbox, { props: { images, openIndex: 2 } });

		await fireEvent.click(screen.getByRole('button', { name: /previous/i }));

		expect(screen.getByText('2 / 3')).toBeInTheDocument();
		expect(screen.getByRole('img')).toHaveAttribute('src', '/b.jpg');
	});

	it('wraps to the last image when previous is clicked on the first image', async () => {
		render(Lightbox, { props: { images, openIndex: 0 } });

		await fireEvent.click(screen.getByRole('button', { name: /previous/i }));

		expect(screen.getByText('3 / 3')).toBeInTheDocument();
	});

	it('advances to the next image on ArrowRight keydown', async () => {
		const { container } = render(Lightbox, { props: { images, openIndex: 0 } });

		await fireEvent.keyDown(container.querySelector('dialog')!, { key: 'ArrowRight' });

		expect(screen.getByText('2 / 3')).toBeInTheDocument();
	});

	it('goes to the previous image on ArrowLeft keydown', async () => {
		const { container } = render(Lightbox, { props: { images, openIndex: 1 } });

		await fireEvent.keyDown(container.querySelector('dialog')!, { key: 'ArrowLeft' });

		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('shows the image alt text as a caption', () => {
		render(Lightbox, { props: { images, openIndex: 0 } });
		expect(screen.getByText('Image A')).toBeInTheDocument();
	});

	it('closes the lightbox when the close button is clicked', async () => {
		const { container } = render(Lightbox, { props: { images, openIndex: 0 } });

		await fireEvent.click(screen.getByRole('button', { name: /close/i }));

		expect(container.querySelector('dialog')?.open).toBe(false);
	});

	it('closes the lightbox when the backdrop is clicked', async () => {
		const { container } = render(Lightbox, { props: { images, openIndex: 0 } });

		await fireEvent.click(container.querySelector('dialog')!);

		expect(container.querySelector('dialog')?.open).toBe(false);
	});

	it('does not close the lightbox when the image itself is clicked', async () => {
		const { container } = render(Lightbox, { props: { images, openIndex: 0 } });

		await fireEvent.click(screen.getByRole('img'));

		expect(container.querySelector('dialog')?.open).toBe(true);
	});
});
