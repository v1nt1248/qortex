import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dialog } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import { router } from './router'

import './assets/styles/style.css'
import App from './App.vue'

const pinia = createPinia()
pinia.use(({ store }) => store.router = markRaw(router))

createApp(App)
  .use(pinia)
  .use(Quasar,
    {
      plugins: { Dialog },
      config: { ripple: true }
    },
  )
  .use(router)
  .mount('#app')
