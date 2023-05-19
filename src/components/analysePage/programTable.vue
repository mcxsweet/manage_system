<template>
   <el-container>
    <el-main>
      <el-table boder="true" :header-cell-style="tableHeader" :data="tableData" >
    <el-table-column label="学号"></el-table-column>
    <el-table-column label="姓名"></el-table-column>
    <el-table-column label="班级"></el-table-column>
    <el-table-column label="平时成绩()"></el-table-column>
    <el-table-column label="期末成绩()"></el-table-column>
    <el-table-column label="总评成绩()"></el-table-column>
    <el-table-column label="课程目标">
        <el-table-column label="平时观测点达成度"></el-table-column>
        <el-table-column label="试卷"></el-table-column>
        <el-table-column label="试卷观测点达成度"></el-table-column>
        <el-table-column label="课程目标达成度"></el-table-column>
    </el-table-column>
  </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
    name:'programTable',
    data(){
        return {
            tableData:[]
        }
    },
    methods:{
      tableHeader({row,column,rowIndex,columnIndex}){
            //console.log(row,column,rowIndex,columnIndex);
           return 'text-align:center'
        },
    }
}
</script>

<style>

</style>