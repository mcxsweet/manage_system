<template>
    <el-container>
        <el-main>
            <el-button class="ButtonStyle" type="primary" @click="isShowAdd = !isShowAdd">添加学生</el-button>

            <!-- 添加教师信息 -->
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

            <el-table v-loading="loading" :data="tableData" border style="width: 100%" height="600">
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
import global from '@/script/global';
export default {
    data() {
        return {
            isShowAdd: false,
            tableData: [1, 1]
        }
    },
    methods: {

    },
    mounted() {

    },
}
</script>

<style></style>