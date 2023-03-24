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
        <el-main>
            <div>
                <el-table :data="finalPaper" :stripe="true" :border="true">

                    <el-table-column label="题型">
                        <el-select v-model="isEdit" placeholder="请选择">
                            <el-option value="选择题"></el-option>
                            <el-option value="填空题"></el-option>
                            <el-option value="简答题"></el-option>
                            <el-option value="计算题"></el-option>
                        </el-select>
                    </el-table-column>

                    <el-table-column label="操作" align="center" width="200px">
                        <template slot-scope="scope">
                            <el-button>设置</el-button>
                            <el-button @click="delectEx(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button @click="test()">表格设置</el-button>
                <el-button @click="test()">添加</el-button>
            </div>

        </el-main>
    </el-container>
</template>
<script>
import api from '@/api/api'

export default {
    name: "finalTable",
    data() {
        return {
            //表单数据
            finalPaper: [{}, {}],
            //表单读写控制
            isEdit: false,
        }
    },
    methods: {

        //获取用户课程
        getMessage() {
            api.get("/courseInfo/currentUser/" + localStorage.getItem("UserId"), "", (resp) => {
                this.courseList = resp.data.data;
            })
        },

        //测试方法
        test() {

        },


    },
    mounted() {

    }
}
</script>

<style></style>
