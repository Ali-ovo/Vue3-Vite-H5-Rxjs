import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import styleImport from 'vite-plugin-style-import';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/**
 * 处理路径
 * @param {String} dir 需要进行处理的路径
 * @returns {String} 返回处理后的路径
 */
function resolve(dir: string) {
  console.log(path.join(__dirname, dir));

  return path.join(__dirname, dir);
}
// https://vitejs.dev/config/
// https://github.com/vitejs/vite/issues/1930 .env
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name: string) => `vant/es/${name}/style`
        }
      ]
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://172.28.210.103:30000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
    // cors: true
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@common': resolve('./src/common'),
      '@components': resolve('./src/components'),
      '@store': resolve('./src/store'),
      '@views': resolve('./src/views')
    }
  },
  build: {
    terserOptions: {
      compress: {
        // 生产环境时移除console
        drop_console: true,
        drop_debugger: true
      }
    },
    brotliSize: false
  }
});
