<template>
    <div class="wrapper">
        <v-Head :apps.sync="apps"></v-Head>
        <vFooter :footerapps.sync="footerapps"></vFooter>
        <wallpaper></wallpaper>
        <files :files.sync="files"></files>
        <mousemenu></mousemenu>
        <notification :notifis.sync="notifis"></notification>
        <application :apps.sync="apps"></application>
        <appstore></appstore>
    </div>
</template>

<style>
    @import "../../../static/css/reset.css";
    @import "../../../static/css/main.css";

</style>
<script>
    import "../../../static/css/iconfont/iconfont";
    var appController = require('../../service/app-controller');
    require('service/global-var'); //获取窗口的width，height
    var io = require('service/socketio'); //websocket js
    // import {
    // getBrandList,
    // deleteBrand,
    // getBrandInfo,
    // saveBrand,
    // actionURL
    // } from '../../../assets/js/api/dcim';
    export default {
        data() {
            return {
                files: appController.files,
                footerapps: appController.footerapps,
                message: '',
                notifyVisible: true,
                notifis: [],
                apps:appController.apps
            }
        },
        components: {
            vHead: require('./Header.vue'),
            vFooter: require('./footer.vue'),
            wallpaper: require('./wallpaper.vue'),
            files: require('./file.vue'),
            mousemenu: require('./mouse-menu.vue'),
            notification: require('./notification.vue'),
            appstore : require('./appstore.vue'),
            application: require('./application.vue')
        },
        created() {
            // getBrandList(para).then((res) => {
            //     self.listloading = false;
            //     self.tableData = res.data.data.data;
            //     self.total = parseInt(res.data.data.count);
            // }).catch(() => {
            //     this.$message({
            //     showClose: true,
            //     message: '获取数据错误',
            //     type: 'error'
            //     });
            // });
            let vm = this;
            // var test_socket = io.connect('ws://192.168.124.99:9990');
            // test_socket.on('connect', function () {
            //     test_socket.emit('testmessage', {
            //         hello: 'world'
            //     });
            //     test_socket.on('new message', function (msg) {
            //         vm.message = msg.message;
            //         vm.notify(vm.message);
            //         var item = {};
            //         item.msg = vm.message;
            //         vm.addmsg(item);
            //     });
            // });
        },
        methods: {
            notify(msg) {
                this.$notify({
                title: '待办事项',
                message: msg,
                offset: 60
                });
            },
            addmsg(item) {
                let vm = this;
                vm.notifis.push(item);
            }
        }
    }

</script>
