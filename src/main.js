// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { MdField, MdList, MdMenu, MdButton } from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import App from './App';
import router from './router';
import './styles/main.css';

Vue.use(MdField);
Vue.use(MdList);
Vue.use(MdMenu);
Vue.use(MdButton);

Vue.config.productionTip = false;

/* eslint-disable no-new */
window.vueApp = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
