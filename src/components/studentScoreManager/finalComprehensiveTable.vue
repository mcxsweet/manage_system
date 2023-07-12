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
      <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseItem()"
        v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
      <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
    </el-header>

    <el-main v-if="ischoose">

      <!-- 表格展示 -->
      <div>
        <el-button type="primary" @click="open()" style="margin: 1vh;">成绩分析</el-button>
        <el-button type="primary" @click="openAchievement()" style="margin: 1vh;">课程目标达成情况</el-button>
        <el-button type="primary" @click="exportXLS()" style="margin: 1vh;">导出XLS</el-button>

        <el-drawer title="成绩分析" :visible.sync="isShow" direction="btt" size="90%">
          <div v-loading="loading2 | loading" style="margin-top: 2vw;">
            <embed :src="pdfUrl" type="application/pdf" width="100%" height="500px" />
            <embed :src="pdfUrl2" type="application/pdf" width="100%" height="500px" />
          </div>
        </el-drawer>

        <el-drawer title="达成度分析" :visible.sync="isShow2" direction="btt" size="90%">
          <div v-loading="loading3" style="margin-top: 2vw;" class="container">
            <div v-for="item, index in data" :key="index" style="margin-top: 50px ">
              <myChart :title="index + 1" :data="item"></myChart>
            </div>
          </div>
        </el-drawer>

        <el-table border="true" :header-cell-style="tableHeader" :data="tableData">
          <el-table-column label="序号" width="50px">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="学号" prop="studentNumber" width="200px">
          </el-table-column>
          <el-table-column label="姓名" prop="studentName" width="150px">
          </el-table-column>
          <el-table-column label="班级" prop="className" width="300px">
          </el-table-column>
          <el-table-column label="平时成绩" prop="usualScore" width="100px">
          </el-table-column>
          <el-table-column label="卷面成绩" prop="finalScore" width="100px">
          </el-table-column>
          <el-table-column label="综合成绩" prop="comprehensiveScore" width="100px">
            <template slot-scope="scope">
              <p v-if="scope.row.comprehensiveScore < 60" style="color: red;">{{ scope.row.comprehensiveScore }}</p>
              <p v-if="scope.row.comprehensiveScore >= 60" style="color: green;">{{ scope.row.comprehensiveScore }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-main>
  </el-container>
</template>

<script>
import api from '@/api/api';
import axios from 'axios';
import global from '@/script/global';

import myChart from '@/components/analysePage/myChart'

export default {
  name: "finalComprehensiveTable",
  data() {
    return {
      reload: false,
      getId: "",//localstrage中的courseID
      currentCourse: "",
      currentId: "",
      courseList: [],

      ischoose: false,
      //表格成绩
      tableData: [],
      loading: true,
      loading2: true,
      loading3: true,
      pdfUrl: "",
      pdfUrl2: "",

      isShow: false,
      isShow2: false,

      data: [],
      fullscreenLoading: false
    }
  },
  components: { myChart },
  methods: {
    tableHeader({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },

    //初始化表格
    getCurrentCourseItem() {
      this.fullscreenLoading = true;
      if (this.currentId == "") {
        this.currentId = this.courseList[this.currentCourse].id;
      }
      this.getComprehensiveScore();
      this.ischoose = true;
      if (this.getId == "") {
        localStorage.setItem('courseId', this.courseList[this.currentCourse].id);
        localStorage.setItem('courseName', this.courseList[this.currentCourse].courseName);
      }
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 1000);
    },

    //点击课程选择框
    focusOnSelect() {
      this.ischoose = false;
      this.currentId = "";
      this.getId = "";
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
      } else if (this.getId != "") {
        url = this.getId
      }
      else if (this.getId == "") {
        url = this.courseList[this.currentCourse].id;
      }
      axios.get(global.runTiemPath + "/student/" + url + "/exportComprehensiveScoreAnalyse", { responseType: 'blob' })
        .then((response) => {
          // 将响应数据转换为Blob对象
          const blob = new Blob([response.data], { type: 'application/pdf' });

          // 生成URL，将其分配给嵌入元素的src属性
          this.pdfUrl = URL.createObjectURL(blob);
          this.loading2 = false;
        })
    },
    exportXLS() {
      window.location.href = global.BaseUrl + "/student/" + this.currentId + "/exportComprehensiveScore";
    },
    open() {
      this.loading = true;
      this.loading2 = true;
      this.isShow = !this.isShow;
      this.initShowTable();
      setTimeout(() => {
        this.getAchievementPDF();
      }, 2000);
    },
    openAchievement() {
      this.isShow2 = true;
      this.getScatterData();
    },
    getScatterData() {
      api.get("/student/" + this.currentId + "/scatterData", "", (resp) => {
        var array = JSON.parse(resp.data.value);
        this.data = array;
      })
      this.loading3 = false;
    },
    getAchievementPDF() {
      var url = "";
      if (this.currentId) {
        url = this.currentId;
      } else if (this.getId != "") {
        url = this.getId
      } else if (this.getId == "") {
        url = this.courseList[this.currentCourse].id;
      }
      axios.get(global.runTiemPath + "/student/" + url + "/1/exportDegreeOfAchievement", { responseType: 'blob' })
        .then((response) => {
          // 将响应数据转换为Blob对象
          const text = new Blob([response.data], { type: 'application/pdf' });

          // 生成URL，将其分配给嵌入元素的src属性
          this.pdfUrl2 = URL.createObjectURL(text);
          this.loading = false;
        })
    },
    //获取课程基本信息
    getCourse() {
      api.get("/courseInfo/" + this.getId, "", (resp1) => {
        this.currentCourse = resp1.data.data.courseName;
      })
    }

  },
  mounted() {
    this.getId = localStorage.getItem('courseId');
    if (this.getId != "") {
      this.ischoose = true;
      this.currentId = this.getId
      this.getCourse();
      this.getCurrentCourseItem();
    }
    if (this.$route.query.id) {
      localStorage.setItem('courseId', this.$route.query.id);
      this.getId = localStorage.getItem('courseId');
      this.currentId = this.$route.query.id;
      this.currentCourse = this.$route.query.name;
      this.getCurrentCourseItem();
    }
    this.getMessage();
  },
}
</script>

<style>
.container {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  /* background-color: red; */
}
</style>