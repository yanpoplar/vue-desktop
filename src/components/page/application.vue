<template>
    <div class="application-section">
        <app-window v-for="app in apps" :app="app"></app-window>
    </div>
</template>

<script>
    module.exports = {
        props:{
            apps:Array
        },
        data: function () {
            return {
            }
        },
        methods: {
        },
        components: {
            appWindow:require('../common/app-window.vue')
        }
    };
</script>