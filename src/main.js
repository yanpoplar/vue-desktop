import Vue from 'vue';
import ElementUI from 'element-ui';
import '../theme/index.css';
import '../static/css/common.css';
Vue.use(ElementUI);
var jQuery = require('jquery');
window.$ = jQuery;
window.$event = require('service/event');
import echarts from 'echarts';
Vue.prototype.$echarts = echarts ;
import App from './components/page/Home';
new Vue({
    render: h => h(App)
}).$mount('#app');
