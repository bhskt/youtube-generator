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
    '@nuxtjs/moment',
    '@nuxtjs/stylelint-module',
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],

  modules: ['@nuxtjs/axios', '@nuxtjs/firebase', 'cookie-universal-nuxt'],

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
  },

  firebase: {
    config: {
      apiKey: 'AIzaSyCQewiwRdARPPQyobDRw8VWXPZw615nTJo',
      authDomain: 'yg-2021.firebaseapp.com',
      projectId: 'yg-2021',
      storageBucket: 'yg-2021.appspot.com',
      messagingSenderId: '398704981477',
      appId: '1:398704981477:web:f26c1cfa77d67de3a66b0c'
    },
    functions: {
      location: 'us-central1',
      emulatorPort: 5001,
      emulatorHost: 'http://localhost'
    },
    services: {
      auth: true,
      firestore: true,
      functions: true
    }
  }
};
