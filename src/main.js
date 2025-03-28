import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import './styles.css'

loadFonts()

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(vuetify)
app.use(pinia) // Register Pinia
app.mount('#app')

// Disable Vue Devtools in production
if (process.env.VUE_APP_ENV === 'production') {
  app.config.devtools = false;
  app.config.debug = false;
  app.config.silent = true;
}