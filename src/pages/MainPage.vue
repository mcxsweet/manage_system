<template>
    <el-container style="height: 100vh; border: 1px solid #eee">

        <el-header>
            <el-row>
                <el-col :span="6">
                    <div style="display: flex;align-items: center;height: 60px;">

                        <p style="font-family: STXingkai;font-size: 30px;color: white;">工程教育专业认证系统</p>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div>
                        <button @click="handleSelect(1, 'homePage')" class="tableBarButton">首页</button>
                        <button @click="handleSelect(1, 'educationProgram')" class="tableBarButton">专业材料</button>
                        <button @click="handleSelect(2, 'courseBasicInformation')" class="tableBarButton">课程管理</button>
                        <button @click="handleSelect(3, 'studentInfo')" class="tableBarButton">学生成绩管理</button>
                        <button @click="handleSelect(4, 'finalComprehensiveTable')" class="tableBarButton">课程分析报告</button>
                        <button v-show="isadmin != 0" @click="handleSelect(5, '')" class="tableBarButton">教学管理</button>
                    </div>
                </el-col>
                <el-col :span="2">
                    <div style="font-size: 20px;text-align: right;">
                        <el-dropdown size="medium" @command="handleCommand" trigger="click">
                            <span style="color: white;">
                                <i class="el-icon-user-solid" style="margin-right: 15px;"></i>
                                {{ teacherName }}
                            </span>

                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>个人信息</el-dropdown-item>
                                <el-dropdown-item command="signOut">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- <span style="color: white;;">
                            <i class="el-icon-switch-button" style="margin-left: 15px;" @click="signOut()"></i>
                        </span> -->
                    </div>
                </el-col>
            </el-row>

        </el-header>

        <el-container>
            <el-aside width="200px">
                <!-- <el-menu v-if="isadmin == 2">
                    <el-submenu index="1" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                        <template slot="title"><i class="el-icon-message"></i>课程管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="goto('courseBasicInformation')">课程基本信息</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu> -->
                <!-- 管理员 -->
                <!-- <el-menu v-if="isadmin == 1" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>课程管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="goto('sudoCourseInformation')">课程基本信息</el-menu-item>
                            <el-menu-item index="1-2" @click="goto('teachingPro')">教学大纲</el-menu-item>
                            <el-menu-item index="1-3" @click="goto('indexPoint')">课程毕业要求指标点</el-menu-item>
                            <el-menu-item index="1-4" @click="goto('basicInformationTable')">课程考核评价方式</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-menu"></i>试卷管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1" @click="goto('finalTable')">课程期末考试命题与课程目标、指标点分数对应表</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-setting"></i>成绩管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="3-1" @click="goto('usualPreformanceTable')">平时考核成绩统计表</el-menu-item>
                            <el-menu-item index="3-2" @click="goto('finalStatisticsTable')">课程期末试卷成绩</el-menu-item>
                            <el-menu-item index="3-3" @click="goto('finalComprehensiveTable')">期末综合成绩统计表</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="3-4">
                            <template slot="title">成绩分析报告</template>
                            <el-menu-item index="3-4-1" @click="goto('analysisTable')">期末综合成绩分析表</el-menu-item>
                            <el-menu-item index="3-4-2" @click="goto('programTable')">课程达成度成绩计算表</el-menu-item>
                        </el-submenu>

                    </el-submenu>
                </el-menu> -->
                <!-- 教师 -->
                <el-menu default-active="1-1" background-color="white" text-color="black"
                    active-text-color="rgb(86, 86, 255)">
                    <div v-show="activeIndex == 1">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-menu"></i>专业材料</template>
                            <el-menu-item-group>
                                <el-submenu index="1-1">
                                    <span slot="title"><i class="el-icon-caret-right"></i>专业材料查询</span>
                                    <el-menu-item index="1-1" @click="goto('educationProgram')">培养方案</el-menu-item>
                                    <el-menu-item index="1-2" @click="goto('indicators')">毕业要求指标点</el-menu-item>
                                    <el-menu-item index="1-3" @click="goto('syllabus')">教学大纲查看</el-menu-item>
                                </el-submenu>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <el-submenu index="1-2">
                                    <span slot="title"><i class="el-icon-caret-right"></i>教学大纲设置</span>
                                    <el-menu-item index="1-2-1" @click="goto('unUse')">教学大纲设置</el-menu-item>
                                </el-submenu>
                            </el-menu-item-group>
                        </el-submenu>
                    </div>

                    <div v-show="activeIndex == 2">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-menu"></i>课程管理</template>
                            <el-menu-item-group>
                                <el-submenu index="1-1">
                                    <template slot="title"><i class="el-icon-caret-right"></i>课程设置</template>
                                    <el-menu-item-group>
                                        <el-menu-item index="1-1"
                                            @click="goto('courseBasicInformation')">课程基本信息</el-menu-item>
                                        <el-menu-item index="1-2" @click="goto('programObjective')">课程目标设置</el-menu-item>
                                        <!-- <el-menu-item index="1-3" @click="goto('indexPoint')">课程毕业要求指标点</el-menu-item> -->
                                        <el-menu-item index="1-4"
                                            @click="goto('basicInformationTable')">课程考核评价方式</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>

                                <el-submenu index="2">
                                    <template slot="title"><i class="el-icon-caret-right"></i>试卷设置</template>
                                    <el-menu-item-group>
                                        <el-menu-item index="2-1"
                                            @click="goto('finalPaperSetting')">考试命题与指标点关系</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>
                            </el-menu-item-group>
                        </el-submenu>
                    </div>

                    <div v-show="activeIndex == 3">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-menu"></i>学生成绩管理</template>
                            <el-menu-item-group>
                                <el-submenu index="1-1">
                                    <template slot="title"><i class="el-icon-caret-right"></i>学生管理</template>
                                    <el-menu-item-group>
                                        <el-menu-item index="1-1" @click="goto('studentInfo')">学生信息管理</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>
                                <el-submenu index="2">
                                    <template slot="title"><i class="el-icon-caret-right"></i>成绩管理</template>
                                    <el-menu-item-group>
                                        <el-menu-item index="2-1"
                                            @click="goto('usualPreformanceTable')">平时考核成绩统计</el-menu-item>
                                        <el-menu-item index="2-2"
                                            @click="goto('finalStatisticsTable')">期末试卷成绩统计</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>
                                <el-submenu index="3">
                                    <template slot="title"><i class="el-icon-caret-right"></i>调查问卷</template>
                                    <el-menu-item-group>
                                        <el-menu-item index="3-1" @click="goto('surveyCheck')">调查问卷查看</el-menu-item>
                                        <el-menu-item index="3-2" @click="goto('surveySetting')">调查问卷设置</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>
                            </el-menu-item-group>
                        </el-submenu>

                    </div>

                    <div v-show="activeIndex == 4">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-menu"></i>课程分析报告</template>
                            <el-menu-item-group>
                                <el-submenu index="1-1">
                                    <template slot="title"><i class="el-icon-caret-right"></i>成绩分析报告</template>
                                    <el-menu-item-group>
                                        <el-menu-item index="1-1"
                                            @click="goto('finalComprehensiveTable')">期末综合成绩统计表</el-menu-item>
                                        <el-menu-item index="1-2" @click="goto('editAnalyseReport')">编辑试卷分析报告</el-menu-item>
                                        <el-menu-item index="1-3"
                                            @click="goto('editTeachingSummary')">编辑教学小结表</el-menu-item>
                                        <el-menu-item index="1-4" @click="goto('analysisTable')">导出课程分析报告</el-menu-item>
                                        <!-- <el-menu-item index="4-3" @click="goto('programTable')">课程分析报告导出</el-menu-item> -->
                                    </el-menu-item-group>
                                </el-submenu>
                            </el-menu-item-group>
                        </el-submenu>

                    </div>

                    <!-- 教学管理 -->
                    <div v-show="activeIndex == 5">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-menu"></i>教学管理</template>
                            <el-menu-item-group>
                                <el-submenu index="1-1">
                                    <template slot="title"><i class="el-icon-caret-right"></i>学院工作</template>
                                    <el-menu-item-group>
                                        <el-menu-item index="1-1" @click="goto('collegeLevel')">查看完成情况</el-menu-item>
                                        <el-menu-item index="1-2" @click="goto('teacherManage')">教师管理</el-menu-item>
                                        <el-menu-item index="1-3" @click="goto('syllabusManage')">教学大纲管理</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>
                                <el-submenu index="1-3">
                                    <template slot="title"><i class="el-icon-caret-right"></i>系主任工作</template>
                                    <el-menu-item-group>
                                        <el-menu-item index="1-4" @click="goto('departmentHeadLevel')">查看完成情况</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>
                            </el-menu-item-group>
                        </el-submenu>
                    </div>
                </el-menu>

            </el-aside>
            <!-- <h1 style="font-size: 50px; justify-content: space-between;text-align: center;height: 200px;">欢迎使用</h1> -->
            <router-view class="main"></router-view>
        </el-container>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api/api';
