<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;">
            <el-select v-model="currentCourse" placeholder="请选择课程" @focus="focusOnSelect()">
                <el-option v-for="(item, index) in courseList" :key="item.id" :label="item.courseName" :value="index">
                    <span style="float: left">{{ item.courseName }}</span>
                    <span style="margin-left: 1vh; float: right; color: #8492a6; font-size: 13px">
                        {{ item.termStart }}-{{ item.termEnd }}.{{ item.term }}
                    </span>
                </el-option>
            </el-select>
            <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseExam()">确定</el-button>

            <el-button type="danger" v-if="isadmin == 0" v-show="isReturn"
                @click="goto('courseBasicInformation')">返回首页</el-button>
            <el-button type="danger" v-if="isadmin == 1" v-show="isReturn"
                @click="goto('sudoCourseInformation')">返回首页</el-button>

            <el-empty v-if="!ischoose" description="请先选择课程"></el-empty>

        </el-header>

        <el-main v-show="ischoose">
            <el-divider content-position="center">考核方式展示</el-divider>
            <el-table :data="examItemArray" :border="true" style="width: 100%" default-expand-all="true">
                <el-table-column label="考核方式" width="200px">
                    <template slot-scope="scope">
                        <p class="MyButton">{{ scope.row.examineItem }}</p>
                    </template>
                </el-table-column>

                <el-table-column label="百分比" width="150px">
                    <template slot-scope="scope">
                        <p class="MyButton">{{ scope.row.percentage }} %</p>
                    </template>
                </el-table-column>

                <el-table-column label="总分" width="100px">
                    <template slot-scope="scope">
                        <p class="MyButton">{{ scope.row.itemScore }}</p>
                    </template>
                </el-table-column>

                <!-- 考核项目 -->
                <el-table-column label="考核项目">
                    <template slot-scope="scope">
                        <div>
                            <el-button @click="getChildItem(scope.row)" type="success" plain round>查看详情</el-button>
                        </div>
                        <!-- <el-collapse>
                            <el-collapse-item title=" 点击展开">
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
                        </el-collapse> -->
                    </template>
                </el-table-column>
            </el-table>

            <!-- 查看每个考核方式详细信息 -->
            <el-dialog :title="itemTitle" v-if="itemShow" :visible.sync="itemShow" width="50%" append-to-body>
                <div>
                    <el-table :data="itemArrary" style="width: 100%">
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
                                <el-button class="MyButton" @click="openWokeSpace(scope4.row)">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-dialog>

            <!-- 题型与指标点对应关系 -->
            <el-divider content-position="center">全局展示</el-divider>

            <el-button type="primary" @click="openDoc()" style="margin: 1vh;">展示小题和指标点关系文档</el-button>

            <!-- <div v-loading="loading2">
                <embed :src="pdfUrl" type="application/pdf" width="100%" height="500px" />
            </div> -->
            <!-- 展示小题和指标点关系文档 -->
            <el-dialog v-if="isShowDoc" title="展示小题和指标点关系文档" :visible.sync="isShowDoc" width="100%" append-to-body>
                <el-button type="primary" @click="exportPDF()" style="margin: 1vh;">导出PDF</el-button>
                <el-button type="primary" @click="exportXLS()" style="margin: 1vh;">导出XLS</el-button>
                <div v-loading="loading2">
                    <embed :src="pdfUrl" type="application/pdf" width="100%" height="500px" />
                </div>
            </el-dialog>

            <!-- 试卷 -->
            <el-drawer :title="workSpaceTitle" :visible.sync="workSpace" direction="btt" :before-close="handleClose"
                size="90%">
                <el-row :gutter="24">
                    <el-col :span="4">
                        <div style="height: 500px;">

                            <el-row>
                                <el-button style="margin: 1vw;" type="primary"
                                    @click="isAddPaperItem = true">题型添加</el-button>
                            </el-row>
                            <el-row>
                                <el-button style="margin: 1vw;" type="success" @click="updateItem()">题型修改</el-button>
                            </el-row>
                            <el-row>
                                <el-button style="margin: 1vw;" type="danger" @click="deleteItem()">题型删除</el-button>
                            </el-row>

                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div style="margin-bottom: 50px;">
                            <el-result icon="warning" title="当前数据为空" subTitle="请添加数据或返回" v-if="finllPaper.length == 0">
                            </el-result>
                            <el-collapse accordion @change="handleChange">
                                <div v-for="item, index in finllPaper" :key="index">
                                    <el-row>
                                        <el-col :span="23">
                                            <el-collapse-item :name="item.id">
                                                <template slot="title">
                                                    <el-row style="font-size: large;">
                                                        {{ item.itemName }} <i class="el-icon-edit"></i>
                                                    </el-row>
                                                </template>

                                                <el-table v-loading="loading" :data="tableData" border stripe
                                                    style="width: 100%;" height="500">
                                                    <el-table-column label="题号" width="50">
                                                        <template slot-scope="scope">
                                                            <p>{{ scope.row.titleNumber }}</p>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="分值" width="180">
                                                        <template slot-scope="scope">
                                                            <p v-show="!scope.row.isshow">{{ scope.row.score }}</p>
                                                            <el-input v-model="scope.row.score"
                                                                v-show="scope.row.isshow"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="指标点">
                                                        <template slot-scope="scope">
                                                            <div v-for="item1, index in scope.row.indicatorPoints"
                                                                :key="index" v-show="!scope.row.isshow">
                                                                <p>{{ item1 }}</p>
                                                            </div>
                                                            <el-select v-model="scope.row.indicatorPoints"
                                                                style="width:100% ;" v-show="scope.row.isshow"
                                                                multiple="true">
                                                                <el-option
                                                                    v-for="item, index in currentExamineItem.indicatorPointsDetail"
                                                                    :key="index" :value="item">
                                                                    <span style="float: left">{{ item }}</span>
                                                                </el-option>
                                                            </el-select>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="课程目标">
                                                        <template slot-scope="scope">
                                                            <div v-for="item, index in scope.row.courseTarget" :key="index"
                                                                v-show="!scope.row.isshow">
                                                                <p>{{ item }}</p>
                                                            </div>
                                                            <el-select v-model="scope.row.courseTarget" multiple="true"
                                                                style="width:100% ;" v-show="scope.row.isshow">
                                                                <el-option
                                                                    v-for="item, index in currentExamineItem.courseTarget"
                                                                    :key="index" :value="item">
                                                                    <span style="float: left">{{ item }}</span>
                                                                </el-option>
                                                            </el-select>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="操作" width="210px">
                                                        <template slot-scope="scope">
                                                            <el-button style="margin-top:8px ;" type="primary" size="mini"
                                                                @click="popUpUpdate(scope.row)">修改</el-button>
                                                            <el-button style="margin-top:8px ;" type="success" size="mini"
                                                                @click="saveItem(scope.row, scope.$index), scope.row.isshow = false">保存</el-button>
                                                            <el-button style="margin-top:8px ;" type="danger" size="mini"
                                                                @click="deleteDetail(scope.row.id)">删除</el-button>
                                                        </template>
                                                    </el-table-column>

                                                </el-table>
                                                <el-button style="margin-top:8px ;" type="primary" size="mini"
                                                    @click="isAddDetail = !isAddDetail">添加</el-button>
                                                <el-button type="primary" size="mini"
                                                    @click="add1(item, tableData.length)">自动添加小题</el-button>
                                                <el-button @click="svaeAll()" type="success" size="mini"
                                                    align="right">全部保存</el-button>
                                            </el-collapse-item>
                                        </el-col>
                                        <el-col :span="1">
                                            <el-button v-if="isDeletePaperItem" style="margin-top:8px ;" type="danger"
                                                size="mini" @click="deletePaperItem(item.id)">删除</el-button>
                                            <el-button v-if="isUpdatePaperItem" style="margin-top:8px ;" type="primary"
                                                size="mini" @click="updateFormUp(item)">修改</el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-collapse>

                            <!-- 添加 -->
                            <el-dialog title="添加" :visible.sync="isAddPaperItem" width="40%" append-to-body>
                                <el-form :model="addForm">
                                    <el-form-item label="名称">
                                        <el-input v-model="addForm.itemName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="总分">
                                        <el-input v-model="addForm.itemScore"></el-input>
                                    </el-form-item>
                                    <el-form-item label="题数">
                                        <el-input v-model="addForm.itemNum"></el-input>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="isAddPaperItem = false">取 消</el-button>
                                    <el-button type="primary" @click="addPaperItem(addForm.itemNum)">确 定</el-button>
                                </div>
                            </el-dialog>

                            <!-- 修改 -->
                            <el-dialog title="修改" :visible.sync="isUpdateForm" width="40%" append-to-body>
                                <el-form :model="updateForm">
                                    <el-form-item label="名称">
                                        <el-input v-model="updateForm.itemName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="总分">
                                        <el-input v-model="updateForm.itemScore"></el-input>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="isUpdateForm = false">取 消</el-button>
                                    <el-button type="primary" @click="updatePaperItem()">确 定</el-button>
                                </div>
                            </el-dialog>
                            <!-- 修改小题 -->
                            <el-dialog title="修改小题" :visible.sync="isUpdateDetail" width="40%" append-to-body>
                                <el-form :model="updateDetailForm">
                                    <el-form-item label="小题序号">
                                        <el-input type="number" :v-model="updateDetailForm.titleNumber"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分值">
                                        <el-input type="number" v-model="updateDetailForm.score"></el-input>
                                    </el-form-item>
                                    <el-form-item label="指标点">
                                        <el-select v-model="updateDetailForm.indicatorPoints" :multiple="true"
                                            style="width:100% ;">
                                            <el-option v-for="item, index in currentExamineItem.indicatorPointsDetail"
                                                :key="index" :value="item">
                                                <span style="float: left">{{ item }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="课程目标">
                                        <el-select v-model="updateDetailForm.courseTarget" :multiple="true"
                                            style="width:100% ;">
                                            <el-option v-for="item, index in currentExamineItem.courseTarget" :key="index"
                                                :value="item">
                                                <span style="float: left">{{ item }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button type="danger" @click="isUpdateDetail = false">取 消</el-button>
                                    <el-button type="primary" @click="updateDetail()">确 定</el-button>
                                </div>
                            </el-dialog>
                            <!-- 添加小题 -->
                            <el-dialog title="添加" :visible.sync="isAddDetail" width="40%" append-to-body>
                                <el-form :model="addDetailForm">
                                    <el-form-item label="题号">
                                        <el-input v-model="addDetailForm.titleNumber"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分值">
                                        <el-input v-model="addDetailForm.score"></el-input>
                                    </el-form-item>
                                    <el-form-item label="指标点">
                                        <el-select v-model="addDetailForm.indicatorPoints" :multiple="true"
                                            style="width:100% ;">
                                            <el-option v-for="item, index in currentExamineItem.indicatorPointsDetail"
                                                :key="index" :value="item">
                                                <span style="float: left">{{ item }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="课程目标">
                                        <el-select v-model="addDetailForm.courseTarget" :multiple="true"
                                            style="width:100% ;">
                                            <el-option v-for="item, index in currentExamineItem.courseTarget" :key="index"
                                                :value="item">
                                                <span style="float: left">{{ item }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="isAddDetail = false">取 消</el-button>
                                    <el-button type="primary" @click="addDetail()">确 定</el-button>
                                </div>
                            </el-dialog>

                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div style="height: 500px;"></div>
                    </el-col>
                </el-row>


            </el-drawer>
        </el-main>

    </el-container>
</template>

<script>
import api from '@/api/api'
import axios from 'axios';
import global from '@/script/global';

export default {
    name: "finalTable",
    data() {
        return {
            isadmin: 0,
            getId: "",//localstrage中的courseID
            isReturn: false,
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
            //当前工作区选中的考察子项目
            currentExamineItem: {},
            //试卷详情（有小题）
            finllPaper: [],

            tableData: [],
            //表格刷新控件
            loading: true,
            //PDF加载空间
            loading2: true,
            //添加题型控件
            isAddPaperItem: false,
            //添加表单
            addForm: { itemNum: 0 },
            //删除题型按钮控件
            isDeletePaperItem: false,
            //修改题型按钮控件
            isUpdatePaperItem: false,
            //修改表单弹出控件
            isUpdateForm: false,
            //修改小题
            isUpdateDetail: false,
            //修改表单
            updateForm: {},

            //当前题型的Id
            currentTypeId: "",
            //添加小题表单控件
            isAddDetail: false,
            //添加小题表单
            addDetailForm: { titleNumber: 0, score: 0, isshow: false },
            //修改小题表单控件

            //修改小题表单
            updateDetailForm: {},

            //itemNumber:0,
            //整体展示表格
            pdfUrl: null,

            //弹出框title
            itemArrary: [],
            itemTitle: "",
            itemShow: false,
            examItemId: "",
            itemindex: 0,//用于自动保存小题
            itemindex1: 0,
            itemindex2: 0,

            //展示指标点,课程目标和试卷小题之间的关系
            isShowDoc: false,
        }
    },
    methods: {
        getChildItem(data) {
            this.itemArrary = [];
            this.itemTitle = data.examineItem + " 设置"
            this.examItemId = data.id;
            api.get("/courseExam/courseExamineChildMethods/" + data.id, "", (resp2) => {
                for (let j = 0; j < resp2.data.data.length; j++) {
                    resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
                    resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);

                    resp2.data.data[j].isExamineChildItem = true;
                    resp2.data.data[j].isChildPercentage = true;
                    resp2.data.data[j].isCourseTarget = true;
                    resp2.data.data[j].isIndicatorPointsDetail = true;
                }
                this.itemArrary = resp2.data.data;
            })
            this.itemShow = true;
        },

        //输入框焦点
        focusOnSelect() {
            this.examItemArray = [];
            this.ischoose = false;
            this.currentId = "";
            this.getId = "";
        },
        //初始化表格数据
        init() {
            if (this.currentId) {
                //获取表单数据
                api.get("/courseExam/courseExamineMethods/" + this.currentId, "", (resp) => {
                    for (let index = 0; index < resp.data.data.length; index++) {
                        api.get("/courseExam/courseExamineChildMethods/" + resp.data.data[index].id, "", (resp2) => {
                            for (let j = 0; j < resp2.data.data.length; j++) {
                                resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
                                resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);
                            }
                            resp.data.data[index].examChildItemArray = resp2.data.data;
                        })
                    }
                    this.currentCourse = this.$route.query.name;
                    this.examItemArray = resp.data.data;
                })
            } else if (this.getId == "") {
                api.get("/courseExam/courseExamineMethods/" + this.courseList[this.currentCourse].id, "", (resp) => {
                    for (let index = 0; index < resp.data.data.length; index++) {
                        api.get("/courseExam/courseExamineChildMethods/" + resp.data.data[index].id, "", (resp2) => {
                            for (let j = 0; j < resp2.data.data.length; j++) {
                                resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
                                resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);
                            }
                            resp.data.data[index].examChildItemArray = resp2.data.data;
                        })
                    }
                    this.examItemArray = resp.data.data;
                })
            }
            else if (this.getId != "") {
                api.get("/courseInfo/" + this.getId, "", (resp1) => {
                    this.currentCourse = resp1.data.data.courseName;
                })
                api.get("/courseExam/courseExamineMethods/" + this.getId, "", (resp) => {
                    for (let index = 0; index < resp.data.data.length; index++) {
                        api.get("/courseExam/courseExamineChildMethods/" + resp.data.data[index].id, "", (resp2) => {
                            for (let j = 0; j < resp2.data.data.length; j++) {
                                resp2.data.data[j].courseTarget = JSON.parse(resp2.data.data[j].courseTarget);
                                resp2.data.data[j].indicatorPointsDetail = JSON.parse(resp2.data.data[j].indicatorPointsDetail);
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
            this.init();
            // this.initShowTable();
            if (this.getId == "") {
                localStorage.setItem('courseId', this.courseList[this.currentCourse].id);
            }
        },

        //打开工作区
        openWokeSpace(detail) {
            this.workSpaceTitle = this.itemTitle + " / " + detail.examineChildItem
            this.workSpace = true;

            //当前选中的考核项目赋值
            this.currentExamineItem = detail;
            api.get("/courseExamPaper/" + detail.id, "", (resp) => {
                if (resp.data.flag) {
                    this.finllPaper = resp.data.data;
                }
            })
            // this.initShowTable();
        },

        //工作区关闭确认
        handleClose(done) {
            done();
        },

        //点击题型
        handleChange(item) {
            this.loading = true;
            this.currentTypeId = item;
            api.get("/courseExamPaper/detail/" + item, "", (resp) => {
                if (resp.data.data) {
                    this.tableData = resp.data.data;
                    for (let index = 0; index < this.tableData.length; index++) {
                        this.tableData[index].indicatorPoints = JSON.parse(this.tableData[index].indicatorPoints);
                        this.tableData[index].courseTarget = JSON.parse(this.tableData[index].courseTarget);
                        this.tableData[index].isshow = false
                    }
                }
            })
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        },

        addPaperItem1(index) {
            this.itemNumber = index
            this.$confirm('是否添加 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }), then(() => {
                this.addPaperItem();
                this.add(index);
                if (this.tableData.length != 0) {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '添加失败'
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });

        },
        //全部小题保存
        svaeAll() {
            this.itemindex = this.tableData.length
            for (let i = 0; i < this.tableData.length; i++) {
                this.tableData[i].isshow = false;
                this.saveAllItem(this.tableData[i], i)
            }
            this.handleChange(this.currentTypeId);
        },
        //自动添加的小题保存
        saveAllItem(obj, index) {
            obj.primaryId = this.currentTypeId
            if (!this.tableData[index].id) {
                obj.indicatorPoints = JSON.stringify(obj.indicatorPoints);
                obj.courseTarget = JSON.stringify(obj.courseTarget);
                api.post("/courseExamPaper/detail", obj, (resp) => {
                    this.tableData[index].indicatorPoints = JSON.parse(obj.indicatorPoints)
                    this.tableData[index].courseTarget = JSON.parse(obj.courseTarget)
                    if (resp.data.flag) {
                        this.itemindex1++
                        if (this.itemindex1 == this.itemindex) {
                            this.$message({
                                type: 'success',
                                message: '所有小题添加成功!'
                            });
                        }
                    } else {
                        this.itemindex2++
                        if (this.itemindex2 == this.itemindex) {
                            this.$message({
                                type: 'error',
                                message: '保存失败'
                            })
                        }

                    }
                })
            } else {
                this.itemindex1 = 0;
                this.itemindex2 = 0;
                obj.indicatorPoints = JSON.stringify(obj.indicatorPoints);
                obj.courseTarget = JSON.stringify(obj.courseTarget);
                api.put("/courseExamPaper/detail", obj, (resp) => {
                    this.tableData[index].indicatorPoints = JSON.parse(obj.indicatorPoints)
                    this.tableData[index].courseTarget = JSON.parse(obj.courseTarget)
                    if (resp.data.flag) {
                        this.itemindex1++
                        if (this.itemindex1 == this.itemindex) {
                            this.$message({
                                type: 'success',
                                message: '所有小题修改成功!'
                            });
                        }
                    } else {
                        this.itemindex2++
                        if (this.itemindex2 == this.itemindex) {
                            this.$message({
                                type: 'error',
                                message: '修改失败'
                            })
                        }

                    }
                })
            }
        },
        //自动添加的小题保存
        saveItem(obj, index) {
            obj.primaryId = this.currentTypeId
            if (!this.tableData[index].id) {
                obj.indicatorPoints = JSON.stringify(obj.indicatorPoints);
                obj.courseTarget = JSON.stringify(obj.courseTarget);
                console.log("1" + this.tableData[index])
                api.post("/courseExamPaper/detail", obj, (resp) => {
                    this.tableData[index].indicatorPoints = JSON.parse(obj.indicatorPoints)
                    this.tableData[index].courseTarget = JSON.parse(obj.courseTarget)
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: resp.data.message
                        });
                    }
                })
            } else {
                console.log(obj)
                obj.indicatorPoints = JSON.stringify(obj.indicatorPoints);
                obj.courseTarget = JSON.stringify(obj.courseTarget);
                api.put("/courseExamPaper/detail", obj, (resp) => {
                    this.tableData[index].indicatorPoints = JSON.parse(obj.indicatorPoints)
                    this.tableData[index].courseTarget = JSON.parse(obj.courseTarget)
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: resp.data.message
                        });
                    }
                })
            }

        },
        //自动添加小题函数
        add1(obj, len) {
            let index = obj.itemNumber
            this.addDetailForm.titleNumber = len
            let score1 = obj.itemScore / obj.itemNumber
            this.addDetailForm.score = score1
            for (let i = 0; i < (index - len) * 1; i++) {
                this.addDetailForm.isshow = true
                this.addDetailForm.titleNumber++
                this.addDetailForm.examChildMethodId = this.currentExamineItem.id;
                this.addDetailForm.indicatorPoints = {}
                this.addDetailForm.courseTarget = {}
                this.tableData.push(JSON.parse(JSON.stringify(this.addDetailForm)))
            }

        },
        //添加题型
        addPaperItem(index) {
            this.addForm.examChildMethodId = this.currentExamineItem.id;
            api.post("/courseExamPaper", this.addForm, (resp) => {
                if (resp.data.flag) {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    api.get("/courseExamPaper/" + this.currentExamineItem.id, "", (resp) => {
                        if (resp.data.flag) {
                            let i = resp.data.data.length - 1
                            this.finllPaper = resp.data.data;
                            this.finllPaper[i].itemNumber = index * 1
                        }
                    })
                    this.isAddPaperItem = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: resp.data.message
                    });
                }
            })

        },
        //删除题型
        deletePaperItem(id) {
            this.$confirm('是否删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/courseExamPaper", id, (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        api.get("/courseExamPaper/" + this.currentExamineItem.id, "", (resp) => {
                            if (resp.data.flag) {
                                this.finllPaper = resp.data.data;
                            }
                        })
                        this.isDeletePaperItem = false;
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

        //删除按钮控制
        deleteItem() {
            this.isUpdatePaperItem = false;
            this.isDeletePaperItem = !this.isDeletePaperItem;
        },

        //修改题型
        updatePaperItem() {
            api.put("/courseExamPaper", this.updateForm, (resp) => {
                if (resp.data.flag) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    api.get("/courseExamPaper/" + this.currentExamineItem.id, "", (resp) => {
                        if (resp.data.flag) {
                            this.finllPaper = resp.data.data;
                        }
                    })
                    this.isUpdateForm = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: resp.data.message
                    });
                }
            })
        },

        //修改表单控制
        updateFormUp(item) {
            this.updateForm = item;
            this.isUpdateForm = !this.isUpdateForm;
        },

        //修改按钮控制
        updateItem() {
            this.isDeletePaperItem = false;
            this.isUpdatePaperItem = !this.isUpdatePaperItem;
        },

        //添加小题
        addDetail() {
            this.addDetailForm.primaryId = this.currentTypeId;
            this.addDetailForm.indicatorPoints = JSON.stringify(this.addDetailForm.indicatorPoints);
            this.addDetailForm.courseTarget = JSON.stringify(this.addDetailForm.courseTarget);
            api.post("/courseExamPaper/detail", this.addDetailForm, (resp) => {
                if (resp.data.flag) {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.isAddDetail = false;
                    this.handleChange(this.currentTypeId);
                    this.addDetailForm = {};
                } else {
                    this.$message({
                        type: 'error',
                        message: resp.data.message
                    });
                }
            })
        },

        //弹出修改界面
        popUpUpdate(item) {
            console.log(item)
            this.updateDetailForm = item;
            this.isUpdateDetail = !this.isUpdateDetail;
        },

        //修改小题
        updateDetail() {
            //转码
            this.updateDetailForm.indicatorPoints = JSON.stringify(this.updateDetailForm.indicatorPoints);
            this.updateDetailForm.courseTarget = JSON.stringify(this.updateDetailForm.courseTarget);
            console.log(this.updateDetailForm)
            api.put("/courseExamPaper/detail", this.updateDetailForm, (resp) => {
                if (resp.data.flag) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.isUpdateDetail = !this.isUpdateDetail;
                    this.handleChange(this.currentTypeId);
                    this.updateDetailForm = {};
                } else {
                    this.$message({
                        type: 'error',
                        message: '修改失败'
                    });
                }
            })
        },

        //删除小题
        deleteDetail(id) {
            this.$confirm('是否删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/courseExamPaper/detail", id, (resp) => {
                    if (resp.data.flag) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.handleChange(this.currentTypeId);
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

        //打开展示表格
        openDoc() {
            this.isShowDoc = !this.isShowDoc;
            this.initShowTable();
        },

        //给展示表格赋值
        initShowTable() {
            var url = "";
            if (this.currentId) {
                url = this.currentId;
            } else if (this.getId != "") {
                url = this.getId
            }
            else if (this.getId == "") {
                url = this.courseList[this.currentCourse].id;
            }
            // axios.get("http://43.140.201.70:8080/courseExamPaper/Table/" + url, { responseType: 'blob' })
            axios.get(global.runTiemPath + "/courseExamPaper/" + url + "/1/Table", { responseType: 'blob' })
                .then((response) => {
                    // 将响应数据转换为Blob对象
                    const blob = new Blob([response.data], { type: 'application/pdf' });

                    // 生成URL，将其分配给嵌入元素的src属性
                    this.pdfUrl = URL.createObjectURL(blob);
                    this.loading2 = false;
                })
        },

        //导出XLS
        exportXLS() {
            var url = "";
            if (this.currentId) {
                url = this.currentId;
            } else if (this.getId != "") {
                url = this.getId
            }
            else if (this.getId == "") {
                url = this.courseList[this.currentCourse].id;
            }
            window.location.href = global.BaseUrl + "/courseExamPaper/" + url + "/2/Table";
        },

        goto(url) {
            this.$router.push({ path: '/MainPage/' + url, });
        },

        exportPDF() {
            var url = "";
            if (this.currentId) {
                url = this.currentId;
            } else if (this.getId != "") {
                url = this.getId
            }
            else if (this.getId == "") {
                url = this.courseList[this.currentCourse].id;
            }
            window.location.href = global.BaseUrl + "/courseExamPaper/" + url + "/1/Table";
        }
    },
    mounted() {
        this.isadmin = localStorage.getItem('Isadmin');
        this.getId = localStorage.getItem('courseId');
        if (this.getId != "") {
            this.ischoose = true;
            this.init();
            // this.initShowTable();
        }
        this.getMessage();
        if (this.$route.query.id) {
            localStorage.setItem('courseId', this.$route.query.id);
            this.getId = localStorage.getItem('courseId');
            this.currentId = this.$route.query.id;
            this.getCurrentCourseExam();
            this.isReturn = true
        }

    },
}
</script>

<style src="@/style/tableStyle.css"></style>

