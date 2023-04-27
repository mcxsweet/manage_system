<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
            <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
                <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
                    <span style="float: left">{{ item.courseName }}</span>
                    <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">
                        {{ item.termStart }}-{{ item.termEnd }}.{{ item.term }}</span>
                </el-option>
            </el-select>
            <el-button icon="el-icon-search" :circle="true" style="margin-left: 10px"
                @click="getCurrentCourseItem()"></el-button>
        </el-header>

        <el-main>

            <!-- 学生期末成绩信息表格 -->
            <el-table boder="true" :header-cell-style="tableHeader" :data="tableData">
                <el-table-column label="序号" width="50px">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="学号" prop="studentNumber" width="150px">
                </el-table-column>
                <el-table-column label="姓名" prop="studentName" width="100px">
                </el-table-column>
                <el-table-column label="班级" prop="className" width="200px">
                </el-table-column>

                <el-table-column label="试卷">
                    <el-table-column v-for="item, index in examPper" :key="index" :label="item.message">
                        <el-table-column v-for="item2, index2 in item.data" :key="index2" :label="item2" width="50px">
                            <template slot-scope="scope">
                                <span v-if="scope.row.scoreResponse[0] != null">
                                    {{ scope.row.scoreResponse[index][index2] }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="总分" width="100px">
                </el-table-column>
                <el-table-column label="操作" width="210px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="settingData(scope.$index)">编辑</el-button>
                        <el-button size="mini" type="success">保存</el-button>
                        <el-button size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>


            <el-button type="primary" @click="addData">添加学生信息</el-button>
            <el-button style="margin-top: 1vw;" type="primary" @click="showUpload = !showUpload">上传文件</el-button>
            <el-button style="margin-top: 1vw;" type="primary" @click="test()">下载文件</el-button>

            <!--  -->
            <el-dialog title="上传文件" :visible.sync="showUpload" style="text-align: center;">
                <el-form>
                    <input type="file" @change="handleFileUpload" />
                    <el-button type="submit" size="mini" @click.prevent="uploadFile">上传文件</el-button>
                </el-form>
            </el-dialog>

            <!--  -->
            <el-dialog title="编辑" :visible.sync="showdialog">
                <el-form :model="setDataObj">
                    <el-form-item label="学号" prop="studentNumber">
                        <el-input v-model="setDataObj.studentNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名" prop="studentName">
                        <el-input v-model="setDataObj.studentName"></el-input>
                    </el-form-item>
                    <el-form-item label="班级" prop="className">
                        <el-input v-model="setDataObj.className"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="success" style="margin: 1vh ;" @click="savesetData()">保存</el-button>
                    <el-button type="danger" style="margin: 1vh ;" @click="showdialog = false">取消</el-button>
                </div>
            </el-dialog>

            <!--  -->
            <el-dialog title="添加" :visible.sync="showdialog2">
                <el-form :model="tableDataObj">
                    <el-form-item label="学号" prop="studentNumber">
                        <el-input v-model="tableDataObj.studentNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名" prop="studentName">
                        <el-input v-model="tableDataObj.studentName"></el-input>
                    </el-form-item>
                    <el-form-item label="班级" prop="className">
                        <el-input v-model="tableDataObj.className"></el-input>
                    </el-form-item>
                    <div v-for="item, index in examPper" :key="index">
                        <p>{{ item.message }}</p>
                        <el-form-item v-for="item2, index2 in item.data" :key="index2" :label="item2">
                            <el-input v-model="tableDataObj.test[index2]"></el-input>
                        </el-form-item>
                    </div>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="success" style="margin: 1vh ;" @click="saveAddData()">保存</el-button>
                    <el-button type="danger" style="margin: 1vh ;" @click="showdialog2 = false">取消</el-button>
                </div>
            </el-dialog>

        </el-main>
    </el-container>
</template>

<script>
import api from '@/api/api'
export default {
    name: "finalStatisticsTable",
    data() {
        return {

            //事件全局中线把选择填空数目传过来
            tableData: [],
            //题型和分数
            questions: [],
            score: [1, 2, 3, 4, 45, 43],

            tableDataObj: { studentNumber: "", studentName: "", className: "", showData: false, test: [] },
            //编辑弹窗数据
            setDataObj: { studentNumber: "", studentName: "", className: "" },

            ischoose: false,

            index: 0,

            showdialog: false,

            showdialog2: false,

            showUpload: false,

            //试卷列
            examPper: [],
        }
    },
    methods: {

        // 获取表格列（试卷信息）
        getExamPaper() {
            api.get("/student/10/getFinalExamPaper", "", (resp) => {
                for (let i = 0; i < resp.data.data.length; i++) {
                    resp.data.data[i].data = JSON.parse(resp.data.data[i].data);
                }
                this.examPper = resp.data.data;
            })
        },

        //获取学生信息
        getStudentScore() {
            api.get("/student/10/getFinalScoreStudent", "", (resp) => {
                this.tableData = resp.data.data;
                console.log(this.tableData);
                // console.log(this.tableData[0].scoreResponse[0][0]);
            })
        },
        tableHeader({ row, column, rowIndex, columnIndex }) {
            //console.log(row,column,rowIndex,columnIndex);
            return 'text-align:center'
        },
        //选择上传文件
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0]
        },
        test(param) {
            console.log(param);
        },
        addData() {
            this.showdialog2 = !this.showdialog2
        },
        settingData(index1) {
            this.showdialog = !this.showdialog
            this.index = index1
            this.setDataObj.studentNumber = this.tableData[index1].studentNumber
            this.setDataObj.studentName = this.tableData[index1].studentName
            this.setDataObj.className = this.tableData[index1].className
        },
        saveAddData() {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData.push(JSON.parse(JSON.stringify(this.tableDataObj)))
                // const studentData = []
                // studentData.studentName = this.dataObj.studentName
                // studentData.studentNumber = this.dataObj.studentNumber
                // studentData.className = this.dataObj.className

                // api.post("/student/addStudent", studentData, (resp) => { })
            }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
            this.showdialog2 = false
        },

        savesetData() {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData[this.index].studentNumber = this.setDataObj.studentNumber
                this.tableData[this.index].studentName = this.setDataObj.studentName
                this.tableData[this.index].className = this.setDataObj.className
                // api.put("/student/addStudent", studentData, (resp) => { })
            }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
            this.showdialog = false
        },
        //获取课程列表   
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        //点击课程选择框
        focusOnSelect() {
            this.tableData = [];
            this.ischoose = false;
            this.currentId = "";
        },
        //初始化表格
        getCurrentCourseItem() {
            if (this.currentId == "") {
                this.currentId = this.courseList[this.currentCourse].id;
            }
            this.getExamMethods();
            this.getStudentScore();
            this.ischoose = true;

        },

    },
    mounted() {
        if (this.$route.query.id) {
            this.currentId = this.$route.query.id;
            this.currentCourse = this.$route.query.name;
            this.getCurrentCourseItem();
            // this.getStudentScore();
        }
        this.getMessage();
        this.getExamPaper();
        this.getStudentScore();
    }
}
</script>

<style></style>