export default {
    name: "MainPage",
    data() {
        return {
            activeIndex: 1,
        }
    },
    computed: {
        /*
            此处为获取 vuex 数据，可以获取 state数据也可以获取getters数据
            state：...mapState('user',['name'])
            也可以使用 this.$store.state.user.user获取
        */
        ...mapGetters(['username', 'id', 'isadmin', 'teacherName'])
    },
    methods: {
        handleSelect(index, goto) {
            this.activeIndex = index;
            if (goto) {
                this.goto(goto);
            }
        },
        goto(url) {
            this.$router.push({ path: '/MainPage/' + url });
        },
        signOut() {
            this.$confirm('是否退出登录 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '退出登录'
                });
                this.$store.dispatch('user/logout');
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        handleCommand(command) {
            if (command == "signOut") {
                this.signOut();
            }
        },
        goBack() {
            window.history.back();
        }
    },
    mounted() {
    },

}
</script>

<style>
.el-header {
    background-color: rgb(86, 86, 255);
    color: #333;
    line-height: 60px;
}

.el-aside {
    background: white;
    box-shadow: 7px 7px 12px #c3c3c3;
    margin-right: 10px;
}

.main {
    background: white;
    box-shadow: 7px 7px 12px #c3c3c3;
    width: 100vw;
}

.tableBarButton {
    border-radius: 20px;
    border: 0;
    color: white;
    width: 120px;
    text-align: center;
    padding: 10px 20px;
    margin-right: 10px;
    background-color: rgb(86, 86, 255);
    transition: 0.3s;

}

.tableBarButton:hover {
    background-color: white;
    color: rgb(86, 86, 255);
}

.tableBarButton:active {
    background-color: white;
    color: rgb(86, 86, 255);
}
</style>
