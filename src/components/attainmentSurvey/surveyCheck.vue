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
            <el-button icon="el-icon-search" style="margin: 10px" @click="showCurrentCourse()">确定</el-button>

            <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
        </el-header>
        <el-main v-show="ischoose">
        </el-main>
    </el-container>
</template>

<script>
import api from '@/api/api';
import axios from 'axios';
import { Loading } from 'element-ui';
import global from '@/script/global';

export default {
    name: "surveyCheck",
    data() {
        return {
            currentCourse: "",
            courseList: [],
            ischoose: false,
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
        //点击按钮
        showCurrentCourse() {
            this.currentId = this.courseList[this.currentCourse].id;
            this.courseName = this.courseList[this.currentCourse].courseName;
            this.ischoose = true;
            localStorage.setItem('courseId', this.currentId);
            localStorage.setItem('courseName', this.courseName);
        },
    },
    mounted() {
        this.getMessage();
        this.currentId = localStorage.getItem("courseId");
        this.currentCourse = localStorage.getItem("courseName");
        if (this.currentId) {
            this.ischoose = true;
        }
    },
}
</script>

<style></style>