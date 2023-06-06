import Vue from 'vue'
import App from './App.vue'

//vue-router
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
Vue.use(VueRouter)

//element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//cookie
import VueCookies from "vue-cookies";
Vue.use(VueCookies);

//echarts
import "echarts";
import ECharts from 'vue-echarts'
Vue.component("ECharts", ECharts);

Vue.config.productionTip = false
Vue.config.silent = true

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this; //安装全局事件总线，$bus相当于vm
  }
}).$mount('#app')

