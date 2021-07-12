import Vue from 'vue'
// 使用element.js的基本标签
import { Button, Form, FormItem, Input } from 'element-ui'
// 导入消息弹框
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// Message 需要挂载到vue原型对象上  $message/$http是自定义的属性  this就指代了Vue原型对象 所以可以直接this.$message
Vue.prototype.$message = Message