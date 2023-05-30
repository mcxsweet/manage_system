<template>
  <el-container>

    <el-header style="background-color: #fff;height: 50px;">
      <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
        <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
          <span style="float: left">{{ item.courseName }}</span>
          <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">{{ item.termStart }}-{{
            item.termEnd }}.{{
    item.term }}</span>
        </el-option>
      </el-select>
      <el-button icon="el-icon-search" style="margin-right;: 10px"
        @click="getCurrentCourseExam()">确定</el-button>
      <el-button type="danger" v-show="isReturn" @click="goto('courseBasicInformation')">返回首页</el-button>
      <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
    </el-header>

    <el-main v-show="ischoose">
      
      <el-table :data="examItemArray" :border="true" style="width: 100%" default-expand-all="true"
        :header-cell-style="tableHeader">
        <el-table-column label="考核项目" width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.examineItem" placeholder="请选择" style="width:100%" allow-create="true" filterable="true"
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
        <el-table-column label="考核子项目" :v-if="reloadPage">
          <template slot-scope="scope1">
            <el-collapse>
              <el-collapse-item title=" 点击展开">
                <div>
                  <el-table :data="scope1.row.examChildItemArray" :stripe="true">
                    <el-table-column label="子项目名称" width="170">

                      <template slot-scope="scope2">
                        <el-input v-model="scope2.row.examineChildItem" v-show="!scope2.row.isExamineChildItem"></el-input>
                        <!-- <el-select v-model="scope2.row.examineChildItem" v-show="!scope2.row.isExamineChildItem"
                          placeholder="请选择" style="width:100%">
                          <el-option-group v-for="group in childOptions" :key="group.label" :label="group.label">
                            <el-option v-for="(op, index) in group.options" :key="index" :value="op.value"></el-option>
                          </el-option-group>
                        </el-select> -->
                        <p v-show="scope2.row.isExamineChildItem">{{ scope2.row.examineChildItem }}</p>
                      </template>
                    </el-table-column>

                    <el-table-column label="子项目百分比" width="150">
                      <template slot-scope="scope2">
                        <el-input type="number" v-model="scope2.row.childPercentage"
                          v-show="!scope2.row.isChildPercentage" :min="0" :max="100">
                          <template slot="append">%</template>
                        </el-input>
                        <p v-show="scope2.row.isChildPercentage">{{ scope2.row.childPercentage }} %</p>
                      </template>
                    </el-table-column>

                    <el-table-column label="对应课程目标" width="170">
                      <template slot-scope="scope2">
                        <el-select v-model="scope2.row.courseTarget" :multiple="true" v-show="!scope2.row.isCourseTarget">
                          <el-option v-for="item in courseTargetList" :key="item.id" :value="item.targetName">
                            <span style="float: left">{{ item.targetName }}</span>
                            <span style="margin-left: 1vh; float: left; color: #8492a6; font-size: 13px">
                              {{ item.courseTarget }}
                            </span>
                          </el-option>
                        </el-select>
                        <div v-for="(item, index) in scope2.row.courseTarget" :key="index"
                          v-show="scope2.row.isCourseTarget">
                          <span>{{ item }}</span>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column label="对应指标点" width="170">
                      <template slot-scope="scope2">
                        <el-select v-model="scope2.row.indicatorPointsDetail" :multiple="true"
                          v-show="!scope2.row.isIndicatorPointsDetail">
                          <el-option v-for="item in indicators" :key="item" :value="item">

                            <!-- <el-option v-for="item in indicators" :key="item.id" :value="item.indicatorName">
                            <span style="float: left">{{ item.indicatorName }}</span>
                            <span style="margin-left: 1vh; float: left; color: #8492a6; font-size: 13px">
                              {{ item.indicatorContent }}
                            </span> -->
                          </el-option>
                        </el-select>
                        <div v-for="(item, index) in scope2.row.indicatorPointsDetail" :key="index"
                          v-show="scope2.row.isIndicatorPointsDetail">
                          <span>{{ item }}</span>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column label="子项目操作" width="220">
                      <template slot-scope="scope2">
                        <el-tooltip content="编辑" placement="bottom" effect="light">
                          <el-button type="primary" icon="el-icon-edit" :circle="true"
                            @click="editChildItem(scope1.$index, scope2.$index)"></el-button>
                        </el-tooltip>

                        <el-tooltip content="保存" placement="bottom" effect="light">
                          <el-button type="success" icon="el-icon-check" :circle="true"
                            @click="saveChildItem(scope1.$index, scope2.$index)"></el-button>
                        </el-tooltip>

                        <el-tooltip content="删除" placement="bottom" effect="light">
                          <el-button type="danger" icon="el-icon-delete" :circle="true"
                            @click="deleteChildItem(scope1.$index, scope2.$index)"></el-button>
                        </el-tooltip>

                      </template>
                    </el-table-column>
                  </el-table>

                  <el-tooltip content="添加子项目" placement="bottom" effect="light">
                    <el-button type="primary" icon="el-icon-plus" :circle="true" v-show="examItemArray[index2].isbuttonshow"
                      @click="addExamChildItem(scope1.row, scope1.$index)"></el-button>
                      
                  </el-tooltip>

                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editExamItem(scope.$index)">编辑</el-button>
            <el-button type="success" size="mini" @click="saveExamItem(scope.$index)">保存</el-button>
            <el-button type="danger" size="mini" @click="delectExamItem(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button icon="el-icon-plus" type="primary" @click="addExamItem()">添加考核方式</el-button>
      <el-divider></el-divider>
      <!-- <div style="margin-top: 5%;">
        <h1>考核评定法: 期末总成绩=<span v-for="(a, index) in examItemArray" :key="index"><span v-if="index != 0">+</span>{{
          a.examineItem + '(' + a.percentage + '%)' }} </span> </h1>
        <h1 v-for="(b, index) in examItemArray" :key="index">{{ b.examineItem + '=' }}<span
            v-for="(ch, index1) in b.examChildItemArray" :key="index1"><span v-if="index1 != 0">+</span>{{
              ch.examineChildItem + '(' + ch.childPercentage + '%)' }}</span></h1>
      </div> -->
    </el-main>

  </el-container>
