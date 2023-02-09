<template>
  <el-container>
    <el-main>
      <el-table :data="tableData1" border="true" style="width: 1084px" default-expand-all="true" > 
        <el-table-column prop="name2" label="考核项目" width="200px">
          <template slot-scope="scope"> 
            <el-select  v-model="scope.row.name2" placeholder="请选择" style="width:100%">
                <el-option value="平时考核成绩"></el-option>
                <el-option value="实验考核成绩"></el-option>
                <el-option value="期末考核成绩"></el-option>
            </el-select>
          </template>
        </el-table-column> 
        <el-table-column prop="number2" label="项目百分比" width="170">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.number2" :min="0" :max="100" style="width:140px"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="考核子项目" width="280"> 
              <template slot-scope="scope">    
                  <el-select v-model="scope.row.childData" multiple placeholder="请选择" style="width:50%"  v-show="scope.row.ised" ref="ad">
                    <el-option value="项目1"></el-option>
                    <el-option value="项目2"></el-option>
                    <el-option value="项目3"></el-option>
                    <el-option value="项目4"></el-option>
                  </el-select>
                  <div v-for="(i,index) in scope.row.childData" :key="index" v-show="!scope.row.ised">                   
                      <span style="width: 100px;" boder>{{ i+":" }}</span>         
                  </div>
                <el-button icon="el-icon-plus" type="success" @click="addChild(scope.row,index)" v-show="scope.row.ised" >添加</el-button> 
                <el-button icon="el-icon-plus" type="success" @click="setChild(scope.row,index)" v-show="!scope.row.ised" >设置</el-button> 
                <!-- <el-button icon="el-icon-plus" type="success" @click="saveChild" flex="right" >设置</el-button>            -->
              </template>    
             
         </el-table-column>
        <el-table-column label="课程子目标百分比" width="193">
          <template slot-scope="scope">
            <div  v-for="(k,index) in scope.row.childnum" :key="index" v-show="!scope.row.ised">
              <el-input-number v-model="k.cnum"></el-input-number> 
            </div>
          </template>
        </el-table-column>
         <el-table-column :label="classData.className" width="170">
            <template slot-scope="scope">
              <div v-for="(c,index) in scope.row.isclass" :key="index" v-show="!scope.row.ised">
                <el-checkbox type="name" v-model="c.isClass" size="medium" style="margin-top:10px" border="true"></el-checkbox>
              </div>
            </template>
        </el-table-column>
    </el-table>
    <el-button icon="el-icon-plus" type="primary" @click="add">添加课程目标</el-button>
    <div style="margin-top: 5%;">
        <p1>成绩评定法：期末总成绩=</p1>
        <div v-for="(m,index) in this.score" :key="index">
          <p1 v-show="m=='平时成绩'">{{ m+'('+totalScore[0].usual[0].resultNum+'%)' }}</p1>
          <p1 v-show="m=='期末卷面成绩'">+{{ m+'('+totalScore[0].testPaper[0].testPaperNum+'%)' }}</p1>
          <p1 v-show="m=='其他'">+{{ m+'('+totalScore[0].elt[0].eltNum+'%)' }}</p1>
        </div> 
        <div v-for="(m1,index1) in this.Usual" :key="index1">
          <p1>平时成绩</p1>
          <p1 v-if="m1=='考勤成绩'">{{ m1+'('+totalScore[0].usual[0].optionvalue[0].clock[0].Numd+'%)' }}</p1>
          <p1 v-if="m1=='课题成绩'">+{{ m1+'('+totalScore[0].usual[0].optionvalue[0].task[0].Numd+'%)' }}</p1>
          <p1 v-if="m1=='作业成绩'">+{{ m1+'('+totalScore[0].usual[0].optionvalue[0].assignment[0].Numd+'%)' }}</p1>
          <p1 v-if="m1=='期中测试成绩'">+{{ m1+'('+totalScore[0].usual[0].optionvalue[0].midterm[0].Numd+'%)' }}</p1>
        </div>
    </div>
    <el-form style="margin-top: 5%;">
      <span>成绩评定法：</span>
      <el-form-item label="期末总成绩" v-show="!isdiv">
          <el-select v-model="score" size="mini" multiple placeholder="请选择">
            <el-option v-for="(i,index) in totalScore[0]" :key="index" :value="i[0].resultName"></el-option>
          </el-select>
          <el-button size="mini" @click="savaoption(score)">确定</el-button>
      </el-form-item>
          <div v-show="isdiv">
            <el-form-item label="期末卷面成绩：" v-show="te=='期末卷面成绩'&&!isdiv2" v-for="(te,index) in score" :key="index">
          <el-input-number v-model="totalScore[0].testPaper[0].testPaperNum"  size="mini" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="其他：" v-show="el=='其他'&&!isdiv2" v-for="(el,index) in score" :key="index">
          <el-input-number v-model="totalScore[0].elt[0].eltNum"  size="mini" :min="0" :max="100"></el-input-number>
        </el-form-item>
            <el-form-item label="平时成绩：" v-show="us=='平时成绩'&&!isdiv2" v-for="(us,index) in score" :key="index">
              <el-input-number v-model="totalScore[0].usual[0].resultNum" size="mini" :min="0" :max="100"></el-input-number>
          <el-select v-model="Usual" size="mini" multiple placeholder="请选择">
            <el-option v-for="(k,index) in totalScore[0].usual[0].optionvalue[0]" :key="index" :value="k[0].Named"></el-option>
          </el-select>
          <el-button size="mini" @click="savaoption2">确定</el-button>
        </el-form-item>
        <div v-show="isdiv2" style="float: auto;;">
        <el-form-item v-show="cl=='考勤成绩'" label="考勤成绩：" v-for="(cl,index) in Usual" :key="index">
            <el-input-number v-model="totalScore[0].usual[0].optionvalue[0].clock[0].Numd" size="mini" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item v-show="ta=='课题成绩'" label="课题成绩："  v-for="(ta,index) in Usual" :key="index">
            <el-input-number v-model="totalScore[0].usual[0].optionvalue[0].task[0].Numd"  size="mini" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item v-show="as=='作业成绩'" label="作业成绩："  v-for="(as,index) in Usual" :key="index">
            <el-input-number v-model="totalScore[0].usual[0].optionvalue[0].assignment[0].Numd"  size="mini" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item v-show="mi=='期中测试成绩'" label="期中测试成绩："  v-for="(mi,index) in Usual" :key="index">
            <el-input-number v-model="totalScore[0].usual[0].optionvalue[0].midterm[0].Numd"  size="mini" :min="0" :max="100"></el-input-number>
          </el-form-item>
       </div>
        </div>
        <el-button type="primary" @click="saveResult">确定</el-button>
    </el-form>
        </el-main>

        </el-container>
