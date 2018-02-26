<template>
    <div class="file-item"
         :class="{
         selected:file.selected,
         dragging:dragging
         }"

         @mousedown="mousedownOnFileItem($event);"
         @contextmenu="contextmenuOnFileItem($event,file)"
    >
        <div class="file-body"
             @click="select(file)"
             @dblclick="file.open()"
             @dragstart="onDragstart($event,file);"
             @dragover="ondragover($event,file);"
             @dragend="onDragend($event,file);"
             draggable="true"
        >
        <div class="icon-itme">
            <svg class="icon" aria-hidden="true">
            <use :xlink:href="file.icon"></use>
            </svg>
        </div>
            <div class="text">
                {{file.name}}
            </div>
        </div>
    </div>
</template>
<style>
    @import  "../../../static/css/appitem.css";
</style>
<script>


    module.exports = {
        props:{
            file:Object,
            select:Function,
            dragstart:Function,
            dragend:Function
        },
        data: function () {
            return {
                dragging:false
            }
        },
        methods: {
            onDragstart:function ($event,file) {
                this.dragstart($event,file);
                this.dragging = true;
            },
            ondragover:function(e,file) {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.dropEffect = "move";
                e.preventDefault();
            },
            onDragend:function ($event,file) {
               
                this.dragend($event,file);
                this.dragging = false;
            },
            mousedownOnFileItem:function (e) {
                if ( $(e.target).is('.file-item') && e.button==0 ){
                    $event.emit('mousedown:wallpaper',{x:e.clientX,y:e.clientY})
                }else if(e.button==0){
                    $event.emit('mousedown:file',{x:e.clientX,y:e.clientY});
                }
            },
            contextmenuOnFileItem:function (e,file) {
                if ( $(e.target).is('.file-item') ){
                    $event.emit('contextmenu:wallpaper',{x:e.clientX,y:e.clientY})
                }else{
                    $event.emit('contextmenu:file',{x:e.clientX,y:e.clientY,file:file})
                }
            }
        }
    }
</script>