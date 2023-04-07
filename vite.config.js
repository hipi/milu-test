import path from 'node:path';
import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
// svg 雪碧图
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// 组件name 写入
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
// UI 组件动态导入
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { VitePWA } from 'vite-plugin-pwa';
// 浏览器版本监测
import checkBrowser from './vite-plugins/checkBrowser';

// autoprefixer
import autoprefixer from 'autoprefixer';

import { toLowerLine } from './src/utils/index';

const rollupProcessFileName = (chunkInfo) => {
  if (chunkInfo.type === 'asset') {
    const [name, ext] = path.basename(chunkInfo.name).split('.');
    return `assets/${toLowerLine(name)}.${ext}`;
  } else {
    return `assets/${toLowerLine(chunkInfo.name)}.js`;
  }
};

export default defineConfig({
  plugins: [
    vue(),
    vueSetupExtend(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve('src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    AutoImport({
      imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
      dirs: ['./src/hooks', './src/components'],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
    VitePWA({
      workbox: {
        // globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        globPatterns: ['**/*'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/s1\.hdslb\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      registerType: 'autoUpdate',
      manifest: {
        name: '迷鹿导航',
        short_name: '迷鹿导航',
        theme_color: '#ffffff',
        icons: [
          { src: 'icon/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon/icon-256.png', sizes: '256x256', type: 'image/png' },
          { src: 'icon/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        lang: 'zh-CN',
        scope: '/',
        description:
          '一个专注于收集和分享优质免费实用资源的导航，包含了效率工具，设计素材，软件资源，影视站点，技术开发等各类实用网址。',
      },
    }),
    checkBrowser(),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  build: {
    // 必需要加 不然默认 ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
    target: ['es2015', 'chrome64', 'edge79', 'firefox67', 'safari11.1'],
    rollupOptions: {
      output: {
        // entryFileNames: `assets/[name].js`,
        // chunkFileNames: `assets/[name].js`,
        // assetFileNames: `assets/[name].[ext]`,
        entryFileNames: rollupProcessFileName,
        chunkFileNames: rollupProcessFileName,
        assetFileNames: rollupProcessFileName,
        manualChunks: {
          // 拆分代码,配置完后自动按需加载
          bucket: ['vue', 'vue-router', 'pinia', '@vueuse/head'],
          libs: ['dayjs', 'crypto-js', 'localforage', 'js-cookie'],
          ui: ['element-plus'],
        },
      },
    },
  },
});
