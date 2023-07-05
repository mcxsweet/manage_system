<template>
  <div>
    <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
      @click="handleExportReport('analyse')">课程目标达成评价分析报告</el-button>
    <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
      @click="handleExportReport('analyse3')">课程试卷分析报告</el-button>
    <el-button class="BottonStyle" style="margin-left: 10px;" type="success"
      @click="handleExportReport('analyse4')">课程教学小结表</el-button>
  </div>
</template>

<script>
export default {
  name: 'programTable',
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.BottonStyle {
  margin: 10px 10px;
  width: 200px;
}
</style>
