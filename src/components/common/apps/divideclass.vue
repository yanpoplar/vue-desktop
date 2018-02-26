<template>
    <div class="page divideclass">
        <div class="page-main" v-if="mainVisible">
            <div class="con-header">
                <div class="search-block">
                    <div class="search-type">
                        <el-select v-model="searchType" multiple placeholder="请选择" collapse-tags style="height:100%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-val">
                        <el-input placeholder="查找你想要的" prefix-icon="el-icon-search" v-model="searchVal">
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="con-main">
                <el-table :data="tableData" height="100%" border style="width: 100%;height:100%;border-radius:3px;">
                    <el-table-column label="序号" width="80">
                        <template slot-scope="scope">{{scope.$index + 1}}</template>
                    </el-table-column>
                    <el-table-column label="任务名称" prop="name">
                    </el-table-column>
                    <el-table-column label="选课类型" prop="classType">
                    </el-table-column>
                    <el-table-column label="选课课程数" prop="classNum">
                    </el-table-column>
                    <el-table-column label="选课开始时间" prop="startTime">
                    </el-table-column>
                    <el-table-column label="选课结束时间" prop="endTime">
                    </el-table-column>
                    <el-table-column label="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" content="教学班分班" placement="top">
                                <i class="iconfont icon-jiaoxuejihua" @click="teachDivide(scope.$index,scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" content="行政班分班" placement="top">
                                <i class="iconfont icon-hangzhengqu" @click="administrationDivide(scope.$index,scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" content="查看" placement="top">
                                <i class="iconfont icon-chakan" @click="openLook(scope.$index)"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="app-footer">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="16" layout="jumper, prev, pager, next"
                    :total="160">
                </el-pagination>
            </div>
        </div>
        <div class="page-divide" v-if="divideVisible">
            <div class="con-header">
                <div class="row-l">
                    <el-button type="primary" icon="el-icon-back" @click="backZero">退回</el-button>
                </div>
            </div>
            <div class="con-main">
                <div class="tit">
                    <span>智能分班设置</span>
                    <i class="iconfont icon-shezhi"></i>
                </div>
                <el-form ref="form" :model="form" label-width="140px">
                    <div class="row">
                        <div class="row-l">
                            <el-form-item size="small" label="班级最小人数">
                                <el-input v-model="form.min"></el-input>
                            </el-form-item>
                        </div>
                        <div class="row-r">
                            <el-form-item size="small" label="班级最大人数">
                                <el-input v-model="form.max"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-l">
                            <el-form-item size="small" label="男女比例">
                                <el-slider v-model="form.manPercent" :format-tooltip="formatTooltip" :step="10"></el-slider>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-l">
                            <el-form-item size="small" label="根据成绩分班">
                                <el-cascader :options="reportOptions" change-on-select v-model="form.selectedReport" @change="changeReportType"></el-cascader>
                            </el-form-item>
                        </div>
                        <div class="row-r" v-if="dVisible">
                            <el-form-item size="small" label="差值">
                                <el-input v-model="form.diffVal"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-l">
                            <el-form-item size="small" label="教室数">
                                <el-input v-model="form.classroom"></el-input>
                            </el-form-item>
                        </div>
                        <div class="row-r">
                            <el-form-item size="small" label="分班数">
                                <el-input v-model="form.classnum"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-l">
                            <el-form-item size="small" label="区间值">
                                <el-col :span="10">
                                    <el-input v-model="form.rangeS"></el-input>
                                </el-col>
                                <el-col class="line" :span="4">----</el-col>
                                <el-col :span="10">
                                    <el-input v-model="form.rangeE"></el-input>
                                </el-col>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-l">
                            <el-form-item size="small" label="毕业学校平均分班">
                                <el-checkbox v-model="form.schoolDivide"></el-checkbox>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div class="tit">
                    <span>概况信息</span>
                    <i class="iconfont icon-shezhi"></i>
                </div>
                <div class="txt">
                    <span v-if="divideByAdministration">已确认组合数：{{survey.groupConfirmedNum}}个</span>
                    <span v-if="divideByAdministration">未确认组合数：{{survey.groupUnconfirmedNum}}个</span>
                    <span v-if="divideByTeach">已分教室数：{{survey.divideClassroom}}人</span>
                    <span>已分学生数：{{survey.dividedStudent}}人</span>
                    <span class="color-red">未分学生数：{{survey.undivideStudent}}人</span>
                </div>
                <div class="row">
                    <div class="row-l tit">
                        <span>分班方案</span>
                        <i class="iconfont icon-shezhi"></i>
                    </div>
                    <div class="row-r">
                        <el-button type="primary" icon="el-icon-back">添加班级</el-button>
                        <el-button type="primary" icon="el-icon-back">一键分班</el-button>
                    </div>
                </div>
                <ul class="class-list">
                    <li class="class-item" v-for="n in 6">
                        <div class="item-detail">
                            <h2 class="item-tit">高中（1）班</h2>
                            <div class="item-main">
                                <p class="item-main-txt">选考：历史 政治</p>
                                <p class="item-main-txt">学考：物理</p>
                                <p class="item-main-txt">走班科目：生物 化学 地理</p>
                            </div>
                            <div class="people">175人</div>
                        </div>
                        <div class="item-btn" v-if="divideByAdministration">学生调整</div>
                        <div class="item-btn" v-if="divideByTeach">班级调整</div>
                    </li>
                    <li class="clearfix"></li>
                </ul>
                <div class="row">
                    <div class="row-r">
                        <el-button type="primary" icon="el-icon-back" v-if="divideByAdministration">使用该方案</el-button>
                        <el-button type="primary" icon="el-icon-back">分班方案评估报告</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-look" v-if="lookVisible">
            <div class="con-header">
                <div class="row-l">
                    <el-button type="primary" icon="el-icon-back" @click="backZero">退回</el-button>
                </div>
            </div>
            <div class="con-main">
                <div class="tit">
                    <span>教学班结果</span>
                    <i class="iconfont icon-shezhi"></i>
                </div>
                <ul class="class-list">
                    <li class="class-item" v-for="n in 6">
                        <div class="item-detail">
                            <h2 class="item-tit">生物（1）班</h2>
                            <div class="item-main">
                                <p class="item-main-txt">高一（1）班：42人</p>
                                <p class="item-main-txt">高一（3）班：33人</p>
                            </div>
                            <div class="people">175人</div>
                        </div>
                        <div class="item-btn">班级调整</div>
                    </li>
                    <li class="clearfix"></li>
                </ul>
                <div class="tit">
                    <span>行政班结果</span>
                    <i class="iconfont icon-shezhi"></i>
                </div>
                <ul class="class-list">
                    <li class="class-item" v-for="n in 6">
                        <div class="item-detail">
                            <h2 class="item-tit">高中（1）班</h2>
                            <div class="item-main">
                                <p class="item-main-txt">选考：历史 政治</p>
                                <p class="item-main-txt">学考：物理</p>
                                <p class="item-main-txt">走班科目：生物 化学 地理</p>
                            </div>
                            <div class="people">175人</div>
                        </div>
                        <div class="item-btn">学生调整</div>
                    </li>
                    <li class="clearfix"></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style>
    @import "/static/css/apps/divideclass.css";

