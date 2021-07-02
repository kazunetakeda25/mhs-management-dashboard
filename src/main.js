// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import Toasted from 'vue-toasted';
import VCalendar from 'v-calendar';
import VueApexCharts from 'vue-apexcharts';
import axios from "axios";
import VueAxios from "vue-axios";
import VueSocketIO from 'vue-socket.io';
import store from './store';
import router from './Routes';
import App from './App';
import layoutMixin from './mixins/layout';

Vue.use(BootstrapVue);
Vue.use(VCalendar, {
  firstDayOfWeek: 2
});
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg',
  },
});
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.use(VueAxios, axios);
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:4000',
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  },
}));

Vue.component('apexchart', VueApexCharts);
Vue.mixin(layoutMixin);
Vue.use(Toasted, { duration: 10000 });

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
