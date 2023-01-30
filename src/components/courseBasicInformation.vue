<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
            <el-row>
                <el-button plain @click="isShow = !isShow">添加</el-button>
                <el-button type="danger" plain>删除</el-button>
                <el-button type="success" plain>搜索</el-button>
                <input type="text" plain placeholder="请输入搜索内容" class="sousuo" v-model="sousuo" @keyup.enter:>
            </el-row>
        </el-header>

        <el-main>
            <el-table :data="tableData" stripe height="80vh">
                <el-table-column align="left" width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" round @click="goto('classInformation')">设置</el-button>
                        <el-button size="mini" type="info"
                            @click="handleExport(scope.$index, scope.row)">Export</el-button>
                        <el-button size="mini" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" label="课程名称" width="200">
                </el-table-column>
                <el-table-column prop="classroomTeacher" label="任课教师" width="140">
                </el-table-column>
                <el-table-column prop="theoreticalHours" label="理论学时" width="100">
                </el-table-column>
                <el-table-column prop="labHours" label="实验学时" width="100">
                </el-table-column>
                <el-table-column prop="className" label="班级名称" width="200">
                </el-table-column>
                <el-table-column prop="term" label="学期" width="140">
                </el-table-column>
                <el-table-column prop="studentsNum" label="学生人数" width="100">
                </el-table-column>
                <el-table-column prop="courseNature" label="课程性质" width="140">
                </el-table-column>
                <el-table-column prop="courseType" label="课程类别" width="140">
                </el-table-column>
                <el-table-column prop="courseTargetNum" label="课程目标数量" width="140">
                </el-table-column>
                <el-table-column prop="indicatorPointsNum" label="指标点数量" width="100">
                </el-table-column>
                <el-table-column prop="indicatorPoints" label="指标点编号" width="140">
                </el-table-column>
            </el-table>
        </el-main>

        <el-dialog title="添加" :visible.sync="isShow">
            <el-form :model="FormData" label-width="100px" class="demo-ruleForm">
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="FormData.courseName"></el-input>
                </el-form-item>
                <el-form-item label="任课教师" prop="classroomTeacher">
                    <el-input v-model="FormData.classroomTeacher"></el-input>
                </el-form-item>
                <el-form-item label="理论学时" prop="theoreticalHours">
                    <el-input v-model="FormData.theoreticalHours"></el-input>
                </el-form-item>
                <el-form-item label="实验学时" prop="labHours">
                    <el-input v-model="FormData.labHours"></el-input>
                </el-form-item>
                <el-form-item label="班级名称" prop="className">
                    <el-input v-model="FormData.className"></el-input>
                </el-form-item>
                <el-form-item label="学期" prop="term">
                    <el-input v-model="FormData.term"></el-input>
                    <!-- <el-date-picker v-model="FormData.term" type="year"></el-date-picker>
                    <span style="margin: auto 20px;">至</span>
                    <el-date-picker v-model="FormData.term" type="year"></el-date-picker> -->
                </el-form-item>
                <el-form-item label="学生人数" prop="studentsNum">
                    <el-input v-model="FormData.studentsNum"></el-input>
                </el-form-item>
                <el-form-item label="课程性质" prop="courseNature">
                    <el-select v-model="FormData.courseNature" placeholder="请选择课程性质">
                        <el-option label="必修" value="必修"></el-option>
                        <el-option label="选修" value="选修"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程类别" prop="courseType">
                    <el-input v-model="FormData.courseType"></el-input>
                </el-form-item>
                <el-form-item label="课程目标数量" prop="courseTargetNum">
                    <el-input v-model="FormData.courseTargetNum"></el-input>
                </el-form-item>
                <el-form-item label="指标点数量" prop="indicatorPointsNum">
                    <el-input v-model="FormData.indicatorPointsNum"></el-input>
                </el-form-item>
                <el-form-item label="指标点编号" prop="indicatorPoints">
                    <el-input v-model="FormData.indicatorPoints"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import api from '@/api/api'
export default {
    name: "courseBasicInformation",
    data() {
        return {
            tableData: [],
            FormData: {
                className: "计算机科学与技术2020",
                classroomTeacher: "阳老师",
                courseName: "高数",
                courseNature: "必修",
                courseTargetNum: 5,
                courseType: "专业必修课",
                indicatorPoints: "指标1,指标2",
                indicatorPointsNum: 2,
                labHours: 4,
                studentsNum: 80,
                term: "2022-2023.1",
                theoreticalHours: 16,
            },
            isShow: false
        }
    },
    methods: {
        goto(url) {
            this.$router.push({ path: '/MainPage/' + url });
        },
        getMessage() {
            api.get("/courseInfo", "", (resp) => {
                this.tableData = resp.data.data;
            })
        },
        handleExport(index, object) {
            window.location.href = "http://localhost:8080/courseInfo/export/" + object.id;
        },
        handleDelete(index, object) {
            this.$confirm('是否删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/courseInfo", object, (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getMessage();
                    } else if (resp.status != 200) {
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
        submit() {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isShow = !this.isShow;
                api.post("/courseInfo", this.FormData, (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.getMessage();
                    } else if (resp.status != 200) {
                        this.$message({
                            type: 'error',
                            message: '添加失败!'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        }
    },
    mounted() {
        this.getMessage();
    },
}
</script>

<style>
.sousuo {
    padding: 10px;
    margin: 20px;
    width: 300px;
}
</style>
