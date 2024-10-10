import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import vitePluginRequire from 'vite-plugin-require';

export default defineConfig({
	plugins: [
		sveltekit(),
		// @ts-expect-error
		vitePluginRequire.default()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
