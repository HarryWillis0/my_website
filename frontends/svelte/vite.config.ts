import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// esbuild's dev-time pre-bundler repackages maplibre-gl's internal worker,
	// which its own worker-loading code doesn't expect — causing a
	// NS_ERROR_CORRUPTED_CONTENT / MIME-type rejection at runtime.
	optimizeDeps: { exclude: ['maplibre-gl'] },
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib')
		},
		// Vitest runs component tests under Node with a jsdom DOM, so package
		// exports need to be forced to their browser build. Leaving `conditions`
		// unset outside of Vitest keeps Vite's own client/SSR condition
		// defaults — setting it to `[]` here would replace those defaults
		// entirely, not just leave them alone, and broke `svelte`'s own
		// browser/server export resolution during real dev/build.
		...(process.env.VITEST ? { conditions: ['browser'] } : {})
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/tests/setup.ts'],
		include: ['src/tests/**/*.test.ts']
	}
});
