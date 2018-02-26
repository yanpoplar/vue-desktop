<template>
    <div class="page intelCourse">
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
                            <el-tooltip class="item" content="节次设置" placement="top">
                                <i class="iconfont icon-icon1" @click="sectionSet(scope.$index,scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" content="师资分配" placement="top">
                                <i class="iconfont icon-hangzhengqu" @click="teachersSet(scope.$index,scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" content="规则配置" placement="top">
                                <i class="iconfont icon-liebiao" @click="rulesSet(scope.$index)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" content="开始排课" placement="top">
                                <i class="iconfont icon-liebiao" @click=""></i>
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
        <div class="page-section" v-if="sectionVisible" @click="hidemenu">
            <div class="con-header">
                <div class="row-l">
                    <el-button type="primary" icon="el-icon-back" @click="backZero">退回</el-button>
                </div>
                <div class="row-r">
                    <el-button type="primary" icon="iconfont icon-tubiao02" @click="saveSection">保存</el-button>
                </div>
            </div>
            <div class="con-main">
                <el-form ref="form" :model="form" label-width="140px">
                    <div class="tit">
                        <span>基本信息配置</span>
                        <i class="iconfont icon-shezhi"></i>
                    </div>
                    <div class="row">
                        <div class="row-l">
                            <el-form-item size="small" label="每天多少课时数">
                                <el-input v-model="form.courseNum" @change="changeTable"></el-input>
                            </el-form-item>
                        </div>
                        <div class="row-r">
                            <el-form-item size="small" label="是否有周末">
                                <el-radio v-model="form.weekHave" label='true' @change="changeTable">是</el-radio>
                                <el-radio v-model="form.weekHave" label='false' @change="changeTable">否</el-radio>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="tit">
                        <span>时间段划分配置</span>
                        <i class="iconfont icon-shezhi"></i>
                    </div>
                    <div class="row">
                        <div class="row-l">
                            <el-form-item size="small" label="晚自习课数">
                                <el-input v-model="form.nightClassNum" @change="changeTable"></el-input>
                            </el-form-item>
                        </div>
                        <div class="row-r">
                            <el-form-item size="small" label="是否有早自习">
                                <el-radio v-model="form.moringHave" label='true' @change="changeTable">是</el-radio>
                                <el-radio v-model="form.moringHave" label='false' @change="changeTable">否</el-radio>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <ul class="tip-list">
                    <li>
                        <span class="color-block blockff9196"></span>
                        <span class="txt">行政班课程区域</span>
                    </li>
                    <li>
                        <span class="color-block block96ffc2"></span>
                        <span class="txt">教学班课程区域</span>
                    </li>
                    <li>
                        <span class="color-block blockfffca2"></span>
                        <span class="txt">连排区域</span>
                    </li>
                    <li>
                        <span class="color-block blocke5e5e5"></span>
                        <span class="txt">禁止排课</span>
                    </li>
                </ul>
                <div class="table-main" id="js-table">

                    <!--<el-table :data="courseTable" style="width: 100%;border-radius:5px;">
                            <el-table-column v-for="(item,index) in weekdays" :label="item">
                                <template slot-scope="scope">
                                    <div class="cell-main">{{scope.row}}</div>
                                </template>
                            </el-table-column>
                    </el-table>-->
                    <div class="day-lists" id="js-lists" @mousedown="getSelect($event)" @mousemove="moveOntable($event)" @mouseup="upOntable($event)">
                        <ul class="day-list" v-for="(item,index) in classTable">
                            <li class="firstli">
                                <div class="txt-main">{{item.name}}</div>
                            </li>
                            <li class="otherli" v-for="(data,num) in item.data">
                                <div class="txt-main" :class="{blockff9196: data.type=='admin',block96ffc2:data.type=='teach',blockfffca2:data.type=='row',blocke5e5e5:data.type=='no',selected:data.selected }"
                                    @click.stop="selectItem(data)" @contextmenu.stop="contextmenuItem($event,data)">{{data.name}}</div>
                            </li>
                        </ul>
                    </div>
                    <!--选择框-->
                    <div class="selectionSection" v-show="selectionLocation.startSelection" :style="{width:selectionStyle.width+'px',height:selectionStyle.height+'px',top:selectionStyle.top+'px',left:selectionStyle.left+'px'}"
                        @mouseup="upOntable($event)"></div>
                    <div class="coursetype-menu" id="js-coursemenu" :style="{top:menutop+'px',left:menuleft+'px'}">
                        <ul class="itemsLists">
                            <li class="itemsList" @click.stop="addTag('admin')">
                                <span class="color-block blockff9196"></span>
                                <span class="txt">行政班课程区域</span>
                            </li>
                            <li class="itemsList" @click.stop="addTag('teach')">
                                <span class="color-block block96ffc2"></span>
                                <span class="txt">教学班课程区域</span>
                            </li>
                            <li class="itemsList" @click.stop="addTag('row')">
                                <span class="color-block blockfffca2"></span>
                                <span class="txt">连排区域</span>
                            </li>
                            <li class="itemsList" @click.stop="addTag('no')">
                                <span class="color-block blocke5e5e5"></span>
                                <span class="txt">禁止排课</span>
                            </li>
                            <li class="itemsList" @click.stop="addTag('normal')">
                                <i class="el-icon-remove-outline"></i>
                                <span class="txt">清除排课区域</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-teachers" v-if="teachersVisible">
            <div v-if="teachersMainVisible" style="height:100%">
                <div class="con-header">
                    <div class="row-l">
                        <el-button type="primary" icon="el-icon-back" @click="backZero">退回</el-button>
                    </div>
                </div>
                <div class="con-main">
                    <ul class="class-list">
                        <li class="class-item" v-for="n in 6">
                            <div class="item-detail">
                                <h2 class="item-tit">生物（1）班</h2>
                                <div class="item-main">
                                    <p class="item-main-txt">高一（1）班：42人</p>
                                    <p class="item-main-txt">高一（3）班：33人</p>
                                </div>
                                <div class="people">教学</div>
                            </div>
                            <div class="item-btn" @click="teacherSet()">任课教师配置</div>
                            <div class="item-btn item-btn2" @click="classSet()">课程独立配置</div>
                        </li>
                        <li class="clearfix"></li>
                    </ul>
                </div>
            </div>
            <div v-if="teachersSetVisible" style="height:100%">
                <div class="con-header">
                    <div class="row-l">
                        <el-button type="primary" icon="el-icon-back" @click="backToMain">返回</el-button>
                    </div>
                    <div class="row-r">
                        <el-button type="primary" icon="iconfont icon-tubiao02" @click="saveTeacherSet">保存</el-button>
                    </div>
                </div>
                <div class="con-main">
                    <el-form ref="teacherSetform" :model="teacherSetform" label-width="120px">
                        <el-form-item size="small" label="是否连排">
                            <el-radio v-model="teacherSetform.continuous" label='true'>是</el-radio>
                            <el-radio v-model="teacherSetform.continuous" label='false'>否</el-radio>
                        </el-form-item>
                        <el-form-item size="small" label="请选择教师">
                            <div class="row-l">
                                <el-select v-model="teacherSetform.teacher" placeholder="请选择教师">
                                    <el-option v-for="item in teacheroptions" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-form>
                    <div class="row">
                        <span class="txt">绘制行政班教师禁止上课时间</span>
                    </div>
                    <div class="table-main">
                        <div class="day-lists">
                            <ul class="day-list" v-for="(item,index) in classTable">
                                <li class="firstli">
                                    <div class="txt-main">{{item.name}}</div>
                                </li>
                                <li class="otherli" v-for="(data,num) in item.data">
                                    <div class="txt-main" :disabled="data.classType != classType" :class="{disable: data.classType != classType,noArrange:data.noArrange}"
                                        @click.stop="noArrange(data)">{{data.name}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="classSetVisible" style="height:100%">
                <div class="con-header">
                    <div class="row-l">
                        <el-button type="primary" icon="el-icon-back" @click="backToMain">返回</el-button>
                    </div>
                </div>
                <div class="con-main">
                    <div class="courseList">
                        <div class="tit">高中(1)班</div>
                        <div class="courseList-main">
                            <ul class="course-list">
                                <li v-for="item in courseList" :class="{active: item.selected}" @click="selectClass(item)">{{item.name}}</li>
                            </ul>
                        </div>
                    </div>
                    <el-form ref="classSetform" :model="classSetform" label-width="140px" style="width:50%;margin: 20px 0 20px 20px;" size="small"
                        v-if="courseName != ''">
                        <el-form-item label="一周课时数">
                            <el-input v-model="classSetform.weekHourNum"></el-input>
                        </el-form-item>
                        <el-form-item label="每天最大课时数">
                            <el-input v-model="classSetform.dayMaxHourNum"></el-input>
                        </el-form-item>
                        <el-form-item label="连排区域">
                            <el-col :span="10">
                                <el-input type="text" v-model="classSetform.startRange"></el-input>
                            </el-col>
                            <el-col class="line" :span="4">-----</el-col>
                            <el-col :span="10">
                                <el-input type="text" v-model="classSetform.endRange"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="每周连排次数">
                            <el-input v-model="classSetform.weekContinNum"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="是否连排">
                            <el-radio v-model="classSetform.isRow" label='true'>是</el-radio>
                            <el-radio v-model="classSetform.isRow" label='false'>否</el-radio>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('classSetform')">保存</el-button>
                            <el-button @click="resetForm('classSetform')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!--规则配置-->
        <div class="page-rules" v-if="rulesVisible">
            <div class="page-rules-main" v-if="rulesMainVisible">
                <div class="con-header">
                    <div class="row-l">
                        <el-button type="primary" icon="el-icon-back" @click="backZero">退回</el-button>
                    </div>
                    <div class="row-r">
                        <el-button type="primary" icon="iconfont icon-tubiao02" @click="saveRules">保存</el-button>
                    </div>
                </div>
                <div class="con-main">
                    <div class="tit">
                        <span>高级规则</span>
                        <i class="iconfont icon-shezhi"></i>
                    </div>
                    <div class="ruleList">
                        <div class="row">
                            <el-checkbox v-model="rules.rule1">同一老师授课班级进度一致</el-checkbox>
                        </div>
                        <div class="row">
                            <el-checkbox v-model="rules.rule2">相同科目，各班级进度一致</el-checkbox>
                        </div>
                        <div class="row">
                            <el-checkbox v-model="rules.rule3">相同科目不同时上课，方便同科老师相互听课</el-checkbox>
                        </div>
                        <div class="row">
                            <el-checkbox v-model="rules.rule4">课时周内分散，天内集中</el-checkbox>
                        </div>
                        <div class="row">
                            <el-checkbox v-model="rules.rule5">连堂不跨无休和课间</el-checkbox>
                        </div>
                        <div class="row">
                            <el-checkbox v-model="rules.rule6">重点课程安排在重点时间段</el-checkbox>
                        </div>
                    </div>
                    <div class="tit">
                        <span>课程规则</span>
                        <i class="iconfont icon-shezhi"></i>
                    </div>
                    <div class="row" style="margin-top:20px;">
                        <div class="row-l">
                            <el-button type="primary" icon="el-icon-plus" @click="addrule">添加规则</el-button>
                        </div>
                    </div>
                    <el-table :data="rules.ruleTable" border style="width: 100%;margin-top:20px;">
                        <el-table-column label="序号" width="80">
                            <template slot-scope="scope">
                                {{scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="txt" label="规则名称">
                        </el-table-column>
                        <el-table-column prop="classType" label="类型">
                        </el-table-column>
                        <el-table-column label="" width="80">
                            <template slot-scope="scope">
                                <el-tooltip class="item" content="编辑" placement="top">
                                    <i class="el-icon-edit"></i>
                                </el-tooltip>
                                <el-tooltip class="item" content="删除" placement="top">
                                    <i class="el-icon-delete" @click="deleteRuleInTable(scope.$index)"></i>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="page-rules-main" v-if="rulesEditVisible">
                <div class="con-header">
                    <div class="row-l">
                        <el-button type="primary" icon="el-icon-back" @click="backEdit">退回</el-button>
                    </div>
                    <div class="row-r">
                        <el-button type="primary" icon="iconfont icon-tubiao02" @click="submitEdit">保存</el-button>
                    </div>
                </div>
                <div class="con-main">
                    <ul class="tip-list">
                        <li>
                            <span class="color-block block81e345"></span>
                            <span class="txt">固定排课</span>
                        </li>
                        <li>
                            <span class="color-block blockff3640"></span>
                            <span class="txt">不排课</span>
                        </li>
                    </ul>
                    <div class="table-main">
                        <div class="day-lists" :style="{width:rulesWidth + 'px'}">
                            <ul class="day-list nobg">
                                <li class="firstli">
                                    <div class="txt-main"></div>
                                </li>
                                <li class="otherli bgfcfcfc" v-for="(data,num) in classes">
                                    <div class="txt-main">{{data}}</div>
                                </li>
                            </ul>
                            <ul class="day-list" v-for="(item,index) in classRuleTable">
                                <li class="firstli">
                                    <div class="txt-main">{{item.name}}</div>
                                </li>
                                <li class="otherli" v-for="(data,num) in item.data">
                                    <div class="txt-main two-row" :class="{border81e345:data.classType=='fixed',borderff3640:data.classType=='no',selected:data.selected }"
                                        @click="selectRuleItem(data)">{{data.classType == 'no'? '不排课': data.courseName}}
                                        <br>{{data.class}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--规则配置弹框-->
        <el-dialog :visible.sync="dialogFormVisible" append-to-body @close="closeDialog">
            <el-form :model="ruleEditform" label-width="100px">
                <el-form-item label="排课类型">
                    <el-select v-model="ruleEditform.classType" placeholder="请选择">
                        <el-option v-for="item in classTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择科目" v-if="ruleEditform.classType == 'fixed'">
                    <el-select v-model="ruleEditform.courseName" placeholder="请选择">
                        <el-option v-for="item in coursesOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择班级">
                    <el-cascader expand-trigger="hover" :options="classOptions" v-model="ruleEditform.class">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitAdd">确定添加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style>
    @import "/static/css/apps/intelCourse.css";

</style>
<script>
    var util = require('../../../service/util');
    module.exports = {
        props: {
            item: Object
        },
        data() {
            return {
                mainVisible: true,
                sectionVisible: false,
                teachersVisible: false,
                teachersMainVisible: true, //师资设置主页面
                teachersSetVisible: false,
                classSetVisible: false,
                rulesVisible: false, //规则设置页面
                rulesMainVisible: false,
                rulesEditVisible: false,
                dialogFormVisible: false,
                searchVal: '',
                searchType: '',
                currentPage: 1,
                options: [{
                    value: '任务名称',
                    label: '任务名称'
                }, {
                    value: '选课类型',
                    label: '选课类型'
                }, {
                    value: '选课课程数',
                    label: '选课课程数'
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
                courseList: [{
                    name: '语文',
                    selected: false
                }, {
                    name: '数学',
                    selected: false
                }, {
                    name: '英语',
                    selected: false
                }],
                form: {
                    courseNum: '7',
                    weekHave: 'false',
                    nightClassNum: '0', //男生比例
                    moringHave: 'false'
                },
                teacherSetform: { //教师设置
                    continuous: 'false',
                    teacher: ''
                },
                classSetform: {
                    weekHourNum: 0,
                    dayMaxHourNum: 0,
                    startRange: '',
                    endRange: '',
                    weekContinNum: 0,
                    isRow: 'true'
                },
                teacheroptions: [{
                    value: '孔子',
                    label: '孔子'
                }, {
                    value: '孟子',
                    label: '孟子'
                }],
                classes: [], //课程列表
                weekdays: [],//星期
                classTable: [], //借此设置课程表
                classRuleTable: [], //规则设置课表
                menutop: 0,
                menuleft: 0,
                selectionLocation: {
                    startSelection: false,
                    startPosition: {},
                    currentPosition: {},
                    topLeft: null,
                    bottomRight: null
                },
                selectionStyle: {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0
                },
                classType: 'teach',
                courseName: '', //课程配置所选课程名
                rules: {
                    rule1: true,
                    rule2: true,
                    rule3: true,
                    rule4: true,
                    rule5: true,
                    rule6: true,
                    ruleTable: [{
                            txt: '全部班级星期一下午3、4节不排课',
                            classType: '不排课'
                        },
                        {
                            txt: '全部班级星期一下午3、4节不排课',
                            classType: '不排课'
                        }, {
                            txt: '全部班级星期一下午3、4节不排课',
                            classType: '不排课'
                        }
                    ]
                },
                ruleEditform: { //规则编辑框
                    classType: '',
                    courseName: '',
                    class: []
                },
                classTypeOptions: [{
                    value: 'no',
                    label: '不排课'
                }, {
                    value: 'fixed',
                    label: '固定排课'
                }],
                coursesOptions: [{
                    value: '语文',
                    label: '语文'
                }, {
                    value: '数学',
                    label: '数学'
                }],
                classOptions: [{
                        value: '全年级',
                        label: '全年级',
                    },
                    {
                        value: '高一',
                        label: '高一',
                        children: [{
                            value: '全年级',
                            label: '全年级',
                        }, {
                            value: '1班',
                            label: '1班',
                        }, {
                            value: '2班',
                            label: '2班',
                        }]
                    }, {
                        value: '高二',
                        label: '高二',
                        children: [{
                            value: '全年级',
                            label: '全年级',
                        }, {
                            value: '1班',
                            label: '1班',
                        }, {
                            value: '2班',
                            label: '2班',
                        }]
                    }, {
                        value: '高三',
                        label: '高三',
                        children: [{
                            value: '全年级',
                            label: '全年级',
                        }, {
                            value: '1班',
                            label: '1班',
                        }, {
                            value: '2班',
                            label: '2班',
                        }]
                    }
                ]
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            sectionSet() { //进入节次设置
                let self = this;
                self.mainVisible = false;
                self.teachersVisible = false;
                self.rulesVisible = false;
                self.sectionVisible = true;
            },
            teachersSet() { //进入师资配置
                let self = this;
                self.mainVisible = false;
                self.sectionVisible = false;
                self.rulesVisible = false;
                self.teachersVisible = true;
                self.teachersMainVisible = true;
            },
            rulesSet() { //进入规则配置
                let self = this;
                self.mainVisible = false;
                self.teachersVisible = false;
                self.rulesVisible = true;
                self.sectionVisible = false;
                self.rulesMainVisible = true;
            },
            backZero() { //返回初始页面
                let self = this;
                self.mainVisible = true;
                self.sectionVisible = false;
                self.teachersVisible = false;
            },
            backToMain(name) { //返回主页面
                let self = this;
                self.teachersMainVisible = true;
                self.teachersSetVisible = false;
                self.classSetVisible = false;
            },
            teacherSet() { //教师设置页面
                let self = this;
                self.teachersMainVisible = false;
                self.teachersSetVisible = true;
                self.classSetVisible = false;
            },
            classSet() { //进入师资配置
                let self = this;
                self.teachersMainVisible = false;
                self.teachersSetVisible = false;
                self.classSetVisible = true;
            },
            changeTable() { //重新生成课表
                let self = this;
                console.log(self.form);
                var classNum = parseInt(self.form.courseNum);
                var weekHave = self.form.weekHave === 'true';
                var moringHave = self.form.moringHave === 'true';
                var nightNum = parseInt(self.form.nightClassNum);
                console.log(classNum, weekHave, moringHave, nightNum);
                self.getTable(classNum, weekHave, moringHave, nightNum);
                console.log(self.classTable);
            },
            getTable(classNum, weekHave, moringHave, nightNum) {
                let self = this;
                self.classTable = [];
                self.classes = [];
                if (moringHave) {
                    self.classes.push("早自习");
                }
                for (var i = 1; i < classNum + 1; i++) {
                    var str = '第' + i + '节';
                    self.classes.push(str);
                }
                if (nightNum == 1) {
                    var str = '晚自习';
                    self.classes.push(str);
                } else {
                    for (var i = 1; i < nightNum + 1; i++) {
                        var str = '晚自习' + i;
                        self.classes.push(str);
                    }
                }
                self.weekdays = [];
                if (weekHave) {
                    self.weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
                } else {
                    self.weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五"];
                }
                for (item in self.weekdays) {
                    var day = {};
                    day.name = self.weekdays[item];
                    var arr = [];
                    for (i in self.classes) {
                        var j = {};
                        j.name = self.classes[i];
                        j.type = 'normal';
                        j.selected = false;
                        if (i % 2 == 0) {
                            j.classType = 'teach';
                        } else {
                            j.classType = 'admin';
                        }
                        j.noArrange = false;
                        arr.push(j);
                    }
                    day.data = arr;
                    self.classTable.push(day);
                }
            },
            getRuleTable(){
                let self = this;
                for (item in self.weekdays) {
                    var day = {};
                    day.name = self.weekdays[item];
                    var arr = [];
                    for (i in self.classes) {
                        var j = {};
                        j.classType = 'normal';
                        j.selected = false;
                        j.course = [];
                        j.courseName = '';
                        j.class = '';
                        arr.push(j);
                    }
                    day.data = arr;
                    self.classRuleTable.push(day);
                }
            },
            selectItem(file) {
                let self = this;
                self.clearSelect();
                file.selected = true;
                self.hidemenu();
            },
            contextmenuItem(e, file) {
                let self = this;
                e.preventDefault();
                if (!file.selected) {
                    self.clearSelect();
                    file.selected = true;
                }
                var parHeight = $("#js-table").height();
                self.menutop = $(e.target).position().top + 20;
                self.menuleft = $(e.target).position().left + 90;
                if (self.menutop + 180 > parHeight) {
                    self.menutop = self.menutop - 180;
                }
                $("#js-coursemenu").show();
            },
            clearSelect() {
                let self = this;
                for (item in self.classTable) {
                    self.classTable[item].data.map(function (a) {
                        a.selected = false;
                    })
                }
            },
            hidemenu() {
                let self = this;
                $("#js-coursemenu").hide();
            },
            getSelectedFiles() {
                let self = this;
                var arr = [];
                for (item in self.classTable) {
                    arr.push(self.classTable[item].data.filter(function (a) {
                        return a.selected;
                    }))
                }
                return arr;
            },
            addTag(type) {
                let self = this;
                for (index in self.getSelectedFiles()) {
                    self.getSelectedFiles()[index].forEach(function (file) {
                        console.log(file);
                        file.type = type;
                        file.selected = false;
                    })
                };
                $("#js-coursemenu").hide();
            },
            getSelectionStyle() {
                let self = this;
                var a = self.selectionLocation.startPosition;
                var b = self.selectionLocation.currentPosition;
                var tableTop = $("#js-lists").offset().top;
                var tableLeft = $("#js-lists").offset().left;
                var pLeft = $("#js-lists").position().left;
                var topLeft = {
                    x: Math.min(a.x, b.x),
                    y: Math.min(a.y, b.y)
                }
                var bottomRight = {
                    x: Math.max(a.x, b.x),
                    y: Math.max(a.y, b.y)
                };
                self.selectionLocation.topLeft = topLeft;
                self.selectionLocation.bottomRight = bottomRight;
                self.selectionStyle.top = (topLeft.y - tableTop);
                self.selectionStyle.left = (topLeft.x - tableLeft + pLeft);
                self.selectionStyle.height = (bottomRight.y - topLeft.y);
                self.selectionStyle.width = (bottomRight.x - topLeft.x);
            },
            getSelect(e) {
                let self = this;
                var x = e.clientX;
                var y = e.clientY;
                var tableTop = $("#js-lists").offset().top;
                if (y < tableTop + 46) {
                    y = tableTop + 46;
                }
                if (e.button == 0) {
                    self.selectionLocation.startSelection = true;
                    self.selectionLocation.startPosition = {
                        x: x,
                        y: y
                    };
                    self.selectionLocation.currentPosition = {
                        x: x,
                        y: y
                    };
                }
            },
            moveOntable(e) {
                let self = this;
                if (e.button == 0 && self.selectionLocation.startSelection) {
                    var x = e.clientX;
                    var y = e.clientY;
                    var tableTop = $("#js-lists").offset().top; //表格据页面上端的距离
                    if (y < tableTop + 46) {
                        y = tableTop + 46;
                    } //出去表头的距离
                    self.selectionLocation.currentPosition = {
                        x: x,
                        y: y
                    };
                    self.getSelectionStyle();
                    self.clearSelect();
                }

            },
            upOntable(e) {
                let self = this;
                if (e.button == 0 && self.selectionLocation.startSelection) {
                    var a = self.selectionLocation.topLeft;
                    var b = self.selectionLocation.bottomRight;
                    var itemW = $(".otherli").innerWidth();
                    var itemH = $(".otherli").innerHeight();
                    var pLeft = $("#js-lists").position().left;
                    var startX = self.selectionStyle.left - pLeft; //框左边离表格左边的距离
                    var rowStartNum = Math.round(startX / itemW); //框中表格开始的位置
                    var rangeX = (startX + self.selectionStyle.width) - (rowStartNum * itemW); //框宽减去前面项的宽还剩的宽度
                    var rowEndNum = Math.round(rangeX / itemW); //框宽减去前面的项还剩几个项
                    var columnStartNum = Math.round((self.selectionStyle.top - 46) / itemH); //框上面有几个项
                    var columnEndNum = Math.round((self.selectionStyle.height + self.selectionStyle.top -
                        46 - (
                            columnStartNum * itemH)) / itemH);
                    for (i in self.classTable) {
                        if (rowStartNum <= i && i < rowStartNum + rowEndNum) {
                            self.classTable[i].data.forEach(function (value, index, array) {
                                if (index >= columnStartNum && index < columnStartNum +
                                    columnEndNum) {
                                    value.selected = true;
                                }
                            })
                        }
                    }
                    self.selectionLocation.startSelection = false;
                    util.initialObj(self.selectionStyle);
                }
            },
            saveSection() { //保存节次设置

            },
            saveTeacherSet() { //保存师资配置

            },
            noArrange(data) {
                let self = this;
                if (data.classType == self.classType) {
                    data.noArrange = !data.noArrange;
                }
            },
            submitForm(formName) { //课程配置设置提交

            },
            resetForm(formName) { //清空form表单值
                let self = this;
                util.initialObj(self[formName]);
                console.log(self[formName]);
                self[formName].isRow = 'true';
            },
            selectClass(item) {
                let self = this;
                if (!item.selected) {
                    self.resetForm('classSetform');
                }
                self.courseList.forEach(function (value, index, array) {
                    value.selected = false;
                })
                self.courseName = item.name;
                item.selected = true;
            },
            saveRules() { //保存规则设置

            },
            addrule() { //添加规则新页面
                let self = this;
                self.rulesMainVisible = false;
                self.rulesEditVisible = true;
                self.classRuleTable = [];
                self.getRuleTable();
            },
            backEdit() {
                let self = this;
                self.rulesMainVisible = true;
                self.rulesEditVisible = false;
            },
            submitEdit() { //保存规则编辑
                let self = this;
                    for (i in self.classRuleTable) {
                        console.log(self.classRuleTable);
                            self.classRuleTable[i].data.forEach(function (value, index, array) {
                                if (value.course.length > 0){
                                    for ( j in value.course){
                                        console.log("2" + j);
                                        var classType = '';
                                        if (value.course[j].classType == "fixed"){
                                            classType = '固定排课';
                                        } else {
                                            classType = '不排课';
                                        }
                                        var str = value.course[j].class + self.classRuleTable[i].name + self.classes[index] + value.course[j].courseName + classType;
                                        var item = {
                                            classType: classType,
                                            txt: str
                                        };
                                        self.rules.ruleTable.push(item);
                                    }
                                }
                            })
                    }
                    console.log(self.rules.ruleTable);
            },
            selectRuleItem(data) { //
                let self = this;
                data.selected = true;
                self.dialogFormVisible = true;
                self.ruleItem = data;
                self.ruleEditform.classType = '';
                self.ruleEditform.courseName = '';
                self.ruleEditform.class = [];
            },
            submitAdd(){
                let self = this;
                self.ruleItem.classType = self.ruleEditform.classType;
                self.ruleItem.courseName = self.ruleEditform.courseName;
                self.ruleItem.class = self.ruleEditform.class.join('');
                var obj = {};
                obj.courseName = self.ruleEditform.courseName;
                obj.class = self.ruleEditform.class.join('');
                obj.classType = self.ruleEditform.classType;
                self.ruleItem.course.push(obj);
                self.ruleItem.selected = false;
                self.dialogFormVisible = false;
                console.log(self.classRuleTable);
            },
            closeDialog() {//关闭弹框
                let self = this;
                self.ruleItem.selected = false;
                self.dialogFormVisible = false;
            },
            deleteRuleInTable(index) {//删除表里的规则
                let self = this;
                self.rules.ruleTable.splice(index,1);
            }
        },
        computed: {
            rulesWidth: function(){
                let self = this;
                return (self.weekdays.length + 1) * 120;
            }
        },
        created() {
            let self = this;
            self.getTable(7, false, false, 0);
        }
    }

</script>
