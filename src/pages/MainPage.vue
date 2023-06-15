<template>
    <el-container style="height: 100vh; border: 1px solid #eee">

        <el-header>
            <el-row>
                <el-col :span="12">
                    <div style="display: flex;align-items: center;height: 60px;">
                        <!-- <el-button icon=" el-icon-back" :circle="true" @click="goBack()"></el-button> -->
                        <el-page-header @back="goBack()" content="">
                        </el-page-header>
                    </div>
                </el-col>
                <!-- <el-col :span="6">
                    <div style="display: flex;align-items: center;justify-content: center; ">
                       <p>您现在正在操作的课程为：</p><span>{{ currentCourse}}</span>
                    </div>
                </el-col> -->
                <el-col :span="12">
                    <div style="font-size: 20px;text-align: right;">
                        <el-dropdown @command="handleCommand" trigger="click">
                            <el-button icon="el-icon-user" size="mini" style="margin-right: 15px;"></el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>个人信息</el-dropdown-item>
                                <el-dropdown-item command="signOut">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span style="color: black;">{{ teacherName }}</span>
                    </div>
                </el-col>
            </el-row>

        </el-header>

        <el-container>
            <el-aside width="200px">
                <el-menu v-if="isadmin == 2">
                    <el-submenu index="1" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                        <template slot="title"><i class="el-icon-message"></i>课程管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="goto('courseBasicInformation')">课程基本信息</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
                <!-- 管理员 -->
                <el-menu v-if="isadmin == 1" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
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
                </el-menu>
                <!-- 教师 -->
                <el-menu v-if="isadmin == 0" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>课程管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="goto('courseBasicInformation')">课程基本信息</el-menu-item>
                            <el-menu-item index="1-2" @click="goto('programObjective')">课程目标设置</el-menu-item>
                            <!-- <el-menu-item index="1-3" @click="goto('teachingPro')">教学大纲</el-menu-item> -->
                            <el-menu-item index="1-4" @click="goto('indexPoint')">课程毕业要求指标点</el-menu-item>
                            <el-menu-item index="1-5" @click="goto('basicInformationTable')">课程考核评价方式</el-menu-item>
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
                </el-menu>

            </el-aside>
            <!-- <h1 style="font-size: 50px; justify-content: space-between;text-align: center;height: 200px;">欢迎使用</h1> -->
            <router-view></router-view>
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
           currentCourse:"", 
           getId:"",
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
        getCourse(){
            api.get("/courseInfo/"+this.getId,"",(resp1)=>{
            this.currentCourse = resp1.data.data.courseName;
          })
        },
        goto(url) {
            this.$router.push({ path: '/MainPage/' + url });
        },
        signOut() {
            this.$store.dispatch('user/logout')
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
        this.getId = localStorage.getItem('courseId')
        this.getCourse();
        // this.username = localStorage.getItem("TeacherName");
        // this.id = localStorage.getItem('isadmin')
        // // this.$router.push({ path: '/MainPage/welcome' });
        // this.isadmin = localStorage.getItem('Isadmin');
    },

}
</script>

<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    background-color: #545c64;
    border: 1px solid black;
}
</style>
