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
      <el-button icon="el-icon-search" :circle="true" style="margin-left: 10px"
        @click="getCurrentCourseExam()"></el-button>
      <el-button type="danger" v-show="isReturn" @click="goto('courseBasicInformation')">返回</el-button>
    </el-header>
        <el-main>
           <!-- <div v-show="showtable">
            <h1 style="text-align: center;">XXXXX      任课教师：XXX</h1>
           </div> -->
            <!-- <el-table boder="true" :header-cell-style="tableHeader" :data="tableData" v-show="true">
                <el-table-column label="学号"></el-table-column>
                <el-table-column label="姓名"></el-table-column>
                <el-table-column label="班级"></el-table-column>
                <el-table-column :label="'考勤分('+attendance+'%)'">
                <el-table-column label="考勤(出勤5、缺席-5、请假0)" >
                    <el-table-column :label="att.attId" v-for="att in attendances" :key="att.attId"></el-table-column>   
                </el-table-column>
                <el-table-column label="考勤分"></el-table-column>
                </el-table-column>
                <el-table-column :label="'作业('+homework+'%)'">
                    <el-table-column label="作业小分">
                        <el-table-column :label="hom.homId" v-for="hom in homeworks" :key="hom.homId"></el-table-column>
                    </el-table-column>
                    <el-table-column label="作业分"></el-table-column>
                </el-table-column>
                <el-table-column :label="'课堂提问('+classquestion+'%)'">
                    <el-table-column label="课堂分"></el-table-column>
                </el-table-column>
                <el-table-column :label="'其中考核('+midterm+'%)'">
                    <el-table-column label="期中成绩分"></el-table-column>
                </el-table-column>
                <el-table-column :label="'实验('+test+'%)'">
                    <el-table-column label=" 实验小分">
                        <el-table-column label="1"></el-table-column>
                        <el-table-column label="1"></el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="">
                    <el-table-column label="实验分"></el-table-column>
                </el-table-column>
                <el-table-column label="成绩汇报">
                    <el-table-column label="平时成绩"></el-table-column>
                </el-table-column>
             </el-table> -->
             <!-- <el-button @click="showdiv1=true">编辑</el-button> -->
                    <div>
                       <el-table :data="tableData1" border="true" style="width: 800px;">
                            <el-table-column label="项目">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="占比">
                                <template slot-scope="scope">
                                    <div>
                                        <span v-show="!scope.row.isshow">{{ scope.row.num }}%</span>
                                    </div>
                                    <el-input v-show="scope.row.isshow" type="number" v-model="scope.row.num" :min="0" :max="100"><template slot="append">%</template></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="课时/作业/实验次数">
                                <template slot-scope="scope">
                                    <div>
                                        <span v-show="!scope.row.isshow">{{ scope.row.point }}次</span>
                                    </div>
                                    <el-input v-show="scope.row.isshow" type="number" v-model="scope.row.point" :min="0"><template slot="append">次</template></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="小分">
                                <template slot-scope="scope">
                                        <span v-show="!scope.row.isshow">{{ scope.row.littleNum }}分</span>
                                    <el-input v-show="scope.row.isshow" type="number" v-model="scope.row.littleNum" :min="0"><template slot="append">分</template></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" @click="settingData,scope.row.isshow = !scope.row.isshow" v-show="!scope.row.isshow">编辑</el-button>
                                    <el-button type="success" size="mini" @click="saveData,scope.row.isshow = !scope.row.isshow" v-show="scope.row.isshow">保存</el-button>
                                    <el-button type="danger" size="mini" @click="delectData">删除</el-button>
                                </template>
                            </el-table-column>
                       </el-table>
                    </div>                                  
        </el-main>
    </el-container>

</template>



<script>
import api from '@/api/api'
export default {
    name:"usualPerformanceTable",
    data(){
        return{
            ischoose:false,
            currentCourse:"",
            courseList:[],
            tableData1:[
                {name:"考勤",num:0,point:0,littleNum:0,ishow:false}, //考勤
                {name:"作业",num:0,point:0,littleNum:0,ishow:false},   //作业
                {name:"课堂提问",num:0,point:0,littleNum:0,ishow:false}, //课堂提问
                {name:"期中考试",num:0,point:0,littleNum:0,ishow:false}, //期中考试
                {name:"实验",num:0,point:0,littleNum:0,ishow:false} //实验
            ],
        }
    },
    methods:{
        tableHeader({row,column,rowIndex,columnIndex}){
            let i = this.attendances.length+1
             //console.log(rowIndex,columnIndex,i);
            if(rowIndex===1&&columnIndex===1){
                return 'background:yellow'
            }
            else if(rowIndex===1&&(columnIndex===3||columnIndex===4||columnIndex===5||columnIndex===7)){
                return 'background:yellow'
            }
            return 'text-align:center'
        },
        //编辑
        settingData(){

        },
        //保存
        saveData(){

        },
        //删除
        delectData(){

        },
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        focusOnSelect() {
            //this.examItemArray = [];
            this.ischoose = false;
            this.currentId = "";
            },
    },
    mounted(){
        this.getMessage();
        if (this.$route.query.id) {
        this.isReturn = true
        this.currentId = this.$route.query.id;
        this.getCurrentCourseExam();
        }
    }
}
</script>

<style>
    
</style>