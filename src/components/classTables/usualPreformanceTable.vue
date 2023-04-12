<template>
    <el-container>   
    <el-header style="background-color: #fff;height: 50px;">
      <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
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

        <el-main>
            <el-table border="true" :header-cell-style="tableHeader" :data="tableData">
                <el-table-column label="学号">

                </el-table-column>
                <el-table-column label="姓名">

                </el-table-column>s
                <el-table-column label="考勤分">

                </el-table-column>
                <el-table-column label="作业分">

                </el-table-column>
                <el-table-column label="课堂提问分">  

                </el-table-column>
                <el-table-column label="期中考核成绩"> 

                </el-table-column>
                <el-table-column label="实验分">

                </el-table-column>
                <el-table-column label="平时成绩">
                    
                </el-table-column>
             </el-table>
        </el-main>
    </el-container>
</template>

<script>
import api from '@/api/api'
export default {
    name:"usualPerformanceTable",
    data(){
        return{
            //表格显示
            ischoose:false,
            //课程名称
            currentCourse:"",
            //教师课程列表
            courseList:[],
            //表格数据
            tableData:[]
        }
    },
    methods:{
        //表格标题字体居中
        tableHeader({row,column,rowIndex,columnIndex}){
            return 'text-align:center'
        },
        //获取课程列表   
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        //点击课程选择框
        focusOnSelect() {
            this.tableData = [];
            this.ischoose = false;
            this.currentId = "";
            },
    },
    mounted(){
        this.getMessage();
        if (this.$route.query.id) {
        this.isReturn = true
        this.currentId = this.$route.query.id;
        this.getCurrentCourseExam();
        }
    }
}
</script>

<style>
    
</style>