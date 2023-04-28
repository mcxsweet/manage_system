<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
      <el-select v-model="currentCourse" placeholder="请选择专业" @focus="focusOnSelect()">
        <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
          <span style="float: left">{{ item.courseName }}</span>
          <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">{{ item.termStart }}-{{
            item.termEnd }}.{{
            item.term }}</span>
                </el-option>
            </el-select>
            <el-button icon="el-icon-search" :circle="true" style="margin-left: 10px"
                @click="getCurrentCourseExam()"></el-button>
            <el-button type="danger" v-show="isReturn" @click="goto('courseBasicInformation')">返回</el-button>
        </el-header>
    </el-container>
  </template>
  
  <script>
  import pdfUpload from '../pdfUpload.vue'
  export default{
      name:'SuperTeachingPro',
      components:{pdfUpload},
      data(){
          return{
        //选择课程后再显示界面
        ischoose: false,
        //当前选择课程索引
        currentCourse: "",
        //当前课程id
        currentId: "",
        //课程列表(后端获取)
        courseList: [],
          }
      },
      methods:{
            focusOnSelect() {
                this.examItemArray = [];
                this.ischoose = false;
                this.currentId = "";
            },
        //获取课程列表
            getMessage() {
                api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                    this.courseList = resp.data.data;
                })
            },

            //选择框值选择后
            getCurrentCourseExam() {
            this.ischoose = true;
            this.init()
            },
      }
  }
  </script>
  
  <style>
  
  </style>