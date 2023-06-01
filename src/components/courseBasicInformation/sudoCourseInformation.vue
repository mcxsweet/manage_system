<template>
  <el-container>
    <el-header style="background-color: #fff;height: 50px;">
      <el-button type="success" plain @click="isShowSearch = !isShowSearch">筛选</el-button>
      <el-button type="primary" @click="over()" v-show="isover">筛选完毕</el-button>
    </el-header>
    <el-main>
        <el-table :data="tableData" stripe height="73vh" border="true">
            <el-table-column label="课程名称" prop="courseName"></el-table-column>
            <el-table-column label="课程教师" prop="classroomTeacher" width="100pxs"></el-table-column>
            <el-table-column label="开设专业" prop="major" width="200"></el-table-column>
            <el-table-column label="学期">
              <template slot-scope="scope">
                        {{ scope.row.termStart }}-{{ scope.row.termEnd }}.{{ scope.row.term }}
                    </template>
            </el-table-column>
            <el-table-column label="课程目标">
              <template slot-scope="scope">
                <el-link type="primary" @click="goto1('programObjective', scope.row.id, scope.row.courseName, scope.row.courseTargetNum)" v-show="scope.row.isTarget"> <span>已设置</span><i class="el-icon-view el-icon--right"></i></el-link>
                <span style="color: red;" v-show="!scope.row.isTarget" >未设置</span>
              </template>
            </el-table-column>
            <el-table-column label="考核评价方式">
              <template slot-scope="scope">
                <el-link type="primary" @click="goto2('basicInformationTable', scope.row.id, scope.row.courseName)" v-show="scope.row.isexamItem"> <span>已设置</span><i class="el-icon-view el-icon--right"></i></el-link>
                <span style="color: red;" v-show="!scope.row.isexamItem">未设置</span>
              </template>
            </el-table-column>
            <el-table-column label="试卷表格" width="100px">
              <template slot-scope="scope">
                <el-link type="primary" @click="goto2('finalTable', scope.row.id, scope.row.courseName)" v-show="scope.row.isfinal"> <span>已设置</span><i class="el-icon-view el-icon--right"></i></el-link>
                <span style="color: red;" v-show="!scope.row.isfinal">未设置</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="平时成绩">
              <template slot-scope="scope">
                <el-link type="primary" v-show="scope.row.isusual"> <span>已设置</span><i class="el-icon-view el-icon--right"></i></el-link>
                <span style="color: red;" v-show="!scope.row.isusual">未设置</span>
              </template>
            </el-table-column>
            <el-table-column label="试卷成绩">
              <template slot-scope="scope">
                <el-link type="primary" v-show="scope.row.isfinalSta"> <span>已设置</span><i class="el-icon-view el-icon--right"></i></el-link>
                <span style="color: red;" v-show="!scope.row.isfinalSta">未设置</span>
              </template>
            </el-table-column> -->
            <el-table-column label="综合成绩" width="100px">
              <template slot-scope="scope">
                <el-link type="primary" v-show="scope.row.isfinalCom"> <span>已设置</span><i class="el-icon-view el-icon--right"></i></el-link>
                <span style="color: red;" v-show="!scope.row.isfinalCom">未设置</span>
              </template>
            </el-table-column>
            <el-table-column label="达成度" width="100px">
              <template slot-scope="scope">
                <el-link type="primary" v-show="scope.row.isPro"> <span>已设置</span><i class="el-icon-view el-icon--right"></i></el-link>
                <span style="color: red;" v-show="!scope.row.isPro">未设置</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-dropdown split-button type="success" @click="handleClick">
                     导出文件
                    <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>教学大纲</el-dropdown-item>
                    <el-dropdown-item>试卷表</el-dropdown-item>
                    <el-dropdown-item>平时成绩</el-dropdown-item>
                    <el-dropdown-item>试卷成绩</el-dropdown-item>
                    <el-dropdown-item>综合成绩</el-dropdown-item>
                    <el-dropdown-item>成绩分析</el-dropdown-item>
                    <el-dropdown-item>达成度</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
        </el-table>
        <!-- 筛选弹出层 -->
        <el-dialog title="筛选 (支持单条件和多条件筛选)" :visible.sync="isShowSearch">
            <el-table :data="searchTable" border="true">
                <el-table-column label="课程名称" width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.courseName"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="班级名称" width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.className"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="学期" width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.termStart" placeholder="请选择起始学年">
                            <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="scope.row.termEnd" placeholder="请选择终止学年">
                            <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="scope.row.term" placeholder="请选择学期">
                            <el-option label="第一学期" value="1"></el-option>
                            <el-option label="第二学期" value="2"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center">
                    <el-button size="mini" type="primary" @click="search()">筛选</el-button>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import api from '@/api/api'
