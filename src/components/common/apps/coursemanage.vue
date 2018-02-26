<template>
    <div class="page coursemanage">
        <div class="alert-info">
            <div class="info-txt">
                <img src="static/img/loading.gif" alt="等待">
                <span>正在导入数据，请稍后...</span>
            </div>
        </div>
        <div class="modalLevel"></div>
        <div class="page-main" v-if="mainVisible">
            <div class="con-header">
                <div class="btn-add">
                    <el-button type="primary" icon="el-icon-plus" @click="addEdit">创建选课</el-button>
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
                <el-table :data="tableData" height="100%" border style="width: 100%;height:100%;border-radius:3px;">
                    <el-table-column label="序号" width="80">
                        <template slot-scope="scope">{{scope.$index + 1}}</template>
                    </el-table-column>
                    <el-table-column label="任务名称" prop="name">
                    </el-table-column>
                    <el-table-column label="选课类型" prop="courseType">
                    </el-table-column>
                    <el-table-column label="选课课程数" prop="courseNum">
                    </el-table-column>
                    <el-table-column label="选课开始时间" prop="startTime">
                    </el-table-column>
                    <el-table-column label="选课结束时间" prop="endTime">
                    </el-table-column>
                    <el-table-column label="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" content="流程配置" placement="top">
                                <i class="iconfont icon-liucheng" @click="importData(scope.$index,scope.row)"></i>
                            </el-tooltip>
                            <el-dropdown trigger="click" placement="bottom">
                                <el-tooltip class="item" content="独立配置" placement="top">
                                    <i class="iconfont icon-danlie"></i>
                                </el-tooltip>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="goStep(0,scope.$index)">选课课程配置</el-dropdown-item>
                                    <el-dropdown-item @click.native="goStep(1,scope.$index)">选课教师配置</el-dropdown-item>
                                    <el-dropdown-item @click.native="goStep(2,scope.$index)">选课学生配置</el-dropdown-item>
                                    <el-dropdown-item @click.native="goStep(3,scope.$index)">导入选课结果</el-dropdown-item>
                                    <el-dropdown-item @click.native="lookRepeort">选课结果分析</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
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
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="16" layout="jumper, prev, pager, next"
                    :total="160">
                </el-pagination>
            </div>
        </div>
        <div class="page-step" v-if="stepVisible">
            <div class="con-header">
                <div class="row-l">
                    <el-button type="primary" icon="el-icon-back" @click="backZero">退回</el-button>
                </div>
            </div>
            <div class="con-main">
                <!--流程界面-->
                <div class="step-page steps" :class="{ singleSetPage : singleSet }">
                    <div class="steps-tit" v-if="!singleSet">
                        <div class="steps-tit-l">
                            <div class="steps-tit-l-l">
                                <div class="linebar" :class="{active:!steps[0].visible}"></div>
                            </div>
                            <div class="steps-tit-l-r">
                                <div class="linebar" :class="{active:!steps[0].visible && !steps[1].visible}"></div>
                            </div>
                        </div>
                        <div class="steps-tit-r">
                            <div class="steps-tit-l-l">
                                <div class="linebar" :class="{active:steps[3].visible || steps[4].visible}"></div>
                            </div>
                            <div class="steps-tit-l-r">
                                <div class="linebar" :class="{active:steps[4].visible}"></div>
                            </div>
                        </div>
                        <div class="step step-one active">
                            <div class="step-num">1</div>
                            <div class="step-txt">选课课程配置</div>
                        </div>
                        <div class="step step-two" :class="{active:!steps[0].visible}">
                            <div class="step-num">2</div>
                            <div class="step-txt">选课教师配置</div>
                        </div>
                        <div class="step step-three" :class="{active:!steps[0].visible && !steps[1].visible}">
                            <div class="step-num">3</div>
                            <div class="step-txt">选课学生配置</div>
                        </div>
                        <div class="step step-four" :class="{active:steps[3].visible || steps[4].visible}">
                            <div class="step-num">4</div>
                            <div class="step-txt">导入选课结果</div>
                        </div>
                        <div class="step step-five" :class="{active:steps[4].visible}">
                            <div class="step-num">5</div>
                            <div class="step-txt">完成</div>
                        </div>
                    </div>
                    <!--第一步界面-->
                    <div class="steps-main steps-main-one" v-if="steps[0].visible">
                        <div class="dividing">
                            <div class="adminCourse">
                                <div class="tit" @click="hideadminCourse">行政班课程分配</div>
                                <div class="adminCourse-main">
                                    <div class="course-main-l" @dragover="courseover($event,item);">
                                        <div class="name-txt">待选课程</div>
                                        <ul class="course-list">
                                            <li v-for="item in adminCourse.unSelectItems" draggable="true" @dragend="courseend($event,item,'adminCourse');">{{item.name}}</li>
                                        </ul>
                                    </div>
                                    <div class="course-main-r" @dragover="courseover($event,item);">
                                        <div class="name-txt">已选课程</div>
                                        <ul class="course-list">
                                            <li v-for="item in adminCourse.selectItems" draggable="true" @dragend="cancelSelEnd($event,item,'adminCourse');">{{item.name}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="teachCourse">
                                <div class="tit" @click="hideTeachCourse">教学班课程分配</div>
                                <div class="teachCourse-main">
                                    <div class="course-main-l" @dragover="courseover($event,item);">
                                        <div class="name-txt">待选课程</div>
                                        <ul class="course-list">
                                            <li v-for="item in teachCourse.unSelectItems" draggable="true" @dragend="courseend($event,item,'teachCourse');">{{item.name}}</li>
                                        </ul>
                                    </div>
                                    <div class="course-main-r" @dragover="courseover($event,item);">
                                        <div class="name-txt">已选课程</div>
                                        <ul class="course-list">
                                            <li v-for="item in teachCourse.selectItems" draggable="true" @dragend="cancelSelEnd($event,item,'teachCourse');">{{item.name}}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="teachCourse-detail" v-if="teachCourse.selectItems.length > 0">
                                    <div class="row">
                                        <div class="txt">请点击你要设置的课程</div>
                                        <el-radio-group v-model="courseName">
                                            <el-radio-button v-for="item in teachCourse.selectItems" :label="item.name">{{item.name}}</el-radio-button>
                                        </el-radio-group>
                                    </div>
                                    <el-form ref="teachCourseform" :model="teachCourseform" label-width="140px" style="width:70%;margin: 15px auto;" size="small"
                                        v-if="courseName != ''">
                                        <el-form-item label="课程介绍">
                                            <el-input type="textarea" v-model="teachCourseform.desc"></el-input>
                                        </el-form-item>
                                        <el-form-item label="课程照片">
                                            <el-button type="primary">选择...</el-button>
                                        </el-form-item>
                                        <el-form-item label="只允许特长生选报">
                                            <el-switch v-model="teachCourseform.specialTrue"></el-switch>
                                        </el-form-item>
                                        <el-form-item label="要限制的分值类型" v-if="!teachCourseform.specialTrue">
                                            <el-select v-model="teachCourseform.reportType" placeholder="请选择">
                                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="分值" v-if="!teachCourseform.specialTrue">
                                            <el-input type="text" v-model="teachCourseform.report"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('teachCourseform')">保存</el-button>
                                            <el-button @click="resetForm('teachCourseform')">重置</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="steps-footer steps-footer-one" v-if="steps[0].visible && !singleSet">
                        <el-button type="primary" icon="iconfont icon-xiayibu" :disabled="steps[0].btnDisabled" @click="nextStep(0)">下一步</el-button>
                    </div>
                    <!--第二步界面-->
                    <div class="steps-main steps-main-two" v-if="steps[1].visible">
                        <div class="dividing">
                            <div class="row">
                                <span class="txt" style="margin-right:20px">开启选择教师</span>
                                <el-switch v-model="teacherSet"></el-switch>
                            </div>
                            <div class="teachCourse" v-if="teacherSet">
                                <div class="tit">教学班教师分配</div>
                                <div class="teachCourse-main">
                                    <div class="course-main-l">
                                        <div class="name-txt">待选教师</div>
                                    </div>
                                    <div class="course-main-r">
                                        <div class="name-txt">已选教师</div>
                                    </div>
                                </div>
                                <div class="teachCourse-main js-teachCourse" v-for="(item, index) in teacherData">
                                    <div class="course-main-l" @dragover="courseover($event,item);">
                                        <div class="name-txt">{{item.name}}</div>
                                        <ul class="course-list">
                                            <li v-for="data in item.unSelectItems" draggable="true" @dragend="teacherDragend($event,data,index,0);">{{data.name}}</li>
                                        </ul>
                                    </div>
                                    <div class="course-main-r" @dragover="courseover($event,item);">
                                        <div class="name-txt">{{item.name}}</div>
                                        <ul class="course-list">
                                            <li v-for="data in item.selectItems" draggable="true" @dragend="teacherDragend($event,data,index,1);">{{data.name}}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="row" style="width:50%;margin: 0 auto">
                                    <div class="row-l txt">课程分类</div>
                                    <div class="row-r txt">
                                        <el-select v-model="courseNameByTeach" placeholder="请选择" size="small">
                                            <el-option v-for="(item, index) in teacherData" :key="item.name" :label="item.name" :value="index">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="teachCourse-detail" v-if="courseNameByTeach !== ''">
                                    <div class="row">
                                        <div class="txt">请点击你要设置的老师</div>
                                        <el-radio-group v-model="teacherName">
                                            <el-radio-button v-for="item in teacherData[courseNameByTeach].selectItems" :label="item.name">{{item.name}}</el-radio-button>
                                        </el-radio-group>
                                    </div>
                                    <el-form ref="teacherform" :model="teacherform" label-width="140px" style="width:70%;margin: 15px auto;" size="small" v-if="teacherName !== ''">
                                        <el-form-item label="要限制的分值类型">
                                            <el-select v-model="teacherform.reportType" placeholder="请选择">
                                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="分值" v-if="teacherform.reportType !== ''">
                                            <el-input type="text" v-model="teacherform.report"></el-input>
                                        </el-form-item>
                                        <el-form-item label="限制课程人数">
                                            <el-switch v-model="teacherform.peopleLimit"></el-switch>
                                        </el-form-item>
                                        <el-form-item label="限制人数" v-if="teacherform.peopleLimit">
                                            <el-input type="text" v-model="teacherform.people"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('teacherform')">保存</el-button>
                                            <el-button @click="resetForm('teacherform')">重置</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="steps-footer steps-footer-two" v-if="steps[1].visible && !singleSet">
                        <el-button type="primary" icon="iconfont icon-xiayibu" @click="nextStep(1)" v-if="!teacherSet">跳过</el-button>
                        <el-button type="primary" icon="iconfont icon-xiayibu" :disabled="steps[1].btnDisabled" @click="nextStep(1)" v-else>下一步</el-button>
                    </div>
                    <!--第三步界面-->
                    <div class="steps-main steps-main-three" v-if="steps[2].visible">
                        <div class="row">
                            <div class="row-l">
                                <el-button :class="{ lightColor: !selVisible }" type="primary" icon="iconfont icon-shoudong" @click="selVisible = true;fileVisible=false;">手动选择</el-button>
                                <el-button :class="{ lightColor: !fileVisible }" type="primary" icon="iconfont icon-piliangdaoru" @click="fileVisible = true;selVisible=false;">文件导入</el-button>
                            </div>
                        </div>
                        <!--手动选择界面-->
                        <div class="select-page" v-if="selVisible">
                            <div class="btn-row">
                                <div class="search-block">
                                    <div class="txt fl">学生学届</div>
                                    <div class="search-type fl">
                                        <el-select v-model="gradeName" placeholder="请选择" style="height:100%">
                                            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="search-block">
                                    <div class="search-type fr">
                                        <el-select v-model="stuSearchType" multiple placeholder="请选择" collapse-tags style="height:100%">
                                            <el-option v-for="item in stuOptions" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="search-val fr">
                                        <el-input placeholder="查找您想要的..." prefix-icon="el-icon-search" v-model="stuSearchVal">
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                            <el-table ref="multipleStu" :data="studentData" height="100%" border style="width: 100%;height:100%;border-radius:3px;" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="55">
                                </el-table-column>
                                <el-table-column label="学籍编号" prop="stuId">
                                </el-table-column>
                                <el-table-column label="学生姓名" prop="stuName">
                                </el-table-column>
                                <el-table-column label="学生性别" prop="stuSex">
                                </el-table-column>
                                <el-table-column label="出生年月" prop="stuBirthday">
                                </el-table-column>
                            </el-table>
                        </div>
                        <!--导入界面-->
                        <div class="file-page" v-if="fileVisible">
                            <!--第一步界面-->
                            <div class="steps-main steps-main-one" v-if="threeStep[0].visible">
                                <div class="steps-main-header">
                                    <a href="javascript:;">点此下载导入模板!</a>
                                </div>
                                <div class="steps-main-con">
                                    <el-upload class="upload-example" drag action="https://jsonplaceholder.typicode.com/posts/">
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">将文件拖到此处，或
                                            <em>点击上传</em>
                                        </div>
                                    </el-upload>
                                </div>
                                <div class="steps-footer steps-footer-one">
                                    <el-button type="primary" icon="iconfont icon-xiayibu" :disabled="threeStep[0].btnDisabled" @click="importNextStep(0,'threeStep')">下一步</el-button>
                                </div>
                            </div>
                            <!--第二步界面-->
                            <div class="steps-main steps-main-two" v-if="threeStep[1].visible">
                                <el-table :data="letterData" height="100%" border style="width: 100%;height:100%;border-radius:3px;">
                                    <el-table-column label="列标" prop="col">
                                    </el-table-column>
                                    <el-table-column label="对应数据">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.colData" filterable placeholder="请选择">
                                                <el-option v-for="item in letterOptions" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="steps-footer steps-footer-two">
                                    <div class="fl" style="margin-top:13px;">
                                        <el-button type="primary" icon="iconfont icon-xiayibu" @click="preStep(1,'threeStep')">上一步</el-button>
                                        <el-button type="primary" icon="iconfont icon-xiayibu" :disabled="threeStep[1].btnDisabled" @click="insertStuData()">导入</el-button>
                                    </div>
                                    <div class="data-num fr">导入信息条数
                                        <span class="num">{{dataNum}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="steps-footer steps-footer-three" v-if="steps[2].visible && !singleSet">
                        <el-button type="primary" icon="iconfont icon-xiayibu" :disabled="steps[2].btnDisabled" @click="nextStep(2)">下一步</el-button>
                    </div>
                    <!--第四步界面-->
                    <div class="steps-main steps-main-four" v-if="steps[3].visible">
                        <div class="file-page">
                            <!--第一步界面-->
                            <div class="steps-main steps-main-one" v-show="fourStep[0].visible">
                                <div class="steps-main-header">
                                    <a href="javascript:;">点此下载导入模板!</a>
                                </div>
                                <div class="steps-main-con">
                                    <el-upload class="upload-example" drag action="https://jsonplaceholder.typicode.com/posts/">
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">将文件拖到此处，或
                                            <em>点击上传</em>
                                        </div>
                                    </el-upload>
                                </div>
                                <div class="steps-footer steps-footer-one">
                                    <el-button type="primary" icon="iconfont icon-xiayibu" :disabled="fourStep[0].btnDisabled" @click="importNextStep(0,'fourStep')">下一步</el-button>
                                </div>
                            </div>
                            <!--第二步界面-->
                            <div class="steps-main steps-main-two" v-show="fourStep[1].visible">
                                <el-table :data="courseTableData" height="100%" border style="width: 100%;height:100%;border-radius:3px;">
                                    <el-table-column label="列标" prop="col">
                                    </el-table-column>
                                    <el-table-column label="对应数据">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.colData" filterable placeholder="请选择">
                                                <el-option v-for="item in letterOptions" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="steps-footer steps-footer-two">
                                    <div class="fl" style="margin-top:13px;">
                                        <el-button type="primary" icon="iconfont icon-xiayibu" @click="preStep(1,'fourStep')">上一步</el-button>
                                        <el-button type="primary" icon="iconfont icon-xiayibu" :disabled="fourStep[1].btnDisabled" @click="insertCourseData(3)">导入</el-button>
                                    </div>
                                    <div class="data-num fr">导入信息条数
                                        <span class="num">{{courseTableNum}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="steps-footer steps-footer-four" v-if="steps[3].visible && !singleSet">
                        <el-button type="primary" icon="iconfont icon-xiayibu" :disabled="steps[3].btnDisabled" @click="nextStep(3)">跳过</el-button>
                    </div>
                    <!--第五步界面-->
                    <div class="steps-main steps-main-five" v-if="steps[4].visible">
                        <!--<p class="success-info">配置完成
                            <span>{{closetime}}</span>秒之后会跳转至选课信息页面...</p>-->
                        <p class="success-info">
                            <span>配置完成</span>
                            <br>点击退回按钮跳转至选课信息页面...</p>
                    </div>
                </div>
            </div>
        </div>
        <!--查看结果页-->
        <div class="page-repeort" v-if="reportVisible">
            <div class="circle-list">
                <div class="circle-img">
                    <canvas height="160" width="300" id="mycircle"></canvas>
                    <div class="text-block">
                        <p class="txt">剩余天数</p>
                        <p class="txt num">3</p>
                    </div>
                    <p class="time-tit">学生选课时间</p>
                    <p class="time-val">2017.11.10-2017.11.20</p>
                </div>
                <div class="circle-img">
                    <canvas height="160" width="300" id="mycircle2"></canvas>
                    <div class="text-block">
                        <p class="txt txt-two">已选人数</p>
                        <p class="txt txt-two num">600</p>
                    </div>
                    <p class="time-tit">学生选课人数</p>
                    <p class="time-val">选课人数共617人</p>
                </div>
                <div class="circle-img">
                    <canvas height="160" width="300" id="mycircle3"></canvas>
                    <div class="text-block">
                        <p class="txt txt-three">已选组合</p>
                        <p class="txt txt-three num">3666</p>
                    </div>
                    <p class="time-tit">学生选课科目</p>
                    <p class="time-val">选课科目共52种</p>
                </div>
            </div>
            <div class="row">
                <div class="row-l">
                    <el-table :data="courseData" height="100%" border style="width: 100%;height:100%;border-radius:3px;" @row-click="openLook">
                        <el-table-column label="组合详情" prop="name"></el-table-column>
                        <el-table-column label="合计" prop="value"></el-table-column>
                        <el-table-column label="所占比例" prop="per"></el-table-column>
                    </el-table>
                </div>
                <div class="row-r">
                    <div id="coursePie" style="width:100%;height:100%"></div>
                </div>
            </div>
        </div>
        <!--组合详情弹框-->
        <el-dialog title="组合详情" :visible.sync="detailVisible" append-to-body width="70%">
            <div class="group-detail">
                <ul class="my-header">
                    <li style="width:15%">课程</li>
                    <li style="width:25%">班级</li>
                    <li style="width:15%">人数</li>
                    <li style="width:30%">百分比条</li>
                    <li style="width:15%">百分比</li>
                </ul>
                <div class="my-body">
                    <div class="my-table" v-for="(item,index) in courseDetail">
                        <div class="tit" :class="{active:item.show}" @click="openDetail(index)">
                            <div class="row-l">{{item.courseName}}</div>
                            <div class="row-r">
                                <i class="iconfont icon-xiala" v-if="item.show"></i>
                                <i class="iconfont icon-xiala" v-else></i>
                            </div>
                        </div>
                        <ul class="my-data" v-if="item.show">
                            <li v-for="(item,index) in item.data">
                                <ul class="data-list">
                                    <li style="width:15%"></li>
                                    <li class="class-name" style="width:25%"><div class="name-val">{{item.class}}</div></li>
                                    <li class="people" style="width:15%">{{item.people}}人</li>
                                    <li class="per-bar" style="width:30%"><div class="bigbar"><div class="smallbar" :style="{width:item.per + '%' }"></div></div></li>
                                    <li class="per" style="width:15%">{{item.per}}%</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </el-dialog>
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
    @import "/static/css/apps/coursemanage.css";

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
                stepVisible: false,
                reportVisible: false, //结果查看页
                detailVisible: false, //详情查看
                singleSet: false, //是否为独立配置
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
                        name: '语文',
                        courseType: '全行政班排课',
                        courseNum: '16',
                        startTime: '2017.6.5',
                        endTime: '2018.2.6'
                    },
                    {
                        name: '语文',
                        courseType: '全教学班排课',
                        courseNum: '16',
                        startTime: '2017.6.5',
                        endTime: '2018.2.6'
                    },
                    {
                        name: '语文',
                        courseType: '行政+教学（N+1）',
                        courseNum: '16',
                        startTime: '2017.6.5',
                        endTime: '2018.2.6'
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
                }],
                //导入界面
                stuSearchVal: '',
                stuSearchType: '',
                selVisible: true,
                fileVisible: false,
                stuOptions: [{
                    value: '学籍编号',
                    label: '学籍编号'
                }, {
                    value: '学生姓名',
                    label: '学生姓名'
                }, {
                    value: '学生性别',
                    label: '学生性别'
                }, {
                    value: '出生年月',
                    label: '出生年月'
                }],
                studentData: [{
                        stuId: "20170001",
                        stuName: "嬴政",
                        stuSex: "男",
                        stuBirthday: "-259.1.27"
                    },
                    {
                        stuId: "20170002",
                        stuName: "骊姬",
                        stuSex: "女",
                        stuBirthday: "-259.10.27"
                    }
                ], //学生导入界面
                multipleStu: [],
                //每一步骤
                steps: [{
                    visible: true,
                    btnDisabled: false
                }, {
                    visible: false,
                    btnDisabled: false
                }, {
                    visible: false,
                    btnDisabled: false
                }, {
                    visible: false,
                    btnDisabled: false
                }, {
                    visible: false,
                    btnDisabled: false
                }],
                threeStep: [{
                    visible: true,
                    btnDisabled: false
                }, {
                    visible: false,
                    btnDisabled: false
                }], //第三步的步骤
                fourStep: [{
                    visible: true,
                    btnDisabled: false
                }, {
                    visible: false,
                    btnDisabled: false
                }], //第四步的步骤
                adminCourse: {
                    selectItems: [], //已选课程
                    unSelectItems: [{
                        name: '语文'
                    }, {
                        name: '数学'
                    }, {
                        name: '英语'
                    }, {
                        name: '历史'
                    }, {
                        name: '地理'
                    }, {
                        name: '政治'
                    }] //为选课程
                },
                teachCourse: {
                    selectItems: [], //已选课程
                    unSelectItems: [{
                        name: '语文'
                    }, {
                        name: '数学'
                    }, {
                        name: '英语'
                    }, {
                        name: '历史'
                    }, {
                        name: '地理'
                    }, {
                        name: '政治'
                    }] //为选课程
                },
                teachCourseform: { //教学班课程信息
                    desc: '',
                    pic: '',
                    specialTrue: false,
                    reportType: '',
                    report: ''
                },
                courseName: '', //教学班正在设置的课程
                teacherData: [{
                    name: '语文',
                    unSelectItems: [{
                        name: '张三'
                    }, {
                        name: '李四'
                    }, {
                        name: '王五'
                    }, {
                        name: '张龙'
                    }, {
                        name: '赵华'
                    }, {
                        name: '天太难'
                    }],
                    selectItems: [] //已选课程
                }, {
                    name: '语文',
                    unSelectItems: [{
                        name: '张三'
                    }, {
                        name: '李四'
                    }, {
                        name: '王五'
                    }, {
                        name: '张龙'
                    }, {
                        name: '赵华'
                    }, {
                        name: '天太难'
                    }],
                    selectItems: [] //已选课程
                }],
                teacherform: { //教学班课程信息
                    reportType: '',
                    report: '',
                    peopleLimit: false,
                    people: ''
                },
                letterData: [], //表数据
                courseTableData: [], //选课数据列名设置
                letterOptions: [], //字母选项
                dataNum: 10, //学生数据导入条数
                courseTableNum: 20, //选课数据导入条数
                closetime: 5, //倒计时
                alertVisible: false, //加载提示框
                hideadminCourseflag: true,
                hideTeachCourseflag: true,
                teacherSet: false, //是否
                courseNameByTeach: 0, //当前选择的课程类型
                teacherName: '', //当前设置的老师名称
                gradeName: '', //当前的学届名称
                gradeOptions: [{
                    value: '2017级',
                    label: '2017级'
                }, {
                    value: '2016级',
                    label: '2016级'
                }], //学届列表
                courseData: [{
                    name: '物理 化学 生物',
                    value: '60',
                    per: '20%'
                }, {
                    name: '物理 化学 生物',
                    value: '60',
                    per: '20%'
                }, {
                    name: '物理 化学 生物',
                    value: '60',
                    per: '20%'
                }], //选课详情
                courseDetail: [{
                    courseName: '物理',
                    show: false,
                    data: [{
                        class: '高一(1)班',
                        people: '50',
                        per: '16'
                    }, {
                        class: '高一(2)班',
                        people: '50',
                        per: '16'
                    }, {
                        class: '高一(3)班',
                        people: '50',
                        per: '50'
                    }]
                }, {
                    courseName: '物理',
                    show: false,
                    data: [{
                        class: '高一(1)班',
                        people: '50',
                        per: '16'
                    }]
                }, {
                    courseName: '物理',
                    show: false,
                    data: [{
                        class: '高一(1)班',
                        people: '50',
                        per: '16'
                    }]
                }, {
                    courseName: '物理',
                    show: false,
                    data: [{
                        class: '高一(1)班',
                        people: '50',
                        per: '16'
                    }]
                }, {
                    courseName: '物理',
                    show: false,
                    data: [{
                        class: '高一(1)班',
                        people: '50',
                        per: '16'
                    }]
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
            backZero() { //返回初始页面
                let self = this;
                self.mainVisible = true;
                self.stepVisible = false;
            },
            hideadminCourse() { //伸缩行政班选课
                let self = this;
                if (self.hideadminCourseflag) {
                    $(".adminCourse-main").slideUp();
                    self.hideadminCourseflag = false;
                } else {
                    $(".adminCourse-main").slideDown();
                    self.hideadminCourseflag = true;
                }

            },
            hideTeachCourse() { //伸缩教学班选课
                let self = this;
                if (self.hideTeachCourseflag) {
                    $(".teachCourse-main").slideUp();
                    self.hideTeachCourseflag = false;
                } else {
                    $(".teachCourse-main").slideDown();
                    self.hideTeachCourseflag = true;
                }

            },
            handleSelectionChange(val) { //多选
                let self = this;
                self.multipleSelection = val;
            },
            importData(index, item) { //导入界面打开
                let self = this;
                self.index = index;
                self.mainVisible = false;
                self.stepVisible = true;
                self.singleSet = false;
            },
            cancelImport() { //导入取消
                let self = this;
                self.multipleSelection = [];
            },
            saveStuData() { //保存导入数据
                let self = this;
                self.$message({
                    message: '保存成功',
                    type: 'success'
                });
            },
            nextStep(num) { //下一步
                let self = this;
                self.steps[num].visible = false;
                self.steps[num + 1].visible = true;
                if (num == 2) {
                    $(".alert-info").hide();
                    $(".info-txt").html('<img src="static/img/loading.gif" alt="等待"><span>正在导入数据，请稍后...</span>');
                }
            },
            importNextStep(num, type) { //导入数据的下一步
                let self = this;
                self[type][num].visible = false;
                self[type][num + 1].visible = true;
            },
            preStep(num, type) { //导入数据de上一步
                let self = this;
                self[type][num].visible = false;
                self[type][num - 1].visible = true;
            },
            insertStuData() { //导入学生信息
                let self = this;
                $(".alert-info").slideDown("slow");
                $(".modalLevel").show();
                setTimeout(function () {
                    $(".info-txt").html("<span>导入成功</span>");
                    $(".modalLevel").hide();
                }, 2000);
            },
            insertCourseData(num) {
                let self = this;
                $(".alert-info").slideDown("slow");
                self.steps[num].visible = false;
                self.steps[num + 1].visible = true;
                // $(".modalLevel").show();
                // $(".info-txt").html("<span>导入成功</span>");
                // var timer = setInterval(function(){
                //     self.closetime = self.closetime - 1;
                //     if(self.closetime < 1) {
                //         clearInterval(timer);
                //         $(".alert-info").hide();
                //         $(".modalLevel").hide();
                //         self.mainVisible = true;
                //         self.stepVisible = false;
                //     }
                // },1000)
            },
            courseover(e, item) {
                let self = this;
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.dropEffect = "move";
                e.preventDefault();
            },
            courseend(e, item, target) { //拖动结束
                let self = this;
                e.preventDefault();
                var data = item;
                var wid = eval('$(".' + target + ' .course-main-r").width()');
                var hei = eval('$(".' + target + ' .course-main-r").height()');
                var left = eval('$(".' + target + ' .course-main-r").offset().left');
                var top = eval('$(".' + target + ' .course-main-r").offset().top');
                var x = e.clientX;
                var y = e.clientY;
                if (left < x && x < (left + wid) && top < y && y < (top + hei)) {
                    var num = self[target].unSelectItems.indexOf(item);
                    if (num < 0) {
                        return;
                    } else {
                        self[target].selectItems.push(data);
                        self[target].unSelectItems.splice(num, 1);
                    }
                } else {
                    return;
                }
            },
            cancelSelEnd(e, item, target) { //已选课程拖动结束
                let self = this;
                e.preventDefault();
                var data = item;
                var wid = eval('$(".' + target + ' .course-main-l").width()');
                var hei = eval('$(".' + target + ' .course-main-l").height()');
                var left = eval('$(".' + target + ' .course-main-l").offset().left');
                var top = eval('$(".' + target + ' .course-main-l").offset().top');
                var x = e.clientX;
                var y = e.clientY;
                if (left < x && x < (left + wid) && top < y && y < (top + hei)) {
                    var num = self[target].selectItems.indexOf(item);
                    if (num < 0) {
                        return;
                    } else {
                        self[target].unSelectItems.push(data);
                        self[target].selectItems.splice(num, 1);
                    }
                } else {
                    return;
                }
            },
            teacherDragend(e, item, index, flag) { //拖动分配教师
                let self = this;
                e.preventDefault();
                var data = item;
                var x = e.clientX;
                var y = e.clientY;
                if (flag == 0) { //未选择往已选择拖动
                    var dataitem = $(".js-teachCourse .course-main-r")[index];
                    var wid = $(dataitem).width();
                    var hei = $(dataitem).height();
                    var left = $(dataitem).offset().left;
                    var top = $(dataitem).offset().top;
                    var num = self.teacherData[index].unSelectItems.indexOf(item);
                    if (num < 0) {
                        return;
                    }
                    console.log(left < x);
                    if (left < x && x < (left + wid) && top < y && y < (top + hei)) {
                        self.teacherData[index].selectItems.push(data);
                        self.teacherData[index].unSelectItems.splice(num, 1);
                    } else {
                        console.log("DFdf");
                        return;
                    }
                } else { //已选择往未选择拖动
                    var dataitem = $(".js-teachCourse .course-main-l")[index];
                    var wid = $(dataitem).width();
                    var hei = $(dataitem).height();
                    var left = $(dataitem).offset().left;
                    var top = $(dataitem).offset().top;
                    var num = self.teacherData[index].selectItems.indexOf(item);
                    if (num < 0) {
                        return;
                    }
                    if (left < x && x < (left + wid) && top < y && y < (top + hei)) {
                        self.teacherData[index].unSelectItems.push(data);
                        self.teacherData[index].selectItems.splice(num, 1);
                    } else {
                        return;
                    }
                }
            },
            submitForm(formName) { //教学班课程设置提交

            },
            resetForm(formName) { //清空form表单值
                let self = this;
                util.initialObj(self[formName]);
            },
            goStep(num, index) { //跳转到独立配置页
                let self = this;
                self.index = index;
                self.mainVisible = false;
                self.stepVisible = true;
                self.singleSet = true;
                for (i in self.steps) {
                    self.steps[i].visible = false;
                    self.steps[i].btnDisabled = true;
                }
                self.steps[num].visible = true;
            },
            lookRepeort() { //查看结果
                let self = this;
                self.mainVisible = false;
                self.stepVisible = false;
                self.reportVisible = true;
                self.$nextTick(function () {
                    // DOM 现在更新了
                    // `this` 绑定到当前实例
                    self.drawCircle('mycircle', 0, 60, '#c9edb3', '#79d242');
                    self.drawCircle('mycircle2', 0, 30, '#c6e5ff', '#71beff');
                    self.drawCircle('mycircle3', 0, 80, '#ffebba', '#ffcd53');
                    //饼图
                    var myChart = this.$echarts.init(document.getElementById('coursePie'));
                    // 绘制图表
                    myChart.setOption({
                        title: {
                            show: false
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b} : {c} ({d}%)",
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: '16'
                        },
                        legend: {
                            type: 'scroll',
                            orient: 'vertical',
                            right: 10,
                            top: 20,
                            bottom: 20,
                            data: ['化学 地理 政治', '化学 地理 历史', '化学 地理 生物', '化学 地理 语文', '化学 地理 数学']
                        },
                        series: [{
                            name: '访问来源',
                            type: 'pie',
                            radius: '60%',
                            center: ['40%', '50%'],
                            zlevel: 5,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data: [{
                                    value: 335,
                                    name: '化学 地理 政治'
                                },
                                {
                                    value: 310,
                                    name: '化学 地理 历史'
                                },
                                {
                                    value: 234,
                                    name: '化学 地理 生物'
                                },
                                {
                                    value: 135,
                                    name: '化学 地理 语文'
                                },
                                {
                                    value: 1548,
                                    name: '化学 地理 数学'
                                }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    });
                })
            },
            drawCircle(id, rangel, per, color, color2) {
                var canvas = document.getElementById(id);
                var ctx = canvas.getContext('2d');
                var ring = util.ring;
                var newring = new ring(rangel, per, color, color2);
                newring.drawRing(ctx);
            },
            openLook(row, event, column) { //打开详情
                let self = this;
                self.detailVisible = true;
            },
            openDetail(index) {
                var self = this;
                self.courseDetail[index].show = !self.courseDetail[index].show;
            }
        },
        created() {
            let vm = this;
            for (var i = 0; i < 26; i++) { //字母的循环
                var letter = String.fromCharCode(65 + i);
                var item = {};
                item.col = letter;
                item.colData = letter;
                vm.letterData.push(item);
                vm.courseTableData.push(item);
                var option = {};
                option.value = letter;
                option.label = letter;
                vm.letterOptions.push(option);
            }
        }
    }

</script>
