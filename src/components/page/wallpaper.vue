<template>
    <div class="wallpaper-section" @click="emit('click:wallpaper',$event);" @drop="drop($event);" @dragover="dragover($event)"
        @mousedown="mousedown($event)" @mouseup="emit('mouseup:wallpaper',$event);">
    </div>
</template>

<script>
    module.exports = {
        data: function () {
            return {}
        },
        methods: {
            emit: function (name, e) {
                if (e.button == 0) {
                    $event.emit(name, {
                        x: e.clientX,
                        y: e.clientY
                    });
                }
            },
            drop: function (e) {
                $event.emit('drop:wallpaper', {
                    x: e.clientX,
                    y: e.clientY
                });
                e.preventDefault();
            },
            dragover: function (e) {
                e.preventDefault();
            },
            mousedown: function (e) {
                if (e.button == 2) {
                    $event.emit('contextmenu:wallpaper', {
                        x: e.clientX,
                        y: e.clientY
                    })
                } else if (e.button == 0) {
                    $event.emit('mousedown:wallpaper', {
                        x: e.clientX,
                        y: e.clientY
                    })
                }
            }
        },
        components: {},
        mounted() {
            $(window).on('contextmenu', function (e) {
                e.preventDefault();
            })
        }
    }

</script>
