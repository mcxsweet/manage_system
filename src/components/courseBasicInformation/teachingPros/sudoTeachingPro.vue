<template>
    <el-container>
        <el-main>
            <el-table :data="tableData" border="true" :header-cell-style="tableHeader">
                <el-table-column label="序号" width="100px"></el-table-column>
                <el-table-column label="课程目标"></el-table-column>
                <el-table-column label="指标点">
                    <template slot-scope="scope1">
            <el-collapse>
              <el-collapse-item title=" 点击展开">
                <div>
                    <el-table :data="scope1"  border="true" :header-cell-style="tableHeader">
                        <el-table-column label="指标点序号"></el-table-column>
                        <el-table-column label="指标点"></el-table-column>
                    </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
                </el-table-column>
            <el-table-column label="操作" width="240px">
                <template >
                    <el-button size="mini" type="primary">编辑</el-button>
                    <el-button size="mini" type="danger">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
            <el-button type="primary">添加课程目标</el-button>
            <el-button type="primary">上传文件</el-button>
        </el-main>
    </el-container>
</template>
  
  <script>
  import api from '@/api/api';
  export default {
      name:'sudoTeachingPro',

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
            //课程目标数据
            programTable:[],
            //指标点数据
            indicators:[]
          }
      },
      methods:{
         //表格标题字体居中
         tableHeader({ row, column, rowIndex, columnIndex }) {
            return 'text-align:center'
        },
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