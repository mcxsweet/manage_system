<template>
  <el-container>
    <el-header style="background-color: #fff;height: 50px;">
      <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
        <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
          <span style="float: left">{{ item.courseName }}</span>
          <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">
            {{ item.termStart }}-{{ item.termEnd }}.{{ item.term }}
          </span>
        </el-option>
      </el-select>

      <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseExam()">确定</el-button>
      <el-button type="danger" v-if="isadmin == 0" v-show="isReturn"
        @click="goto('courseBasicInformation')">返回首页</el-button>
      <el-button type="danger" v-if="isadmin == 1" v-show="isReturn"
        @click="goto('sudoCourseInformation')">返回首页</el-button>
      <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
    </el-header>

    <el-main v-show="ischoose">
      <el-table :data="tableData1" border style="width: 100%">
        <el-table-column prop="index" label="序号" width="118">
          <template slot-scope="scope">
            <el-input v-model="scope.row.targetName" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.targetName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="courseTarget" label="课程目标" width="300">
          <template slot-scope="scope">
            <el-input v-model="scope.row.courseTarget" v-show="scope.row.ised" placeholder="教学大纲中的课程目标文字描述"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.courseTarget }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="weight" label="支撑权重" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.weight" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.weight }}</span>
          </template>
        </el-table-column>

        <el-table-column label="毕业要求指标点" width="150">
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

        <el-table-column prop="pathWays" label="达成途径" width="300">
          <template slot-scope="scope">
            <el-input v-model="scope.row.pathWays" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.pathWays }}</span>
          </template>
        </el-table-column>

        <el-table-column label="请选择评价依据" width="150">
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
      <el-button icon="el-icon-plus" type="primary" @click="add" style="margin: 10px;">添加课程目标</el-button>

    </el-main>
  </el-container>
</template>

<script>
import api from '@/api/api';

export default {
  name: 'programObjective',
  data() {
    return {
      newObj: [], //用于设置新课程目标数量
      getId: "",//localstrage中的courseID
      kecheng: '课程目标',
      indicatorPointsNum: 0,
      newcourseTargetNum: 0,
      indicatorPoints1: [],
      //显示页面
      ischoose: false,
      isNumber: false,
      isReturn: false,
      //用户课程列表
      courseList: [],
      //选择框索引
      currentCourse: "",
      //课程ID
      currentId: "",
      isReturn: false,
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

      isadmin: 0,

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
      this.currentCourse = ""
      this.indicators = []
      this.getId = "";
    },
    //点击按钮
    getCurrentCourseExam() {
      this.isNumber = true
      this.ischoose = true;
      this.init();
      this.courseName = this.courseList[this.currentCourse].courseName
      this.obj.courseId = this.courseList[this.currentCourse].id
      this.newcourseTargetNum = this.tableLength
      if (this.getId == "") {
        localStorage.setItem('courseId', this.obj.courseId);
      }
    },
    goto(url) {
      this.$router.push({ path: '/MainPage/' + url, });
    },
    //获取用户课程信息
    getMessage() {
      api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
        this.courseList = resp.data.data;
      })
    },
    //初始化表格
    init() {
      if (this.$route.query.id) {
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
        this.getIndicators(this.$route.query.id);
      } else if (this.getId == "") {
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
          this.newObj = resp.data.data
          if (this.tableLength > this.tableData1.length) {
            let i = 0
            i = (this.tableLength - this.tableData1.length) * 1
            this.add1(i);
          }
        })
        this.getIndicators(this.id);
      } else if (this.getId != "") {
        api.get("/courseInfo/" + this.getId, "", (resp1) => {
          this.tableLength = resp1.data.data.courseTargetNum
          this.newcourseTargetNum = this.tableLength
          this.currentCourse = resp1.data.data.courseName;
          this.courseName = resp1.data.data.courseName;
        })
        api.get("/courseInfo/courseTarget/" + this.getId, "", (resp) => {
          for (let index = 0; index < resp.data.data.length; index++) {
            resp.data.data[index].indicatorPoints = JSON.parse(resp.data.data[index].indicatorPoints);
            resp.data.data[index].evaluationMethod = JSON.parse(resp.data.data[index].evaluationMethod);
            resp.data.data[index].index = index;
            resp.data.data[index].ised = false;
          }
          this.tableData1 = resp.data.data;
          this.newObj = resp.data.data
          if (this.tableLength > this.tableData1.length) {
            let i = 0
            i = (this.tableLength - this.tableData1.length) * 1
            this.add1(i);
          }
        })
        this.getIndicators(this.getId);
      }

    },

    //获取指标点列表
    getIndicators(id) {
      api.get("/courseInfo/" + id, "", (resp) => {
        this.indicators = JSON.parse(resp.data.data.indicatorPoints);
      })
    },
    //获取指标点列表
    getIndicators1() {
      api.get("/courseInfo/indicators", "", (resp) => {
        this.indicatorPoints1 = resp.data.data;
      })
    },
    //修改新课程目标数
    savaNum(index) {
      let newid = 0
      if (this.$route.query.id) {
        newid = this.$route.query.id
      } else if (this.getId != "") {
        newid = this.getId
      } else {
        newid = this.courseList[this.currentCourse].id
      }
      api.get("/courseInfo/" + newid, "", (resp1) => {
        this.newObj = resp1.data.data
      })
      this.newObj.courseTargetNum = this.newcourseTargetNum
      api.put("/courseInfo", this.newObj, (resp) => {
        if (resp.data.flag) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.getCurrentCourseExam();
        }
      })
    },
    editta(row, index) {
      row.ised = true;
    },
    saveta(row, index) {
      row.ised = false
      if (this.getid != "") {
        this.tableData1[row.index].courseId = this.getId
      }
      this.tableData1[row.index].indicatorPoints = JSON.stringify(this.tableData1[row.index].indicatorPoints);
      this.tableData1[row.index].evaluationMethod = JSON.stringify(this.tableData1[row.index].evaluationMethod);
      this.tableData1[row.index].courseName = this.courseName;
      if (row.id == null) {
        api.post("/courseInfo/courseTarget", this.tableData1[row.index], (resp) => {
          if (resp.data.flag) {
            api.get("/courseInfo/courseTarget/" + this.getId, "", (resp2) => {
              this.tableData1[row.index].id = resp2.data.data[row.index].id
            })
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
      if (this.$route.query.id) {
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
      } else if (this.getId == "") {
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
      } else if (this.getId != "") {
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
      }
    },
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
    this.isadmin = localStorage.getItem('Isadmin');
    this.getId = localStorage.getItem('courseId');
    if (this.getId != "") {
      this.isNumber = true
      this.ischoose = true;
      this.init();
    }
    this.getMessage();
    this.getIndicators1();
    if (this.$route.query.id) {
      localStorage.setItem('courseId', this.$route.query.id);
      this.getId = localStorage.getItem('courseId');
      this.isReturn = true
      this.id = this.$route.query.id;
      this.obj.courseId = this.$route.query.id;
      this.courseName = this.$route.query.name
      this.tableLength = this.$route.query.Num
      this.newcourseTargetNum = this.$route.query.Num
      this.getCurrentCourseExam();
    }
    this.init();
  },
}
</script>

<style></style>