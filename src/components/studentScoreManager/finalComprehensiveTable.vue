<template>
  <el-container>
    <el-header style="background-color: #fff;height: 50px;">
      <el-select v-if="reload" v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
        <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
          <span style="float: left">{{ item.courseName }}</span>
          <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">
            {{ item.termStart }}-{{ item.termEnd }}.{{ item.term }}</span>
        </el-option>
      </el-select>
      <el-button icon="el-icon-search" :circle="true" style="margin-left: 10px"
        @click="getCurrentCourseItem()"></el-button>
    </el-header>

    <el-main v-if="ischoose">
      <el-table border="true" :header-cell-style="tableHeader" :data="tableData">
        <el-table-column label="序号" width="50px">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="学号" prop="studentNumber">
        </el-table-column>
        <el-table-column label="姓名" prop="studentName">
        </el-table-column>
        <el-table-column label="班级" prop="className">
        </el-table-column>
        <el-table-column label="平时成绩" prop="usualScore">
        </el-table-column>
        <el-table-column label="卷面成绩" prop="finalScore">
        </el-table-column>
        <el-table-column label="综合成绩" prop="comprehensiveScore">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import api from '@/api/api';
export default {
  name: "finalComprehensiveTable",
  data() {
    return {
      reload: false,
      currentCourse: "",
      currentId: "",
      courseList: [],

      ischoose: false,
      //表格成绩
      tableData: [],
    }
  },
  methods: {
    tableHeader({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },

    //点击课程选择框
    focusOnSelect() {
      this.ischoose = false;
      this.currentId = "";
    },

    //初始化表格
    getCurrentCourseItem() {
      if (this.currentId == "") {
        this.currentId = this.courseList[this.currentCourse].id;
      }
      this.getComprehensiveScore();
      this.ischoose = true;
    },
    //获取课程列表   
    getMessage() {
      api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
        this.courseList = resp.data.data;
      })
      this.reload = true;
    },
    //获取学生期末综合成绩
    getComprehensiveScore() {
      api.get("/student/10/getComprehensiveScore", "", (resp) => {
        if (resp.data.flag) {
          this.tableData = resp.data.data;
        }
      })
    },

  },
  mounted() {
    if (this.$route.query.id) {
      this.currentId = this.$route.query.id;
      this.currentCourse = this.$route.query.name;
      this.getCurrentCourseItem();
    }
    this.getMessage();
  },
}
</script>

<style></style>