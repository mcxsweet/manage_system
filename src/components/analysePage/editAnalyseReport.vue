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
            <center>
                <h2>试卷分析报告</h2>
            </center>
            <el-card>
                <p>试卷得分请况：</p>
                <el-row :gutter="1">
                    <el-col :span="4">
                        <div>
                            <el-statistic title="< 60">
                                <template slot="formatter"> {{ scoreAnalyse.failed }} </template>
                            </el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div>
                            <el-statistic title="60 - 69">
                                <template slot="formatter"> {{ scoreAnalyse.pass }} </template>
                            </el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="70 - 79">
                            <template slot="formatter"> {{ scoreAnalyse.good }} </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="80 - 89">
                            <template slot="formatter"> {{ scoreAnalyse.great }} </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="90 - 100">
                            <template slot="formatter"> {{ scoreAnalyse.superior }} </template>
                        </el-statistic>
                    </el-col>
                </el-row>
            </el-card>

            <el-card>
                <div class="clearfix">
                    <el-row>
                        <el-col :span="22">
                            <div @click="open(0)"><i class="el-icon-caret-right"></i> 试卷情况分析</div>
                        </el-col>
                        <el-col :span="2">
                            <el-button v-show="!content[0].isedit" type="primary" round @click="edit(0)">编辑</el-button>
                            <el-button v-show="content[0].isedit" type="success" round @click="save(0)">保存</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div v-show="content[0].show">
                    <!-- <el-divider></el-divider> -->
                    <mavon-editor v-show="content[0].isedit" v-model="content[0].data" ref="md" :subfield="false"
                        @change="change" style="min-height: 400px" />

                    <mavon-editor v-show="!content[0].isedit" v-model="content[0].data" :toolbarsFlag="false"
                        :editable="false" :subfield="false" defaultOpen="preview" :navigation="false"
                        style="min-height: 100px" />
                    <!-- <p v-show="!content[0].isedit">{{ content[0].data }}</p> -->
                </div>
            </el-card>

            <el-card>
                <div class="clearfix">
                    <el-row>
                        <el-col :span="22">
                            <div @click="open(1)"><i class="el-icon-caret-right"></i> 改进措施</div>
                        </el-col>
                        <el-col :span="2">
                            <el-button v-show="!content[1].isedit" type="primary" round @click="edit(1)">编辑</el-button>
                            <el-button v-show="content[1].isedit" type="success" round @click="save(1)">保存</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div v-show="content[1].show">
                    <!-- <el-divider></el-divider> -->
                    <mavon-editor v-show="content[1].isedit" v-model="content[1].data" ref="md" :subfield="false"
                        @change="change" style="min-height: 400px" />

                    <mavon-editor v-show="!content[1].isedit" v-model="content[1].data" :toolbarsFlag="false"
                        :editable="false" :subfield="false" defaultOpen="preview" :navigation="false"
                        style="min-height: 100px" />
                    <!-- <p v-show="!content[1].isedit">{{ content[1].data }}</p> -->
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
import api from '@/api/api';
import axios from 'axios';
import global from '@/script/global';

import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
    name: "editAnalyseReport",
    components: {
        mavonEditor
    },
    data() {
        return {
            //当前课程id
            currentId: "",
            //课程名称
            currentCourse: "",
            courseList: [],
            ischoose: false,

            //富文本框内容
            // content: { isedit: false, data: "本课程教学内容紧扣教学大纲，教学进度合适，基本应用和实践应用结合教授。本课程教学主要多媒体教学。多媒体教学能将丰富的电子课件和网络知识更系统清晰的传达给学生。本课程教学过程中最大问题为教学实验内容多，实验内容难度多，而且要准备的实验器材比较杂，实验不太好准备。", show: false },
            content: [{ isedit: false, show: false, data: "数据为空！！请点击编辑" }, { isedit: false, show: false, data: "数据为空！！请点击编辑" }],

            scoreAnalyse: {}
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
            this.init();
        },
        check() {
            if (localStorage.getItem("courseId")) {
                this.currentId = localStorage.getItem("courseId");
                this.currentCourse = localStorage.getItem("courseName");
                this.ischoose = true;
                this.init();
            }
        },
        focusOnSelect() {
            this.ischoose = false;
            this.currentId = "";
        },

        init() {
            api.get("/report/" + this.currentId + "/getImprovementActions", "", (resp) => {
                if (resp.data.data) {
                    this.content[0].data = resp.data.data.examPaperSituationAnalyse;
                    this.content[1].data = resp.data.data.improvementActions;
                }
            })

            api.get("/student/" + this.currentId + "/getScoreAnalyse", "", (resp) => {
                if (resp.data.data) {
                    this.scoreAnalyse = resp.data.data;
                }
            })
        },

        // 所有操作都会被解析重新渲染
        change(value, render) {
            // render 为 markdown 解析后的结果[html]
            this.html = render;
        },
        open(index) {
            this.content[index].show = !this.content[index].show;
        },
        edit(index) {
            this.content[index].isedit = !this.content[index].isedit;
            this.content[index].show = true;
        },
        save(index) {
            switch (index) {
                case 0:
                    api.post("/report/InsertImprovementActions", { courseId: this.currentId, examPaperSituationAnalyse: this.content[index].data }, (resp) => {
                        if (resp.data.flag) {
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            this.init();
                        }
                    })
                    break;
                case 1:
                    api.post("/report/InsertImprovementActions", { courseId: this.currentId, improvementActions: this.content[index].data }, (resp) => {
                        if (resp.data.flag) {
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            this.init();
                        }
                    })
                    break;
                default:
                    break;
            }
            this.content[index].isedit = !this.content[index].isedit;
        }
    },
    mounted() {
        this.getMessage();
        this.check();
    },
}
</script>

<style scoped>
.el-card {
    margin-bottom: 20px;
}

.clearfix {
    margin-bottom: 10px;
}

.clearfix div {
    font-size: 20px;
}

h2 {
    margin: 10px;
}
</style>