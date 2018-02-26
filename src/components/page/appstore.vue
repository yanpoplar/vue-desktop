<template>
    <div class="app-store" v-show="show">
        <header class="app-title">
                <svg class="icon2" aria-hidden="true">
                    <use xlink:href="#icon-huojian"></use>
                </svg>应用市场
            <div class="app-control">
                <!--<span class="c c1" @mousedown="hideApp(app)"></span>
                <span class="c c2" @mousedown="app.resizable && maxApp(app)"><svg class="icon icon3" aria-hidden="true">
                    <use xlink:href="#icon-zuidahua1"></use>
                </svg></span>-->
                <span class="c c3" @mousedown="closeApp()"></span>
            </div>
        </header>
        <div class="store-header">
            <ul>
                <li v-bind:class="{active:type==0}" v-on:click="type = 0">全部</li>
                <li v-bind:class="{active:type==1}" v-on:click="type = 1">已购买</li>
                <li v-bind:class="{active:type==2}" v-on:click="type = 2">已到期</li>
            </ul>
            <div class="resSearch">
                <input type="text" name="" placeholder="查找您想要的..." v-model="search">
                <div class="search-icon">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-search"></use>
                    </svg>
                </div>
            </div>
        </div>
        <div class="store-body">
            <ul>
                <li v-for="n in 16">
                    <div class="app-icon">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-zhinengpaike"></use>
                        </svg>
                    </div>
                    <div class="app-name">
                        <p class="app-na">综合素质评价</p>
                        <div class="report">
                            <svg v-for="n in 5" class="icon-star" aria-hidden="true">
                                <use xlink:href="#icon-xing"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="app-detail">
                        <div class="app-detail-body">
                            <p class="app-detail-txt">转变以考试成绩为唯一标准评价学生的做法，为高校招生录取提供重要参考为高校招生录取为高校招生录取</p>
                            <div class="app-detail-btn">详情</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
                    <div class="store-footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="16"
                layout="jumper, prev, pager, next" :total="160">
            </el-pagination>
        </div>
    </div>

</template>

<style>
    @import "../../../static/css/appstore.css";

</style>
<script>
    module.exports = {
        data: function () {
            return {
                show: false,
                type: 0,
                search: '',
                currentPage3: 1
            }
        },
        methods: {
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            closeApp(){
                let vm = this;
                vm.show = false;
                $event.emit('changetype:appstore');
            }
        },
        components: {},
        mounted: function () {
            let vm = this;
            $event.on('click:appstore', function () { 
                vm.show = true;
            });
            $event.on('click:desktop', function () { 
                vm.show = false;
            });
        }
    }

</script>
