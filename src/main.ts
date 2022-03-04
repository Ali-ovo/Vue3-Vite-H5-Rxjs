import { createApp } from 'vue';
import App from './App.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// import 'vant/lib/index.css';

import './styles/index.scss';
import store from './store';
import router from './router';

const app = createApp(App);

dayjs.locale('zh-ch');
app.config.globalProperties.$dayjs = dayjs;

app.use(store);
app.use(router);
app.mount('#app');
