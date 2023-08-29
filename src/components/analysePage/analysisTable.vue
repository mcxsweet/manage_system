<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
            <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
                <el-option v-for="(item, index) in courseList" :key="index" :label="item.courseName" :value="index">
                    <span style="float: left">{{ item.courseName }}</span>
                    <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">
                        {{ item.termStart }}-{{ item.termEnd }}.{{ item.term }}</span>
                </el-option>
            </el-select>
            <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseItem()">确定</el-button>
            <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
        </el-header>

        <el-main v-if="ischoose">
            <div style="width: 100%;">
                <p class="title">分析报告 pdf 展示</p>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleShowPDF('analyse')">课程目标达成评价分析报告</el-button>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleShowPDF('analyse3')">课程试卷分析报告</el-button>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleShowPDF('analyse4')">课程教学小结表</el-button>

                <p class="title">分析报告导出 word 文档</p>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleExportReport('analyse')">课程目标达成评价分析报告</el-button>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleExportReport('analyse3')">课程试卷分析报告</el-button>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
                    @click="handleExportReport('analyse4')">课程教学小结表</el-button>

                <p class="title">分析报告完成情况确认</p>
                <el-button class="BottonStyle" style="margin-left: 10px;" type="danger"
                    @click="updateStatus()">分析报告完成情况确认</el-button>
                <span style="color: red;">
                    <i class="el-icon-back"></i>
                    (必须操作)操作后学院才能看到结果
                </span>

            </div>

            <el-drawer :visible.sync="showPDF" direction="btt" size="90%">
                <div v-loading="loading" style="height: 100vh;">
                    <embed :src="pdfUrl" type="application/pdf" width="100%" height="100%" />
                </div>
            </el-drawer>
        </el-main>

    </el-container>
</template>

<script>
import api from '@/api/api';
import axios from 'axios';
import global from '@/script/global';
import { Loading } from 'element-ui';


export default {
    data() {
        return {
            data: [],
            title: "课程目标达成情况",
            //当前课程id
            currentId: "",
            //课程名称
            currentCourse: "",
            //教师课程列表
            courseList: [],

            //是否选择课程
            ischoose: false,
            //是否展示pdf
            showPDF: false,
            pdfUrl: "",
            loading: true,
        }
    },
    methods: {
        //获取课程列表   
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        getCurrentCourseItem() {
            this.ischoose = true;
            this.currentId = this.courseList[this.currentCourse].id;

            localStorage.setItem("courseId", this.currentId);
            localStorage.setItem("courseName", this.courseList[this.currentCourse].courseName);

        },
        focusOnSelect() {
            this.ischoose = false;
            this.currentId = "";
        },
        //检查是否有选中课程
        check() {
            this.currentId = localStorage.getItem("courseId");
            if (this.currentId) {
                api.get("/courseInfo/" + this.currentId, "", (resp) => {
                    this.currentCourse = resp.data.data.courseName;
                })
                this.ischoose = true;
            }
        },
        //获取pdf
        getPDF(type) {
            this.loading = true;
            let url = global.runTiemPath + "/report/" + this.currentId + "/2/" + type;
            axios.get(url, { responseType: 'blob' })
                .then((response) => {
                    // 将响应数据转换为Blob对象
                    const text = new Blob([response.data], { type: 'application/pdf' });

                    // 生成URL，将其分配给嵌入元素的src属性
                    this.pdfUrl = URL.createObjectURL(text);
                    this.loading = false;
                });
        },
        //导出分析报告
        handleExportReport(type) {
            window.location.href = global.BaseUrl + "/report/" + this.currentId + "/1/" + type;
        },
        handleShowPDF(type) {
            this.showPDF = true;
            this.getPDF(type);
        },

        //分析报告生成情况确认
        updateStatus() {
            this.$confirm('请确认该课程分析报告生成状态 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let loadingInstance = Loading.service({ fullscreen: true });
                api.get("/report/" + this.currentId + "/updateStatus", "", (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '状态保存成功'
                        });
                        loadingInstance.close();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '出错了，请确认文档是否正确生成！'
                        });
                        loadingInstance.close();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        }


    },
    mounted() {
        this.getMessage();
        this.check();
    },
}
</script>

<style scoped>
.container {
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    /* background-color: red; */
}

.BottonStyle {
    margin: 10px 10px;
    width: 200px;
}
</style>
