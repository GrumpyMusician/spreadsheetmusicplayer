import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

export default {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',    // output folder
      assets: 'build',
      fallback: null     // optional
    }),
    paths: {
      base: process.env.GITHUB_PAGES ? '/spreadsheetmusicplayer' : ''
    }
  }
};
