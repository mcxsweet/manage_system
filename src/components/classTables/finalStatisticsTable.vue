<template>
    <el-container>
        <el-main>
            <el-table boder="true" :header-cell-style="tableHeader" :data="tableData" @sort-change="changeSort" v-loading="listLoading">
    <el-table-column>
        <el-table-column label="学号">
            <el-table-column></el-table-column>
        </el-table-column>
    </el-table-column>
    <el-table-column>
        <el-table-column label="姓名">
            <el-table-column></el-table-column>
        </el-table-column>
    </el-table-column>
    <el-table-column>
        <el-table-column label="班级">
            <el-table-column label="分值"></el-table-column>
        </el-table-column>
    </el-table-column>
    <el-table-column :label="'一、选择（'+(choiceNum*choiceGarde)+'）'">
       <el-table-column :label="ch.choiceId" v-for="ch in choice" :key="ch.choiceId">
        <el-table-column :label="choiceGarde"></el-table-column>
       </el-table-column>
    </el-table-column>
    <el-table-column :label="'二、填空（'+(gapNum*gapGarde)+'）'">
        <el-table-column :label="ga.gapId" v-for="ga in choice" :key="ga.gapId">
        <el-table-column :label="gapGarde"></el-table-column>
       </el-table-column>
    </el-table-column>
    <el-table-column :label="'三、简答（'+answerGardes+'）'">
        <el-table-column :label="an.answerId" v-for="an in answer" :key="an.answerId">
        <el-table-column :label="an.answerGarde"></el-table-column>
       </el-table-column>
    </el-table-column>
    <el-table-column :label="'四、计算（'+computeGardes+'）'">
        <el-table-column :label="co.computeId" v-for="co in compute" :key="co.computeId">
        <el-table-column :label="co.comGarde"></el-table-column>
       </el-table-column>
    </el-table-column>
    <el-table-column label="小计得分">
       <el-table-column :label="choiceNum*choiceGarde"></el-table-column>
       <el-table-column :label="gapNum*gapGarde"></el-table-column>
       <el-table-column :label="answerGardes"></el-table-column>
       <el-table-column :label="computeGardes"></el-table-column>
    </el-table-column>
    <el-table-column label="总计得分">
        <el-table-column :label="(gapNum*gapGarde)+(gapNum*gapGarde)+computeGardes+answerGardes"></el-table-column>
    </el-table-column>
  </el-table>
        </el-main>
    </el-container>
  
</template>
<script>
export default {
    name:"finalStatisticsTable",
    data(){
        return{
            //事件全局中线把选择填空数目传过来
            tableData:[],
            data1:'',
            data2:'',
            data3:'',
            data4:'',
            choiceNum:0,
            choiceGarde:0,
            gapNum:0,
            gapGarde:0,
            answerNum:0,
            answerGardes:0,
            computeNum:0,
            computeGardes:0,
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
           return 'text-align:center'
        },
    },
    created(){
       this.answer = this.$route.query.an;
        this.compute = this.$route.query.co;
       this.choice = this.$route.query.ch;
       this.gap = this.$route.query.ga;
       this.choiceGarde = this.$route.query.chgarde;
       this.gapGarde = this.$route.query.gapgarde;
       this.choiceNum = this.choice.length
       this.gapNum = this.gap.length;
       this.answerNum = this.answer.length;
       this.computeNum = this.compute.length
       for(let i=0;i<this.answerNum;i++){
        this.answerGardes = this.answerGardes+this.answer[i].answerGarde
       }
       for(let j=0;j<this.computeNum;j++){
        this.computeGardes = this.answerGardes+this.compute[j].comGarde
        
       }
       console.log(this.computeGardes)
    }
}
</script>

<style>

</style>