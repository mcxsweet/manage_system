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
            <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseItem()"
                v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
            <span style="color:red">* 说明: 上传文件时可以先下载文件模板,在自己电脑填写后在上传</span>

            <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
        </el-header>

        <el-main v-if="ischoose">

            <el-button style="margin-bottom: 1vw;" type="primary" @click="downLoad()">下载模板</el-button>
            <el-button style="margin-bottom: 1vw;" type="primary" @click="showUpload = !showUpload">上传xls文件导入成绩</el-button>
            <el-button style="margin-bottom: 1vw;" type="primary" @click="downLoad()">下载文件导出成绩</el-button>

            <div v-if="!isEmpty">
                <el-table border="true" :header-cell-style="tableHeader" :data="tableData" height="600">

                    <el-table-column label="序号" width="50px">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="学号" prop="studentNumber">
                    </el-table-column>
                    <el-table-column label="姓名" prop="studentName">
                    </el-table-column>
                    <el-table-column label="班级" prop="className">
                    </el-table-column>

                    <!-- 遍历表格列 -->
                    <el-table-column v-for="item, index in examMethods" :label="item" :key="index">
                        <template slot-scope="scope">
                            <span v-if="scope.row.scoreResponse != null" v-show="!scope.row.ised">
                                {{ scope.row.scoreResponse[index] }}</span>
                            <el-input v-model="scope.row.scoreResponse[index]" v-show="scope.row.ised"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column label="总分">
                        <template slot-scope="scope">
                            <p v-if="scope.row.score < 60" style="color: red;">{{ scope.row.score }}</p>
                            <p v-if="scope.row.score >= 60" style="color: green;">{{ scope.row.score }}</p>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="200px" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-show="!scope.row.ised" type="primary" style="margin-left: 1vw ;" size="mini"
                                @click="setting(scope.$index)">编辑</el-button>

                            <el-button v-show="scope.row.ised" type="success" style="margin-left: 1vw ;" size="mini"
                                @click="saveData(scope.$index)">保存</el-button>

                            <el-button type="danger" style="margin-left: 1vw ;" size="mini"
                                @click="delectData(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-if="isEmpty">
                <el-result icon="warning" title="当前课程平时考核方式未设置！" subTitle="请先对考核方式进行设置">
                </el-result>
            </div>

            <el-dialog v-if="showUpload" title="上传文件" :visible.sync="showUpload" style="text-align: center;">
                <form>
                    <input type="file" @change="handleFileUpload" />
                    <button type="submit" @click.prevent="uploadFile">点击上传</button>
                </form>
            </el-dialog>

        </el-main>
    </el-container>
</template>

<script>
import api from '@/api/api'
import axios from 'axios'
import global from '@/script/global'
import { Loading } from 'element-ui';

