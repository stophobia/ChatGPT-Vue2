import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router";
import 'element-plus/dist/index.css';
import './assets/global.css';
import ElementPlus from 'element-plus'

const app = createApp(App);
app.use(router);
app.mount('#app')
