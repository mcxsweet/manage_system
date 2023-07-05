<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
            <el-row>
                <el-button plain @click="isShow = !isShow" v-if="isadmin == 0">添加课程</el-button>
                <el-button type="success" plain @click="isShowSearch = !isShowSearch">筛选</el-button>
                <el-button type="primary" @click="over()" v-show="isover">筛选完毕</el-button>
            </el-row>
        </el-header>

        <el-main>
            <el-table :data="tableData" stripe height="73vh" border="true">
                <el-table-column align="left" width="150" label="课程操作">
                    <template slot-scope="scope">
                        <!-- <el-button size="mini" type="primary" round
                            @click="goto('classInformation', scope.row.id)">设置</el-button>
                        <el-button size="mini" type="info" @click="handleExport(scope.$index, scope.row)">导出</el-button> -->
                        <el-button size="mini" type="warning"
                            @click="handleOperation(scope.$index, scope.row)">操作</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" label="课程名称" width="200">
                </el-table-column>
                <el-table-column prop="major" label="开设专业" width="200">
                </el-table-column>
                <el-table-column prop="theoreticalHours" label="理论学时" width="100">
                </el-table-column>
                <el-table-column prop="labHours" label="实验学时" width="100">
                </el-table-column>
                <el-table-column prop="className" label="班级名称" width="200">
                </el-table-column>
                <el-table-column label="学期" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.termStart }}-{{ scope.row.termEnd }}.{{ scope.row.term }}
                    </template>
                </el-table-column>
                <el-table-column prop="studentsNum" label="学生人数" width="100">
                </el-table-column>
                <el-table-column prop="courseNature" label="课程性质" width="140">
                </el-table-column>
                <el-table-column prop="courseType" label="课程类别" width="140">
                </el-table-column>

            </el-table>
        </el-main>

        <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="isShow">
            <el-form :model="FormData" label-width="100px" class="demo-ruleForm">

                <el-form-item label="任课教师" prop="classroomTeacher">
                    <el-input v-model="FormData.classroomTeacher"></el-input>
                </el-form-item>

                <el-form-item label="开设专业">
                    <el-select v-model="FormData.major" @change="getIndicators()" style="width:100%;">
                        <el-option value="计算机科学与技术"></el-option>
                        <el-option value="电子信息工程"></el-option>
                        <el-option value="数据科学与大数据技术"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="课程名称" prop="courseName">
                    <el-select v-model="FormData.courseName" @change="autoGenerate()" placeholder="请选择课程名称"
                        style="width: 100%;" filterable>
                        <el-option v-for="item in courseList" :key="item.id" :label="item.courseName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="课程代码" prop="courseCode">
                    <el-input v-model="FormData.courseCode" disabled></el-input>
                </el-form-item>

                <el-form-item label="课程性质" prop="courseNature">
                    <el-select v-model="FormData.courseNature" placeholder="请选择课程性质">
                        <el-option label="必修" value="必修"></el-option>
                        <el-option label="选修" value="选修"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程类别" prop="courseType">
                    <el-select v-model="FormData.courseType" placeholder="请选择课程类别">
                        <el-option value="专业基础课"></el-option>
                        <el-option value="专业特色课"></el-option>
                        <el-option value="专业必修课"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="理论学时" prop="theoreticalHours">
                    <el-input v-model="FormData.theoreticalHours"></el-input>
                </el-form-item>
                <el-form-item label="实验学时" prop="labHours">
                    <el-input v-model="FormData.labHours"></el-input>
                </el-form-item>
                <el-form-item label="班级名称" prop="className">
                    <!-- <el-input v-model="FormData.className"></el-input> -->
                    <el-select v-model="FormData.major" placeholder="请选择专业名称" style="width: 200px" disabled>
                    </el-select>
                    <span style="margin-left: 1vh;margin-right: 2vh;"></span>
                    <el-select v-model="FormData.classNameClass" placeholder="请选择入学年级" style="width: 200px;" filterable>
                        <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学期" prop="term">
                    <!-- <el-input v-model="FormData.term"></el-input> -->
                    <el-select v-model="FormData.termStart" placeholder="请选择" style="width: 100px;">
                        <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <span style="margin-left: 1vh;margin-right: 1vh;">至</span>
                    <el-select v-model="FormData.termEnd" placeholder="请选择" style="width: 100px;">
                        <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <span style="margin-left: 1vh;margin-right: 1vh;"></span>
                    <el-select v-model="FormData.term" placeholder="请选择学期">
                        <el-option label="第一学期" value="1"></el-option>
                        <el-option label="第二学期" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学生人数" prop="studentsNum">
                    <el-input v-model="FormData.studentsNum"></el-input>
                </el-form-item>

                <el-form-item label="所选教材" prop="textBook">
                    <el-input v-model="FormData.textBook"></el-input>
                </el-form-item>
                <el-form-item label="课程目标数量" prop="courseTargetNum">
                    <el-input v-model="FormData.courseTargetNum" placeholder="数量与内容请与教学大纲一致！" ></el-input>
                </el-form-item>
                <el-form-item label="指标点数量" prop="indicatorPointsNum">
                    <el-input v-model="FormData.indicatorPointsNum" placeholder="数量与内容请与教学大纲一致！"></el-input>
                </el-form-item>
                <el-form-item label="指标点编号" prop="indicatorPoints">
                    <!-- <el-input v-model="FormData.indicatorPoints"></el-input> -->
                    <el-select v-model="FormData.indicatorPoints" filterable="true" :multiple="true"
                        placeholder="数量与内容请与教学大纲一致！" style="width:100%;" :multiple-limit="FormData.indicatorPointsNum"
                        allow-create="true">
                        <el-option v-for="item in indicators" :key="item.indicatorName" :label="item.indicatorName"
                            :value="item.indicatorName">
                            <span style="float: left">{{ item.indicatorName }}</span>
                            <span style="margin-left: 1vh; float: left; color: #8492a6; font-size: 13px">
                                {{ item.indicatorContent }}
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 筛选弹出层 -->
        <el-dialog title="筛选 (支持单条件和多条件筛选)" :visible.sync="isShowSearch">
            <el-table :data="searchTable" border="true">
                <el-table-column label="课程名称" width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.courseName"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="班级名称" width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.className"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="学期" width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.termStart" placeholder="请选择起始学年">
                            <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="scope.row.termEnd" placeholder="请选择终止学年">
                            <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="scope.row.term" placeholder="请选择学期">
                            <el-option label="第一学期" value="1"></el-option>
                            <el-option label="第二学期" value="2"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center">
                    <el-button size="mini" type="primary" @click="search()">筛选</el-button>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 操作弹出层 -->
        <el-drawer title="我是标题" :visible.sync="isOperation" :with-header="false" direction="ltr">
            <div class="boxShadow">
                <p class="title">课程管理</p>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="primary"
                    @click="goto('classInformation', currentObject.id)">详细课程信息设置
                </el-button>
                <el-button class="BottonStyle" type="warning"
                    @click="goto1('programObjective', currentObject.id, currentObject.courseName, currentObject.courseTargetNum)">课程目标设置</el-button>
                <el-button class="BottonStyle" type="success"
                    @click="goto('basicInformationTable', currentObject.id, currentObject.courseName)">课程考核评价方式</el-button>
                <el-button class="BottonStyle" type="info"
                    @click="goto('finalTable', currentObject.id, currentObject.courseName)">试卷设置</el-button>
                <el-button class="BottonStyle" type="danger" @click="handleExport(null, currentObject)">导出文件</el-button>
            </div>

            <!-- <div class="boxShadow">
                <p class="title">课程相关文档查看</p>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="goto('teachingPro', currentObject.id, currentObject.courseName)">课程大纲查看</el-button>
                <el-button class="BottonStyle" type="primary"
                    @click="goto('indexPoint', currentObject.id, currentObject.major)">专业课程目标总表查看</el-button>
            </div> -->

            <div class="boxShadow">
                <p class="title">学生信息管理</p>
                <el-button class="BottonStyle" @click="showUpload = true" type="primary">导入学生名单</el-button>
                <el-button class="BottonStyle" type="danger" @click="handleExportTest()">导出学生名单</el-button>
            </div>

            <div class="boxShadow">
                <p class="title">课程成绩管理</p>
                <el-button class="BottonStyle" style="margin-left: 10px;"
                    @click="goto('usualPreformanceTable', currentObject.id, currentObject.courseName)"
                    type="primary">平时成绩管理</el-button>
                <el-button class="BottonStyle"
                    @click="goto('finalStatisticsTable', currentObject.id, currentObject.courseName)"
                    type="primary">期末试卷成绩</el-button>
                <el-button class="BottonStyle" @click="goto('finalComprehensiveTable')" type="primary">期末综合成绩</el-button>
            </div>

            <div class="boxShadow">
                <p class="title">分析报告导出</p>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleExportReport('analyse')">课程目标达成评价分析报告</el-button>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleExportReport('analyse3')">课程试卷分析报告</el-button>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleExportReport('analyse4')">课程教学小结表</el-button>
            </div>


        </el-drawer>

        <!-- 上传学生名单 -->
        <el-dialog title="上传文件" :visible.sync="showUpload" style="text-align: center;">
            <el-form>
                <input type="file" @change="handleFileUpload" />
                <el-button type="submit" size="mini" @click.prevent="uploadFile()">上传文件</el-button>
            </el-form>
        </el-dialog>

        <el-footer>
            <span>总共有{{ tableData.length }}条课程</span>
        </el-footer>
    </el-container>
