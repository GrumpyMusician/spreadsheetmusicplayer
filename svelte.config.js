import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const ghPages = process.env.GITHUB_PAGES === 'true';

export default {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    paths: {
      base: ghPages ? '/spreadsheetmusicplayer' : ''
    }
  }
};
