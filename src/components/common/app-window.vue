<template>
    <div class="app" v-show="app._show" :class="{
                focus:app._focus,
                animating:app.animating
                }" :style="{
                top:app.top+'px',
                left:app.left+'px',
                width:app.width +'px',
                height:app.height + 42 +'px'
                }" @mousedown="appWindowMousedown(app,$event)">
        <header class="app-title" @mousedown.self="titleMousedown(app,$event)" @mouseup="mouseup()">
            <svg class="icon2" aria-hidden="true">
                <use :xlink:href="app.icon"></use>
            </svg>
            {{app.title}}
            <div class="app-control">
                <span class="c c1" @mousedown="hideApp(app)"></span>
                <span class="c c2" @mousedown="app.resizable && maxApp(app)">
                    <svg class="icon icon3" aria-hidden="true" v-if="!app.maximized">
                        <use xlink:href="#icon-zuidahua1"></use>
                    </svg>
                    <svg class="icon icon3" aria-hidden="true" v-else>
                        <use xlink:href="#icon-huanyuan"></use>
                    </svg>
                </span>
                <span class="c c3" @mousedown="closeApp(app)"></span>
            </div>
        </header>
        <div class="app-main" :style="{height:app.height+'px'}">

            <div class="thisleft"></div>
            <div class="thismain">
                <div class="thisheader">
                    <ul>
                        <li class="appmain" :class="{active:appIndex}" title="主页" @click="indexclick()">
                            <svg class="icon1" aria-hidden="true">
                                <use xlink:href="#icon-icon-test"></use>
                            </svg>
                        </li>
                        <li class="apptab" :class="{active:item._show}" v-for="item in secapps" @click="tabclick(item)">
                            <span class="tabname">{{item.name}}</span>
                            <svg class="icon2" aria-hidden="true" @click.stop="closeItem(item)">
                                <use xlink:href="#icon-close"></use>
                            </svg>
                        </li>
                    </ul>
                </div>
                <div class="thisbody">
                    <ul v-if="appIndex" class="app2-list" >
                        <li v-for="item in app.apps" @dblclick="openItem(item)">
                            <div class="app-icon">
                                <div class="icon-body">
                                    <svg class="icon" aria-hidden="true">
                                        <use :xlink:href="item.icon"></use>
                                    </svg>
                                </div>
                            </div>
                            <p class="app-name">{{item.name}}</p>
                        </li>
                    </ul>
                    <div class="appcon"  v-else>
                        <component  v-for="item in secapps" :is="item.type" :item.sync="item" v-if="item._show"></component>
                    </div>
                </div>
            </div>
        </div>
            <div class="resize-overlay" v-show="overlayShow"></div>
            <!--<div
                v-for="dir in resizeDirection"
                v-show="app.resizable"
                class="resize-handle resize-handle-{{dir}}"
                @mousedown="resizeHandler(dir,$event)"
        ></div>-->
        </div>
</template>
<style>
    @import "../../../static/css/app-window.css";

