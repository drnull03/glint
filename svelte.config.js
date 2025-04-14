import adapterStatic from '@sveltejs/adapter-static';
import adapterAuto from '@sveltejs/adapter-auto';

const isMobile = process.env.TARGET === 'mobile';
const isDesktop = process.env.TARGET === 'desktop';

let routes;
if(isMobile) {
  routes = 'src/mobile-routes';
} else if(isDesktop) {
  routes = 'src/desktop-routes'
} else {
  routes = 'src/routes'
}

const config = {
  kit: {
    adapter: (isMobile || isDesktop)
      ? adapterStatic({
          pages: isDesktop ? 'build-desktop' : 'build-mobile',
          assets: isDesktop ? 'build-desktop' : 'build-mobile',
          fallback: null,
          strict: false
        })
      : adapterAuto(),
    files: {
      routes
    }
  }
};

export default config;