</template>

<script>
import api from '@/api/api'

export default {
  name: "basicInformationTable",
  data() {
    return {
      addid:0,
      index2:0,
      //选择课程后再显示界面
      ischoose: false,
      //当前选择课程索引
      currentCourse: "",
      //当前课程id
      currentId: "",
      //课程列表(后端获取)
      courseList: [],
      //当前课程目标
      courseTargetList: [],
      //当前指标点
      indicators: [],

      //课程考试项目
      examItemArray: [],

      text: '',

      //实例对象
      examItem: {
        //考核项目名
        examineItem: "",
        childoptionId: 0, //用于区别子项目选项
        isExamineItem: false,

        //考核项目百分比
        percentage: "",
        isPercentage: false,
        isbuttonshow:false,
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
        isIndicatorPointsDetail: false,
        isReturn: false, //返回课程基本信息页面
      },

      reloadPage: true,
    }
  },
  methods: {
    //表头字体居中
    tableHeader({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },

    focusOnSelect() {
      this.examItemArray = [];
      this.ischoose = false;
      this.currentId = "";
    },
    //初始化表格数据
    init() {
      if (this.currentId) {
        this.addid = this.currentId*1
        //获取课程目标
        this.getCurrentCourseTarget(this.currentId);
        this.getIndicators(this.currentId);
        //获取表单数据
        api.get("/courseExam/courseExamineMethods/" + this.currentId, "", (resp) => {
          console.log(resp.data.data)
          for (let index = 0; index < resp.data.data.length; index++) {
            resp.data.data[index].isExamineItem = true;
            resp.data.data[index].isPercentage = true;
            resp.data.data[index].isbuttonshow = false
            api.get("/courseExam/courseExamineChildMethods/" + resp.data.data[index].id, "", (resp2) => {
              for (let j = 0; j < resp2.data.data.length; j++) {
                resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
                resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);

                resp2.data.data[j].isExamineChildItem = true;
                resp2.data.data[j].isChildPercentage = true;
                resp2.data.data[j].isCourseTarget = true;
                resp2.data.data[j].isIndicatorPointsDetail = true;
              }
              resp.data.data[index].examChildItemArray = resp2.data.data;
            })
          }
          this.currentCourse = this.$route.query.name;
          this.examItemArray = resp.data.data;
        })
      } else {
        this.addid = this.courseList[this.currentCourse].id*1
        this.getCurrentCourseTarget(this.courseList[this.currentCourse].id);
        this.getIndicators(this.courseList[this.currentCourse].id);

        api.get("/courseExam/courseExamineMethods/" + this.courseList[this.currentCourse].id, "", (resp) => {
          for (let index = 0; index < resp.data.data.length; index++) {
            resp.data.data[index].isExamineItem = true;
            resp.data.data[index].isPercentage = true;
            api.get("/courseExam/courseExamineChildMethods/" + resp.data.data[index].id, "", (resp2) => {
              for (let j = 0; j < resp2.data.data.length; j++) {
                resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
                resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);

                resp2.data.data[j].isExamineChildItem = true;
                resp2.data.data[j].isChildPercentage = true;
                resp2.data.data[j].isCourseTarget = true;
                resp2.data.data[j].isIndicatorPointsDetail = true;
              }
              resp.data.data[index].examChildItemArray = resp2.data.data;
            })
          }
          this.examItemArray = resp.data.data;
        })
      }
    },
    //添加考核项目
    addExamItem() {
      this.examItemArray.push(JSON.parse(JSON.stringify(this.examItem)));
    },
    //编辑考核项目
    editExamItem(index) {
      this.examItemArray[index].isbuttonshow = true;
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

        this.examItemArray[index].itemScore = 100;

        if (this.currentId) {
          this.examItemArray[index].courseId = this.currentId;
          this.examItemArray[index].courseName = this.currentCourse;
        } else {
          this.examItemArray[index].courseId = this.courseList[this.currentCourse].id;
          this.examItemArray[index].courseName = this.courseList[this.currentCourse].courseName;
        }
        //添加
        if (!this.examItemArray[index].id) {
          api.post("/courseExam/courseExamineMethods", this.examItemArray[index], (resp) => {
            console.log(resp.data.data)
            if (resp.data.flag) {
              api.get("/courseExam/courseExamineMethods/" + this.addid, "", (resp2) => {
                this.examItemArray[index].id = resp2.data.data[index].id
              })
              if (resp.data.flag) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
          } else {
            this.$message({
              type: 'error',
              message: '添加失败!'
            });
          }
            }
          })
        }
        //修改
        else {
          api.put("/courseExam/courseExamineMethods", this.examItemArray[index], (resp) => {
              if(resp.data.flag){
                this.$message({
                  type:'success',
                  message:'修改成功'
                })
              }
              else{
                this.$message({
                  type:'error',
                  message:'修改失败'
                })
              }
           })
        }
        this.examItemArray[index].isExamineItem = true;
        this.examItemArray[index].isPercentage = true;
        this.examItemArray[index].isbuttonshow = false;
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
                message: '删除成功!'
              });
              this.examItemArray.splice(index, 1);
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
      }
    },

    //添加考核子项目
    addExamChildItem(obj, index) {
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
      }else if(!this.examItemArray[index].id){
        this.$message({
          type:'error',
          message:'请先保存考核项目！'
        })
        this.examItemArray[index].examChildItemArray.splice(childIndex, 1);
      }
       else {
        this.examItemArray[index].examChildItemArray[childIndex].isExamineChildItem = true;
        this.examItemArray[index].examChildItemArray[childIndex].isChildPercentage = true;
        this.examItemArray[index].examChildItemArray[childIndex].isCourseTarget = true;
        this.examItemArray[index].examChildItemArray[childIndex].isIndicatorPointsDetail = true;

        this.examItemArray[index].examChildItemArray[childIndex].childScore = 100;
        this.examItemArray[index].examChildItemArray[childIndex].courseTarget = JSON.stringify(this.examItemArray[index].examChildItemArray[childIndex].courseTarget);
        this.examItemArray[index].examChildItemArray[childIndex].indicatorPointsDetail = JSON.stringify(this.examItemArray[index].examChildItemArray[childIndex].indicatorPointsDetail);
        this.examItemArray[index].examChildItemArray[childIndex].courseExamineMethodsId = this.examItemArray[index].id;
        //添加
        if (!this.examItemArray[index].examChildItemArray[childIndex].id) {
          api.post("/courseExam/courseExamineChildMethods", this.examItemArray[index].examChildItemArray[childIndex], (resp) => {
            if (resp.data.flag) {
              api.get("/courseExam/courseExamineChildMethods/" + this.examItemArray[index].id, "", (resp1) => {
                this.examItemArray[index].examChildItemArray[childIndex].id = resp1.data.data[childIndex].id
              })  
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
            }
          })
        }
        //修改
        else {
          api.put("/courseExam/courseExamineChildMethods", this.examItemArray[index].examChildItemArray[childIndex], (resp) => {
            if (resp.data.flag) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            }
          })
        }
        this.examItemArray[index].examChildItemArray[childIndex].courseTarget = JSON.parse(this.examItemArray[index].examChildItemArray[childIndex].courseTarget);
        this.examItemArray[index].examChildItemArray[childIndex].indicatorPointsDetail = JSON.parse(this.examItemArray[index].examChildItemArray[childIndex].indicatorPointsDetail);

      }
    },

    //删除考核子项目
    deleteChildItem(index, childIndex) {
      var id = this.examItemArray[index].examChildItemArray[childIndex].id;
      if (!id) {
        //删除本地
        this.examItemArray[index].examChildItemArray.splice(childIndex, 1);
      }
      else {
        //删除云端
        this.$confirm('是否提交 ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.del("/courseExam/courseExamineChildMethods/" + id, "", (resp) => {
            if (resp.data.flag) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.examItemArray[index].examChildItemArray.splice(childIndex, 1);
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
      }
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

    goto(url, data) {
      this.$router.push({
        path: '/MainPage/' + url
      });
    },

    //获取当前课程的课程目标
    getCurrentCourseTarget(currentId) {
      api.get("/courseInfo/courseTarget/" + currentId, "", (resp) => {
        if (resp.data.flag) {
          this.courseTargetList = resp.data.data;
        }
      })
    },

    //获取指标点列表
    getIndicators(id) {
      api.get("/courseInfo/" + id, "", (resp) => {
        this.indicators = JSON.parse(resp.data.data.indicatorPoints);
      })
    },

    //relode
    forcePage() {
      this.reloadPage = false;
      // this.$nextTick(this.reloadPage = false)
      setTimeout(() => {
        this.reloadPage = true;
      }, 100);
    }

  },
  mounted() {
    this.$set(this.examItemArray, "examChildItemArray", []);

    this.getMessage();
    if (this.$route.query.id) {
      this.isReturn = true
      this.currentId = this.$route.query.id;
      this.getCurrentCourseExam();
    }
    this.forcePage();
  },
}
</script>

<style></style>
