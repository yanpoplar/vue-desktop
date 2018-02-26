<template>
 <transition name="slide-fade">
    <div class="notification" v-show="notifyVisible">
      <ul class="notification-main">
        <li v-for="item in notifis">
          <div class="masgicon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-ziyuanxiawu"></use>
            </svg>
          </div>
          <div class="msg-main">
            <div class="tit">
              <span class="appname">待办事项
                <div v-if="item.type" class="notice">通知</div>
              </span>
              <span class="time">3分钟前</span>
            </div>
            <div class="msgtxt">
              {{item.msg}}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<style>
  .slide-fade-enter-active {
    transition: all .8s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100%);
  }
    @import "../../../static/css/notification.css";
</style>

<script>

  export default {
    props:{
        notifis:Array
    },
    data() {
      return {
        notifyVisible: false
      };
    },

    watch: {

    },

    methods: {

    },
    mounted() {
          var vm = this;
            $event.on('mousedown:alarm',function () {//右击app 取消app选择
            console.log("alarm");
              vm.notifyVisible = !vm.notifyVisible;
            });
    }
  };
</script>
