import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib')
		},
		conditions: process.env.VITEST ? ['browser'] : []
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/tests/setup.ts'],
		include: ['src/tests/**/*.test.ts']
	}
});
