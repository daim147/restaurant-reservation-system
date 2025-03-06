import Vue from 'vue';
import App from './App.vue';
import store from './store';
import './assets/css/tailwind.css';

// Enable Vue devtools in production (normally only enabled in development)
Vue.config.devtools = true;

// Configure Vue for better development experience
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
