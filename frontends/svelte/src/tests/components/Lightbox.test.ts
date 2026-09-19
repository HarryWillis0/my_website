import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

import Lightbox from '$lib/components/article/Lightbox.svelte';

const images = [
	{ src: '/a.jpg', alt: 'Image A' },
	{ src: '/b.jpg', alt: 'Image B' }
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
});
