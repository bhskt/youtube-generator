export default {
  head: {
    titleTemplate: '%s',
    title: 'YouTube Generator',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },

  components: true,

  buildModules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/stylelint-module',
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],

  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      icons: 'fa'
    },
    theme: {
      dark: true
    },
    treeShake: true
  },

  build: {},

  server: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0'
  },

  target: 'static',

  googleFonts: {
    families: {
      Lato: true
    }
  }
};
