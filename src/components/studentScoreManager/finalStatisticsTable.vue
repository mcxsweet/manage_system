<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
            <el-select v-if="reload" v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
                <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
                    <span style="float: left">{{ item.courseName }}</span>
                    <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">
                        {{ item.termStart }}-{{ item.termEnd }}.{{ item.term }}</span>
                </el-option>
            </el-select>
            <el-button icon="el-icon-search" style="margin-right;: 10px"
        @click="getCurrentCourseExam()">确定</el-button>
                <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
        </el-header>

        <el-main v-if="ischoose">
           
            <!-- 学生期末成绩信息表格 -->
            <div v-if="!isEmpty">
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
                                    <span v-if="scope.row.scoreDetails != null">
                                        {{ scope.row.scoreResponse[index][index2] }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column label="总分" width="100px">
                        <template slot-scope="scope">
                            {{ scope.row.score }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="210px">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="settingData(scope.$index)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="deleteData(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-button type="primary" @click="addData">添加学生信息</el-button>
                <el-button style="margin-top: 1vw;" type="primary" @click="showUpload = !showUpload">上传文件</el-button>
                <el-button style="margin-top: 1vw;" type="primary" @click="downLoad()">下载文件</el-button>

                <!--  -->
                <el-dialog title="上传文件" :visible.sync="showUpload" style="text-align: center;">
                    <el-form>
                        <input type="file" @change="handleFileUpload" />
                        <el-button type="submit" size="mini" @click.prevent="uploadFile()">上传文件</el-button>
                    </el-form>
                </el-dialog>
            </div>

            <div v-if="isEmpty">
                <el-result icon="warning" title="当前课程期末考核方式未设置！" subTitle="请先对试卷进行设置">
                    <!-- <template slot="extra">
                        <el-button type="primary" size="medium">返回</el-button>
                    </template> -->
                </el-result>
            </div>

            <!--  -->
            <el-dialog title="编辑" :visible.sync="showdialog" v-if="showdialog">
                <el-form :model="setDataObj">
                    <el-form-item label="学号">
                        <el-input v-model="setDataObj.studentNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名">
                        <el-input v-model="setDataObj.studentName"></el-input>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-input v-model="setDataObj.className"></el-input>
                    </el-form-item>
                    <div v-for="item, index in examPper" :key="index">
                        <p>{{ item.message }}</p>
                        <el-form-item v-for="item2, index2 in item.data" :key="index2" :label="item2">
                            <el-input v-model="setDataObj.scoreResponse[index][index2]"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="success" style="margin: 1vh ;" @click="savesetData()">保存</el-button>
                    <el-button type="danger" style="margin: 1vh ;" @click="showdialog = false">取消</el-button>
                </div>
            </el-dialog>

            <!-- 添加数据 -->
            <el-dialog title="添加" :visible.sync="showdialog2" v-if="showdialog2">
                <el-form :model="tableDataObj">
                    <el-form-item label="学号">
                        <el-input v-model="tableDataObj.studentNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名">
                        <el-input v-model="tableDataObj.studentName"></el-input>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-input v-model="tableDataObj.className"></el-input>
                    </el-form-item>
                    <div v-for="item, index in examPper" :key="index">
                        <p>{{ item.message }}</p>
                        <el-form-item v-for="item2, index2 in item.data" :key="index2" :label="item2">
                            <el-input v-model="tableDataObj.scoreDetails[index][index2]"></el-input>
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
import axios from 'axios'
import global from '@/script/global'

export default {
    name: "finalStatisticsTable",
    data() {
        return {

            currentId: "",
            currentCourse: "",
            courseList: [],
            //事件全局中线把选择填空数目传过来
            tableData: [],
            //题型和分数
            questions: [],
            score: [1, 2, 3, 4, 45, 43],

            test: [],
            //添加数据模型
            tableDataObj: { studentNumber: "", studentName: "", className: "", courseId: "", scoreDetails: [[]] },
            //编辑数据模型
            setDataObj: { studentNumber: "", studentName: "", className: "", courseId: "", scoreResponse: [[]] },

            ischoose: false,
            isEmpty: false,

            index: 0,
            showdialog: false,
            showdialog2: false,
            showUpload: false,
            reload: false,

            //试卷列
            examPper: [],

        }
    },
    methods: {

        // 获取表格列（试卷信息）
        getExamPaper() {
            api.get("/student/" + this.currentId + "/getFinalExamPaper", "", (resp) => {
                if (resp.data.data == null) {
                    this.isEmpty = true;
                } else {
                    this.isEmpty = false;
                    for (let i = 0; i < resp.data.data.length; i++) {
                        resp.data.data[i].data = JSON.parse(resp.data.data[i].data);
                    }
                }
                this.examPper = resp.data.data;
            })
        },

        //获取学生信息
        getStudentScore() {
            api.get("/student/" + this.currentId + "/getFinalScoreStudent", "", (resp) => {
                this.tableData = resp.data.data;
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
        uploadFile() {
            const formData = new FormData()
            formData.append('file', this.selectedFile)
            axios.post("/student/" + this.currentId + "/studentFinalScoreExcl", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                if (response.data.flag) {
                    this.getStudentScore();
                    this.showUpload = !this.showUpload;
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: error.data.message
                });
            })
        },
        //打开添加弹窗
        addData() {
            // this.tableDataObj.scoreDetails = [];
            for (let i = 0; i < this.examPper.length; i++) {
                this.tableDataObj.scoreDetails.push([]);
                this.setDataObj.scoreResponse.push([]);
            }
            this.showdialog2 = !this.showdialog2;
        },
        //打开编辑弹窗
        settingData(index1) {
            this.showdialog = true;
            this.index = index1
            this.setDataObj.id = this.tableData[index1].id;
            this.setDataObj.studentNumber = this.tableData[index1].studentNumber;
            this.setDataObj.studentName = this.tableData[index1].studentName;
            this.setDataObj.className = this.tableData[index1].className;
            this.setDataObj.courseId = this.tableData[index1].courseId;
            this.setDataObj.finalScoreId = this.tableData[index1].finalScoreId;
            this.setDataObj.studentId = this.tableData[index1].studentId;
            this.setDataObj.score = this.tableData[index1].score;

            if (this.tableData[index1].scoreResponse.length > 0) {
                this.setDataObj.scoreResponse = this.tableData[index1].scoreResponse;
            } else {
                this.setDataObj.scoreResponse = [];
                for (let i = 0; i < this.examPper.length; i++) {
                    this.setDataObj.scoreResponse.push([]);
                }
            }
        },

        //添加数据
        saveAddData() {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableDataObj.courseId = 10;
                this.tableDataObj.scoreDetails = JSON.stringify(this.tableDataObj.scoreDetails);
                api.post("/student/addStudent", this.tableDataObj, (resp) => {
                    if (resp.data.data) {
                        this.tableDataObj.studentId = resp.data.message;
                        api.post("/student/addFinalScore", this.tableDataObj, (response) => {
                            if (resp.data.flag && response.data.flag) {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.getStudentScore();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: "发生错误！！"
                                });
                            }
                        })
                    }
                })
                this.tableDataObj = { scoreDetails: [[]] };

            }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
            this.showdialog2 = false
        },

        //修改数据
        savesetData() {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.put("/student/updateStudent", this.setDataObj, (resp) => {
                    if (resp.data.flag) {
                        this.setDataObj.scoreDetails = JSON.stringify(this.setDataObj.scoreResponse);
                        this.setDataObj.studentId = this.setDataObj.id;
                        if (this.setDataObj.finalScoreId) {
                            api.put("/student/updateStudentFinalScore", this.setDataObj, (resp2) => {
                                if (resp2.data.flag) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功!'
                                    });
                                    this.getStudentScore();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: resp2.data.message
                                    });
                                }
                            })
                        } else {
                            api.post("/student/addFinalScore", this.setDataObj, (response) => {
                                if (response.data.flag) {
                                    this.$message({
                                        type: 'success',
                                        message: '添加成功!'
                                    });
                                    this.getStudentScore();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: "发生错误！！"
                                    });
                                }
                            })
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: resp.data.message
                        });
                    }
                })
            }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
            this.showdialog = false
        },

        //删除数据
        deleteData(index) {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/student/deleteStudentFinalScore", this.tableData[index], (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getStudentScore();
                    } else {
                        this.$message({
                            type: 'error',
                            message: resp.data.message
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },

        //下载文件
        downLoad() {
            window.location.href = global.BaseUrl + "/student/" + this.currentId + "/studentFinalScoreExcl";
        },

        //获取课程列表   
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        //点击课程选择框
        focusOnSelect() {
            this.ischoose = false;
            this.currentId = "";
        },
        //初始化表格
        getCurrentCourseItem() {
            if (this.currentId == "") {
                this.currentId = this.courseList[this.currentCourse].id;
            }
            this.examPper = [];
            this.getExamPaper();

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
        this.reload = true;
        // this.getExamPaper();
        // this.getStudentScore();
    }
}
</script>

<style></style>