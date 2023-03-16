<template>
    <el-container>
        <p style="margin-top: 20px;margin-left: 20px;">请先选择课程</p>
    <el-header style="background-color: #fff;height: 50px;">
      <el-select v-model="currentCourse" placeholder="请先选择课程" @focus="ischoose = false,issetfinal=false,examinations.length=0" >
        <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
        </el-option>
      </el-select>
      <el-button icon="el-icon-search" circle style="margin-left: 10px" @click="getCurrentCourseExam()"></el-button>
    </el-header>
        <el-main>
            <div  v-show="ischoose">
                <el-table :data="examinations" :header-cell-style="tableHeader" border="true" style="width: 880px;">
                    <el-table-column type="expand" label="小题分" width="80px">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand" v-for="i in scope.row.examinationGardes" :key="i.id">
                            <el-form-item :label="i.examination+i.id+':'" >
                                <span>{{ i.garde }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="题型"  width="200px" prop="examinationName"></el-table-column>
                <el-table-column label="题数"  width="200px" prop="examinationNum"></el-table-column>
                <el-table-column label="总分" width="200px" prop="totalGarde"></el-table-column>
                <el-table-column label="操作" align="left" width="200px">
                    <template slot-scope="scope">
                        <el-button >设置</el-button>
                        <el-button @click="delectEx(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="ischoose=false,issetfinal=true">试卷设置</el-button>
            </div>
            <!-- <div style="margin: auto;" v-show="fasle">
                <el-table :header-cell-style="tableHeader" style="width: 100%" boder :row-class-name="tableRowclassName" :data="tableData" size="mini">
                    <el-table-column label="指标点" prop="name">   
                    </el-table-column>
                    <el-table-column label="支撑程度"></el-table-column>
                    <el-table-column label="试卷" >
                        <el-table-column :label="'一、选择('+choiceNum*choiceGarde+')'">
                            <el-table-column :label="choiced.choiceId" v-for="choiced in choice" :key="choiced.choiceId">
                                <el-table-column :label="choiceGarde" >
                                    <template><el-checkbox v-model="choice.checked" style="margin-left: 23px;"></el-checkbox><i class="el-icon-check" v-show="false"></i></template>
                                </el-table-column>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column :label="'二、填空('+gapNum*gapGarde+')'">
                            <el-table-column :label="gapd.gapId" v-for="gapd in gap" :key="gapd.gapId" >
                                <el-table-column :label="gapGarde">
                                    <template ><el-checkbox v-model="gapd.checked" style="margin-left: 23px;"></el-checkbox><i class="el-icon-check" v-show="false"></i></template>
                                </el-table-column>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column :label="'三、简答('+answerGardes+')'">
                            <el-table-column :label="answerd.answerId" v-for="answerd in answer" :key="answerd.answerId">
                                <el-table-column :label="answerd.answerGarde">
                                    <template ><el-checkbox v-model="answerd.checked" style="margin-left: 23px;"></el-checkbox><i class="el-icon-check" v-show="false"></i></template>
                                </el-table-column>
                            </el-table-column>    
                        </el-table-column>
                        <el-table-column :label="'四、计算('+computeGardes+')'">
                            <el-table-column :label="comd.computeId" v-for="comd in compute" :key="comd.computeId">
                                <el-table-column :label="comd.comGarde">
                                    <template ><el-checkbox v-model="comd.checked" style="margin-left: 23px;"></el-checkbox><i class="el-icon-check" v-show="false"></i></template>
                                </el-table-column>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="卷面总分">
                            <el-table-column><el-table-column label="(100)" ></el-table-column></el-table-column>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="实验">
                        <el-table-column label="实验项目完成"></el-table-column>
                        <el-table-column label="实验项目完成"></el-table-column>
                        <el-table-column label="实验项目完成"></el-table-column>
                    </el-table-column>
                    <el-table-column label="平时考核">
                        <el-table-column label="考勤"></el-table-column>
                        <el-table-column label="随堂"></el-table-column>
                        <el-table-column label="作业"></el-table-column>
                        <el-table-column label="期中考核"></el-table-column>
                        <el-table-column label="平时总分">
                            <el-table-column><el-table-column label="(100)" ></el-table-column></el-table-column>
                        </el-table-column>
                    </el-table-column>
                 </el-table>
                    <el-button v-show="tableshow">编辑</el-button>
                    <el-button v-show="tableshow" @click="showdiv1=true">试卷编辑</el-button>
                    <el-button v-show="tableshow" @click="goto('finalStatisticsTable', answer,compute,choice,gap,choiceGarde,gapGarde)">跳往课程期末试卷成绩表</el-button>
            </div> -->
    <div v-show="issetfinal">
            <el-table :data="examinations" :header-cell-style="tableHeader" border="true" style="width: 840px;">
                <el-table-column label="题型选择"  width="200px">
                    <template slot-scope="scope" >
                        <el-select v-model="scope.row.examinationName" placeholder="请选择">
                            <el-option value="选择题"></el-option>
                            <el-option value="填空题"></el-option>
                            <el-option value="简答题"></el-option>
                            <el-option value="计算题"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="题数选择"  width="200px">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.examinationNum" :min="0" :max="100"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="分数设置" width="200px">
                    <template slot-scope="scope" >
                           <el-button @click="selectGarde(scope.row,scope.$index)" v-show="scope.row.showSelect" >设置</el-button>
                           <div v-for="g in scope.row.examinationGardes" :key="g.id">
                               {{ g.examination+g.id+':' }}<el-input type="number" size="mini" v-model="g.garde"></el-input>
                           </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240px">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="delectEx(scope.row)">删除</el-button> 
                        <el-button type="primary" size="mini" @click="reSelectEx(scope.row.examinationId)">重置</el-button>
                        <el-button size="mini" type="danger" @click="savaExamnation(scope.row,scope.$index)">保存</el-button>
                    </template>
                    
                </el-table-column>
            </el-table>
            <el-button icon="el-icon-plus" type="primary" @click="addExamination">添加题目类型</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="ischoose = true,issetfinal=false">完成</el-button>
        </div>

        </el-main>
    </el-container>
   
</template>
<script>
import api from '@/api/api'

export default {
    name:"finalTable",
    data(){
        return{
            arr:{},
            issetfinal:false, 
            ischoose: false,
        //当前选择课程索引
            currentCourse: "",
            //课程列表(后端获取)
            courseList: [],
            //试卷设置数组
            examinations:[],
            //题目类型项
            examinationObj:{
                showSelect:true,
                examinationId:1,    //类型id
                examinationName:'', //类型名
                examinationNum:0,   //题目数
               // exam:'',
                examinationGardes:[], //各题目分数
                totalGarde:0 //该题型总分
            },
            //小题
            gardesObj:{
                id:1, //小题序号
                examination:'', //小题名称
                garde:0, //小题分数
            },                                                                                           
            tableData:[{
                name:'111',
            },
            {
                name:'111',
                
            },
            {
                name:''
            },
            {
                name:'111'
            },
            {
                name:'111'
            }],
            
        }
    },
    methods:{
        tableHeader({row,column,rowIndex,columnIndex}){
            //console.log(row,column,rowIndex,columnIndex);
            if(rowIndex===3){
                return 'color:red;text-align:center';
            }
            return 'text-align:center'
        },
        //添加题目类型
        addExamination(){
            this.examinationObj.examinationName=""
            this.examinationObj.totalGarde=0
            this.examinationObj.examinationGardes=[]
            this.examinationId=0
            this.showSelect = true
            this.examinations.push(JSON.parse(JSON.stringify(this.examinationObj)))
            this.examinationObj.examinationId++
        },
        //开始设置小题分数
        selectGarde(obj,index){
            this.gardesObj.id=1
            this.gardesObj.examination=obj.examinationName
            for(let i=0;i<obj.examinationNum;i++){
                this.examinations[index].examinationGardes.push(JSON.parse(JSON.stringify(this.gardesObj)))
                this.gardesObj.id++
            }
            console.log(this.examinations[obj.examinationId].examinationGardes) 
        },
        //删除当前行
       delectEx(obj){
        console.log(this.examinations)
        let j
        let index = this.examinations.indexOf(obj);
        this.examinations.splice(index, 1)
        for (let i = 0; i < this.examinations.length; i++) {
            j = this.examinations.indexOf(this.examinations[i])
            console.log("j="+j)
            this.examinations[i].index = j
            this.examinations[i].examinationId=j
        }
        console.log(this.examinations)
       },
       //重置当前行数据
       reSelectEx(obj){
        this.gardesObj.id=1
        this.examinations[obj].examinationGardes.length=0
        this.examinations[obj].examinationName=''
        this.examinations[obj].examinationNum=0
        this.examinations[obj].showSelect = true
        console.log(this.examinations[obj])
       },
       //获取用户课程
       getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        init() {
                 this.examinations = [];
                api.get("/courseExamPaper/" + this.courseList[this.currentCourse].id, "", (resp) => {
                 for (let index = 0; index < resp.data.data.length; index++) {
                       this.examinationObj.examinationName = JSON.parse(JSON.stringify(resp.data.data[index].itemName));
                       this.examinationObj.totalGarde= JSON.parse(resp.data.data[index].itemScore);
                       this.examinationObj.examinationId = JSON.parse(resp.data.data[index].id)
                       this.examinationObj.examinationGardes=[]
                       this.examinations.push(JSON.parse(JSON.stringify(this.examinationObj)))
                 }
                })
                
            },
        getCurrentCourseExam() { 
            this.init();
            this.ischoose = true;
            // console.log(this.examinations)
        },
        savaExamnation(obj,index){    
            console.log(this.courseList[this.currentCourse].id)
                for(let y of obj.examinationGardes){
                    obj.totalGarde=obj.totalGarde+y.garde*1
                }
               
                //添加
                this.arr.courseid = this.courseList[this.currentCourse].id
                //this.arr.id = this.examinations[index].examinationId
                this.arr.itemName = this.examinations[index].examinationName
                this.arr.itemscore = obj.totalGarde*1
                this.arr.type = 0
                console.log(this.arr)
                api.post("/courseExamPaper", this.arr, (resp) => {   
                 })
                //修改       
                // api.put("courseExamPaper", this.examinations[index], (resp) => { })
            }
        },
    mounted() {
    this.getMessage();
    if (this.$route.query.id) {
      this.currentId = this.$route.query.id;
      this.getCurrentCourseExam();
    }
    }
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