</style>
<script>
    var util = require('../../../service/util');
    module.exports = {
        props: {
            item: Object
        },
        data: function () {
            return {
                mainVisible: true,
                divideVisible: false,
                lookVisible: false,
                searchVal: '',
                searchType: '',
                currentPage: 1,
                options: [{
                    value: '学届名称',
                    label: '学届名称'
                }, {
                    value: '当前学年',
                    label: '当前学年'
                }, {
                    value: '当前学期',
                    label: '当前学期'
                }, {
                    value: '学期人数',
                    label: '学期人数'
                }],
                tableData: [{
                        name: '2017级',
                        classType: '第一学年',
                        classNum: '第一学期',
                        startTime: '2017.10.10',
                        endTime: '2018.6.5'
                    },
                    {
                        name: '2017级',
                        classType: '第一学年',
                        classNum: '第一学期',
                        startTime: '2017.10.10',
                        endTime: '2018.6.5'
                    },
                    {
                        name: '2017级',
                        classType: '第一学年',
                        classNum: '第一学期',
                        startTime: '2017.10.10',
                        endTime: '2018.6.5'
                    }
                ],
                form: {
                    min: '',
                    max: '',
                    manPercent: 10, //男生比例
                    selectedReport: [],
                    diffVal: '',
                    classroom: '',
                    classnum: '',
                    rangeS: '',
                    rangeE: '',
                    schoolDivide: false

                },
                divideByAdministration: true,
                divideByTeach: false,
                reportOptions: [{
                    value: '单科成绩',
                    label: '单科成绩',
                    children: [{
                        value: '语文',
                        label: '语文'
                    }, {
                        value: '数学',
                        label: '数学'
                    }, {
                        value: '英语',
                        label: '英语'
                    }]
                }, {
                    value: '均分成绩',
                    label: '均分成绩',
                }, {
                    value: '总分成绩',
                    label: '总分成绩',
                }, {
                    value: '各班均差',
                    label: '各班均差',
                    children: [{
                        value: '总分',
                        label: '总分'
                    }, {
                        value: '均分',
                        label: '均分'
                    }, {
                        value: '单科',
                        label: '单科'
                    }, {
                        value: '全部科目独立',
                        label: '全部科目独立'
                    }]
                }],
                dVisible: false, //差值显示否
                survey: { //概况信息
                    groupConfirmedNum: '39',
                    groupUnconfirmedNum: '19',
                    divideClassroom: '10',
                    dividedStudent: '160',
                    undivideStudent: '50'
                }
            }
        },
        methods: {
            formatTooltip(val) { //比例变化
                var str = val / 10 + ':' + (100 - val) / 10;
                return str;
            },
            changeReportType(val) {
                let self = this;
                if (val[0] == "各班均差" && val.length > 1) {
                    self.dVisible = true;
                } else {
                    self.dVisible = false;
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            teachDivide() { //进入行政班分班
                let self = this;
                self.mainVisible = false;
                self.lookVisible = false;
                self.divideVisible = true;
                self.divideByAdministration = true;
                self.divideByTeach = false;
            },
            administrationDivide() { //进入教学班分班
                let self = this;
                self.mainVisible = false;
                self.lookVisible = false;
                self.divideVisible = true;
                self.divideByAdministration = false;
                self.divideByTeach = true;
            },
            openLook() { //进入教学班分班
                let self = this;
                self.mainVisible = false;
                self.divideVisible = false;
                self.lookVisible = true;
            },
            backZero() { //返回初始页面
                let self = this;
                self.mainVisible = true;
                self.divideVisible = false;
                self.lookVisible = false;
            }
        },
        created() {}
    }

</script>
