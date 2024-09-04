import { defineConfig } from 'vite';
import { Packer } from 'roadroller';

export default defineConfig({
  plugins: [
    plugin()
  ],
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    reportCompressedSize: false,
    minify: 'terser',
    terserOptions: {
      toplevel: true,
      compress: {
        drop_console: true,
        ecma: 2020,
        module: true,
        passes: 3,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true
      },
      format: {
        comments: false,
        ecma: 2020
      },
      module: true
    },
    assetsInlineLimit: 0
  }
});

async function roadroll(data) {
  const packer = new Packer([{
    data,
    type: 'js',
    action: 'eval'
  }], {});
  await packer.optimize(2);
  const { firstLine, secondLine } = packer.makeDecoder();
  return firstLine + secondLine;
}

function plugin() {
  return {
    enforce: 'post',
    generateBundle: async (options, bundle) => {
      const html = bundle['index.html'];
      const js = bundle[Object.keys(bundle).filter(i => i.endsWith('.js'))[0]];
      const packedJs = await roadroll(js.code);

      html.source = html.source
        .replace(/<script.*<\/script>/, '')
        .replace('</body>', () => `<script>${packedJs}</script>`)
        .replace(/\n+/g, '');

      // Delete the JS so it doesn't go into the dist folder
      delete bundle[js.fileName];
    }
  };
}