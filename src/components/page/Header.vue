<template>
    <div class="header" @mousedown="mousedown($event);">
        <div class="header-con">
            <div class="head-left">
                <a class="menu logo" href="./"></a>
                <a class="menu item" :class="{active:type==0}" href="javascript:;" @click="opendesktop">桌面</a>
                <a class="menu item" :class="{active:type==1}" href="javascript:;" @click="openappstore">应用管理</a>
            </div>
            <div class="app-list">
                <div class="app-item" :class="{actived:app._focus}" :title="app.title" v-for="app in sortedApps" @click="click(app)">
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="app.icon"></use>
                    </svg>
                </div>
            </div>
            <div class="head-right">
                <a class="user-info item" @click="userclick($event);">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-geren"></use>
                    </svg>
                </a>
                <a class="item day" v-text="time"></a>
                <a class="alarm item" @click="alarm($event);">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xiaoxi"></use>
                    </svg>
                    <div class="msgtip" v-if="msgShow">
                        <div class="msg-cir"></div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    // var util = require('service/util');
    // var appController = require('service/app-controller');
    function getNewArray(arr) {
        var _arr = [];
        arr.forEach(function (a) {
            _arr.push(a);
        });
        return _arr;
    }
    module.exports = {
        props: {
            apps: Array
        },
        computed: {
            sortedApps: function () {
                var apps = getNewArray(this.apps);
                return apps;
            }
        },
        data() {
            return {
                time: '',
                type: 0,
                msgShow: true
            }
        },
        methods: {
            getDate() {
                this.dateForm();
                setInterval(() => {
                    this.dateForm();
                }, 1000)
            },
            dateForm() { //日期格式化
                var l = ["日", "一", "二", "三", "四", "五", "六"];
                var now = new Date();
                var year = now.getFullYear();
                var month = (now.getMonth() + 1).toString();
                var day = (now.getDate()).toString();
                var d = (now.getDay()).toString();
                var hour = (now.getHours()).toString();
                var min = (now.getMinutes()).toString();
                var sec = (now.getSeconds()).toString();
                if (month.length == 1) {
                    month = "0" + month;
                }
                if (day.length == 1) {
                    day = "0" + day;
                }
                if (hour.length == 1) {
                    hour = "0" + hour;
                }
                if (min.length == 1) {
                    min = "0" + min;
                }
                if (sec.length == 1) {
                    sec = "0" + sec;
                }
                this.time = month + "月" + day + "日" + " " + "周" + l[d] + " " + hour + ":" + min;
            },
            mousedown(e) {
                let vm = this;
                $event.emit('mousedown:taskbar', {
                    x: e.clientX,
                    y: e.clientY
                });
            },
            click(app) {
                if (app._focus) {
                    app.hide();
                } else {
                    app.show();
                }
            },
            userclick(e) {
                let vm = this;
                $event.emit('mousedown:usercenter', {
                    x: e.clientX - 10,
                    y: 40
                });
            },
            alarm() {
                $event.emit('mousedown:alarm');
                this.msgShow = false;
            },
            opendesktop() {
                this.type = 0;
                $event.emit('click:desktop');
            },
            openappstore() {
                this.type = 1;
                $event.emit('click:appstore');
            }
        },
        created() {
            var vm = this;
            vm.getDate();
            $event.on('changetype:appstore', function () { //拖动app 根据鼠标位置获取app位置
                vm.type = 0;
            });
        }
    }

</script>
<style>
    @import "../../../static/css/header.css";

</style>
