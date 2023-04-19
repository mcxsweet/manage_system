<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
            <el-row>
                <el-button plain @click="isShow = !isShow">添加</el-button>
                <!-- <el-button type="danger" plain>删除</el-button> -->
                <el-button type="success" plain @click="isShowSearch = !isShowSearch">筛选</el-button>
                <el-button type="primary" @click="over()" v-show="isover">筛选完毕</el-button>
            </el-row>
        </el-header>

        <el-main>
            <el-table :data="tableData" stripe height="73vh" border="true">
                <el-table-column align="left" width="150">
                    <template slot-scope="scope">
                        <!-- <el-button size="mini" type="primary" round
                            @click="goto('classInformation', scope.row.id)">设置</el-button>
                        <el-button size="mini" type="info" @click="handleExport(scope.$index, scope.row)">导出</el-button> -->
                        <el-button size="mini" type="warning"
                            @click="handleOperation(scope.$index, scope.row)">操作</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" label="课程名称" width="200">
                </el-table-column>
                <el-table-column prop="major" label="开设专业" width="200">
                </el-table-column>
                <el-table-column prop="theoreticalHours" label="理论学时" width="100">
                </el-table-column>
                <el-table-column prop="labHours" label="实验学时" width="100">
                </el-table-column>
                <el-table-column prop="className" label="班级名称" width="200">
                </el-table-column>
                <el-table-column label="学期" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.termStart }}-{{ scope.row.termEnd }}.{{ scope.row.term }}
                    </template>
                </el-table-column>
                <el-table-column prop="studentsNum" label="学生人数" width="100">
                </el-table-column>
                <el-table-column prop="courseNature" label="课程性质" width="140">
                </el-table-column>
                <el-table-column prop="courseType" label="课程类别" width="140">
                </el-table-column>

            </el-table>
        </el-main>

        <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="isShow">
            <el-form :model="FormData" label-width="100px" class="demo-ruleForm">
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="FormData.courseName"></el-input>
                </el-form-item>
                <el-form-item label="开设专业">
                    <el-input v-model="FormData.major"></el-input>
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
                    <!-- <el-input v-model="FormData.term"></el-input> -->
                    <el-select v-model="FormData.termStart" placeholder="请选择" style="width: 12vh;">
                        <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <span style="margin-left: 1vh;margin-right: 1vh;">至</span>
                    <el-select v-model="FormData.termEnd" placeholder="请选择" style="width: 12vh;">
                        <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <span style="margin-left: 1vh;margin-right: 1vh;"></span>
                    <el-select v-model="FormData.term" placeholder="请选择学期">
                        <el-option label="第一学期" value="1"></el-option>
                        <el-option label="第二学期" value="2"></el-option>
                    </el-select>
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
                <el-form-item label="所选教材" prop="textBook">
                    <el-input v-model="FormData.textBook"></el-input>
                </el-form-item>
                <el-form-item label="课程目标数量" prop="courseTargetNum">
                    <el-input v-model="FormData.courseTargetNum"></el-input>
                </el-form-item>
                <el-form-item label="指标点数量" prop="indicatorPointsNum">
                    <el-input v-model="FormData.indicatorPointsNum"></el-input>
                </el-form-item>
                <el-form-item label="指标点编号" prop="indicatorPoints">
                    <!-- <el-input v-model="FormData.indicatorPoints"></el-input> -->
                    <el-select v-model="FormData.indicatorPoints" :filterable="true" :multiple="true" placeholder="请选择指标点"
                        style="width:100% ;" :multiple-limit="FormData.indicatorPointsNum">
                        <el-option v-for="item in indicators" :key="item.indicatorName" :label="item.indicatorName"
                            :value="item.indicatorName">
                            <span style="float: left">{{ item.indicatorName }}</span>
                            <span style="margin-left: 1vh; float: left; color: #8492a6; font-size: 13px">
                            {{ item.indicatorContent }}
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 筛选弹出层 -->
        <el-dialog title="筛选 (支持单条件和多条件筛选)" :visible.sync="isShowSearch">
            <el-table :data="searchTable" border="true">
                <el-table-column label="课程名称" width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.courseName"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="班级名称" width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.className"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="学期" width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.termStart" placeholder="请选择起始学年">
                            <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="scope.row.termEnd" placeholder="请选择终止学年">
                            <el-option v-for="item in DataOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="scope.row.term" placeholder="请选择学期">
                            <el-option label="第一学期" value="1"></el-option>
                            <el-option label="第二学期" value="2"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center">
                    <el-button size="mini" type="primary" @click="search()">筛选</el-button>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 操作弹出层 -->
        <!-- <el-dialog title="操作" :visible.sync="isOperation" :show-close="false" width="40%"> -->
        <el-drawer title="我是标题" :visible.sync="isOperation" :with-header="false" direction="ltr">
            <div style="display: flex;flex-wrap: wrap;">
                <p style="width: 100%;margin: 10px;">课程内容设置</p>
                <el-button style="margin: 3vh; width: 20vh;" type="primary" plain
                    @click="goto('classInformation', currentObject.id)">详细课程信息设置</el-button>
                <el-button style="margin: 3vh; width: 20vh;" type="success" plain
                    @click="handleExport(null, currentObject)">导出文件</el-button>
                <!-- <el-button style="margin: 3vh; width: 20vh;" type="primary"
                    @click="handleDelete(currentObject)">删除</el-button> -->

                <p style="width: 100%;margin: 10px;">该行项目设置</p>

                <el-button style="margin: 3vh; width: 20vh;" type="primary" plain
                    @click="goto('basicInformationTable', currentObject.id, currentObject.courseName)">课程考核评价方式</el-button>
                <el-button style="margin: 3vh; width: 20vh;" type="info" plain
                    @click="goto('finalTable', currentObject.id, currentObject.courseName)">试卷设置</el-button>

                <p style="width: 100%;margin: 10px;">课程成绩管理</p>
                <el-button style="margin: 3vh; width: 20vh;"
                    @click="goto('usualPreformanceTable', currentObject.id, currentObject.courseName)" type="primary"
                    plain>平时成绩管理</el-button>
                <el-button style="margin: 3vh; width: 20vh;" @click="goto('finalStatisticsTable')" type="primary"
                    plain>期末试卷成绩</el-button>
                <el-button style="margin: 3vh; width: 20vh;" @click="goto('finalComprehensiveTable')" type="primary"
                    plain>期末综合成绩</el-button>
                <el-button style="margin: 3vh; width: 20vh;" type="success" plain
                    @click="handleExportTest()">导出文件</el-button>
            </div>
        </el-drawer>
        <!-- </el-dialog> -->

        <el-footer>
            <span>总共有{{ tableData.length }}条课程</span>
        </el-footer>
    </el-container>
