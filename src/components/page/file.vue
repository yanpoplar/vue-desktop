<template>
    <div class="file-section">
        <file v-for="file in files" :file.sync="file" :select="select" :dragstart="dragstart" :dragend="dragend" v-show="allFileShow"
            :style="{
                width:option.cell.width+'px',
                top:(file.y*option.cell.height + 40) +'px',
                left:file.x*option.cell.width +'px'
                }"></file>
    </div>
</template>

<script>
    var appController = require('service/app-controller');
    var util = require('service/util');

    var option = {
        cell: {
            height: 130,
            width: 130
        }
    };
    var maxRow = Math.floor(window._h / option.cell.height); //一列能放得个数
    function getParsedXY(x, y, origin) { //获取拖动后的app位置
        x = x - option.cell.width / 2;
        y = y - option.cell.height / 2;
        var o = {
            x: x / option.cell.width,
            y: (y - 40) / option.cell.height
        };
        if (!origin) {
            o.x = Math.round(o.x);
            o.y = Math.round(o.y);
        }
        if (o.y >= maxRow) {
            o.y = maxRow - 1;
        }
        return o;
    }



    var commandKeyPressed = false;
    // $(window).on('keydown',function (e) {
    //     if(e.keyCode == require('service/keyboard').keyMap.cmd){
    //         commandKeyPressed = true;
    //     }
    // }).on('keyup',function (e) {
    //     if(e.keyCode == require('service/keyboard').keyMap.cmd){
    //         commandKeyPressed = false;
    //     }
    // })

    module.exports = {
        props: {
            files: Array
        },
        data: function () {
            return {
                option: option,
                clipboard: [],
                draggingItem: null,
                allFileShow: true
            }
        },
        methods: {
            sortFile(files) { //排序app x 为第几列 y为第几行
                files.forEach(function (file, index) {
                    file.x = Math.floor(index / maxRow);
                    file.y = index % maxRow;
                })
            },
            select: function (file) {
                if (!commandKeyPressed) {
                    this.clearSelect();
                }
                file.select();
            },
            // selectAll:function () {
            //     this.files.forEach(function (a) {
            //         a.selected = true;
            //     })
            // },
            getSelectedFiles:function () {
                return this.files.filter(function (a) {
                    return a.selected;
                })
            },
            dragstart(e, item) { //拖动app
                this.draggingItem = item;
            },
            dragend(e, item) { //app 拖动完成后
                var vm = this;
                vm.draggingItem = item;
                var wid = $(".footer ul").width();
                var liwid = $(".footer li").width();
                var left = (window._w - wid) / 2;
                var top = window._h + 40;
                var x = e.clientX;
                var y = e.clientY;
                if (x > left && x < (window._w - left) && y > top) {
                    var num = Math.floor((x - left) / liwid);
                    appController.addfooterapps(vm.draggingItem, num);
                } else {
                    var targetPosition = getParsedXY(e.clientX, e.clientY);
                    var row = targetPosition.x;
                    var col = targetPosition.y;
                    var index = row * maxRow + col;
                    appController.changeFile(item, index);
                }
                vm.draggingItem = null;
                appController.resetAllFile();
            },
            // getGridMap:function () {
            //     var map = [];
            //     this.files.forEach(function (item) {
            //         map[item.x] = map[item.x] || [];
            //         map[item.x][item.y] = item ;
            //     });
            //     return map;
            // },
            clearSelect() {
                this.files.map(function (a) {
                    a.selected = false;
                })
            },
            // forEachGridEmptyPoint:function (cb) {
            //     var map = this.getGridMap();
            //     var x,y;
            //     var count = 0;
            //     for(x=0,y=0;x<50;y++){
            //         if(y>maxRow-1){
            //             y=0;
            //             x++;
            //         }
            //         if(!map[x] || !map[x][y]){

            //             if(cb && cb(x,y,count)===false){
            //                 return;
            //             }
            //             count++;
            //         }
            //     }
            // }
        },
        components: {
            file: require('../common/app-item.vue')
        },
        mounted() {
            var vm = this;
            vm.sortFile(vm.files);

            $event.on('refresh:menu', function () {
                vm.allFileShow = false;
                setTimeout(function () {
                    vm.allFileShow = true;
                }, 10);
            });

            $event.on('file:reset', function () {
                vm.sortFile(vm.files);
            });

            $event.on('mousedown:wallpaper', function () { //点击空摆出 取消app选择
                vm.clearSelect();
            });
            $event.on('contextmenu:file', function (data) { //右击app 取消app选择
                if (!data.file.selected) {
                    vm.clearSelect();
                    data.file.selected = true;
                }
            });
            $event.on('drop:footer', function (data) { //拖动app 根据鼠标位置获取app位置
                appController.addfile(data.file);
                appController.resetAllFile();
            });
            $event.on('open:menu', function () {
                vm.getSelectedFiles().forEach(function (file) {
                    file.open();
                })
            });
            //     $event.on('copy:keyboard copy:menu',function () {
            //         vm.clipboard = vm.getSelectedFiles().map(function (a) {
            //             var b = a.clone();
            //             b.copy = true;
            //             return b;
            //         });
            //     });
            //     $event.on('cut:keyboard cut:menu',function () {
            //         vm.clipboard = vm.getSelectedFiles().map(function (a) {
            //             var b = a.clone();
            //             a.deleted = true;
            //             return b;
            //         });
            //         util.arrayRemove(vm.files,function (a) {
            //             return a.deleted;
            //         });
            //     });
            //     $event.on('delete:menu delete:keyboard',function () {
            //         util.arrayRemove(vm.files,function (a) {
            //             return a.selected;
            //         });
            //     });
            //     $event.on('selectAll:keyboard selectAll:menu',function () {
            //         vm.selectAll();
            //     });
            //     $event.on('paste:keyboard paste:menu',function () {
            //         var arr = vm.clipboard;
            //         vm.clearSelect();
            //         if(!arr || !arr.length)return;
            //         vm.forEachGridEmptyPoint(function (x,y,index) {
            //             var item = arr.shift();
            //             item.x = x;
            //             item.y = y;
            //             item.selected = false;
            //             if(item.copy){
            //                 item.name = item.name + " (2)";
            //             }
            //             item.copy = false;
            //             vm.files.push(item);

            //             if(!arr.length){
            //                 return false;
            //             }
            //         });
            //     });

            //     $event.on('selection:mouse-action',function (data) {
            //         var a = getParsedXY(data.topLeft.x,data.topLeft.y,true);
            //         var b = getParsedXY(data.bottomRight.x,data.bottomRight.y,true);
            //         var yRange = [a.y,b.y];
            //         var xRange = [a.x,b.x];
            //         vm.files.forEach(function (item) {
            //             item.selected = false;
            //             if(item.x>=xRange[0]  && item.x<=xRange[1]){
            //                 if(item.y>=yRange[0] && item.y<=yRange[1] ){
            //                     item.selected = true;
            //                 }
            //             }
            //         })
            //     });
            $event.on('contextmenu:wallpaper', function () { //空白处右键取消app选中状态
                vm.clearSelect();
            });
            //     $event.on('openFileProp:menu',function (file) {
            //         var File = require('service/file.js');
            //         var propObj = {
            //             name: file.name +" 属性",
            //             app: "props",
            //             icon: file.icon,
            //             options: {
            //                 data:file,
            //                 width:400
            //             }
            //         };
            //         var PropFile = new File(propObj);
            //         PropFile.open();
            //     });
            //     $event.on('resetFile:menu',function () {
            //         appController.resetAllFile();
            //     })
        }
    }

</script>
