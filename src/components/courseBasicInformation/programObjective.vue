<template>
  <el-container>
    <el-main>
      <el-table :data="tableData1" border style="width: 100%">
        <el-table-column prop="index" label="序号" width="100%">
          <template slot-scope="scope">
            <span>课程目标{{ scope.$index+1 }}：</span>
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
            <el-select v-model="scope.row.evaluationMethod" multiple placeholder="评价依据" v-show="scope.row.ised">
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
            <el-button type="danger" size="mini" @click="delect(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-button icon="el-icon-plus" type="primary" @click="add">添加课程目标</el-button>
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
      id:"",
      tableData1: [],
      indicators: [],
      value1: [],
      value2: []
    }
  },
  methods: {
    //初始化表格
    init() {
      api.get("/courseInfo/courseTarget/" + this.obj.courseId, "", (resp) => {
        for (let index = 0; index < resp.data.data.length; index++) {
          resp.data.data[index].indicatorPoints = JSON.parse(resp.data.data[index].indicatorPoints);
          resp.data.data[index].evaluationMethod = JSON.parse(resp.data.data[index].evaluationMethod);
          // this.tableData1[index] = resp.data.data[index];
          resp.data.data[index].index = index;
          resp.data.data[index].ised = false;
        }
        this.tableData1 = resp.data.data;
      })
      this.getIndicators();
    },

    //获取指标点列表
    getIndicators() {
      api.get("/courseInfo/"+this.id, "", (resp) => {
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
      
      if (row.id == null) {
        api.post("/courseInfo/courseTarget", this.tableData1[row.index], (resp) => {

          console.log(resp.data.flag)
          if (resp.data.flag) {
            this.$message({
              type: 'success',
              message: '成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '失败!'
            });
          }
        })
      } else {
        api.put("/courseInfo/courseTarget", this.tableData1[row.index], (resp) => {
          if (resp.data.flag) {
            this.$message({
              type: 'success',
              message: '成功!'
            });
            this.init();
          } else {
            this.$message({
              type: 'error',
              message: '失败!'
            });
          }
        })
      }

      this.tableData1[row.index].indicatorPoints = JSON.parse(this.tableData1[row.index].indicatorPoints);
      this.tableData1[row.index].evaluationMethod = JSON.parse(this.tableData1[row.index].evaluationMethod);
    },
    delect(obj,index) {
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
            this.tableData1.splice(index,1);
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
      this.obj.index = this.tableData1.length
      this.tableData1.push(JSON.parse(JSON.stringify(this.obj)))
    }
  },
  created() {
    this.obj.courseId = this.$route.query.courseId;
    this.obj.courseName = this.$route.query.courseName;
  },
  mounted() {
    this.id = this.$route.query.courseId
    this.init();
  },
}
</script>

<style></style>