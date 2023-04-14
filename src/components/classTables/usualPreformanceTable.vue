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
                <el-table-column label="学号" prop="studentNumber">
                    <!-- <template slot-scope="scope">
                        <el-input v-model="scope.row.studentNumber" v-show="!scope.row.showUser"></el-input>
                        <p v-show="scope.row.showUser">{{ scope.row.studentNumber }}</p>
                    </template> -->
                </el-table-column>
                <el-table-column label="姓名" prop="studentName">
                    <!-- <template slot-scope="scope">
                        <el-input v-model="scope.row.studentName" v-show="!scope.row.showUser"></el-input>
                        <p v-show="scope.row.showUser">{{ scope.row.studentName }}</p>
                    </template> -->
                </el-table-column>
                <el-table-column label="班级" prop="className">
                    <!-- <template slot-scope="scope">
                        <el-input v-model="scope.row.className" v-show="!scope.row.showUser"></el-input>
                        <p v-show="scope.row.showUser">{{ scope.row.className }}</p>
                    </template> -->
                </el-table-column>

                <el-table-column v-for="item, index in examMethods" :label="item.message" :prop="item.data" :key="index">
                </el-table-column>

                <el-table-column label="总分">
                </el-table-column>

                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" style="margin-left: 1vw ;" size="mini"
                            @click="setting(scope.$index)">编辑</el-button>

                        <el-button type="danger" style="margin-left: 1vw ;" size="mini"
                            @click="delectData(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button style="margin-top: 1vw;" type="primary" @click="addData">添加</el-button>
            <el-button style="margin-top: 1vw;" type="primary" @click="showUpload = !showUpload">上传文件</el-button>
            <el-button style="margin-top: 1vw;" type="primary" @click="test()">下载文件</el-button>

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

                    <el-form-item v-if="isattendanceScore" label="考勤" prop="attendanceScore">
                        <el-input v-model="tableData[index].attendanceScore"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isquizScore" label="课堂提问分" prop="quizScore">
                        <el-input v-model="tableData[index].quizScore"></el-input>
                    </el-form-item>
                    <el-form-item v-if="ismidTermScore" label="期中考核成绩" prop="midTermScore">
                        <el-input v-model="tableData[index].midTermScore"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isworkScore" label="作业分" prop="workScore">
                        <el-input v-model="tableData[index].workScore"></el-input>
                    </el-form-item>


                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="success" style="margin: 1vh ;" @click="saveData(tableData[index])">保存</el-button>
                    <el-button type="danger" style="margin: 1vh ;" @click="isShow = false">取消</el-button>
                </div>
            </el-dialog>

            <el-dialog title="上传文件" :visible.sync="showUpload" style="text-align: center;">
                <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
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
            dataObj: { studentNumber: "", studentName: "", className: "", score: 0, showScore: true, showUser: true },
            isShow: false,
            index: 0,
            //考核方式列表遍历表格列
            examMethods: [],
            isattendanceScore: false,
            isworkScore: false,
            isquizScore: false,
            ismidTermScore: false,

            //文件上传弹窗
            showUpload: false,
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

                // for (let index = 0; index < resp.data.data.length; index++) {
                //     resp.data.data[index].showUser = true
                //     resp.data.data[index].showScore = true
                // }

                this.tableData = resp.data.data;

            })
        },
        addData() {
            this.tableData.push(JSON.parse(JSON.stringify(this.dataObj)))

        },
        setting(index1) {
            this.isShow = !this.isShow;
            this.index = index1;
            for (var i = 0; i < this.examMethods.length; i++) {
                switch (this.examMethods[i].data) {
                    case "attendanceScore":
                        this.isattendanceScore = true;
                        break;
                    case "workScore":
                        this.isworkScore = true;
                        break;
                    case "quizScore":
                        this.isquizScore = true;
                        break;
                    case "midTermScore":
                        this.ismidTermScore = true;
                        break;
                }
            }
        },
        //修改数据
        saveData() {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isShow = !this.isShow;
                api.put("/student/updateStudent", this.tableData[this.index], (resp) => {
                    if (resp.data.flag) {
                        this.tableData[this.index].studentId = this.tableData[this.index].id;
                        this.tableData[this.index].id = this.tableData[this.index].usualScoreId;
                        api.put("/student/updateStudentUsualScore", "", (respanse) => {
                        })
                    }
                })
            }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },

        //添加数据
        insertData() {

        },
        delectData(index) {
            this.tableData.splice(index, 1);
        },
        test(param) {
            console.log(param);
        },

        //获取考核方式
        getExamMethods() {
            api.get("/student/10/getMethods", "", (resp) => {
                this.examMethods = resp.data.data;
            })
        },

        //点击课程选择框
        focusOnSelect() {
            this.tableData = [];
            this.ischoose = false;
            this.currentId = "";
        },
    },
    mounted() {
        this.getExamMethods();
        this.getMessage();
        this.getStudentScore();
        if (this.$route.query.id) {
            this.currentId = this.$route.query.id;

        }
    }
}
</script>

<style></style>