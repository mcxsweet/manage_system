<template>
  <el-container>
      <el-header style="background-color: #fff;height: 50px;">
          <el-row>
              <el-button plain @click="isShow = !isShow">添加</el-button>
              <el-button type="danger" plain>删除</el-button>
              <el-button type="success" plain @click="hunt">搜索</el-button>
              <input type="text" plain placeholder="请输入搜索内容" class="sousuo" v-model="sousuo">
          </el-row>
      </el-header>

      <el-main>
          <el-table :data="tableData" stripe height="73vh" border="true">
              <el-table-column align="left" width="300">
                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" round
                          @click="goto('classInformation', scope.row.id)">设置</el-button>
                      <el-button size="mini" type="info" @click="handleExport(scope.$index, scope.row)">导出</el-button>
                      <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                  </template>
              </el-table-column>
              <el-table-column prop="courseName" label="课程名称" width="200">
              </el-table-column>
              <el-table-column prop="theoreticalHours" label="理论学时" width="100">
              </el-table-column>
              <el-table-column prop="labHours" label="实验学时" width="100">
              </el-table-column>
              <el-table-column prop="className" label="班级名称" width="200">
              </el-table-column>
              <el-table-column label="学期" width="140">
                  <template slot-scope="scope">
                      {{ scope.row.termStart }}-{{ scope.row.termEnd }}.{{ scope.row.term }}
                  </template>
              </el-table-column>
              <el-table-column prop="studentsNum" label="学生人数" width="100">
              </el-table-column>
              <el-table-column prop="courseNature" label="课程性质" width="140">
              </el-table-column>
              <el-table-column prop="courseType" label="课程类别" width="140">
              </el-table-column>
          </el-table>
      </el-main>

      <!-- 添加弹出框 -->
      <el-dialog title="添加" :visible.sync="isShow">
          <el-form :model="FormData" label-width="100px" class="demo-ruleForm">
              <el-form-item label="课程名称" prop="courseName">
                  <el-input v-model="FormData.courseName"></el-input>
              </el-form-item>
              <el-form-item label="任课教师" prop="classroomTeacher">
                  <el-input v-model="FormData.classroomTeacher"></el-input>
              </el-form-item>
              <el-form-item label="理论学时" prop="theoreticalHours">
                  <el-input v-model="FormData.theoreticalHours"></el-input>
              </el-form-item>
              <el-form-item label="实验学时" prop="labHours">
                  <el-input v-model="FormData.labHours"></el-input>
              </el-form-item>
              <el-form-item label="班级名称" prop="className">
                  <el-input v-model="FormData.className"></el-input>
              </el-form-item>
              <el-form-item label="学期" prop="term">
                  <!-- <el-input v-model="FormData.term"></el-input> -->
                  <el-select v-model="FormData.termStart" placeholder="请选择" style="width: 12vh;">
                      <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                      </el-option>
                  </el-select>
                  <span style="margin-left: 1vh;margin-right: 1vh;">至</span>
                  <el-select v-model="FormData.termEnd" placeholder="请选择" style="width: 12vh;">
                      <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                      </el-option>
                  </el-select>
                  <span style="margin-left: 1vh;margin-right: 1vh;"></span>
                  <el-select v-model="FormData.term" placeholder="请选择课程性质">
                      <el-option label="第一学期" value="1"></el-option>
                      <el-option label="第二学期" value="2"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="学生人数" prop="studentsNum">
                  <el-input v-model="FormData.studentsNum"></el-input>
              </el-form-item>
              <el-form-item label="课程性质" prop="courseNature">
                  <el-select v-model="FormData.courseNature" placeholder="请选择课程性质">
                      <el-option label="必修" value="必修"></el-option>
                      <el-option label="选修" value="选修"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="课程类别" prop="courseType">
                  <el-input v-model="FormData.courseType"></el-input>
              </el-form-item>
              <el-form-item label="课程目标数量" prop="courseTargetNum">
                  <el-input v-model="FormData.courseTargetNum"></el-input>
              </el-form-item>
              <el-form-item label="指标点数量" prop="indicatorPointsNum">
                  <el-input v-model="FormData.indicatorPointsNum"></el-input>
              </el-form-item>
              <el-form-item label="指标点编号" prop="indicatorPoints">
                  <!-- <el-input v-model="FormData.indicatorPoints"></el-input> -->
                  <el-select v-model="FormData.indicatorPoints" filterable multiple placeholder="请选择指标点"
                      style="width:100% ;" :multiple-limit="FormData.indicatorPointsNum">
                      <el-option v-for="item in indicators" :key="item.indicatorName" :label="item.indicatorName"
                          :value="item.indicatorName">
                      </el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="isShow = false">取 消</el-button>
              <el-button type="primary" @click="submit">确 定</el-button>
          </div>
      </el-dialog>

      <el-footer>
          <span>总共有{{ tableData.length }}条课程</span>
      </el-footer>
  </el-container>
</template>

<script>
import api from '@/api/api'
export default {
  name: "sudoInformationTable", //系主任
  data() {
      return {
          tableData: [],
          FormData: {},
          isShow: false,
          sousuo: '',
          indicators: [1, 2, 3],
          DataOptions: []
      }
  },
  methods: {
      initDataOptions() {
          for (let i = 0; i < 10; i++) {
              this.DataOptions.push(new Date().getFullYear() - 3 + i);
          }
      },

      goto(url, data) {
          this.$router.push({
              path: '/MainPage/' + url,
              query: {
                  id: data
              }
          });
      },
      //点击搜索内容
      hunt() {
          setTimeout(() => {
              this.$router.push({ path: '/welcome' });
          }, 2000);
      },
      getMessage() {

          api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
              this.tableData = resp.data.data;
          })
      },
      handleExport(index, object) {
          window.location.href = "http://localhost:8080/courseInfo/export/" + object.id;
      },
      handleSetting(index, object) {
          classdata: [] = object;
          this.$emit('childClick', classdata);
          this.$bus.$emit("sendCourseID", object.id);
      },

      //删除
      handleDelete(item) {
          this.$confirm('是否删除 ?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              api.del("/courseInfo", item, (resp) => {
                  if (resp.data.flag) {
                      this.$message({
                          type: 'success',
                          message: '删除成功!'
                      });
                      this.getMessage();
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
      //提交
      submit() {
          this.$confirm('是否提交 ?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.isShow = !this.isShow;
              this.FormData.teacherId = localStorage.getItem("UserId");

              this.FormData.indicatorPoints = JSON.stringify(this.FormData.indicatorPoints);

              api.post("/courseInfo", this.FormData, (resp) => {
                  if (resp.data.flag) {
                      this.$message({
                          type: 'success',
                          message: '添加成功!'
                      });
                      this.getMessage();
                  } else if (resp.status != 200) {
                      this.$message({
                          type: 'error',
                          message: '添加失败!'
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

      //获取指标点列表
      getIndicators() {
          api.get("/courseInfo/indicators", "", (resp) => {
              this.indicators = resp.data.data;
          })
      }
  },
  mounted() {
      this.getIndicators();
      this.getMessage();
      this.initDataOptions();
      this.FormData.classroomTeacher = localStorage.getItem("name");
  },
}
</script>

<style>
.sousuo {
  padding: 10px;
  margin: 20px;
  width: 300px;
}
</style>