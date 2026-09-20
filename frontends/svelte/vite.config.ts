import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vitest/config';
import path from 'path';
import { readFileSync } from 'node:fs';

// maplibre-gl-worker.mjs is emitted byte-for-byte via `?url` (see RouteMap.svelte),
// so its own `import ... from "./maplibre-gl-shared.mjs"` stays a literal relative
// path that Vite never resolves. In production that sibling file was never
// emitted, so it 404s, the response falls back to the app's HTML shell, and
// Firefox refuses to run that as a module (NS_ERROR_CORRUPTED_CONTENT). Copy the
// shared chunk in next to whatever hashed name the worker gets.
function maplibreWorkerSharedChunk(): Plugin {
	return {
		name: 'maplibre-worker-shared-chunk',
		apply: 'build',
		generateBundle(_options, bundle) {
			const workerAsset = Object.values(bundle).find(
				(chunk) =>
					'originalFileNames' in chunk &&
					chunk.originalFileNames.some((f) => f.endsWith('maplibre-gl-worker.mjs'))
			);
			if (!workerAsset) return;

			const dir = workerAsset.fileName.split('/').slice(0, -1).join('/');
			this.emitFile({
				type: 'asset',
				fileName: `${dir}/maplibre-gl-shared.mjs`,
				source: readFileSync(
					path.resolve(__dirname, 'node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs'),
					'utf-8'
				)
			});
		}
	};
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), maplibreWorkerSharedChunk()],
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