</style>
<script>
    module.exports = {
        props: {
            app: Object,
        },
        data: function () {
            return {
                appWindowMinWidth: 924,
                appWindowMinHeight: 680,
                drag: false,
                resize: {
                    r: false,
                    b: false,
                    t: false,
                    l: false
                },
                overlayShow: false,
                resizeDirection: ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'],
                appIndex: true,
                secapps : [] 
            }
        },
        computed: {
            isResizing: function () {
                var resizing = false;
                $.each(this.resize, function (k, v) {
                    if (v) {
                        resizing = true;
                    }
                })
                return resizing;
            }
        },
        methods: {
            appWindowMousedown: function (app, e) {
                if (!$(e.target).is('.app-control *')) {
                    app.show();
                }
            },
            titleMousedown: function (app, e) {
                app.show();
                this.drag = {
                    x: e.clientX - app.left,
                    y: e.clientY - app.top
                };
            },
            mouseup: function () {
                this.drag = false;
                var vm = this;
                $.each(this.resize, function (k, v) {
                    vm.resize[k] = false;
                });

            },
            closeApp: function (app) {
                app.close();
            },
            maxApp: function (app) {
                app.maximize();
            },
            hideApp: function (app) {
                app.hide();
            },
            resizeHandler: function (direction, event) {
                var vm = this;
                var app = vm.app;
                app.show();
                var fn = {
                    r: function (e) {
                        vm.resize.r = {
                            d: e.clientX - app.left - app.width
                        };
                    },
                    b: function (e) {
                        vm.resize.b = {
                            d: e.clientY - app.top - app.height
                        };
                    },
                    l: function (e) {
                        vm.resize.l = {
                            d: e.clientX - app.left, // distance of click and edge
                            right: app.left + app.width
                        };
                    },
                    t: function (e) {
                        vm.resize.t = {
                            d: e.clientY - app.top,
                            bottom: app.top + app.height
                        }
                    },
                };
                var arr = direction.split('');
                arr.forEach(function (dir) {
                    if (fn[dir]) {
                        fn[dir](event)
                    }
                })
            },
            tabclick(item) {//标签点击
                let self = this;
                self.appIndex = true;
                for (index in self.secapps) {
                    self.secapps[index]._show = false;
                }
                item._show = true;
                self.appIndex = false;
            },
            openItem(item) {//二级图标点击
                let self = this;
                self.appIndex = false;
                if (self.secapps.indexOf(item)<0) {
                    for (index in self.secapps) {
                        self.secapps[index]._show = false;
                    }
                    item._show = true;
                    self.secapps.push(item);
                }else {
                    for (index in self.secapps) {
                        self.secapps[index]._show = false;
                        if ( self.secapps[index].name == item.name) {
                            self.secapps[index]._show = true;
                        }
                    }
                }
            },
            indexclick() {
                let self = this;
                self.appIndex = true;
                for (index in self.secapps) {
                    self.secapps[index]._show = false;
                }
            },
            closeItem(item) {//关闭标签页
                let self = this;
                var num = self.secapps.indexOf(item);
                self.secapps.splice(num,1);
                if(item._show){
                    self.appIndex = true;
                }
            }
        },
        components: {

        },
        mounted: function () {
            var vm = this;
            var $w = $(window);
            var app = vm.app;
            function isset(n) {
                return typeof n !== 'undefined';
            }

            function onDrag(e) {
                var y = e.clientY - vm.drag.y;
                var x = e.clientX - vm.drag.x;
                app.top = Math.min(Math.max(0, y,header_height), window._h - app.height - app.titleHeight + header_height + footer_height);
                app.left = Math.min(Math.max(0, x), window._w - app.width);
            }

            function onEasyResize(e) {
                var height, width;

                if (vm.resize.b) {
                    height = e.clientY - vm.resize.b.d - app.top;
                }

                if (vm.resize.r) {
                    width = e.clientX - vm.resize.r.d - app.left;
                }

                if (height) {
                    var maxHeight = window._h - app.top - app.titleHeight;
                    height = Math.max(Math.min(height, maxHeight), appWindowMinHeight);
                    app.set('height', height);
                }
                if (width) {
                    var maxWidth = window._w - app.left;
                    width = Math.max(Math.min(width, maxWidth), appWindowMinWidth);
                    app.set('width', width);
                }
            }

            function onDamnItResize(e) {
                var height, width, top, left, right, bottom;

                if (vm.resize.l) {
                    right = vm.resize.l.right;
                    left = e.clientX - vm.resize.l.d;
                    left = Math.max(left, 0);
                }
                if (vm.resize.t) {
                    bottom = vm.resize.t.bottom;
                    top = e.clientY - vm.resize.t.d;
                    top = Math.max(top, 0);
                }


                if (right && isset(left)) {
                    width = right - left;
                    if (width < appWindowMinWidth) {
                        width = appWindowMinWidth;
                        left = right - width;
                    }
                }

                if (isset(top) && bottom) {
                    height = bottom - top;
                    if (height < appWindowMinHeight) {
                        height = appWindowMinHeight;
                        top = bottom - height;
                    }
                }

                if (isset(left)) {
                    app.set('left', left);
                }
                if (isset(top)) {
                    app.set('top', top);
                }

                if (height) {
                    app.set('height', height);
                }
                if (width) {
                    app.set('width', width);
                }
            }

            $w.on('mousemove', function (e) {

                if (vm.drag) {
                    onDrag(e);
                } else if (vm.isResizing) {
                    onEasyResize(e);
                    onDamnItResize(e);
                }

            }).on('mouseup', vm.mouseup);

            vm.$watch(function () {
                return vm.drag || vm.isResizing;
            }, function (val) {
                $event.emit('overlay:show', val);
            });
            $event.on('overlay:show', function (val) {
                vm.overlayShow = val;
            });

        }
    }
            var appRequire = require.context('./apps/', true, /\.vue$/);
            var appPathArr = appRequire.keys();
            appPathArr.forEach(function (appPath) {
                var appName = appPath.replace(/\.vue$/, "");
                appName = appName.replace(/^\.\//, '');
                console.log(appPath);
                module.exports.components[appName] = appRequire(appPath);
            });

</script>
