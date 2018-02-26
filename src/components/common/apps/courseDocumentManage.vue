<template>
    <div class="page coursemanage">
        <div class="alert-info">
            <div class="info-txt">
                <img src="static/img/loading.gif" alt="等待">
                <span>正在导入数据，请稍后...</span>
            </div>
        </div>
        <div class="modalLevel"></div>
        <div class="page-main">
            <div class="con-header">
                <div class="btn-add">
                    <el-button type="primary" icon="el-icon-plus" @click="addCourse">添加课程</el-button>
                    <el-button type="primary" icon="iconfont icon-piliangdaoru" @click="courseImport">课程导入</el-button>
                </div>
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
                <el-table :data="tableData" height="100%" border style="width:100%;height:100%;border-radius:3px;">
                    <el-table-column label="序号">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column label="课程名称" prop="courseName">
                    </el-table-column>
                    <el-table-column label="一天最大课时数" prop="maxTime">
                    </el-table-column>
                    <el-table-column label="一周课时数" prop="weekTime">
                    </el-table-column>
                    <el-table-column label="一周连排次数" prop="weekRow">
                    </el-table-column>
                    <el-table-column label="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" content="编辑" placement="top">
                                <i class="el-icon-edit" @click="edit(scope.$index,scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" content="删除" placement="top">
                                <i class="el-icon-delete" @click="deleteItem(scope.$index)"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="app-footer">
                <div class="log-import">
                    <el-button type="primary" icon="iconfont icon-piliangdaoru" @click="logImport">导入日志</el-button>
                </div>
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="16" layout="jumper, prev, pager, next"
                    :total="160">
                </el-pagination>
            </div>
        </div>
        <!--编辑数据弹框-->
        <el-dialog title="选课编辑" :visible.sync="dialogFormVisible" append-to-body>
            <el-form :model="form">
                <el-form-item label="任务名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="选课类型" :label-width="formLabelWidth">
                    <el-select v-model="form.courseType" placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选课课程数" :label-width="formLabelWidth">
                    <el-input v-model="form.courseNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="选课开始时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" format="yyyy.MM.dd" value-format="yyyy.MM.dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="选课结束时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期" format="yyyy.MM.dd" value-format="yyyy.MM.dd">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style>
    @import "/static/css/apps/studentDocumentManage.css";

</style>
<script>
    var util = require('../../../service/util');
    module.exports = {
        props: {
            item: Object
        },
        data: function () {
            return {
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
                        courseName: '0111548',
                        maxTime: '张琳',
                        weekTime: '女',
                        weekRow: '2017.6.5'
                    },
                    {
                        courseName: '0111548',
                        maxTime: '张琳',
                        weekTime: '女',
                        weekRow: '2017.6.5'
                    },
                    {
                        courseName: '0111548',
                        maxTime: '张琳',
                        weekTime: '女',
                        weekRow: '2017.6.5'
                    }
                ],
                dialogFormVisible: false,
                form: {
                    name: '',
                    courseType: '',
                    courseNum: '',
                    startTime: '',
                    endTime: ''
                },
                formLabelWidth: '120px',
                index: 0,
                isAdd: false,
                typeOptions: [{
                    value: '全行政班排课',
                    label: '全行政班排课'
                }, {
                    value: '全教学班排课',
                    label: '全教学班排课'
                }, {
                    value: '行政+教学（N+1）',
                    label: '行政+教学（N+1）'
                }, {
                    value: '行政+教学（N+2）',
                    label: '行政+教学（N+2）'
                }, {
                    value: '行政+教学（N+3）',
                    label: '行政+教学（N+3）'
                }]
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            edit(index, item) {
                let self = this;
                self.index = index;
                self.isAdd = false;
                self.dialogFormVisible = true;
                util.deepCopy(item, self.form);
            },
            addEdit() {
                let self = this;
                self.isAdd = true;
                self.dialogFormVisible = true;
            },
            cancelEdit() {
                let self = this;
                util.initialObj(self.form);
                self.dialogFormVisible = false;
            },
            submitEdit() {
                let self = this;
                if (self.isAdd) {
                    var item = {};
                    util.deepCopy(self.form, item);
                    self.tableData.push(item);
                } else {
                    util.deepCopy(self.form, self.tableData[self.index]);
                }
                util.initialObj(self.form);
                self.dialogFormVisible = false;
            },
            deleteItem(index) { //删除
                let self = this;
                self.tableData.splice(index, 1);
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            },
            addCourse() {//添加课程

            },
            courseImport(){//课程导入

            },
            logImport(){//导入日志

            }
        },
        created() {}
    }

</script>
