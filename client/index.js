import Vue from 'vue'
import APP from './app.vue'
import './assets/style/global.less'

const root = document.createElement('div')
document.body.appendChild(root)

console.log(APP)

new Vue({
  render: (h) => h(APP)
}).$mount(root)
