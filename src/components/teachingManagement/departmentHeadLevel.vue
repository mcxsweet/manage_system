<template>
    <el-container>
        <el-main v-show="ischoose">
            <el-card>
                <h3>{{ department }} 教学管理</h3>

                <el-table
                    :data="tableData.filter(data => !search && !search2 && !search3 || data.courseName.includes(search) && data.classroomTeacher.includes(search2) && (data.accomplish == search3 || !search3))"
                    style="width: 100%" tooltip-effect="dark" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50">
                    </el-table-column>
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
                                    <span>{{ props.row.termStart }}-{{ props.row.termStart }}.{{ props.row.term
                                    }}</span>
                                </el-form-item>
                                <el-form-item label="所选教材">
                                    <span>{{ props.row.textBook }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="downloadZip(scope.row.id)">导出</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="课程名称" width="200" prop="courseName" align="center">
                        <template slot="header">
                            <p>课程名称</p>
                            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
                        </template>
                    </el-table-column>
                    <el-table-column label="教师" width="100" prop="classroomTeacher" align="center">
                        <template slot="header">
                            <p>教师</p>
                            <el-input v-model="search2" size="mini" placeholder="输入搜索" />
                        </template>
                    </el-table-column>
                    <el-table-column label="学期" width="120" align="center">
                        <template slot-scope="scope">
                            <p>{{ scope.row.termStart }}-{{ scope.row.termEnd }}.{{ scope.row.term }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="完成情况" width="120" align="center">
                        <template slot="header">
                            <p>完成情况</p>
                            <el-select v-model="search3" size="mini" clearable placeholder="请选择">
                                <el-option v-for="item in isAccomplish" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                        <template slot-scope="scope">
                            <p v-if="scope.row.accomplish == 'true'" style="color: green;">已完成</p>
                            <p v-if="scope.row.accomplish == 'false'" style="color: red;">未完成</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="相关文件导出" width="700">
                        <template slot-scope="scope">
                            <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                                @click="showPDFOnline(scope.row.id, 1)">课程目标达成评价分析报告</el-button>
                            <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                                @click="showPDFOnline(scope.row.id, 2)">课程试卷分析报告</el-button>
                            <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                                @click="showPDFOnline(scope.row.id, 3)">课程教学小结表</el-button>
                        </template>

                    </el-table-column>
                </el-table>
            </el-card>
        </el-main>

        <el-drawer :visible.sync="showPDF" direction="btt" size="90%">
            <div v-loading="loading" style="height: 100vh;">
                <embed :src="pdfUrl" type="application/pdf" width="100%" height="100%" />
            </div>
        </el-drawer>
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
            isAccomplish: [
                {
                    value: 'true',
                    label: '已完成'
                }, {
                    value: 'false',
                    label: '未完成'
                }
            ],
            search: "",
            search2: "",
            search3: "",

            //展示pdf
            showPDF: false,
            loading: true,
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
        // 下载该课程相关资料zip
        downloadZip(courseId) {
            window.location.href = global.BaseUrl + "/manager/" + courseId + "/downloadZip";
        },
        showPDFOnline(courseId, type) {
            this.showPDF = true;
            this.getPDF(courseId, type);
        },

        //获取pdf
        getPDF(courseId, type) {
            this.loading = true;
            let url = global.runTiemPath + "/manager/" + courseId + "/" + type + "/file";
            axios.get(url, { responseType: 'blob' })
                .then((response) => {
                    // 将响应数据转换为Blob对象
                    const text = new Blob([response.data], { type: 'application/pdf' });

                    // 生成URL，将其分配给嵌入元素的src属性
                    this.pdfUrl = URL.createObjectURL(text);
                    this.loading = false;
                });
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