export default {
    name: "usualPerformanceTable",
    data() {
        return {
            //表格显示
            ischoose: false,
            //当前课程id
            currentId: "",
            getId: "",//localstrage中的courseID
            //课程名称
            currentCourse: "",
            //教师课程列表
            courseList: [],
            //表格数据
            tableData: [],
            dataObj: { studentNumber: "", studentName: "", className: "", scoreDetails: [], courseId: "" },
            setDataObj: { studentNumber: "", studentName: "", className: "", scoreResponse: [], courseId: "" },

            index: 0,
            //考核方式列表遍历表格列
            examMethods: [],
            isEmpty: false,

            //文件上传弹窗
            showUpload: false,

            //界面加载控件
            fullscreenLoading: false,
            //导入弹窗加载控件
            exportLoading: false,
        }
    },
    methods: {
        //下载文件
        downLoad() {
            window.location.href = global.BaseUrl + "/student/" + this.currentId + "/studentUsualScoreExcl";
        },

        //上传文件
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0]
        },
        uploadFile() {
            let loadingInstance = Loading.service({ fullscreen: true });
            const formData = new FormData()
            formData.append('file', this.selectedFile)
            axios.post(global.runTiemPath + "/student/" + this.currentId + "/studentUsualScoreExcl", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                if (response.data.flag) {
                    this.getStudentScore();
                    this.showUpload = !this.showUpload;
                    this.$message({
                        type: 'success',
                        message: response.data.message
                    });
                    loadingInstance.close();
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    });
                    loadingInstance.close();
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: error.data.message
                });
            });
        },

        //表格标题字体居中
        tableHeader({ row, column, rowIndex, columnIndex }) {
            return 'text-align:center'
        },

        //点击课程选择框
        focusOnSelect() {
            this.tableData = [];
            this.ischoose = false;
            this.currentId = "";
            this.isEmpty = false;
            this.getId = "";
        },

        //初始化表格
        getCurrentCourseItem() {
            this.fullscreenLoading = true;

            this.currentId = this.courseList[this.currentCourse].id;

            this.getExamMethods();
            this.getStudentScore();

            if (this.tableData) {
                this.ischoose = true;
            }

            localStorage.setItem('courseId', this.courseList[this.currentCourse].id);
            localStorage.setItem('courseName', this.courseList[this.currentCourse].courseName);
            this.fullscreenLoading = false;

        },

        //获取课程列表   
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },

        //获取学生平时成绩信息
        getStudentScore() {
            api.get("/student/" + this.currentId + "/getUsualStudent", "", (resp) => {
                for (let index = 0; index < resp.data.data.length; index++) {
                    resp.data.data[index].ised = false;
                }
                this.tableData = resp.data.data;
                this.fullscreenLoading = false;
            })
        },

        //编辑模式
        setting(index1) {
            this.tableData[index1].ised = true;
        },

        //编辑保存
        saveData(index) {
            this.tableData[index].studentId = this.tableData[index].id;
            this.tableData[index].scoreDetails = JSON.stringify(this.tableData[index].scoreResponse);

            api.post("/student/addUsualScore", this.dataObj, (respanse) => { })
            if (this.tableData[index].usualScoreId) {
                api.put("/student/updateStudentUsualScore", this.tableData[index], (respanse) => {
                    if (respanse.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.getStudentScore();
                    } else {
                        this.$message({
                            type: 'error',
                            message: "修改失败"
                        });
                    }
                })
            } else {
                api.post("/student/addUsualScore", this.tableData[index], (respanse) => {
                    if (respanse.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.getStudentScore();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '添加失败'
                        });
                    }
                })
            }


        },

        //添加数据
        insertData() {
            this.dataObj.courseId = this.currentId;
            api.post("/student/addStudent", this.dataObj, (resp) => {
                if (resp.data.flag) {
                    this.dataObj.studentId = resp.data.message;
                    this.dataObj.scoreDetails = JSON.stringify(this.dataObj.scoreDetails);
                    api.post("/student/addUsualScore", this.dataObj, (respanse) => {
                        if (respanse.data.flag) {
                            this.$message({
                                type: 'success',
                                message: '成功!'
                            });
                            this.getStudentScore();
                            this.isShow1 = !this.isShow1;
                            this.dataObj = { scoreDetails: [] };
                            for (var i = 0; i < this.examMethods.length; i++) {
                                this.dataObj.scoreDetails.push("");
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: respanse.data.message
                            });
                        }
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: resp.data.message
                    });
                }
            })
        },

        //删除数据
        delectData(index) {
            this.$confirm('是否删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/student/deleteStudentUsualScore", this.tableData[index], (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '成功!'
                        });
                        this.getStudentScore();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },

        //获取考核方式
        getExamMethods() {
            api.get("/student/" + this.currentId + "/getMethods", "", (resp) => {
                this.examMethods = resp.data.data;
                this.dataObj.scoreDetails = [];
                for (var i = 0; i < this.examMethods.length; i++) {
                    this.dataObj.scoreDetails.push("");
                }
                if (resp.data.data.length == 0) {
                    this.isEmpty = true;
                }
            })
        },

    },
    mounted() {
        this.getMessage();
        this.getId = localStorage.getItem('courseId');
        this.currentId = this.getId;
        this.currentCourse = localStorage.getItem("courseName");
        if (this.getId != "") {
            this.fullscreenLoading = true;
            this.ischoose = true;
            this.getExamMethods();
            this.getStudentScore();
        }
    }
}
</script>

<style></style>