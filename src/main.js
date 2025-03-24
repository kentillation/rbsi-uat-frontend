import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './styles.css'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')

// Disable Vue Devtools in production
  if (process.env.VUE_APP_ENV === 'production') {
    const app = createApp(App);
    app.config.devtools = false;
    app.config.debug = false;
    app.config.silent = true;
}