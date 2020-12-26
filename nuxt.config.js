export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      lang: 'ru',
    },
    title: 'Ресурспаки для minecraft - craft-rp.ru',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Просматривайте и скачивайте лучшие ресурспаки для minecraft, которые подойдут именно Вам! - craft-rp.ru',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'ресурспаки, ресурпак, графика, minecraft',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/main.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/vuelidate.js', ssr: true },
    { src: '~/plugins/vue-js-modal.js' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/google-analytics',
  ],
  serverMiddleware: [{ path: '/api', handler: '~/api/index.js' }],
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    [
      'nuxt-buefy',
      {
        defaultIconPack: 'fas',
        materialDesignIconsHRef:
          'https://use.fontawesome.com/releases/v5.4.1/css/all.css',
      },
    ],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    'vue-scrollto/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL:
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3000'
        : 'https://craft-rp.ru',
  },
  robots: {
    UserAgent: '*',
    Disallow: '/admin',
  },
  sitemap: {
    path: '/craft-rp.ru.xml',
    hostname:
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3000'
        : 'https://craft-rp.ru',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false,
    exclude: ['/admin', '/post'],
    routes: [
      '/',
      '/post/*',
      '/about',
      '/contactus',
      '/login',
      '/register',
      '/mypage',
    ].map((el) => ({
      url: el,
      priority: 1,
      lastmodISO: new Date().toISOString().split('T')[0],
    })),
  },
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
