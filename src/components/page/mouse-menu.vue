<template>
    <div class="mouse-action-section">
        <div class="context-menu" v-if="menu.data && menu.data.length" :style="{
                    top:menu.position.y+'px',
                    left:menu.position.x+'px'
                }">
            <ul>
                <li v-for="item in menu.data" :class="{disabled:item.disabled,divide:item.type=='divide','list-item':item.type!=='divide'}"
                    @click="click(item)">
                    <span class="name">
                        <svg class="icon" aria-hidden="true" :style="item.iconStyle">
                            <use :xlink:href='item.fontclass'></use>
                        </svg>{{item.text}}</span>
                    <span class="key">{{item.key}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<style>
    @import "../../../static/css/contextmenu.css";

</style>
<script>
    var menuData = require('../../mock/menu');
    module.exports = {
        data: function () {
            return {
                menu: {
                    position: {},
                    file: null,
                    data: null
                }
            }
        },
        methods: {
            hide: function () {
                this.menu.data = null;
            },
            click(item) {
                if (item.disabled) return;
                if (item.callback) {
                    item.callback(this.menu.file);
                }
                this.hide();
            }
        },
        created() {
            var vm = this;
            $event.on('contextmenu:file', function (data) {
                console.log('file menu', data);
                vm.menu.data = menuData.file;
                vm.menu.file = data.file;
                vm.menu.position = {
                    x: data.x,
                    y: data.y
                };
            });
            $event.on('contextmenu:wallpaper', function (data) {
                console.log('desktop menu');
                vm.menu.data = menuData.wallpaper;
                vm.menu.file = null;
                vm.menu.position = {
                    x: data.x,
                    y: data.y
                };
            });
            $event.on('mousedown:usercenter', function (data) {
                vm.menu.data = menuData.usercenter;
                vm.menu.file = null;
                vm.menu.position = {
                    x: data.x,
                    y: data.y
                };

            });
            $event.on('mousedown:wallpaper mousedown:file mousedown:taskbar mousedown:footer', function (data) {
                vm.hide();
            });
            // var pasteOption = menuData.wallpaper.filter(function (a) {
            //     return a.type=='paste'
            // })[0];
            // $event.on('copy:keyboard copy:menu cut:keyboard cut:menu',function () {
            //     if(pasteOption){
            //         pasteOption.disabled = false;
            //     }
            // });
            // $event.on('paste:keyboard paste:menu',function () {
            //     if(pasteOption){
            //         pasteOption.disabled = true;
            //     }
            // })
        }
    }

</script>
