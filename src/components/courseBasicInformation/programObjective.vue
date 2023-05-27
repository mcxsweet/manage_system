<template>
  <el-container>
    <el-header style="background-color: #fff;height: 50px;">
      <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
        <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
          <span style="float: left">{{ item.courseName }}</span>
          <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">{{ item.termStart }}-{{
            item.termEnd }}.{{item.term }}</span>
        </el-option>
      </el-select>
      <el-button icon="el-icon-search" style="margin-right;: 10px"
        @click="getCurrentCourseExam()">确定</el-button>
          <span v-show="isNumber">课程目标数为:</span><el-input-number v-show="isNumber" v-model="tableLength" controls-position="right" size="mini"></el-input-number>
          <el-button  v-show="isNumber" icon="el-icon-search" style="margin-right;: 10px" size="mini">保存</el-button>
        <el-select v-model="indicatorPoints1" filterable multiple style="width:100% ;" :multiple-limit="indicatorPointsNum" v-show="isNumber">
              <el-option v-for="item in indicators" :key="item.indicatorName" :value="item.indicatorName">
                  <span style="float: left">{{ item.indicatorName }}</span>
                  <span style="margin-left: 1vh; float: left; color: #8492a6; font-size: 13px">
                        {{ item.indicatorContent }}
                  </span>
              </el-option>
        </el-select>
      <el-button type="danger" v-show="isReturn" @click="goto('courseBasicInformation')">返回</el-button>
    </el-header>
    <el-main>
      <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
      <el-table :data="tableData1" border style="width: 100%" v-show="ischoose">
        <el-table-column prop="index" label="序号" width="118">
          <template slot-scope="scope">
            <el-input v-model="scope.row.targetName" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.targetName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="courseTarget" label="课程目标">
          <template slot-scope="scope">
            <el-input v-model="scope.row.courseTarget" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.courseTarget }}</span>
          </template>
        </el-table-column>

        <el-table-column label="毕业要求指标点" width="220">
          <template slot-scope="scope">
            <el-select v-model="scope.row.indicatorPoints" :filterable="true" :multiple="true" placeholder="请选择"
              v-show="scope.row.ised">
              <el-option v-for="item in indicators" :key="item" :value="item">
              </el-option>
            </el-select>

            <div v-for="(item, index) in scope.row.indicatorPoints" :key="index" v-show="!scope.row.ised">
              <template boder="true"><span>{{ item }}</span></template>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="pathWays" label="达成途径">
          <template slot-scope="scope">
            <el-input v-model="scope.row.pathWays" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.pathWays }}</span>
          </template>
        </el-table-column>

        <el-table-column label="请选择评价依据" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.evaluationMethod" multiple placeholder="评价依据" v-show="scope.row.ised"
              allow-create="true" filterable="true">
              <el-option label="考试" value="考试"></el-option>
              <el-option label="作业" value="作业"></el-option>
              <el-option label="报告" value="报告"></el-option>
              <el-option label="论文" value="论文"></el-option>
              <el-option label="答辩" value="答辩"></el-option>
              <el-option label="实验" value="实验"></el-option>
            </el-select>
            <div v-for="(item2, index) in scope.row.evaluationMethod" :key="index" v-show="!scope.row.ised">
              <span>{{ item2 }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editta(scope.row, scope)">编辑</el-button>
            <el-button type="success" size="mini" @click="saveta(scope.row)">保存</el-button>
            <el-button type="danger" size="mini" @click="delect(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button icon="el-icon-plus" type="primary" @click="add" v-show="ischoose">添加课程目标</el-button>
    </el-main>
  </el-container>
</template>

<script>
import api from '@/api/api';

export default {
  name: 'programObjective',
  data() {
    return {
      newObj: [],
      kecheng: '课程目标',
      indicatorPointsNum:0,
      indicatorPoints1:[],
      //显示页面
      ischoose:false,
      isNumber:false,
      //用户课程列表
      courseList:[],
      //选择框索引
      currentCourse:"",
      //课程ID
      currentId: "",
      isReturn:false,
      obj: {
        index: 0,
        ised: true,
        //课程Id
        courseId: '',
        //课程名
        courseName: '',
        //课程目标 
        courseTarget: '',
        //达成途径
        pathWays: '',
        //指标点
        indicatorPoints: [],
        //评价依据
        evaluationMethod: [],
      },
      id: "",
      tableLength: 0,
      courseName: "",
      tableData1: [],
      indicators: [],
     
    }
  },
  methods: {
    //点击课程选择框
    focusOnSelect() {
      this.tableData1 = [];
      this.isNumber = false;
      this.ischoose = false;
      this.id = "";
      this.$route.query.id = ""
      //this.tableLength = 0
      this.currentCourse = ""
    },
    //点击按钮
    getCurrentCourseExam() {
      this.isNumber = true
      this.ischoose = true;
      this.init();
      this.courseName = this.courseList[this.currentCourse].courseName
      this.obj.courseId = this.courseList[this.currentCourse].id
    },
    //获取用户课程信息
    getMessage() {
      api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
        this.courseList = resp.data.data;
        
      })
    },
    //初始化表格
    init() {
      if(this.$route.query.id){
        this.getIndicators(this.$route.query.id);
        this.tableLength = this.$route.query.Num
        api.get("/courseInfo/courseTarget/" + this.id, "", (resp) => {
         for (let index = 0; index < resp.data.data.length; index++) {
           resp.data.data[index].indicatorPoints = JSON.parse(resp.data.data[index].indicatorPoints);
            resp.data.data[index].evaluationMethod = JSON.parse(resp.data.data[index].evaluationMethod);
            resp.data.data[index].index = index;
            resp.data.data[index].ised = false;
          }
          this.tableData1 = resp.data.data;
         if (this.tableLength > this.tableData1.length) {
            let i = 0
            i = (this.tableLength - this.tableData1.length) * 1
           this.add1(i);
          }
        })
        this.currentCourse = this.$route.query.name;
        this.getIndicators();
      }else{
        this.tableLength = this.courseList[this.currentCourse].courseTargetNum
        this.id = this.courseList[this.currentCourse].id
        api.get("/courseInfo/courseTarget/" + this.id, "", (resp) => {
         for (let index = 0; index < resp.data.data.length; index++) {
           resp.data.data[index].indicatorPoints = JSON.parse(resp.data.data[index].indicatorPoints);
            resp.data.data[index].evaluationMethod = JSON.parse(resp.data.data[index].evaluationMethod);
            // this.tableData1[index] = resp.data.data[index];
            resp.data.data[index].index = index;
            resp.data.data[index].ised = false;
          }
          this.tableData1 = resp.data.data;
         if (this.tableLength > this.tableData1.length) {
            let i = 0
            i = (this.tableLength - this.tableData1.length) * 1
           this.add1(i);
          }
        })
       this.getIndicators(this.id);
      }
      
    },

    //获取指标点列表
    getIndicators(id) {
      api.get("/courseInfo/" + id, "", (resp) => {
        this.indicators = JSON.parse(resp.data.data.indicatorPoints);
      })
    },

    editta(row, index) {
      row.ised = true;
    },
    saveta(row, index) {
      row.ised = false
      this.tableData1[row.index].indicatorPoints = JSON.stringify(this.tableData1[row.index].indicatorPoints);
      this.tableData1[row.index].evaluationMethod = JSON.stringify(this.tableData1[row.index].evaluationMethod);
      this.tableData1[row.index].courseName = this.courseName;
      if (row.id == null) {
        api.post("/courseInfo/courseTarget", this.tableData1[row.index], (resp) => {
          if (resp.data.flag) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '保存失败!'
            });
          }
        })
      } else {
        api.put("/courseInfo/courseTarget", this.tableData1[row.index], (resp) => {
          if (resp.data.flag) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.init();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败!'
            });
          }
        })
      }
      this.tableData1[row.index].indicatorPoints = JSON.parse(this.tableData1[row.index].indicatorPoints);
      this.tableData1[row.index].evaluationMethod = JSON.parse(this.tableData1[row.index].evaluationMethod);
    },
    delect(obj, index) {
      this.$confirm('是否删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        obj.indicatorPoints = JSON.stringify(obj.indicatorPoints);
        obj.evaluationMethod = JSON.stringify(obj.evaluationMethod);
        api.del("/courseInfo/courseTarget", obj, (resp) => {
          if (resp.data.flag) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.tableData1.splice(index, 1);
            //this.init();
          } else if (resp.status != 200) {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    add() {
      let j = 0
      if(this.$route.query.id){
        this.tableLength = this.$route.query.Num
        if (this.tableLength > this.tableData1.length) {
        this.obj.index = this.tableData1.length
        j = this.obj.index + 1
        this.obj.targetName = "课程目标" + j
        this.tableData1.push(JSON.parse(JSON.stringify(this.obj)))
      } else {
        this.$message({
          type: 'error',
          message: '不可再添加空白项！'
        })
      }
      }else{
       this.tableLength = this.courseList[this.currentCourse].courseTargetNum
       if (this.tableLength > this.tableData1.length) {
        this.obj.index = this.tableData1.length
        j = this.obj.index + 1
        this.obj.targetName = "课程目标" + j
        this.tableData1.push(JSON.parse(JSON.stringify(this.obj)))
      } else {
        this.$message({
          type: 'error',
          message: '不可再添加空白项！'
        })
      } 
    }},
    add1(index) {
      let j = 0
      for (let i = 0; i < index; i++) {
        this.obj.index = this.tableData1.length
        j = this.obj.index + 1
        this.obj.targetName = "课程目标" + j
        this.tableData1.push(JSON.parse(JSON.stringify(this.obj)))
      }
    }
  },

  mounted() {
    this.getMessage();
    if (this.$route.query.id) {
      //this.isReturn = true
      this.id = this.$route.query.id;
      this.obj.courseId = this.$route.query.id;
      this.courseName = this.$route.query.name
      this.tableLength = this.$route.query.Num
      this.getCurrentCourseExam();
    }
    this.init();
  },
}
</script>

<style></style>