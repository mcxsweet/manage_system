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
            <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseItem()"
                v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
            <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
        </el-header>

        <el-main v-if="ischoose">

            <el-button style="margin-bottom: 1vw;" type="primary" @click="addData">添加</el-button>
            <el-button style="margin-bottom: 1vw;" type="primary" @click="showUpload = !showUpload">上传文件</el-button>
            <el-button style="margin-bottom: 1vw;" type="primary" @click="downLoad()">下载文件</el-button>

            <div v-if="!isEmpty">
                <el-table border="true" :header-cell-style="tableHeader" :data="tableData">
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
                            <span v-if="scope.row.scoreResponse != null">
                                {{ scope.row.scoreResponse[index] }}
                            </span>
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
                            <el-button type="primary" style="margin-left: 1vw ;" size="mini"
                                @click="setting(scope.$index)">编辑</el-button>

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
                    <button type="submit" @click.prevent="uploadFile">上传文件</button>
                </form>
            </el-dialog>

            <el-dialog v-if="isShow" title="编辑" :visible.sync="isShow">
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
                    <el-form-item v-for="item, j in examMethods" :label="item" :key="j">
                        <el-input v-model="setDataObj.scoreResponse[j]"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="success" style="margin: 1vh ;" @click="saveData(tableData[index])">保存</el-button>
                    <el-button type="danger" style="margin: 1vh ;" @click="isShow = false">取消</el-button>
                </div>
            </el-dialog>

            <el-dialog v-if="isShow1" title="添加" :visible.sync="isShow1">
                <el-form :model="dataObj">
                    <el-form-item label="学号" prop="studentNumber">
                        <el-input v-model="dataObj.studentNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名" prop="studentName">
                        <el-input v-model="dataObj.studentName"></el-input>
                    </el-form-item>
                    <el-form-item label="班级" prop="className">
                        <el-input v-model="dataObj.className"></el-input>
                    </el-form-item>
                    <el-form-item v-for="item, index in examMethods" :label="item" :key="index">
                        <el-input v-model="dataObj.scoreDetails[index]"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="success" style="margin: 1vh ;" @click="insertData()">保存</el-button>
                    <el-button type="danger" style="margin: 1vh ;" @click="isShow1 = false">取消</el-button>
                </div>
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
            reload: false,
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
            isShow: false,
            isShow1: false,
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
            axios.post("/student/" + this.currentId + "/studentUsualScoreExcl", formData, {
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
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    });
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: error.data.message
                });
            });

            setTimeout(() => {
                loadingInstance.close();
            }, 1000);

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
            this.getId = "";
        },
        //初始化表格
        getCurrentCourseItem() {
            if (this.currentId == "") {
                this.currentId = this.courseList[this.currentCourse].id;
            }
            this.getExamMethods();
            this.getStudentScore();
            if (this.tableData) {
                this.ischoose = true;
            }
            if (this.getId == "") {
                localStorage.setItem('courseId', this.courseList[this.currentCourse].id);
            }

            this.fullscreenLoading = true;
            setTimeout(() => {
                this.fullscreenLoading = false;
            }, 1000);

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
                this.tableData = resp.data.data;
            })
        },
        //打开添加弹窗
        addData() {
            this.isShow1 = !this.isShow1
        },
        setting(index1) {
            this.isShow = !this.isShow;
            this.index = index1;
            this.setDataObj.id = this.tableData[index1].id;
            this.setDataObj.studentNumber = this.tableData[index1].studentNumber;
            this.setDataObj.studentName = this.tableData[index1].studentName;
            this.setDataObj.className = this.tableData[index1].className;
            this.setDataObj.courseId = this.tableData[index1].courseId;
            this.setDataObj.usualScoreId = this.tableData[index1].usualScoreId;
            this.setDataObj.studentId = this.tableData[index1].studentId;
            this.setDataObj.score = this.tableData[index1].score;

            if (this.tableData[index1].scoreResponse.length > 0) {
                this.setDataObj.scoreResponse = this.tableData[index1].scoreResponse;
            } else {
                this.setDataObj.scoreResponse = [];
                for (let i = 0; i < this.examMethods.length; i++) {
                    this.setDataObj.scoreResponse.push("");
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
                api.put("/student/updateStudent", this.setDataObj, (resp) => {
                    if (resp.data.flag) {
                        this.setDataObj.scoreDetails = JSON.stringify(this.setDataObj.scoreResponse);
                        this.setDataObj.studentId = this.setDataObj.id;
                        if (this.setDataObj.usualScoreId) {
                            api.put("/student/updateStudentUsualScore", this.setDataObj, (respanse) => {
                                if (respanse.data.flag) {
                                    this.$message({
                                        type: 'success',
                                        message: '成功!'
                                    });
                                    this.getStudentScore();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: resp.data.message
                                    });
                                }
                            })
                        } else {
                            api.post("/student/addUsualScore", this.setDataObj, (respanse) => {
                                if (respanse.data.flag) {
                                    this.$message({
                                        type: 'success',
                                        message: '成功!'
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: resp.data.message
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
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/student/deleteStudent", this.tableData[index], (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '成功!'
                        });
                        this.tableData.splice(index, 1);
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
        //获取课程基本信息
        getCourse() {
            api.get("/courseInfo/" + this.getId, "", (resp1) => {
                this.currentCourse = resp1.data.data.courseName;
            })
        }

    },
    mounted() {
        this.getId = localStorage.getItem('courseId');
        if (this.getId != "") {
            this.ischoose = true;
            this.currentId = this.getId
            this.getCourse();
            this.getCurrentCourseItem();
        }
        if (this.$route.query.id) {
            localStorage.setItem('courseId', this.$route.query.id);
            this.getId = localStorage.getItem('courseId');
            this.currentId = this.$route.query.id;
            this.currentCourse = this.$route.query.name;
            this.getCurrentCourseItem();
            // this.getStudentScore();
        }
        this.getMessage();
        this.reload = true;


    }
}
</script>

<style></style>