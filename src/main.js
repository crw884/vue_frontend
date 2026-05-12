import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router.js'

import './style.css'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import { ConfirmationService } from 'primevue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)
app.component('Toast', Toast);
app.use(PrimeVue,{
  theme:{
    preset: Aura,
    options:{
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})


app.mount('#app')