</template>

<script>
import api from '@/api/api'
import axios from 'axios'
import global from '@/script/global'
import { Loading } from 'element-ui';

export default {
    name: "courseBasicInformation",
    data() {
        return {
            isover: false,
            tableData: [],
            //用于添加课程信息
            FormData: {},
            //存储当前选择专业的课程列表
            courseList: [],
            isShowSearch: false,
            isShow: false,
            indicators: [],
            DataOptions: [],
            //筛选条件
            searchTable: [{}],
            //控制设置弹出层
            isOperation: false,
            //当前选中的对象
            currentObject: {},
            isadmin: 0, //权限等级

            //学生名单上传弹窗控件
            showUpload: false,
        }
    },
    methods: {
        //初始化学期表格
        initDataOptions() {
            for (let i = 0; i < 10; i++) {
                this.DataOptions.push(new Date().getFullYear() - 3 + i);
            }
        },
        //跳转函数
        goto(url, data, data2) {
            this.$router.push({
                path: '/MainPage/' + url,
                query: {
                    id: data,
                    name: data2
                }
            });
        },
        goto1(url, data, data1, data2) {
            this.$router.push({
                path: '/MainPage/' + url,
                query: {
                    id: data,
                    name: data1,
                    Num: data2
                }
            })
        },

        //点击搜索内容
        search() {
            this.isShowSearch = !this.isShowSearch;
            api.post("/courseInfo/currentUser/" + localStorage.getItem("UserId"), this.searchTable[0], (resp) => {
                this.tableData = resp.data.data;
                this.searchTable = [{}];
            })
            this.isover = true
        },
        over() {
            this.getMessage();
            this.isover = false
        },
        //获取基本信息
        getMessage() {
            if (this.isadmin == 0) {
                api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                    this.tableData = resp.data.data;
                })
            }
            else if (this.isadmin == 2) {

            }
            else {

            }

        },
        //导出
        handleExport(index, object) {
            window.location.href = global.BaseUrl + "/courseInfo/export/" + object.id;
        },

        //导出分析报告
        handleExportReport(type) {
            window.location.href = global.BaseUrl + "/report/" + this.currentObject.id + "/1/" + type;
        },

        //导出测试
        handleExportTest() {
            window.location.href = global.BaseUrl + "/report/" + this.currentObject.id + "/analyse";
        },
        //跳转到设置界面
        handleSetting(index, object) {
            classdata: [] = object;
            this.$emit('childClick', classdata);
            this.$bus.$emit("sendCourseID", object.id);
        },
        //删除
        handleDelete(item) {
            this.$confirm('是否删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/courseInfo", item, (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getMessage();
                    } else if (resp.status != 200) {
                        this.$message({
                            type: 'error',
                            message: '删除失败!'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //提交
        submit() {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isShow = !this.isShow;
                this.FormData.teacherId = localStorage.getItem("UserId");

                this.FormData.indicatorPoints = JSON.stringify(this.FormData.indicatorPoints);
                this.FormData.className = this.FormData.major + this.FormData.classNameClass
                // console.log(this.FormData);
                api.post("/courseInfo", this.FormData, (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.getMessage();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '添加失败!'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //获取指标点列表
        getIndicators() {
            const major = this.FormData.major;
            const classroomTeacher = this.FormData.classroomTeacher;
            this.FormData = {};
            this.FormData.major = major;
            this.FormData.classroomTeacher = classroomTeacher;
            api.post("/courseInfo/indicators", { "major": this.FormData.major }, (resp) => {
                this.indicators = resp.data.data;
            })
            this.getCourseList();
        },
        //获取当前选择的专业的课程信息列表
        getCourseList() {
            api.get("/courseInfo/" + this.FormData.major + "/getAllCourseByMajor", "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        //自动填充选择的课程的基本信息
        autoGenerate() {
            api.get("/courseInfo/" + this.FormData.courseName + "/autoGenerate", "", (resp) => {
                this.FormData = resp.data.data;
                this.FormData.classroomTeacher = localStorage.getItem("TeacherName");
            })
        },

        //弹出操作界面
        handleOperation(index, object) {
            this.isOperation = !this.isOperation;
            this.currentObject = object;

        },

        //选择上传文件
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0]
        },
        //上传文件
        uploadFile() {
            let loadingInstance = Loading.service({ fullscreen: true });
            const formData = new FormData()
            formData.append('file', this.selectedFile)
            axios.post("/student/" + this.currentObject.id + "/studentInfo", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                if (response.data.flag) {
                    this.showUpload = !this.showUpload;
                    this.$message({
                        type: 'success',
                        message: response.data.message
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    });
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: error.data.message
                });
            })

            setTimeout(() => {
                loadingInstance.close();
            }, 1000);
        },

    },
    // 监听数据
    watch: {
        "FormData.termStart": {
            handler() {
                this.FormData.termEnd = this.FormData.termStart + 1;
            }
        }
    },
    mounted() {
        this.getIndicators();
        this.getMessage();
        this.initDataOptions();
        this.FormData.classroomTeacher = localStorage.getItem("TeacherName");
        this.isadmin = localStorage.getItem("Isadmin");
    },
}
</script>

<style src="@/style/tableStyle.css"></style>
<style>
* {
    margin: 0;
    padding: 0;
}

.title {
    margin: 10px 20px;
    font-size: 20px;
    width: 100%;
}
</style>
<style scoped>
.BottonStyle {
    margin: 10px 10px;
    width: 200px;
}
</style>