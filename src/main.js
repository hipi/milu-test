import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import router from './router';

// icons
import 'virtual:svg-icons-register';

import App from './App.vue';
import './styles/index.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createHead());

app.mount('#root');
