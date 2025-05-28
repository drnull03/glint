import adapterStatic from '@sveltejs/adapter-static';
import adapterAuto from '@sveltejs/adapter-auto';
import adapterExtension from 'sveltekit-adapter-chrome-extension';

const target = process.env.TARGET;

let routes;
let adapter;

if (target === 'mobile') {
  routes = 'src/mobile-routes';
  adapter = adapterStatic({
    pages: 'build-mobile',
    assets: 'build-mobile',
    fallback: null,
    strict: false
  });
} else if (target === 'desktop') {
  routes = 'src/desktop-routes';
  adapter = adapterStatic({
    pages: 'build-desktop',
    assets: 'build-desktop',
    fallback: null,
    strict: false
  });
} else if (target === 'extension') {
  routes = 'src/extension-routes';
  adapter = adapterExtension({
    pages: 'build-extension',
    assets: 'build-extension',
    fallback: null,
    precompress: false,
    manifest: 'manifest.json'
  });
} else {
  routes = 'src/routes';
  adapter = adapterAuto();
}

const config = {
  kit: {
    adapter,
    files: {
      routes
    },
    appDir: 'app'
  }
};

export default config;