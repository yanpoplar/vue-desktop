<template>
    <div class="footer"  @mousedown="emit('mousedown:footer',$event);">
        <div class="items" @dragover="dragover($event)" >
                <ul>
                    <li v-for="item in footerapps" @click="click(item)" @dragstart="onDragstart($event,item);" @dragend="onDragend($event,item);" draggable="true">
                        <svg class="icon" aria-hidden="true" :style="item.iconStyle"><use :xlink:href='item.icon'></use></svg>
                    </li>
                </ul>
            
            <div id="triangle-bottomleft"></div>
            <div id="triangle-bottomright"></div>
        </div>

    </div>
</template>

<script>
    var appController = require('service/app-controller');
    export default {
        props:{
            footerapps:Array
        },
        data() {
            return {
                maxNum : 10,
                draggingItem:null
            }
        },
        methods: {
            emit:function (name,e) {
                if(e.button==0){
                    $event.emit(name,{x:e.clientX,y:e.clientY});
                }
            },
            click(item) {
                console.log(item);
            },
            onDragstart:function ($event,file) {
                
            },
            onDragend:function (e,file) {
                var wid = $(".footer ul").width();
                var liwid = $(".footer li").width();
                var left = (window._w - wid) / 2;
                var top = window._h + 40;
                var x = e.clientX;
                var y = e.clientY;
                if (x > left && x < (window._w - left) && y > top){
                    var num =  Math.floor( (x - left) / liwid);
                    var index = this.footerapps.indexOf(file);
                    this.footerapps.splice(index,1);
                    this.footerapps.splice(num,0,file);
                } else {
                    $event.emit('drop:footer',{x:e.clientX,y:e.clientY,file:file});
                    e.preventDefault();
                }
            },
            dragover:function (e) {
                e.preventDefault();
            }
        }
    }
</script>

<style>
    @import "../../../static/css/footer.css";
</style>
