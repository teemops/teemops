import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,


  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - SCG',
    title: 'Teemops',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/lists.ts' },
    { src: '~/plugins/axios.ts' },
    { src: '~/plugins/api.ts' },
    { src: '~/plugins/filters.ts' },
    { src: '~/plugins/vue-apexchart.ts', ssr: false },
    { src: '~/plugins/vue-qrcode.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    ['nuxt-vuex-localstorage', {
      mode: 'debug',
      localStorage: ['auth']
    }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.MODE == 'dev' ? 'http://localhost:8080/api/' : "https://api.teemops.com/api/",
    //baseURL: 'https://api.teemops.com/api/'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.orange.darken2,
          accent: colors.grey.darken3,
          secondary: colors.brown.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.orange.darken2,
          accent: colors.grey.darken1,
          secondary: colors.brown.darken1,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      compact: process.env.MODE != 'dev',
      sourceRoot: __dirname
    },
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (process.env.MODE === 'dev') {
        config.devtool = isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  env: {
    stripe_key: process.env.STRIPE_KEY,
    stripe_link: process.env.STRIPE_LINK,
    topsless_api: process.env.MODE != 'dev' ? 'https://topsless.app.teemops.com/' : 'http://localhost:8081/dev/',
    mfa_auth_api: process.env.MODE != 'dev' ? 'https://mfa-auth.teemops.com/api/' : 'http://localhost:8787/api/',
    aws_parent_account: process.env.AWS_ACCOUNT,
    build_name: process.env.BUILD_NAME,
    is_product_audit: process.env.BUILD_NAME == 'audit' ? true : false,
  },
}
