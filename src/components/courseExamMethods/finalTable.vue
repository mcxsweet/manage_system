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
        </el-header>

        <el-main v-show="ischoose">
            <el-table :data="examItemArray" :border="true" style="width: 100%" default-expand-all="true"
                :header-cell-style="tableHeader">
                <el-table-column label="考核方式" width="200px">
                    <template slot-scope="scope">
                        <p>{{ scope.row.examineItem }}</p>
                    </template>
                </el-table-column>

                <el-table-column label="百分比" width="100px">
                    <template slot-scope="scope">
                        <p>{{ scope.row.percentage }} %</p>
                    </template>
                </el-table-column>

                <el-table-column label="总分" width="100px">
                    <template slot-scope="scope">
                        <p>{{ scope.row.itemScore }}</p>
                    </template>
                </el-table-column>

                <!-- 考核项目 -->
                <el-table-column label="考核项目" :v-if="reloadPage">
                    <template slot-scope="scope">
                        <el-collapse>
                            <el-collapse-item title=" ">
                                <div>
                                    <el-table :data="scope.row.examChildItemArray" style="width: 100%">
                                        <el-table-column label="名称">
                                            <template slot-scope="scope1">
                                                <p>{{ scope1.row.examineChildItem }}</p>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="百分比" width="100px">
                                            <template slot-scope="scope2">
                                                <p>{{ scope2.row.childPercentage }} %</p>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="总分" width="100px">
                                            <template slot-scope="scope3">
                                                <p>{{ scope3.row.childScore }}</p>
                                            </template>
                                        </el-table-column>

                                        <el-table-column label="操作">
                                            <template slot-scope="scope4">
                                                <el-button @click="openWokeSpace(scope.row, scope4.row)">详情</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>

                            </el-collapse-item>
                        </el-collapse>
                    </template>
                </el-table-column>


                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" @click="editExamItem(scope.$index)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="saveExamItem(scope.$index)">保存</el-button>
                    </template>
                </el-table-column>
            </el-table>


            <el-drawer :title="workSpaceTitle" :visible.sync="workSpace" direction="btt" :before-close="handleClose"
                size="80%">

            </el-drawer>
        </el-main>

    </el-container>
</template>

<script>
import api from '@/api/api'

export default {
    name: "finalTable",
    data() {
        return {

            //选择课程后再显示界面
            ischoose: false,
            //当前选择课程索引
            currentCourse: "",
            //当前课程id
            currentId: "",
            //课程列表(后端获取)
            courseList: [],

            //课程考试项目
            examItemArray: [],

            //详细工作区
            workSpace: false,
            workSpaceTitle: "",

            reloadPage: true,
        }
    },
    methods: {
        //表头字体居中
        tableHeader({ row, column, rowIndex, columnIndex }) {
            return 'text-align:center'
        },

        //输入框焦点
        focusOnSelect() {
            this.examItemArray = [];
            this.ischoose = false;
            this.currentId = "";
        },
        //初始化表格数据
        init() {
            if (this.currentId) {
                //获取表单数据
                api.get("/courseExam/courseExamineMethods/" + this.currentId, "", (resp) => {
                    for (let index = 0; index < resp.data.data.length; index++) {
                        resp.data.data[index].isExamineItem = true;
                        resp.data.data[index].isPercentage = true;
                        api.get("/courseExam/courseExamineChildMethods/" + resp.data.data[index].id, "", (resp2) => {
                            for (let j = 0; j < resp2.data.data.length; j++) {
                                resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
                                resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);

                                resp2.data.data[j].isExamineChildItem = true;
                                resp2.data.data[j].isChildPercentage = true;
                                resp2.data.data[j].isCourseTarget = true;
                                resp2.data.data[j].isIndicatorPointsDetail = true;
                            }
                            resp.data.data[index].examChildItemArray = resp2.data.data;
                        })
                    }
                    this.currentCourse = this.$route.query.name;
                    this.examItemArray = resp.data.data;
                })
            } else {
                api.get("/courseExam/courseExamineMethods/" + this.courseList[this.currentCourse].id, "", (resp) => {
                    for (let index = 0; index < resp.data.data.length; index++) {
                        resp.data.data[index].isExamineItem = true;
                        resp.data.data[index].isPercentage = true;
                        api.get("/courseExam/courseExamineChildMethods/" + resp.data.data[index].id, "", (resp2) => {
                            for (let j = 0; j < resp2.data.data.length; j++) {
                                resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
                                resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);

                                resp2.data.data[j].isExamineChildItem = true;
                                resp2.data.data[j].isChildPercentage = true;
                                resp2.data.data[j].isCourseTarget = true;
                                resp2.data.data[j].isIndicatorPointsDetail = true;
                            }
                            resp.data.data[index].examChildItemArray = resp2.data.data;
                        })
                    }
                    this.examItemArray = resp.data.data;
                })
            }
        },

        //获取课程列表
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },

        //选择框值选择后
        getCurrentCourseExam() {
            this.ischoose = true;
            this.init()
        },

        //relode
        forcePage() {
            this.reloadPage = false;
            // this.$nextTick(this.reloadPage = false)
            setTimeout(() => {
                this.reloadPage = true;
            }, 100);
        },

        //打开工作区
        openWokeSpace(item, detail) {
            console.log(item);
            console.log(detail);
            this.workSpaceTitle = item.courseName + " / " + item.examineItem + " / " + detail.examineChildItem
            this.workSpace = !this.workSpace;
        },

        //工作区关闭确认
        handleClose(done) {
            this.$confirm('是否关闭？请记得保存', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                done();
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
        if (this.$route.query.id) {
            this.isReturn = true
            this.currentId = this.$route.query.id;
            this.getCurrentCourseExam();
        }
        this.forcePage();
    },
}
</script>

<style></style>
