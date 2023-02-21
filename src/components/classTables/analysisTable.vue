<template>
  <el-container>
    <el-main>
        <el-table border="true" :data="tableData" :span-method="arrSpanmethod" :header-cell-style="tableHeader">
            <el-table-column label="课程成绩分析">
                <el-table-column>
                    <template><span>卷面成绩</span></template>
                </el-table-column>
                <el-table-column prop="name0" label="分数段"></el-table-column>
                <el-table-column prop="name1" label="优"></el-table-column>
                <el-table-column prop="name2" label="良"></el-table-column>
                <el-table-column prop="name3" label="中"></el-table-column>
                <el-table-column prop="name4" label="及格"></el-table-column>
                <el-table-column prop="name5" label="不及格"></el-table-column>
                <el-table-column prop="name6" label="最高分"></el-table-column>
                <el-table-column prop="name7" label="94.5"></el-table-column>
            </el-table-column>
        </el-table>
        <el-table border="true" :data="tableData2" :span-method="arrSpanmethod" :header-cell-style="tableHeader">
            <el-table-column>
                <el-table-column>
                    <template><span>综合成绩</span></template>
                </el-table-column>
                <el-table-column prop="name0" label="分数段"></el-table-column>
                <el-table-column prop="name1" label="优"></el-table-column>
                <el-table-column prop="name2" label="良"></el-table-column>
                <el-table-column prop="name3" label="中"></el-table-column>
                <el-table-column prop="name4" label="及格"></el-table-column>
                <el-table-column prop="name5" label="不及格"></el-table-column>
                <el-table-column prop="name6" label="最高分"></el-table-column>
                <el-table-column prop="name7" label="94.5"></el-table-column>
            </el-table-column>
        </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
    name:'analysisTable',
    data(){
        return{
            tableData:[
                    {
                    name0:'',
                    name1:'90以上',
                    name2:'80-89',
                    name3:'70-79',
                    name4:'60-69',
                    name5:'60分以下',
                    name6:'最低分',
                    name7:'5',                   
                },
                {
                    name0:'人数',
                    name1:'2',
                    name2:'3',
                    name3:'12',
                    name4:'5',
                    name5:'12',
                    name6:'平均分',
                    name7:'66.2',
                },
                {
                    name0:'比例',
                    name1:'5.88',
                    name2:'8.82',
                    name3:'35.3',
                    name4:'14.7',
                    name5:'35.29',
                    name6:'卷面成绩及格率',
                    name7:'64。71',
                },
            ],
            tableData2:[
                    {
                    name0:'',
                    name1:'90以上',
                    name2:'80-89',
                    name3:'70-79',
                    name4:'60-69',
                    name5:'60分以下',
                    name6:'最低分',
                    name7:'5',                   
                },
                {
                    name0:'人数',
                    name1:'2',
                    name2:'3',
                    name3:'12',
                    name4:'5',
                    name5:'12',
                    name6:'平均分',
                    name7:'66.2',
                },
                {
                    name0:'比例',
                    name1:'5.88',
                    name2:'8.82',
                    name3:'35.3',
                    name4:'14.7',
                    name5:'35.29',
                    name6:'卷面成绩及格率',
                    name7:'64。71',
                },
            ]
        }
    },
    methods:{
        tableHeader({row,column,rowIndex,columnIndex}){
            //console.log(row,column,rowIndex,columnIndex);
            return 'text-align:center'
        },
        arrSpanmethod({ row, column, rowIndex, columnIndex }){
          if(columnIndex ===0){
            if(rowIndex % 3 === 0){
                return {
                    rowspan: 3,
                    colspan: 1
                }
            }
                else {
                return {
                rowspan: 0,
                colspan: 0
                };
            }
          }
        },
        getdata(){
            //接收后端数据，数据处理
        }
    },
    created(){
        this.getdata();
        //数据复制：this.tableData[0].name1 = '111'
    }
}
</script>

<style>

</style>
