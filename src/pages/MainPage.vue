<template>
    <el-container style="height: 100vh; border: 1px solid #eee">

        <el-header>
            <el-row>
                <el-col :span="12">
                    <div>
                        <el-button icon="el-icon-back" :circle="true" @click="goBack()"></el-button>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="font-size: 20px;text-align: right; ">
                        <el-dropdown @command="handleCommand" trigger="click">
                            <el-button icon="el-icon-user" size="mini" style="margin-right: 15px;"></el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>个人信息</el-dropdown-item>
                                <el-dropdown-item command="signOut">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span style="color: black;">{{ username }}</span>
                    </div>
                </el-col>
            </el-row>

        </el-header>

        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu v-if="false">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>课程管理</template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="1-1" @click="goto('sudoInformationTable')">课程基本信息</el-menu-item>
                            <el-menu-item index="1-2" @click="goto('sudoInformationTable')">教学大纲</el-menu-item>
                            <el-menu-item index="1-3" @click="goto('sudoInformationTable')">课程毕业指标点</el-menu-item>
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
                            <template slot="title">平时成绩</template>
                            <el-menu-item index="3-1" @click="goto('usualPreformanceTable')">平时考核成绩统计表</el-menu-item>
                            <el-menu-item index="3-2" @click="goto('finalStatisticsTable')">课程期末试卷成绩</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="3-3" @click="goto('finalComprehensiveTable')">期末综合成绩统计表</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="3-4">
                            <template slot="title">成绩分析报告</template>
                            <el-menu-item index="3-4-1" @click="goto('analysisTable')">期末综合成绩分析表</el-menu-item>
                            <el-menu-item index="3-4-1" @click="goto('programTable')">课程达成度成绩计算表</el-menu-item>
                        </el-submenu>

                    </el-submenu>
                </el-menu>
                <el-menu>
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>课程管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="goto('courseBasicInformation')">课程基本信息</el-menu-item>
                             <el-menu-item v-if="isadmin==0" index="1-2" @click="goto('teachingPro')">教学大纲</el-menu-item>
                            <el-menu-item v-if="isadmin==1" index="1-2" @click="goto('sudoTeachingPro')">教学大纲</el-menu-item>
                            <el-menu-item v-if="isadmin==2" index="1-2" @click="goto('SuperTeachingPro')">教学大纲</el-menu-item>
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
                            <el-menu-item index="3-4-1" @click="goto('programTable')">课程达成度成绩计算表</el-menu-item>
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

export default {
    name: "MainPage",
    data() {
        return {
            username: '',
            id: 1,
            isadmin:0,
        }
    },
    methods: {
        goto(url) {
            this.$router.push({ path: '/MainPage/' + url });
        },
        signOut() {
            localStorage.clear();
            sessionStorage.clear();
            this.$router.push({ path: '/' });
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
        this.username = localStorage.getItem("TeacherName");
        this.id = localStorage.getItem('isadmin')
        // this.$router.push({ path: '/MainPage/welcome' });
        this.isadmin = localStorage.getItem('Isadmin');
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
    color: #333;
}
</style>
