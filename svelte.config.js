import adapter from '@sveltejs/adapter-static';

const repoName = 'my-sveltekit-site'; // ← CHANGE THIS

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html' // required for SPA routing
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? `/${repoName}` : ''
		}
	}
};