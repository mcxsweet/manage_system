<template>
    <el-container>
        <el-main>
           <div v-show="showtable">
            <h1 style="text-align: center;">XXXXX      任课教师：XXX</h1>
           </div>
            <el-table boder="true" :header-cell-style="tableHeader" :data="tableData" v-show="true">
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
             </el-table>
             <el-button @click="showdiv1=true">编辑</el-button>
             <div style="margin-top: 2%;" v-show="showdiv1">
                <span>平时成绩设置：</span>
                <el-form>
                    <el-form-item label="考勤分：" style="margin-left: 18px;">
                        <el-input-number v-model="attendance" :min="0" size="mini"></el-input-number><span>%</span>
                    </el-form-item>
                    <el-form-item label="作业分：" style="margin-left: 18px;">
                        <el-input-number v-model="homework" :min="0" size="mini"></el-input-number><span>%</span>
                    </el-form-item>
                    <el-form-item label="课堂提问：">
                        <el-input-number v-model="classquestion" :min="0" size="mini"></el-input-number><span>%</span>
                    </el-form-item>
                    <el-form-item label="期中考试：">
                        <el-input-number v-model="midterm" :min="0" size="mini"></el-input-number><span>%</span>
                    </el-form-item>
                    <el-form-item label="实验：" style="margin-left: 25px;">
                        <el-input-number v-model="test" :min="0" size="mini"></el-input-number><span>%</span>   
                    </el-form-item>
                </el-form>
                <el-button @click="showdiv1=!showdiv1,showdiv2=!showdiv2">保存</el-button>
             </div>
             <div v-show="showdiv2">
                <el-form>
                    <el-form-item label="课时数：">
                        <el-select v-model="classNum" placeholder="请选择课时数" size="mini">
                            <el-option value="8"></el-option>
                            <el-option value="16"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="作业次数：">
                        <el-input-number v-model="homeworkNum" :min="0" size="mini"></el-input-number>
                    </el-form-item>
                </el-form>
                <el-button @click="saveNum(classNum,homeworkNum)">保存</el-button>
             </div>
        </el-main>
    </el-container>

</template>

<script>
export default {
    name:"usualPerformanceTable",
    data(){
        return{
            tableData:[],
            attendances:[],
            homeworks:[],
            attobj:{
                attId:0
            },
            homobj:{
                homId:0
            },
            addId:0,
            attendance:0,
            homework:0,
            classquestion:0,
            midterm:0,
            test:0,
            classNum:16,
            homeworkNum:0,
            showtable:false,
            showdiv1:true,
            showdiv2:false
        }
    },
    methods:{
        tableHeader({row,column,rowIndex,columnIndex}){
            let i = this.attendances.length+1
             console.log(rowIndex,columnIndex,i);
            if(rowIndex===1&&columnIndex===1){
                return 'background:yellow'
            }
            else if(rowIndex===1&&(columnIndex===3||columnIndex===4||columnIndex===5||columnIndex===7)){
                return 'background:yellow'
            }
            return 'text-align:center'
        },
        saveNum(obj1,obj2){
            if(obj1==this.attendances.length){
                return
            }
            else {
                this.attendances.length=0
                this.showdiv2 = false
                this.attobj.attId=0
                for(let i=0;i<obj1;i++){
                    this.attobj.attId++
                    this.attendances.push(JSON.parse(JSON.stringify(this.attobj)))
                }
                if(obj2==this.homeworks.length){
                    return 
                }
                else{
                    this.homeworks.length=0
                    this.homobj.homId=0
                    for( let j=0;j<obj2;j++){
                        this.homobj.homId++
                        this.homeworks.push(JSON.parse(JSON.stringify(this.homobj)))   
                    }
                }
            } 
        }
    }
}
</script>

<style>
    
</style>