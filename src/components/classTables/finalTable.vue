<template>
    <el-container>
        <el-main>
            <div v-show="!showtable" style="margin: auto;">
                <el-table :header-cell-style="tableHeader" style="width: 100%" boder :row-class-name="tableRowclassName" :data="tableData" size="mini" v-show="tableshow">
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
             </div>
   
    <div v-show="showdiv1">
        <el-form :inline="true">
        <el-form-item label="请选择选择题数：" size="mini">
            <el-input-number v-model="choiceNum" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="请选择选择题分数：" size="mini">
            <el-input-number v-model="choiceGarde" :min="0"></el-input-number>
        </el-form-item>
    </el-form>
    <el-form :inline="true">
        <el-form-item label="请选择填空题数：" size="mini">
            <el-input-number v-model="gapNum" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="请选择填空题分数：" size="mini">
            <el-input-number v-model="gapGarde" :min="0"></el-input-number>
        </el-form-item>
    </el-form>
    <el-form :inline="true">
        <el-form-item label="请选择简答题数：" size="mini">
            <el-input-number v-model="answerNum" :min="0"></el-input-number>
        </el-form-item>
    </el-form>
    <el-form :inline="true">
        <el-form-item label="请选择计算题数：" size="mini">
            <el-input-number v-model="computeNum" :min="0"></el-input-number>
        </el-form-item>
    </el-form>
    <el-button size="mini" @click="showdiv1 = !showdiv1,showdiv2=!showdiv2,saveNum(answerNum,computeNum,choiceNum,gapNum)">确定</el-button>
    </div>
    <div v-show="showdiv2">
        <span>选择题总分：{{choiceNum*choiceGarde}}</span>
        <br>
        <span>填空题总分：{{ gapNum*gapGarde }}</span>
        <br>
        <span>简答题总分：{{ answerGardes }}</span>
        <br>
        <span>计算题总分：{{ computeGardes }}</span>
        <el-form :inline="true">   
            <el-form> <el-form-item v-for="(item) in answer" :key="item.answerId">
               <el-form-item :label="'简答题'+item.answerId+':'"><el-input-number v-model="item.answerGarde" size="mini" :min="0"></el-input-number></el-form-item>
            </el-form-item>
            <el-form-item>
                <el-button>确定</el-button>
            </el-form-item>
        </el-form>
           <el-form :inline="true">
                <el-form-item v-for="(item1) in compute" :key="item1.computeId">
                    <el-form-item :label="'计算题'+item1.computeId+':'"><el-input-number v-model="item1.comGarde" size="mini" :min="0"></el-input-number></el-form-item>
                </el-form-item>
           </el-form>
            <el-form-item> <el-button size="mini" @click="showdiv2=!showdiv2,tableshow=true,saved">确定</el-button></el-form-item> 
        </el-form>
    </div>
        </el-main>
    </el-container>
    
   
</template>
<script>
export default {
    name:"finalTable",
    data(){
        return{
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
            tableshow:false,
            showdiv1:true,
            showdiv2:false,
            showtable:false,
            choiceNum:0,
            choiceGarde:0,
            gapNum:0,
            gapGarde:0,
            answerNum:0,
            answerGardes:0,
            computeGardes:0,
            computeNum:0,
            answer:[],
            compute:[],
            choice:[],
            gap:[],
            ansobj:{
                answerId:0,
                answerGarde:0,
                checked:false
            },
            comobj:{
                computeId:0,
                comGarde:0,
                checked:false,
            },
            choiceobj:{
                choiceId:0,
                checked:false,
            },
            gapobj:{
                gapId:0,
                checked:false,
            }
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
        saveNum(obj1,obj2,obj3,obj4){
            for(let i =0;i<obj1;i++){
                this.ansobj.answerId++
                this.answer.push(JSON.parse(JSON.stringify(this.ansobj)))
            }
            for(let j =0;j<obj2;j++){
                this.comobj.computeId++
                this.compute.push(JSON.parse(JSON.stringify(this.comobj)))
            }
            for(let k =0;k<obj3;k++){
                this.choiceobj.choiceId++
                this.choice.push(JSON.parse(JSON.stringify(this.choiceobj)))
            }
            for(let y=0;y<obj4;y++){
                this.gapobj.gapId++
                this.gap.push(JSON.parse(JSON.stringify(this.gapobj)))
            }
        },
        saved(){
            let num1 = 0
            let num2 = 0
            for(let i=0;this.answer.length;i++){
                num1 = this.answer[i].answerGarde+num1
            }
            for(i=0;i<this.compute.length;i++){
                num2 = this.compute[i].comGarde+num2
            }
            this.answerGardes = num1
            this.computeGardes = num2
            if(num1+num2+(this.choiceNum*this.choiceGarde)+(this.gapNum*this.gapGarde)!=100){
                return this.$message('试卷总分不为一百！')
            }
        },
        goto(url, data1,data2,data3,data4,data5,data6) {
             this.$router.push({
                path: '/MainPage/' + url,
                query: {
                    an:data1,
                    co:data2,
                    ch:data3,
                    ga:data4,
                    chgarde:data5,
                    gapgarde:data6
                }
            });
        },
    }
}
</script>

<style>

</style>