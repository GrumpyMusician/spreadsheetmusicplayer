import adapter from '@sveltejs/adapter-static';

const repoName = 'spreadsheetmusicplayer'; // ← CHANGE THIS

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
			assets: process.env.NODE_ENV === 'production' ? `/${repoName}` : ''
		}
	}
};
