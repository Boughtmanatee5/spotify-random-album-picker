import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import require from 'vite-plugin-require';

export default defineConfig({
	plugins: [sveltekit(), require()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
