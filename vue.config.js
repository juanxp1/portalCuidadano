const { defineConfig } = require("@vue/cli-service");
const { IS_PROD } = require("./src/util/globals");
const config = require("./webpack.config");
module.exports = defineConfig({
  productionSourceMap: false,
  css: {
    // extract: !IS_SERVER && { ignoreOrder: true },
    // sourceMap: !IS_SERVER,
    // extract: IS_PROD,
    extract: { ignoreOrder: true },
    sourceMap: !IS_PROD,
  },
  configureWebpack: { ...config },
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  pages: {
    index: {
      // entry for the page
      entry: "src/entry-client.js",
      title: process.env.VUE_APP_TITLE,
    },
  },
  pluginOptions: {
    i18n: {
      locale: process.env.VUE_APP_I18N_LOCALE || "es",
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "es",
      localeDir: "locales",
      enableInSFC: false,
      silentTranslationWarn: true,
    },
  },
  pwa: {
    name: process.env.VUE_APP_TITLE,
    themeColor: "#ffffff",
    msTileColor: "#594d95",
    assetsVersion: process.env.VUE_APP_VERSION,
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "default",
    manifestOptions: {
      short_name: process.env.VUE_APP_SHORT_NAME,
      description: process.env.VUE_APP_DESCRIPTION,
      background_color: "#FFFFFF",
      icons: [
        {
          src: "./img/icons/android-chrome-36x36.png",
          sizes: "36x36",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-384x384.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-maskable-36x36.png",
          sizes: "36x36",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-48x48.png",
          sizes: "48x48",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-72x72.png",
          sizes: "72x72",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-96x96.png",
          sizes: "96x96",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-144x144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-256x256.png",
          sizes: "256x256",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-384x384.png",
          sizes: "384x384",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/service-worker.js",
      exclude: [/\.map$/],
      dontCacheBustURLsMatching: /^\/(js|css).+[A-Za-z0-9]{8}\.(js|css)$/,
      maximumFileSizeToCacheInBytes: 5 * 1024 ** 2,
      // ...other Workbox options...
    },
  },
  transpileDependencies: ["vuetify", "markdown-it-prism"],
  // integrity: true,
  lintOnSave: false,
});
