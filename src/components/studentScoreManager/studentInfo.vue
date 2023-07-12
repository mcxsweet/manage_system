<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
            <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
                <el-option v-for="(item, index) in courseList" :key="index" :label="item.courseName" :value="index">
                    <span style="float: left">{{ item.courseName }}</span>
                    <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">
                        {{ item.termStart }}-{{ item.termEnd }}.{{ item.term }}</span>
                </el-option>
            </el-select>
            <el-button icon="el-icon-search" style="margin: 10px" @click="showCurrentCourse()">确定</el-button>
            <span style="color:red">* 说明: 导入的学生名单建议采用教务系统名单</span>

            <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>
        </el-header>


        <el-main v-show="ischoose">

            <el-button class="ButtonStyle" type="primary" @click="isShowAdd = !isShowAdd">添加学生</el-button>
            <el-button class="ButtonStyle" @click="showUpload = true" type="primary">导入学生名单</el-button>
            <!-- 上传学生名单 -->
            <el-dialog title="上传xls文件" :visible.sync="showUpload" style="text-align: center;">
                <el-form>
                    <input type="file" @change="handleFileUpload" />
                    <el-button type="submit" size="mini" @click.prevent="uploadFile()">上传文件</el-button>
                </el-form>
            </el-dialog>

            <!-- 添加学生信息 -->
            <el-dialog title="添加学生信息" :visible.sync="isShowAdd" style="text-align: center;">
                <el-form label-width="50px" class="demo-ruleForm">
                    <el-form-item label="学号">
                        <el-input v-model="addFormData.studentNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="addFormData.studentName"></el-input>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-input v-model="addFormData.className"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowAdd = false">取 消</el-button>
                    <el-button type="primary" @click="addStudent()">确 定</el-button>
                </div>
            </el-dialog>

            <el-table v-loading="loading" :data="tableData" border style="width: 100%">
                <el-table-column label="序号" width="50px">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="学号">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.studentNumber" v-show="scope.row.ised"></el-input>
                        <span v-show="!scope.row.ised">{{ scope.row.studentNumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.studentName" v-show="scope.row.ised"></el-input>
                        <span v-show="!scope.row.ised">{{ scope.row.studentName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="班级">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.className" v-show="scope.row.ised"></el-input>
                        <span v-show="!scope.row.ised">{{ scope.row.className }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editStudent(scope.$index)">编辑</el-button>
                        <el-button type="success" size="mini" @click="saveStudent(scope.$index)">保存</el-button>
                        <el-button type="danger" size="mini" @click="deleteStudent(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
import api from '@/api/api';
import axios from 'axios';
import { Loading } from 'element-ui';

export default {
    name: "studentInfo",
    data() {
        return {
            currentId: "",
            currentCourse: "",
            ischoose: false,
            courseList: [],

            //上传学生名单
            showUpload: false,
            isShowAdd: false,
            addFormData: {},

            //表格数据
            tableData: [],
            loading: false,
        }
    },
    methods: {
        //获取用户课程信息
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },
        //点击课程选择框
        focusOnSelect() {
            this.ischoose = false;
            this.currentCourse = "";
        },
        //获取学生信息
        getStudentInfo() {
            this.loading = true;
            api.get("/student/" + this.currentId + "/getStudent", "", (resp) => {
                if (resp.data.flag) {
                    for (let index = 0; index < resp.data.data.length; index++) {
                        resp.data.data[index].ised = false;
                    }
                    this.tableData = resp.data.data;
                    this.loading = false;
                }
            })
        },
        //点击按钮
        showCurrentCourse() {
            this.currentId = this.courseList[this.currentCourse].id;
            this.courseName = this.courseList[this.currentCourse].courseName;
            this.ischoose = true;
            localStorage.setItem('courseId', this.currentId);
            localStorage.setItem('courseName', this.courseName);
            this.getStudentInfo();
        },
        //选择上传文件
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0]
        },
        //上传文件
        uploadFile() {
            let loadingInstance = Loading.service({ fullscreen: true });
            const formData = new FormData()
            formData.append('file', this.selectedFile)
            axios.post("/student/" + this.currentId + "/studentInfo", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                if (response.data.flag) {
                    this.showUpload = !this.showUpload;
                    this.$message({
                        type: 'success',
                        message: response.data.message
                    });
                    this.getStudentInfo();
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
            })
            loadingInstance.close();
        },
        //添加学生信息
        addStudent() {
            this.addFormData.courseId = this.currentId;
            api.post("/student/addStudent", this.addFormData, (resp) => {
                if (resp.data.flag) {
                    this.isShowAdd = false;
                    this.getStudentInfo();
                }
            })
        },
        //删除学生信息
        deleteStudent(item) {
            this.$confirm('是否删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(item);
                api.del("/student/deleteStudent", item, (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '删除失败!'
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
        //编辑学生信息
        editStudent(index) {
            this.tableData[index].ised = true;
        },
        //保存学生信息
        saveStudent(index) {
            api.put("/student/updateStudent", this.tableData[index], (resp) => {
                if (resp.data.flag) {
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    this.tableData[index].ised = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: resp.data.message
                    });
                }
            })
        }
    },
    mounted() {
        this.getMessage();
        this.currentId = localStorage.getItem("courseId");
        this.currentCourse = localStorage.getItem("courseName");
        if (this.currentId) {
            this.ischoose = true;
            this.getStudentInfo();
        }
    },
}
</script>

<style scoped>
.ButtonStyle {
    margin-bottom: 10px;
}
</style>