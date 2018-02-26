<template>
    <div class="page coursemanage">
        <div class="page-main">
            <!--<div class="con-header">
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
            </div>-->
            <div class="con-main">
                <el-table :data="tableData" height="100%" border style="width:100%;height:100%;border-radius:3px;">
                    <el-table-column label="操作人" prop="userName">
                    </el-table-column>
                    <el-table-column label="操作时间" prop="operateTime">
                    </el-table-column>
                    <el-table-column label="操作内容" prop="operateContent">
                    </el-table-column>
                    <el-table-column label="备注" prop="remark">
                    </el-table-column>
                    <!--<el-table-column label="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" content="回滚" placement="top">
                                <i class="el-icon-edit" @click="rollBack(scope.$index,scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" content="删除" placement="top">
                                <i class="el-icon-delete" @click="deleteItem(scope.$index)"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>-->
                </el-table>
            </div>
            <div class="app-footer">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="16" layout="jumper, prev, pager, next"
                    :total="160">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<style>
    @import "/static/css/apps/studentDocumentManage.css";

</style>
<script>
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
                        userName: '我的天那',
                        operateTime: '10',
                        operateContent: '8',
                        remark: '2017.6.5'
                    },
                    {
                        userName: '我的天那',
                        operateTime: '10',
                        operateContent: '8',
                        remark: '2017.6.5'
                    },
                    {
                        userName: '我的天那',
                        operateTime: '10',
                        operateContent: '8',
                        remark: '2017.6.5'
                    }
                ]
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            rollBack(index, item) {
                let self = this;
            },
            deleteItem(index) { //删除
                let self = this;
                self.tableData.splice(index, 1);
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            }
        },
        created() {}
    }

</script>
s