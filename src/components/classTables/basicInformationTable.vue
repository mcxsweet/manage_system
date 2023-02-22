<template>
  <el-container>
    <p style="margin-top: 20px;margin-left: 20px;">请先选择课程</p>
    <el-header style="background-color: #fff;height: 50px;">
      <el-select v-model="currentCourse" placeholder="请先选择课程" @focus="ischoose = false" @change="getCurrentCourseExam()">
        <el-option v-for="item in courseList" :key="item.id" :label="item.courseName" :value="item.id">
        </el-option>
      </el-select>
    </el-header>

    <el-main v-show="ischoose">
      <el-table :data="tableData1" border="true" style="width: 1284px" default-expand-all="true">
        <el-table-column prop="name2" label="考核项目" width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.name2" placeholder="请选择" style="width:100%" v-show="scope.row.ised1">
              <el-option value="平时考核成绩"></el-option>
              <el-option value="实验考核成绩"></el-option>
              <el-option value="期末考核成绩"></el-option>
            </el-select>
            <p v-show="!scope.row.ised1">{{ scope.row.name2 }}</p>
          </template>
        </el-table-column>

        <el-table-column prop="number2" label="项目百分比" width="170">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.number2" :min="0" :max="100" style="width:140px"
              v-show="scope.row.ised1"></el-input-number>
            <p v-show="!scope.row.ised1">{{ scope.row.number2 + '%' }}</p>
          </template>
        </el-table-column>

        <el-table-column label="考核子项目" width="280">
          <template slot-scope="scope">
            <el-select v-model="scope.row.childData" multiple placeholder="请选择" style="width:50%" v-show="scope.row.ised2"
              ref="ad">
              <el-option value="项目1"></el-option>
              <el-option value="项目2"></el-option>
              <el-option value="项目3"></el-option>
              <el-option value="项目4"></el-option>
            </el-select>
            <div v-for="(i, index) in scope.row.childData" :key="index" v-show="!scope.row.ised2">
              <span style="width: 100px;" boder>{{ i + ":" }}</span>
            </div>
            <el-button icon="el-icon-plus" type="success" @click="addChild(scope.row, index)"
              v-show="scope.row.ised2">确定</el-button>
            <el-button icon="el-icon-plus" type="success" @click="setChild(scope.row, index)"
              v-show="!scope.row.ised2">设置</el-button>
            <!-- <el-button icon="el-icon-plus" type="success" @click="saveChild" flex="right" >设置</el-button>            -->
          </template>

        </el-table-column>
        <el-table-column label="课程子目标百分比" width="193">
          <template slot-scope="scope">
            <div v-for="(k, index) in scope.row.childnum" :key="index" v-show="!scope.row.ised3">
              <el-input-number v-model="k.cnum"></el-input-number>
            </div>
            <div v-show="scope.row.ised3" v-for="(j, index) in scope.row.childnum" :key="index">
              <p>{{ j.cnum + '%' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="classData.className" width="170">
          <template slot-scope="scope">
            <div v-for="(c, index) in scope.row.isclass" :key="index" v-show="!scope.row.ised3">
              <el-checkbox type="name" v-model="c.isClass" size="medium" style="margin-top:10px"
                border="true"></el-checkbox>
            </div>
            <div v-show="scope.row.ised3" v-for="(a, index) in scope.row.isclass" :key="index">
              <i class="el-icon-check" v-show="!a.ised3"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editta(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="saveta(scope.row)">保存</el-button>
            <el-button type="primary" size="mini" @click="delect(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button icon="el-icon-plus" type="primary" @click="add">添加考核方式</el-button>

      <!-- <el-divider></el-divider> -->
      <!-- <div style="margin-top: 5%;" v-show="isdiv4">
        <p1>成绩评定法：期末总成绩=</p1>
        <p1 v-if="scorelen > 1">{{ this.score[0] }}</p1>
        <p1 v-if="scorelen > 1">{{ '(' + this.score[scorelen / 2] + '%)' }}</p1>
        <p1 v-if="scorelen > 3">+</p1>
        <p1 v-if="scorelen > 3">{{ this.score[1] }}</p1>
        <p1 v-if="scorelen > 3">{{ '(' + this.score[scorelen / 2 + 1] + '%)' }}</p1>
        <p1 v-if="scorelen > 5">+</p1>
        <p1 v-if="scorelen > 5">{{ this.score[2] }}</p1>
        <p1 v-if="scorelen > 5">{{ '(' + this.score[scorelen / 2 + 2] + '%)' }}</p1>
        <div>
          <p1 v-if="Usuallen > 1">平时成绩=</p1>
          <p1 v-if="Usuallen > 1">{{ this.Usual[0] }}</p1>
          <p1 v-if="Usuallen > 1">{{ '(' + this.Usual[Usuallen / 2] + '%)' }}</p1>
          <p1 v-if="Usuallen > 3">+</p1>
          <p1 v-if="Usuallen > 3">{{ this.Usual[1] }}</p1>
          <p1 v-if="Usuallen > 3">{{ '(' + this.Usual[Usuallen / 2 + 1] + '%)' }}</p1>
          <p1 v-if="Usuallen > 5">+</p1>
          <p1 v-if="Usuallen > 5">{{ this.Usual[2] }}</p1>
          <p1 v-if="Usuallen > 5">{{ '(' + this.Usual[Usuallen / 2 + 2] + '%)' }}</p1>
          <p1 v-if="Usuallen > 7">+</p1>
          <p1 v-if="Usuallen > 7">{{ this.Usual[3] }}</p1>
          <p1 v-if="Usuallen > 7">{{ '(' + this.Usual[Usuallen / 2 + 3] + '%)' }}</p1>
        </div>
        <el-button @click="isdiv4 = !isdiv4">设置</el-button>
      </div> -->

      <!-- <div v-show="!isdiv4">
        <el-form style="margin-top: 5%;">
          <span>成绩评定法：</span>
          <el-form-item label="期末总成绩:" v-show="isdiv1">
            <el-select v-model="score" size="mini" multiple placeholder="请选择">
              <el-option v-for="(i, index) in totalScore[0]" :key="index" :value="i[0].resultName"></el-option>
            </el-select>
            <el-button size="mini" @click="savaoption(score)">确定</el-button>
          </el-form-item>
          <div v-show="isdiv2">
            <el-form-item label="期末卷面成绩：" v-show="te == '期末卷面成绩' && !isdiv1" v-for="(te, index) in score" :key="index">
              <el-input-number v-model="totalScore[0].testPaper[0].testPaperNum" size="mini" :min="0"
                :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="其他：" v-show="el == '其他' && !isdiv1" v-for="(el, index) in score" :key="index"
              style="margin-left:50px ;">
              <el-input-number v-model="totalScore[0].elt[0].eltNum" size="mini" :min="0" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="平时成绩：" v-show="us == '平时成绩' && !isdiv1" v-for="(us, index) in score" :key="index"
              style="margin-left:25px ;">
              <el-input-number v-model="totalScore[0].usual[0].resultNum" size="mini" :min="0"
                :max="100"></el-input-number>
              <el-select v-model="Usual" size="mini" multiple placeholder="请选择">
                <el-option v-for="(k, index) in totalScore[0].usual[0].optionvalue[0]" :key="index"
                  :value="k[0].Named"></el-option>
              </el-select>

            </el-form-item>
          </div>
          <div v-show="isdiv3" style="float: auto;;">
            <el-form-item v-show="cl == '考勤成绩'" label="考勤成绩：" v-for="(cl, index) in Usual" :key="index">
              <el-input-number v-model="totalScore[0].usual[0].optionvalue[0].clock[0].Numd" size="mini" :min="0"
                :max="100"></el-input-number>
            </el-form-item>
            <el-form-item v-show="ta == '课题成绩'" label="课题成绩：" v-for="(ta, index) in Usual" :key="index">
              <el-input-number v-model="totalScore[0].usual[0].optionvalue[0].task[0].Numd" size="mini" :min="0"
                :max="100"></el-input-number>
            </el-form-item>
            <el-form-item v-show="as == '作业成绩'" label="作业成绩：" v-for="(as, index) in Usual" :key="index">
              <el-input-number v-model="totalScore[0].usual[0].optionvalue[0].assignment[0].Numd" size="mini" :min="0"
                :max="100"></el-input-number>
            </el-form-item>
            <el-form-item v-show="mi == '期中测试成绩'" label="期中测试成绩：" v-for="(mi, index) in Usual" :key="index">
              <el-input-number v-model="totalScore[0].usual[0].optionvalue[0].midterm[0].Numd" size="mini" :min="0"
                :max="100"></el-input-number>
            </el-form-item>
          </div>


          <el-button type="primary" @click="saveResult1(score)" v-show="isdiv5">确定1</el-button>
          <el-button type="primary" @click="saveResult2(Usual)" v-show="isdiv6">确定2</el-button>
        </el-form>
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
      //选择课程后再显示界面
      ischoose: false,
      //当前选择课程名
      currentCourse: "",
      //课程列表(后端获取)
      courseList: [],

      classData: { className: '课程目标1' },//课程目标和指标点数据
      tableData1: [],
      scorelen: 0,
      Usuallen: 0,
      tableData2: {
        name2: '',
        number2: 0,
        dataid: 0,
        childnum: [],
        isclass: [],
        ised: true,
        ised1: true,
        ised2: true,
        ised3: true
      },
      numobj: {
        numid: 0,
        cnum: ''
      },
      classobj: {
        isClass: '',
        isid: 0
      },
      scoreobj: {
        sconum: 0
      },
      childData: [],
      id: 0,
      isdiv1: true,
      isdiv2: false,
      isdiv3: false,
      isdiv4: false,
      isdiv5: false,
      isdiv6: false,
      totalScore: [{
        usual: [{
          resultName: '平时成绩',
          resultNum: 0,
          optionvalue: [{
            clock: [{ Named: '考勤成绩', Numd: 0 }],
            task: [{ Named: '课题成绩', Numd: 0 }],
            assignment: [{ Named: '作业成绩', Numd: 0 }],
            midterm: [{ Named: '期中测试成绩', Numd: 0 }]
          }]
        }],
        testPaper: [{ resultName: '期末卷面成绩', testPaperNum: 0 }],
        elt: [{ resultName: '其他', eltNum: 0 }]
      }],
      score: [],
      Usual: []
    }
  },
  methods: {
    add() {
      this.tableData1.push(JSON.parse(JSON.stringify(this.tableData2)))
      this.tableData2.dataid++
      this.id = this.id + 1
      console.log(this.tableData1)
    },
    getcoursetableData() {
      api.get("courseExam/courseExamineMethods/2", "", (resp) => {
        this.coursetableData = resp.data.data;
      })
    },
    addChild(obj, index) {
      obj.ised2 = !obj.ised2
      obj.ised3 = !obj.ised3
      for (let i = 0; i < obj.childData.length; i++) {
        obj.childnum.push(JSON.parse(JSON.stringify(this.numobj)))
        this.numobj.numid++
      }
      this.numobj.numid = 0;
      for (let k = 0; k < obj.childData.length; k++) {
        obj.isclass.push(JSON.parse(JSON.stringify(this.classobj)))
        this.classobj.isid++
      }
      this.classobj.isid = 0;
      console.log(obj)
    },
    setChild(obj, index) {
      obj.ised3 = !obj.ised3
      obj.ised2 = !obj.ised2
      obj.childData.value = ''
      obj.childnum.length = 0
      obj.isclass.length = 0
    },
    savaoption() {
      this.isdiv1 = !this.isdiv1
      this.isdiv2 = !this.isdiv2
      this.isdiv5 = this.isdiv2
    },
    saveResult1(obj) {
      if ((this.totalScore[0].testPaper[0].testPaperNum + this.totalScore[0].elt[0].eltNum + this.totalScore[0].usual[0].resultNum) != 100) {
        console.log(this.totalScore[0].testPaper[0].testPaperNum + this.totalScore[0].elt[0].eltNum + this.totalScore[0].usual[0].resultNum)
        return alert("总百分比必须为100%！")
      }
      this.isdiv3 = !this.isdiv3
      this.isdiv2 = !this.isdiv2
      this.isdiv5 = !this.isdiv5
      this.isdiv6 = !this.isdiv6
      for (let i of obj) {
        if (i == '平时成绩') {
          this.score.push(JSON.parse(JSON.stringify(this.totalScore[0].usual[0].resultNum)))
        }
        if (i == '期末卷面成绩') {
          this.score.push(JSON.parse(JSON.stringify(this.totalScore[0].testPaper[0].testPaperNum)))
        }
        if (i == '其他')
          this.score.push(JSON.parse(JSON.stringify(this.totalScore[0].elt[0].eltNum)))
      }
      this.scorelen = this.score.length
      // if(this.score[]){
      //   return alert("百分比不能为零！")
      //  }

    },
    saveResult2(obj) {
      for (let b of this.totalScore[0].usual[0].optionvalue) {
        if ((b.assignment[0].Numd + b.clock[0].Numd + b.midterm[0].Numd + b.task[0].Numd) != 100) {
          return alert("总百分比必须为100%！")
        }
      }
      this.isdiv4 = !this.isdiv4
      this.isdiv6 = !this.isdiv6
      for (let i of obj) {
        if (i == '考勤成绩') {
          this.Usual.push(JSON.parse(JSON.stringify(this.totalScore[0].usual[0].optionvalue[0].clock[0].Numd)))
        }
        if (i == '作业成绩') {
          this.Usual.push(JSON.parse(JSON.stringify(this.totalScore[0].usual[0].optionvalue[0].assignment[0].Numd)))
        }
        if (i == '期中测试成绩') {
          this.Usual.push(JSON.parse(JSON.stringify(this.totalScore[0].usual[0].optionvalue[0].midterm[0].Numd)))
        }
        if (i == '课题成绩') {
          this.Usual.push(JSON.parse(JSON.stringify(this.totalScore[0].usual[0].optionvalue[0].task[0].Numd)))
        }
      }
      this.Usuallen = this.Usual.length
    },
    delect(obj) {
      let j
      let index = this.tableData1.indexOf(obj);
      this.tableData1.splice(index, 1)
      for (let i = 0; i < this.tableData1.length; i++) {
        j = this.tableData1.indexOf(this.tableData1[i])
        this.tableData1[i].id = j
      }

    },
    saveta(obj) {
      obj.ised1 = !obj.ised1
      obj.ised = !obj.ised
      obj.ised3 = !obj.ised3
    },
    editta(obj) {
      obj.ised1 = !obj.ised1
      obj.ised = !obj.ised
      obj.ised3 = !obj.ised3
    },

    //获取课程列表
    getMessage() {
      api.get("/courseInfo", "", (resp) => {
        this.courseList = resp.data.data;
      });
    },

    //选择框值选择后
    getCurrentCourseExam() {
      this.ischoose = true;
      console.log(this.currentCourse);
    }

  },
  mounted() {
    this.getMessage();
    this.getcoursetableData();
  }
}
</script>

<style></style>