</template>

<script>


export default {
    name:"basicInformationTable",
    data(){
        return {
        classData:{className:'课程目标1'},//课程目标和指标点数据
        tableData1:[],
        tableData2:{
          name2:'',
          number2:0,
          dataid:0,
          childnum:[],
          isclass:[],
          ised:true
        },
        numobj:{
          numid:0,
          cnum:''
        },
        classobj:{
          isClass:'',
          isid:0
        },
        scoreobj:{
          sconum:0
        },
        childData:[], 
        id:0,
        isdiv:false,
        isdiv2:false,
        isdiv3:false,
        totalScore:[{
          usual:[{
            resultName:'平时成绩',
            resultNum:0,
            optionvalue:[{
                clock:[{Named:'考勤成绩',Numd:0}],
                task:[{Named:'课题成绩',Numd:0}],
                assignment:[{Named:'作业成绩',Numd:0}],
                midterm:[{Named:'期中测试成绩',Numd:0}]
            }]
          }],
          testPaper:[{resultName:'期末卷面成绩',testPaperNum:0}],
          elt:[{resultName:'其他',eltNum:0}]
        }],
        score:[],
        Usual:[]
      }
    }, 
    mounted(){
        this.getcoursetableData();
    },
    methods:{
        add(){
            this.tableData1.push(JSON.parse(JSON.stringify(this.tableData2))) 
            this.tableData2.dataid++
            this.id = this.id+1
            console.log(this.tableData1)
        },
        getcoursetableData(){
            api.get("courseExam/courseExamineMethods/2","",(resp)=>{
                this.coursetableData = resp.data.data;
            })
        },
        addChild(obj,index){
            obj.ised = !obj.ised
            for(let i=0;i<obj.childData.length;i++){
              obj.childnum.push(JSON.parse(JSON.stringify(this.numobj)))
              this.numobj.numid++
            }
            this.numobj.numid=0;
            for(let k=0;k<obj.childData.length;k++){
              obj.isclass.push(JSON.parse(JSON.stringify(this.classobj)))
              this.classobj.isid++
            }
            this.classobj.isid=0;
          console.log(obj)
        },
        setChild(obj,index){
          console.log(obj)
         
          obj.ised = !obj.ised
          obj.childData.value=''
          obj.childnum.length=0
          obj.isclass.length=0
        },
        savaoption(){         
            this.isdiv = !this.isdiv
        },
        savaoption2(obj){
          let i=this.totalScore[0].usual[0].resultNum+this.totalScore[0].elt[0].eltNum+this.totalScore[0].testPaper[0].testPaperNum
          if(i!=100){
            alert('总百分比不能超过一百或者为0')
          }
          else{
            this.isdiv2 = !this.isdiv2
          }    
        },
        saveResult(){
          this.isdiv3 = !this.isdiv3
        },
    }
}
</script>

<style>

</style>