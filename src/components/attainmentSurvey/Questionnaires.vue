<template>
  <div class="naires">
    <!-- 头部区域 -->
      <el-header class="header">
        <el-button style="float:right" type="primary" @click="logout">退出</el-button>
      </el-header>
    <el-tabs tab-position="left" v-model="courseId">
      <el-tab-pane
        v-for="(course, i) in courses"
        :key="i"
        :name="course.courseId">
        <span slot="label">
          <el-badge v-if="!course.survey" is-dot class="item">{{
            course.courseName
          }}</el-badge>
          <span v-else>{{ course.courseName }}</span>
        </span>
        <Survey
          v-if="courseId === course.courseId"
          :number="student.studentNumber"
          :courseId="courseId"
          @selected="changeBadge"
        ></Survey>
      </el-tab-pane>
      <div v-if="courseId==='0'" style="text-align:center"><h2>请认真完成问卷</h2></div>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Survey from "./Survey.vue";
import api from "@/api/api";
export default {
  components: { Survey },
  name: "Questionnaires",
  data() {
    return {
      courses: [],
      courseId: null,
    };
  },
  computed: {
    ...mapState("user", ["student"]),
  },
  mounted() {
    this.getCourses();
  },
  methods: {
    getCourses() {
      api.get(
        "/survey/getCoursesByStudentNumber?number=" +
          this.student.studentNumber,
        null,
        (res) => {
          let { data, flag } = res.data;
          if (flag) {
            this.courses = data;
          }
        }
      );
    },
    changeBadge(courseId) {
      console.log("----changeBadge----");
      for (let i = 0; i < this.courses.length; i++) {
        if (courseId === this.courses[i].courseId) {
          this.courses[i].survey = true;
        }
        
      }
    },
    logout(){
       this.$store.dispatch('user/logout')
    }
  },
};
</script>

<style scope>
.naires {
  width: 80%;
  margin: 40px auto;
}
.header{
  background-color: white;
}
.item {
  margin-top: 10px;
}
</style>