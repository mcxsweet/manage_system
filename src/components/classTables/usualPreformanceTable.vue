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
            <el-table border="true" :header-cell-style="tableHeader" :data="tableData" v-show="!ischoose">
                <el-table-column label="学号">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.studentNumber" v-show="!scope.row.showUser"></el-input>
                        <p v-show="scope.row.showUser">{{ scope.row.studentNumber }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="姓名">
                    <template slot-scope="scope">
                       <el-input v-model="scope.row.studentName" v-show="!scope.row.showUser"></el-input> 
                        <p v-show="scope.row.showUser">{{ scope.row.studentName }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="班级">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.className" v-show="!scope.row.showUser"></el-input>
                        <p v-show="scope.row.showUser">{{ scope.row.className }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="作业分">
                    <template slot-scope="scope">
                         <el-input type="number" v-model="scope.row.score" v-show="!scope.row.showScore"></el-input>
                        <p v-show="scope.row.showScore">{{ scope.row.score }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="课堂提问分">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.score" v-show="!scope.row.showScore"></el-input>
                        <p v-show="scope.row.showScore">{{ scope.row.score }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="期中考核成绩">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.score" v-show="!scope.row.showScore"></el-input>
                        <p v-show="scope.row.showScore">{{ scope.row.score }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="实验分">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.score" v-show="!scope.row.showScore"></el-input>
                        <p v-show="scope.row.showScore">{{ scope.row.score }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="170px">
                    <template slot-scope="scope">
                        <el-button type="primary"  style="margin: 1vh ;" size="mini" @click="setting(scope.$index)">编辑</el-button>
                        
                        <el-button type="danger" style="margin: 1vh ;" size="mini" @click="delectData(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="addData">添加</el-button>
            <el-dialog title="编辑" :visible.sync="isShow">
                <el-form :model="tableData[index]">
                    <el-form-item label="学号" prop="studentNumber">
                        <el-input v-model="tableData[index].studentNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名" prop="studentName">
                        <el-input v-model="tableData[index].studentName"></el-input>
                    </el-form-item>
                    <el-form-item label="班级" prop="className">
                        <el-input v-model="tableData[index].className"></el-input>
                    </el-form-item>
                    <el-form-item label="作业分" prop="score">
                        <el-input v-model="tableData[index].score"></el-input>
                    </el-form-item>
                    <el-form-item label="课堂提问分" prop="score">
                        <el-input v-model="tableData[index].score"></el-input>
                    </el-form-item>
                    <el-form-item label="其中考核成绩" prop="score">
                        <el-input v-model="tableData[index].score"></el-input>
                    </el-form-item>
                    <el-form-item label="试验分" prop="score">
                        <el-input v-model="tableData[index].score"></el-input>
                    </el-form-item>
                    
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="success" style="margin: 1vh ;" @click="saveData(tableData[index])">保存</el-button>
                    <el-button type="danger" style="margin: 1vh ;" @click="isShow = false">取消</el-button>
                </div>  
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
import api from '@/api/api'
export default {
    name: "usualPerformanceTable",
    data() {
        return {
            //表格显示
            ischoose: false,
            //课程名称
            currentCourse: "",
            //教师课程列表
            courseList: [],
            //表格数据
            tableData: [],
            dataObj:{studentNumber:"",studentName:"",className:"",score:0,showScore:true,showUser:true},
            isShow : false,
            index :0
        }
    },
    methods: {
        //表格标题字体居中
        tableHeader({ row, column, rowIndex, columnIndex }) {
            return 'text-align:center'
        },
        //获取课程列表   
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },

        //获取详细信息
        getStudentScore() {
            api.get("/student/10/getStudent", "", (resp) => {
               
                for(let index=0;index<resp.data.data.length;index++){
                    resp.data.data[index].showUser = true
                    resp.data.data[index].showScore = true
                }
                this.tableData = resp.data.data;
                
            })
        },
        addData(){
            this.tableData.push(JSON.parse(JSON.stringify(this.dataObj)))
           
        },
        setting(index1){
            this.isShow = !this.isShow
           this.index = index1
        },
        saveData(){
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isShow = !this.isShow;                                    
                    api.put("/student/updateStudent", this.tableData[this.index], (resp) => { })                  
                }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        delectData(index){
            this.tableData.splice(index, 1);
        //     if (!this.tableData[index].id) {
        //     //删除本地
        //     this.tableData.splice(index, 1);
        // }
        // else {
        //     //删除云端
        //     this.$confirm('是否提交 ?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //     }).then(() => {
        //     api.del("/stduent/deleteStudent/" + this.tableData[index].id, "", (resp) => {
        //         if (resp.data.flag) {
        //         this.$message({
        //             type: 'success',
        //             message: '成功!'
        //         });
        //         this.tableData.splice(index, 1);
        //         } else if (resp.status != 200) {
        //         this.$message({
        //             type: 'error',
        //             message: '失败!'
        //         });
        //         }
        //     })
        //     }).catch(() => {
        //     this.$message({
        //         type: 'info',
        //         message: '已取消'
        //     });
        //     });
        // }
        },
        test(param) {
            console.log(param);

        },

        //点击课程选择框
        focusOnSelect() {
            this.tableData = [];
            this.ischoose = false;
            this.currentId = "";
        },
    },
    mounted() {
        this.getMessage();
        this.getStudentScore();
        if (this.$route.query.id) {
            this.currentId = this.$route.query.id;

        }
    }
}
</script>

<style></style>