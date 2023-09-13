<template>
  <el-container>
    <!-- <el-header style="background-color: #fff; height: 50px"> </el-header> -->

    <el-main>
      <el-button class="ButtonStyle" type="primary" @click="isShowAdd = !isShowAdd">添加用户</el-button>

      <!-- 添加用户信息 -->
      <el-dialog title="添加用户信息" :visible.sync="isShowAdd" style="text-align: center">
        <el-form label-width="150px" class="demo-ruleForm">
          <el-form-item label="账号名称">
            <el-input v-model="addFormData.name"></el-input>
          </el-form-item>
          <el-form-item label="账号密码">
            <el-input v-model="addFormData.password"></el-input>
          </el-form-item>
          <el-form-item label="教师姓名">
            <el-input v-model="addFormData.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="教师权限">
            <el-input v-model="addFormData.isAdmin"></el-input>
          </el-form-item>
          <el-form-item label="所属院系">
            <el-input v-model="addFormData.department"></el-input>
            <!-- <el-select
              v-model="eldepartment"
              placeholder="请选择院系"
              @focus="focusOnSelect()"
            >
              <el-option
                v-for="(item, index) in courseList"
                :key="index"
                :label="item.department"
                :value="index"
              >
                <span>{{ item.department }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
      </el-dialog>

      <el-table v-loading="loading" :data="tableData.filter((data) =>
        !search || data.name.toLowerCase().includes(search.toLowerCase()))" stripe border style="width: 100%"
        height="800">
        <el-table-column>
          <template slot="header">
            <el-input v-model="search" size="mini" placeholder="请输入账号名称" />
          </template>
          <el-table-column label="序号" width="50px" fixed>
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账号名称" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" v-show="scope.row.ised"></el-input>
              <span v-show="!scope.row.ised">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账号密码" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.password" v-show="scope.row.ised"></el-input>
              <span v-show="!scope.row.ised">{{ scope.row.password }}</span>
            </template>
          </el-table-column>
          <el-table-column label="教师姓名" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.teacherName" v-show="scope.row.ised"></el-input>
              <span v-show="!scope.row.ised">{{ scope.row.teacherName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限" width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.isAdmin" v-show="scope.row.ised" placeholder="请选择专业">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <span v-show="!scope.row.ised">{{ options[scope.row.isAdmin].label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属院系" width="220">
            <template slot-scope="scope">
              <el-input v-model="scope.row.department" v-show="scope.row.ised"></el-input>
              <span v-show="!scope.row.ised">{{ scope.row.department }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editUser(scope.$index)">编辑</el-button>
              <el-button type="success" size="mini" @click="saveUser(scope.$index)">保存</el-button>
              <el-button type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import api from "@/api/api";
import axios from "axios";
import { Loading } from "element-ui";
import global from "@/script/global";

export default {
  name: "studentInfo",
  data() {
    return {
      //添加用户表单
      isShowAdd: false,
      addFormData: {},
      departmentList: [],
      search: "",
      eldepartment: "",
      //表格数据
      tableData: [],
      loading: false,

      options: [
        {
          value: '0',
          label: '教师'
        },
        {
          value: '1',
          label: '系主任'
        },
        {
          value: '2',
          label: '学院领导'
        }
      ]
    };
  },
  methods: {
    getMessage() {
      api.get("/user", "", (resp) => {
        this.departmentList = resp.data.data.department;
      });
    },
    //获取用户信息
    getUserinfo() {
      this.loading = true;
      api.get("/user/", "", (resp) => {
        for (let index = 0; index < resp.data.data.length; index++) {
          resp.data.data[index].ised = false;
        }
        this.tableData = resp.data.data;
        this.loading = false;
      });
    },
    focusOnSelect() {
      this.ischoose = false;
      this.eldepartment = "";
    },

    //添加用户信息
    addUser() {
      console.log("addUser被调用");
      api.post("/user/addUser", this.addFormData, (resp) => {
        if (resp.data.flag) {
          console.log("addUser被调用成功");
          this.isShowAdd = false;
          this.getUserinfo();
        }
      });
    },
    //删除用户信息
    deleteUser(item) {
      this.$confirm("是否删除 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.del("/user/deleteUser", item, (resp) => {
            console.log("deleteUser被调用");
            if (resp.data.flag) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getUserinfo();
            } else {
              this.$message({
                type: "error",
                message: "删除失败!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    //编辑用户信息
    editUser(index) {
      this.tableData[index].ised = true;
    },
    //保存用户信息
    saveUser(index) {
      api.put("/user/updateUser", this.tableData[index], (resp) => {
        console.log("updateUser被调用");
        if (resp.data.flag) {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          this.tableData[index].ised = false;
        } else {
          this.$message({
            type: "error",
            message: resp.data.message,
          });
        }
      });
    },
  },
  mounted() {
    this.getUserinfo();
  },
};
</script>

<style scoped>
.ButtonStyle {
  margin-bottom: 10px;
}
</style>