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

      <!-- 表格展示 -->
      <div>
        <el-button type="primary" @click="isShow = !isShow" style="margin: 1vh;">成绩分析</el-button>

        <el-drawer title="成绩分析" :visible.sync="isShow" direction="btt" size="90%">
          <div v-loading="loading2" style="margin-top: 2vw;">
            <embed :src="pdfUrl" type="application/pdf" width="100%" height="500px" />
          </div>
        </el-drawer>

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
      </div>

    </el-main>
  </el-container>
</template>

<script>
import api from '@/api/api';
import axios from 'axios';


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
      loading2: true,
      pdfUrl: "",

      isShow: false,

    }
  },
  methods: {
    tableHeader({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },

    //初始化表格
    getCurrentCourseItem() {
      if (this.currentId == "") {
        this.currentId = this.courseList[this.currentCourse].id;
      }
      this.getComprehensiveScore();
      this.initShowTable();
      this.ischoose = true;
    },

    //点击课程选择框
    focusOnSelect() {
      this.ischoose = false;
      this.currentId = "";
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
      api.get("/student/" + this.currentId + "/getComprehensiveScore", "", (resp) => {
        if (resp.data.flag) {
          this.tableData = resp.data.data;
        }
      })
    },
    initShowTable() {
      var url = "";
      if (this.currentId) {
        url = this.currentId;
      } else {
        url = this.courseList[this.currentCourse].id;
      }
      axios.get("/student/" + url + "/exportComprehensiveScore", { responseType: 'blob' })
        .then((response) => {
          // 将响应数据转换为Blob对象
          const blob = new Blob([response.data], { type: 'application/pdf' });

          // 生成URL，将其分配给嵌入元素的src属性
          this.pdfUrl = URL.createObjectURL(blob);
          this.loading2 = false;
        })
    }

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