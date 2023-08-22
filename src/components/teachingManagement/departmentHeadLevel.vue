<template>
    <el-container>
        <!-- <el-header style="background-color: #fff;height: 50px;">
            <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
                <el-option v-for="(item, index) in courseList" :key="index" :label="item.courseName" :value="index">
                    <span style="float: left">{{ item.courseName }}</span>
                    <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">
                        {{ item.termStart }}-{{ item.termEnd }}.{{ item.term }}</span>
                </el-option>
            </el-select>
            <el-button icon="el-icon-search" style="margin: 10px" @click="showCurrentCourse()">确定</el-button>

            <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
        </el-header> -->
        <el-main v-show="ischoose">
            <el-card>
                <h3>{{ department }} 教学管理</h3>
                <el-input style="margin: 5px;width: 300px;" v-model="search" placeholder="输入课程名进行搜索" />
                <el-table :data="tableData.filter(data => !search || data.courseName.includes(search))" style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="课程名称">
                                    <span>{{ props.row.courseName }}</span>
                                </el-form-item>
                                <el-form-item label="课程代码">
                                    <span>{{ props.row.courseCode }}</span>
                                </el-form-item>
                                <el-form-item label="课程性质">
                                    <span>{{ props.row.courseNature }}</span>
                                </el-form-item>
                                <el-form-item label="课程类别">
                                    <span>{{ props.row.courseType }}</span>
                                </el-form-item>
                                <el-form-item label="理论学时">
                                    <span>{{ props.row.theoreticalHours }}</span>
                                </el-form-item>
                                <el-form-item label="实验学时">
                                    <span>{{ props.row.labHours }}</span>
                                </el-form-item>
                                <el-form-item label="班级名称">
                                    <span>{{ props.row.className }}</span>
                                </el-form-item>
                                <el-form-item label="学期">
                                    <span>{{ props.row.termStart }}-{{ props.row.termEnd }}.{{ props.row.term }}</span>
                                </el-form-item>
                                <el-form-item label="所选教材">
                                    <span>{{ props.row.textBook }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="课程名称" width="200" prop="courseName" sortable>
                    </el-table-column>
                    <el-table-column label="教师" width="100" prop="classroomTeacher" sortable>
                    </el-table-column>
                    <el-table-column label="学期" width="120">
                        <template slot-scope="scope">
                            <p>{{ scope.row.termStart }}-{{ scope.row.termStart }}.{{ scope.row.term }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="完成情况" width="100">
                        <template slot-scope="scope">
                            <p v-if="scope.row.accomplish" style="color: green;">已完成</p>
                            <p v-if="!scope.row.accomplish" style="color: red;">未完成</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="相关文件导出" width="700">
                        <template slot-scope="scope">

                            <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                                @click="handleExportReport(scope.row.id, 'analyse')">课程目标达成评价分析报告</el-button>
                            <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                                @click="handleExportReport(scope.row.id, 'analyse3')">课程试卷分析报告</el-button>
                            <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                                @click="handleExportReport(scope.row.id, 'analyse4')">课程教学小结表</el-button>
                        </template>

                    </el-table-column>
                </el-table>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
import api from '@/api/api';
import axios from 'axios';
import { Loading } from 'element-ui';
import global from '@/script/global';
export default {
    data() {
        return {
            currentCourse: "",
            courseList: [],
            ischoose: true,

            //用户所属部门
            department: "",
            //表格数据
            tableData: [],
            //表格数据筛选控件
            search: "",
        }
    },
    methods: {
        //获取用户课程信息
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        //点击课程选择框
        focusOnSelect() {
            this.ischoose = false;
            this.currentCourse = "";
        },
        //获取当前用户的管理专业的所有课程名称
        getCourseByMajor() {
            api.post("/manager/getCourseByMajor", { major: this.department }, (resp) => {
                this.tableData = resp.data.data;
            })
        },
        //获取当前用户的专业
        getMajor() {
            var department = this.$store.state.user.department;
            switch (department) {
                case "计算机科学与工程系":
                    this.department = "计算机科学与技术";
                    break;
                case "数据科学与工程系":
                    this.department = "数据科学与大数据技术";
                    break;
                case "信息与智能工程系":
                    this.department = "电子信息工程";
                    break;
                default:
                    break;
            }
        },
        //导出相关报告
        handleExportReport(courseId, type) {
            window.location.href = global.BaseUrl + "/report/" + courseId + "/1/" + type;
            // api.get("/report/" + courseId + "/1/" + type, "", (resp) => {
            //     if (resp.data.flag) {
            //         this.$message({
            //             type: 'success',
            //             message: resp.data.message
            //         });
            //     }
            // })
        },
    },
    mounted() {
        this.getMajor();
        this.getCourseByMajor();
    },
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 100px;
    margin-bottom: 0;
    width: 50%;
}
</style>