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
      <el-table :data="examItemArray" class="table" :border="true" style="width: 100%" default-expand-all="true"
        :header-cell-style="tableHeader">


        <el-table-column label="考核项目" width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.examineItem" placeholder="请选择" style="width:100%" allow-create="true"
              filterable="true" v-show="!scope.row.isExamineItem">
              <el-option value="平时考核成绩"></el-option>
              <el-option value="实验考核成绩"></el-option>
              <el-option value="期末考核成绩"></el-option>
            </el-select>
            <p class="MyButton" v-show="scope.row.isExamineItem">{{ scope.row.examineItem }}</p>
          </template>
        </el-table-column>

        <el-table-column label="项目百分比" width="150">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <el-input type="number" v-model="scope.row.percentage" v-show="!scope.row.isPercentage">
                <template slot="append">%</template>
              </el-input>
              <!-- <el-tag type="danger" style="font-weight: 200px" v-show="scope.row.isPercentage">
                {{ scope.row.percentage }} %
              </el-tag> -->
              <p class="MyButton" v-show="scope.row.isPercentage">{{ scope.row.percentage }} %</p>
            </div>
          </template>
        </el-table-column>

        <!-- 考核子项目 -->
        <el-table-column label="考核子项目">
          <template slot-scope="scope1">
            <div style="text-align: center;">
              <el-button @click="getChildItem(scope1.row)" type="success" plain round>查看详情</el-button>
            </div>
            <!-- <el-collapse>
              <el-collapse-item disabled>
                <template slot="title">
                  <p @click="(scope1.row, scope1.$index)" style="width: 100%;text-align: center;color: green;">点击展开
                  </p>
                </template>
                <div>
                  <el-table :data="scope1.row.examChildItemArray" :stripe="true">
                    <el-table-column label="子项目名称" width="170">

                      <template slot-scope="scope2">
                        <el-input v-model="scope2.row.examineChildItem"
                          v-show="!scope2.row.isExamineChildItem"></el-input>
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
                    <el-button type="primary" icon="el-icon-plus" :circle="true" v-show="scope1.row.isbuttonshow"
                      @click="addExamChildItem(scope1.row, scope1.$index)"></el-button>

                  </el-tooltip>

                </div>
              </el-collapse-item>
            </el-collapse> -->
          </template>
        </el-table-column>


        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click="editExamItem(scope.$index)">编辑</el-button>
            <el-button type="success" @click="saveExamItem(scope.$index)">保存</el-button>
            <el-button type="danger" @click="delectExamItem(scope.$index)">删除</el-button>
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

    <el-dialog :title="itemTitle" v-if="itemShow" :visible.sync="itemShow" width="50%" append-to-body>
      <div>
        <el-table :data="itemArrary" :stripe="true">
          <el-table-column label="子项目名称">
            <template slot-scope="scope2">
              <el-input v-model="scope2.row.examineChildItem" v-show="!scope2.row.isExamineChildItem"></el-input>
              <p v-show="scope2.row.isExamineChildItem">{{ scope2.row.examineChildItem }}</p>
            </template>
          </el-table-column>

          <el-table-column label="子项目百分比" width="150">
            <template slot-scope="scope2">
              <el-input type="number" v-model="scope2.row.childPercentage" v-show="!scope2.row.isChildPercentage" :min="0"
                :max="100">
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
              <div v-for="(item, index) in scope2.row.courseTarget" :key="index" v-show="scope2.row.isCourseTarget">
                <span>{{ item }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="对应指标点" width="170">
            <template slot-scope="scope2">
              <el-select v-model="scope2.row.indicatorPointsDetail" :multiple="true"
                v-show="!scope2.row.isIndicatorPointsDetail">
                <el-option v-for="item in indicators" :key="item" :value="item">
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
                  @click="editChildItem(scope2.$index)"></el-button>
              </el-tooltip>

              <el-tooltip content="保存" placement="bottom" effect="light">
                <el-button type="success" icon="el-icon-check" :circle="true"
                  @click="saveChildItem(scope2.$index)"></el-button>
              </el-tooltip>

              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button type="danger" icon="el-icon-delete" :circle="true"
                  @click="deleteChildItem(scope2.$index)"></el-button>
              </el-tooltip>

            </template>
          </el-table-column>
        </el-table>

        <el-tooltip content="添加子项目" placement="bottom" effect="light">
          <el-button type="primary" icon="el-icon-plus" :circle="true" @click="addExamChildItem()"></el-button>
        </el-tooltip>

      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import api from '@/api/api'

export default {
  name: "basicInformationTable",
  data() {
    return {
      addid: 0,
      getId:"",//localstrage中的courseID
      index2: 0,
      isadmin: 0,
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
        isbuttonshow: false,
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

      //子项目弹窗
      itemTitle: "",
      examItemId: "",
      itemShow: false,
      itemArrary: [],
    }
  },
  methods: {
    //表头字体居中
    tableHeader({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    getChildItem(data) {
      this.itemArrary = [];
      this.itemTitle = data.examineItem + " 设置"
      this.examItemId = data.id;
      api.get("/courseExam/courseExamineChildMethods/" + data.id, "", (resp2) => {
        for (let j = 0; j < resp2.data.data.length; j++) {
          resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
          resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);

          resp2.data.data[j].isExamineChildItem = true;
          resp2.data.data[j].isChildPercentage = true;
          resp2.data.data[j].isCourseTarget = true;
          resp2.data.data[j].isIndicatorPointsDetail = true;
        }
        this.itemArrary = resp2.data.data;
      })
      this.itemShow = true;
    },

    focusOnSelect() {
      this.examItemArray = [];
      this.ischoose = false;
      this.currentId = "";
      this.getId = "";
    },
    //初始化表格数据
    init() {
      if (this.currentId) {
        this.addid = this.currentId * 1
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
          }
          this.currentCourse = this.$route.query.name;
          this.examItemArray = resp.data.data;
        })
      } else if(this.getId == "") {
        this.addid = this.courseList[this.currentCourse].id * 1
        this.getCurrentCourseTarget(this.courseList[this.currentCourse].id);
        this.getIndicators(this.courseList[this.currentCourse].id);

        api.get("/courseExam/courseExamineMethods/" + this.courseList[this.currentCourse].id, "", (resp) => {
          for (let index = 0; index < resp.data.data.length; index++) {
            resp.data.data[index].isExamineItem = true;
            resp.data.data[index].isPercentage = true;
          }
          this.examItemArray = resp.data.data;
        })
      }
      else if(this.getId != "") {
        this.addid = this.getId * 1
        this.getCurrentCourseTarget(this.getId);
        this.getIndicators(this.getId);
        api.get("/courseInfo/"+this.getId,"",(resp1)=>{
            this.currentCourse = resp1.data.data.courseName;
          })
        api.get("/courseExam/courseExamineMethods/" + this.getId, "", (resp) => {
          for (let index = 0; index < resp.data.data.length; index++) {
            resp.data.data[index].isExamineItem = true;
            resp.data.data[index].isPercentage = true;
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
            if (resp.data.flag) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
            else {
              this.$message({
                type: 'error',
                message: '修改失败'
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
      this.itemArrary.push(JSON.parse(JSON.stringify(this.examChildItem)));
    },

    //编辑考核子项目
    editChildItem(index) {
      this.itemArrary[index].isExamineChildItem = false;
      this.itemArrary[index].isChildPercentage = false;
      this.itemArrary[index].isCourseTarget = false;
      this.itemArrary[index].isIndicatorPointsDetail = false;
    },

    //保存考核子项目
    saveChildItem(index) {
      if (!this.itemArrary[index].examineChildItem || !this.itemArrary[index].childPercentage) {
        this.$message({
          type: 'error',
          message: '考核项目和百分比为必填项！！！!'
        });
      } else {
        this.itemArrary[index].isExamineChildItem = true;
        this.itemArrary[index].isChildPercentage = true;
        this.itemArrary[index].isCourseTarget = true;
        this.itemArrary[index].isIndicatorPointsDetail = true;

        this.itemArrary[index].childScore = 100;
        this.itemArrary[index].courseTarget = JSON.stringify(this.itemArrary[index].courseTarget);
        this.itemArrary[index].indicatorPointsDetail = JSON.stringify(this.itemArrary[index].indicatorPointsDetail);

        //添加
        if (!this.itemArrary[index].id) {
          this.itemArrary[index].courseExamineMethodsId = this.examItemId;
          api.post("/courseExam/courseExamineChildMethods", this.itemArrary[index], (resp) => {
            if (resp.data.flag) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              this.itemArrary[index].id = resp.data.data;
            }
          })
        }
        //修改
        else {
          api.put("/courseExam/courseExamineChildMethods", this.itemArrary[index], (resp) => {
            if (resp.data.flag) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            }
          })
        }
        this.itemArrary[index].courseTarget = JSON.parse(this.itemArrary[index].courseTarget);
        this.itemArrary[index].indicatorPointsDetail = JSON.parse(this.itemArrary[index].indicatorPointsDetail);
      }
    },

    //删除考核子项目
    deleteChildItem(index) {
      var id = this.itemArrary[index].id;
      if (!id) {
        //删除本地
        this.itemArrary.splice(index, 1);
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
              this.itemArrary.splice(index, 1);
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
      this.init();
      if(this.getId==""){
        localStorage.setItem('courseId',this.courseList[this.currentCourse].id);
      }
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
  },
  mounted() {
    this.isadmin = localStorage.getItem('Isadmin');
    this.getId = localStorage.getItem('courseId');
    if(this.getId !=""){
      this.ischoose = true;
      this.init();
    }
    this.getMessage();
    if (this.$route.query.id) {
      localStorage.setItem('courseId',this.$route.query.id);
      this.getId = localStorage.getItem('courseId');
      this.isReturn = true
      this.currentId = this.$route.query.id;
      this.getCurrentCourseExam();
    }
  },
}
</script>

<style src="@/style/tableStyle.css"></style>