import global from '@/script/global';
export default {
  name:'sudoCourseInformation',
  data(){
    return{
      tableData:[],
      isover:false,
      isShowSearch:false,
      searchTable: [{}],
      DataOptions: [],
    }
  },
  methods:{
     //初始化学期表格
     initDataOptions() {
            for (let i = 0; i < 10; i++) {
                this.DataOptions.push(new Date().getFullYear() - 3 + i);
            }
        },
     //点击搜索内容
     search() {
            this.isShowSearch = !this.isShowSearch;
            api.post("/courseInfo/currentUser/" + localStorage.getItem("UserId"), this.searchTable[0], (resp) => {
                this.tableData = resp.data.data;
                this.searchTable = [{}];
            })
            this.isover = true
        },
        over() {
            this.getMessage();
            this.isover = false
        },
        //获取基本信息
        getMessage() {  
                api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                    for(let i=0;i<resp.data.data.length;i++){
                      resp.data.data[i].isTarget = false //课程目标表
                      resp.data.data[i].isfinal = false   //试卷
                      resp.data.data[i].isexamItem = false //考核评价方式
                      //resp.data.data[i].isusual = false   //平时成绩
                      //resp.data.data[i].isfinalSta = false //期末试卷成绩
                      resp.data.data[i].isfinalCom = false //期末综合成绩
                      resp.data.data[i].isPro = false  //达成度
                    }
                    //获取课程目标表信息
                    for(let index=0;index<resp.data.data.length;index++){
                      api.get("/courseInfo/courseTarget/" + resp.data.data[index].id, "", (resp1) =>{
                        if(resp1.data.data.length>=1){
                          resp.data.data[index].isTarget = true
                        }
                      })
                      //获取考核评价方式
                      api.get("/courseExam/courseExamineMethods/" + resp.data.data[index].id, "", (resp2) =>{
                        if(resp2.data.data.length>=1){
                          resp.data.data[index].isexamItem = true
                        }
                        for(let j =0;j<resp2.data.data.length;j++){
                          if(resp2.data.data[j].examineItem =="期末考核成绩"){
                            api.get("/courseExam/courseExamineChildMethods/" + resp2.data.data[j].id, "", (resp3) => {
                              //获取试卷题型
                              api.get("/courseExamPaper/"+resp3.data.data[0].id,"",(resp4)=>{
                                if(resp4.data.data.length>=1){
                                resp.data.data[index].isfinal = true
                              }
                              })
                             })
                          }
                        }
                      })
                    } 

                    this.tableData = resp.data.data;
                })
               
        },
        goto2(url,data,data1){
            this.$router.push({
                path:'/MainPage/' + url,
                query:{
                    id:data,
                    name:data1,
                }
            })
        },
        goto1(url,data,data1,data2){
            this.$router.push({
                path:'/MainPage/' + url,
                query:{
                    id:data,
                    name:data1,
                    Num:data2
                }
            })
        },
  },
  mounted(){
    this.initDataOptions();
    this.getMessage();
  }
}
</script>

<style>

</style>