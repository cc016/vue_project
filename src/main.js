import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入配置表  以便读取element ui 包含的标签……
import './plugins/element.js'

// 导入全局样式表
import './assets/css/global.css'

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
    // 把axios 挂载到原型对象上  这样的话 每一个vue组件  可以通过this直接访问$http 从而发送axios请求
Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')