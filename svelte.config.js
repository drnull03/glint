import adapterStatic from '@sveltejs/adapter-static';
import adapterAuto from '@sveltejs/adapter-auto';

const isMobile = process.env.TARGET === 'mobile';

const config = {
  kit: {
    adapter: isMobile
      ? adapterStatic({
          pages: 'build-mobile',
          assets: 'build-mobile',
          fallback: null,
          strict: false // ignore dynamic routes (since they won't be present in mobile)
        })
      : adapterAuto(),
    // prerender: isMobile
    //   ? {
    //       crawl: false,       // Prevent automatic crawling
    //       entries: ['/mobile'] // Only prerender the /mobile route
    //     }
    //   : {},
    files: {
      // Use only the mobile routes folder when building for mobile
      routes: isMobile ? 'src/mobile-routes' : 'src/routes'
    }
  }
};

export default config;
