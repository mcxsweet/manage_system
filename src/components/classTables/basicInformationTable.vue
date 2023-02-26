<template>
  <el-container>
    <p style="margin-top: 20px;margin-left: 20px;">请先选择课程</p>
    <el-header style="background-color: #fff;height: 50px;">
      <el-select v-model="currentCourse" placeholder="请先选择课程" @focus="ischoose = false">
        <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
        </el-option>
      </el-select>
      <el-button icon="el-icon-search" circle style="margin-left: 10px" @click="getCurrentCourseExam()"></el-button>
    </el-header>

    <el-main v-show="ischoose">
      <el-table :data="examItemArray" border="true" style="width: 100%" default-expand-all="true">
        <el-table-column label="考核项目" width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.examineItem" placeholder="请选择" style="width:100%"
              v-show="!scope.row.isExamineItem">
              <el-option value="平时考核成绩"></el-option>
              <el-option value="实验考核成绩"></el-option>
              <el-option value="期末考核成绩"></el-option>
            </el-select>
            <p v-show="scope.row.isExamineItem">{{ scope.row.examineItem }}</p>
          </template>
        </el-table-column>

        <el-table-column label="项目百分比" width="150">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.percentage" v-show="!scope.row.isPercentage">
              <template slot="append">%</template>
            </el-input>
            <p v-show="scope.row.isPercentage">{{ scope.row.percentage }} %</p>
          </template>
        </el-table-column>

        <!-- 考核子项目 -->
        <el-table-column label="考核子项目">
          <template slot-scope="scope">
            <el-table :data="scope.row.examChildItemArray" stripe="true">
              <el-table-column label="子项目名称" width="170">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.examineChildItem" v-show="!scope.row.isExamineChildItem" placeholder="请选择"
                    style="width:100%">
                    <el-option value="平时考核成绩"></el-option>
                    <el-option value="实验考核成绩"></el-option>
                    <el-option value="期末考核成绩"></el-option>
                  </el-select>
                  <p v-show="scope.row.isExamineChildItem">{{ scope.row.examineChildItem }}</p>
                </template>
              </el-table-column>

              <el-table-column label="子项目百分比" width="150">
                <template slot-scope="scope">
                  <el-input type="number" v-model="scope.row.childPercentage" v-show="!scope.row.isChildPercentage"
                    :min="0" :max="100">
                    <template slot="append">%</template>
                  </el-input>
                  <p v-show="scope.row.isChildPercentage">{{ scope.row.childPercentage }} %</p>
                </template>
              </el-table-column>

              <el-table-column label="对应课程目标" width="170">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.courseTarget" multiple v-show="!scope.row.isCourseTarget">
                    <el-option label="课程目标1" value="课程目标1"></el-option>
                    <el-option label="课程目标2" value="课程目标2"></el-option>
                  </el-select>
                  <div v-for="(item, index) in scope.row.courseTarget" :key="index" v-show="scope.row.isCourseTarget">
                    <span>{{ item }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="对应指标点" width="170">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.indicatorPointsDetail" multiple="true"
                    v-show="!scope.row.isIndicatorPointsDetail">
                    <el-option label="指标点1" value="指标点1"></el-option>
                    <el-option label="指标点2" value="指标点2"></el-option>
                  </el-select>
                  <div v-for="(item, index) in scope.row.indicatorPointsDetail" :key="index"
                    v-show="scope.row.isIndicatorPointsDetail">
                    <span>{{ item }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="子项目操作" width="220">
                <template slot-scope="scope2">
                  <el-tooltip content="编辑" placement="bottom" effect="light">
                    <el-button type="primary" icon="el-icon-edit" circle="true"
                      @click="editChildItem(scope.$index, scope2.$index)"></el-button>
                  </el-tooltip>

                  <el-tooltip content="保存" placement="bottom" effect="light">
                    <el-button type="success" icon="el-icon-check" circle
                      @click="saveChildItem(scope.$index, scope2.$index)"></el-button>
                  </el-tooltip>

                  <el-tooltip content="删除" placement="bottom" effect="light">
                    <el-button type="danger" icon="el-icon-delete" circle
                      @click="deleteChildItem(scope.$index, scope2.$index)"></el-button>
                  </el-tooltip>

                </template>
              </el-table-column>
            </el-table>

            <el-tooltip content="添加子项目" placement="bottom" effect="light">
              <el-button type="primary" icon="el-icon-plus" circle @click="addExamChildItem(scope.$index)"></el-button>
            </el-tooltip>
          </template>



        </el-table-column>


        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editExamItem(scope.$index)">编辑</el-button>
            <el-button type="danger" size="mini" @click="saveExamItem(scope.$index)">保存</el-button>
            <el-button type="primary" size="mini" @click="delectExamItem(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button icon="el-icon-plus" type="primary" @click="addExamItem()">添加考核方式</el-button>

    </el-main>

  </el-container>
</template>

<script>
import api from '@/api/api'

export default {
  name: "basicInformationTable",
  data() {
    return {
      //选择课程后再显示界面
      ischoose: false,
      //当前选择课程索引
      currentCourse: "",
      //课程列表(后端获取)
      courseList: [],

      //课程考试项目
      examItemArray: [],

      text: '',

      //实例对象
      examItem: {
        //考核项目名
        examineItem: "",
        isExamineItem: false,

        //考核项目百分比
        percentage: "",
        isPercentage: false,

        //课程考试子项目
        examChildItemArray: [],
      },

      examChildItem: {
        //考核子项目
        examineChildItem: "",
        isExamineChildItem: false,

        //所占百分比
        childPercentage: "",
        isChildPercentage: false,

        //课程目标
        courseTarget: [],
        isCourseTarget: false,

        //指标点
        indicatorPointsDetail: [],
        isIndicatorPointsDetail: false
      }

    }
  },
  methods: {

    //初始化表格数据
    init() {
      
      // this.examItemArray = [];
      api.get("/courseExam/courseExamineMethods/" + this.courseList[this.currentCourse].id, "", (resp) => {
        for (let index = 0; index < resp.data.data.length; index++) {
          resp.data.data[index].isExamineItem = true;
          resp.data.data[index].isPercentage = true;
          // resp.data.data[index].examChildItemArray = [];
          api.get("/courseExam/courseExamineChildMethods/" + resp.data.data[index].id, "", (resp2) => {
            for (let j = 0; j < resp2.data.data.length; j++) {
              resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
              resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);
              resp2.data.data[j].isCourseTarget = false;
              resp2.data.data[j].isIndicatorPointsDetail = false;
            }
            resp.data.data[index].examChildItemArray = resp2.data.data;
          })
        }

        this.examItemArray = resp.data.data;
      })
    },

    //添加考核项目
    addExamItem() {
      this.examItemArray.push(JSON.parse(JSON.stringify(this.examItem)));
    },

    //编辑考核项目
    editExamItem(index) {
      this.examItemArray[index].isExamineItem = false;
      this.examItemArray[index].isPercentage = false;
    },

    //保存考核项目
    saveExamItem(index) {
      if (!this.examItemArray[index].examineItem || !this.examItemArray[index].percentage) {
        this.$message({
          type: 'error',
          message: '考核项目和百分比为必填项！！！!'
        });
      } else {
        this.examItemArray[index].courseId = this.courseList[this.currentCourse].id;
        this.examItemArray[index].courseName = this.courseList[this.currentCourse].courseName;
        //添加
        if (!this.examItemArray[index].id) {
          api.post("/courseExam/courseExamineMethods", this.examItemArray[index], (resp) => { })
        }
        //修改
        else {
          api.put("/courseExam/courseExamineMethods", this.examItemArray[index], (resp) => { })
        }
        this.examItemArray[index].isExamineItem = true;
        this.examItemArray[index].isPercentage = true;
        setTimeout(() => {
          this.init();
        }, 1000);
      }
    },

    //删除考核项目
    delectExamItem(index) {
      if (!this.examItemArray[index].id) {
        //删除本地
        this.examItemArray.splice(index, 1);
      }
      else {
        //删除云端
        this.$confirm('是否提交 ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.del("/courseExam/courseExamineMethods/" + this.examItemArray[index].id, "", (resp) => {
            if (resp.data.flag) {
              this.$message({
                type: 'success',
                message: '成功!'
              });
              this.init();
            } else if (resp.status != 200) {
              this.$message({
                type: 'error',
                message: '失败!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },

    //添加考核子项目
    addExamChildItem(index) {
      this.examItemArray[index].examChildItemArray.push(JSON.parse(JSON.stringify(this.examChildItem)));
    },

    //编辑考核子项目
    editChildItem(index, childIndex) {
      this.examItemArray[index].examChildItemArray[childIndex].isExamineChildItem = false;
      this.examItemArray[index].examChildItemArray[childIndex].isChildPercentage = false;
      this.examItemArray[index].examChildItemArray[childIndex].isCourseTarget = false;
      this.examItemArray[index].examChildItemArray[childIndex].isIndicatorPointsDetail = false;
    },

    //保存考核子项目
    saveChildItem(index, childIndex) {
      if (!this.examItemArray[index].examChildItemArray[childIndex].examineChildItem || !this.examItemArray[index].examChildItemArray[childIndex].childPercentage) {
        this.$message({
          type: 'error',
          message: '考核项目和百分比为必填项！！！!'
        });
      } else {
        this.examItemArray[index].examChildItemArray[childIndex].isExamineChildItem = true;
        this.examItemArray[index].examChildItemArray[childIndex].isChildPercentage = true;
        this.examItemArray[index].examChildItemArray[childIndex].isCourseTarget = true;
        this.examItemArray[index].examChildItemArray[childIndex].isIndicatorPointsDetail = true;


        this.examItemArray[index].examChildItemArray[childIndex].courseTarget = JSON.stringify(this.examItemArray[index].examChildItemArray[childIndex].courseTarget);
        this.examItemArray[index].examChildItemArray[childIndex].indicatorPointsDetail = JSON.stringify(this.examItemArray[index].examChildItemArray[childIndex].indicatorPointsDetail);
        this.examItemArray[index].examChildItemArray[childIndex].courseExamineMethodsId = this.examItemArray[index].id;

        //添加
        if (!this.examItemArray[index].examChildItemArray[childIndex].id) {
          api.post("/courseExam/courseExamineChildMethods", this.examItemArray[index].examChildItemArray[childIndex], (resp) => {
            if (resp.data.flag) {
              this.$message({
                type: 'success',
                message: '成功!'
              });
            }
          })
        }
        //修改
        else {

        }
        this.examItemArray[index].examChildItemArray[childIndex].courseTarget = JSON.parse(this.examItemArray[index].examChildItemArray[childIndex].courseTarget);
        this.examItemArray[index].examChildItemArray[childIndex].indicatorPointsDetail = JSON.parse(this.examItemArray[index].examChildItemArray[childIndex].indicatorPointsDetail);

      }
    },

    deleteChildItem() {

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
      console.log(this.currentCourse);
      this.init();
    }

  },
  mounted() {
    this.getMessage();
    this.getcoursetableData();
  }
}
</script>

<style></style>
