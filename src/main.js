import Vue from 'vue'
import App from './App.vue'

//vue-router
import VueRouter from 'vue-router'
import router from './router'
Vue.use(VueRouter)

//element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.config.silent = true

new Vue({
  render: h => h(App),
  router,
  beforeCreate() {
    Vue.prototype.$bus = this; //安装全局事件总线，$bus相当于vm
  }
}).$mount('#app')
