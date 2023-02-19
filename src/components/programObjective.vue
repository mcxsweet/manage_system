<template>
  <el-container>
    <el-main>
      <el-table :data="tableData1" border style="width: 100%">
        <el-table-column prop="index" label="序号" width="90%">
          <template slot-scope="scope">
            <el-span v-model="scope.row.index">{{ '课程目标' + (scope.row.index + 1) + ':' }}</el-span>
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
            <el-select v-model="scope.row.indicatorPoints" multiple placeholder="请选择" v-show="scope.row.ised">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
            </el-select>
            <div v-for="(item2, index) in scope.row.evaluationMethod" :key="index" v-show="!scope.row.ised">
              <span>{{ item2 }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editta(scope.row, scope)">编辑</el-button>
            <el-button type="danger" size="mini" @click="saveta(scope.row)">保存</el-button>
            <el-button type="primary" size="mini" @click="delect(scope.row)">删除</el-button>
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


        ised: true
      },
      tableData1: [],
      options: [{
        value: '选项1',
        label: '指标的1'
      }, {
        value: '选项2',
        label: '指标的2'
      }, {
        value: '选项3',
        label: '指标的3'
      }, {
        value: '选项4',
        label: '指标的4'
      }, {
        value: '选项5',
        label: '指标的5'
      }],
      value1: [],
      value2: []
    }
  },
  methods: {
    editta(row, index) {
      row.ised = true;
    },
    saveta(row, index) {
      row.ised = false
      this.tableData1[row.index].indicatorPoints = JSON.stringify(this.tableData1[row.index].indicatorPoints);
      this.tableData1[row.index].evaluationMethod = JSON.stringify(this.tableData1[row.index].evaluationMethod);

      api.post("/courseInfo/courseTarget", this.tableData1[row.index], (resp) => {
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

      this.tableData1[row.index].indicatorPoints = JSON.parse(this.tableData1[row.index].indicatorPoints);
      this.tableData1[row.index].evaluationMethod = JSON.parse(this.tableData1[row.index].evaluationMethod);
    },
    delect(obj) {
      let j
      let index = this.tableData1.indexOf(obj);
      this.tableData1.splice(index, 1)
      for (let i = 0; i < this.tableData1.length; i++) {
        j = this.tableData1.indexOf(this.tableData1[i])
        this.tableData1[i].index = j
      }

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
}
</script>

<style></style>