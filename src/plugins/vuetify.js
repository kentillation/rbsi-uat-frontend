// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: localStorage.getItem('theme') || 'light', // Load saved theme or default to light
    themes: {
      light: {
        dark: false,
      },
      dark: {
        dark: true,
      },
    },
  },
});

export default vuetify;