</template>

<script>
import api from '@/api/api'
export default {
    name: "courseBasicInformation",
    data() {
        return {
            isover: false,
            tableData: [],
            FormData: {},
            isShowSearch: false,
            isShow: false,
            sousuo: '',
            indicators: [],
            DataOptions: [],
            //筛选条件
            searchTable: [{}],
            //控制设置弹出层
            isOperation: false,
            //当前选中的对象
            currentObject: {},

        }
    },
    methods: {
        //初始化学期表格
        initDataOptions() {
            for (let i = 0; i < 10; i++) {
                this.DataOptions.push(new Date().getFullYear() - 3 + i);
            }
        },
        //跳转函数
        goto(url, data, data2) {
            this.$router.push({
                path: '/MainPage/' + url,
                query: {
                    id: data,
                    name: data2
                }
            });
        },

        //点击搜索内容
        search() {
            this.isShowSearch = !this.isShowSearch;
            api.post("/courseInfo/currentUser/" + localStorage.getItem("UserId"), this.searchTable[0], (resp) => {
                this.tableData = resp.data.data;
                this.searchTable = [{}];
            })
            this.isover = true
        },
        over() {
            this.getMessage();
            this.isover = false
        },
        //获取基本信息
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.tableData = resp.data.data;
            })
        },
        //导出
        handleExport(index, object) {
            window.location.href = "http://localhost:8080/courseInfo/export/" + object.id;
        },
        //导出
        handleExportTest() {
            window.location.href = "http://localhost:8080/courseExamPaper/Table";
        },
        //跳转到设置界面
        handleSetting(index, object) {
            classdata: [] = object;
            this.$emit('childClick', classdata);
            this.$bus.$emit("sendCourseID", object.id);
        },
        //删除
        handleDelete(item) {
            this.$confirm('是否删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/courseInfo", item, (resp) => {
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
        //提交
        submit() {
            this.$confirm('是否提交 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isShow = !this.isShow;
                this.FormData.teacherId = localStorage.getItem("UserId");

                this.FormData.indicatorPoints = JSON.stringify(this.FormData.indicatorPoints);

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
        },
        //获取指标点列表
        getIndicators() {
            api.get("/courseInfo/indicators", "", (resp) => {
                this.indicators = resp.data.data;
            })
        },
        //弹出操作界面
        handleOperation(index, object) {
            this.isOperation = !this.isOperation;
            this.currentObject = object;

        }

    },
    // 监听数据
    watch: {
        "FormData.termStart": {
            handler() {
                this.FormData.termEnd = this.FormData.termStart + 1;
            }
        }
    },
    mounted() {
        this.getIndicators();
        this.getMessage();
        this.initDataOptions();
        this.FormData.classroomTeacher = localStorage.getItem("TeacherName");
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