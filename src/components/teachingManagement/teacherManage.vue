<!-- eslint-disable vue/no-unused-vars -->
<template>
  <el-container>
    <el-main>
      <el-button class="ButtonStyle" type="primary" @click="isShowAdd = !isShowAdd">添加用户</el-button>
      <el-button class="ButtonStyle" @click="showUpload = true" type="primary">导入教师名单</el-button>
      <!-- 上传学生名单 -->
      <el-dialog title="上传xls文件" :visible.sync="showUpload" style="text-align: center">
        <el-form>
          <input type="file" @change="handleFileUpload" />
          <el-button type="submit" size="mini" @click.prevent="uploadFile()">上传文件</el-button>
        </el-form>
      </el-dialog>


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
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
      </el-dialog>

      <el-table v-loading="loading"
        :data="tableData.filter((data) => !search1 && !search2 && !search3 && !search4 || data.name.includes(search1) && data.teacherName.includes(search2) && (data.isAdmin == search3 || !search3) && data.department.includes(search4))"
        stripe border style="width: 100%" height="800">
        <el-table-column label="序号" width="50px" fixed>
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号名称" width="150" align="center">
          <template slot="header" slot-scope="scope">
            <p>账号名称</p>
            <el-input v-model="search1" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号密码" width="150" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.password" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.password }}</span>
          </template>
        </el-table-column>

        <el-table-column label="教师姓名" width="100" align="center">
          <template slot="header" slot-scope="scope">
            <p>教师姓名</p>
            <el-input v-model="search2" size="mini" placeholder="输入搜索" />
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.teacherName" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.teacherName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="教师权限" width="200" align="center">
          <template slot="header" slot-scope="scope">
            <p>教师权限</p>
            <el-select v-model="search3" size="mini" clearable placeholder="请选择教师权限">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>

          <template slot-scope="scope">
            <span v-show="!scope.row.ised" v-if="scope.row.isAdmin == 0">教师</span>
            <span v-show="!scope.row.ised" v-if="scope.row.isAdmin == 1">系主任</span>
            <span v-show="!scope.row.ised" v-if="scope.row.isAdmin == 2">学院</span>
            <el-select v-model="scope.row.isAdmin" v-show="scope.row.ised" placeholder="请选择专业">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="所属院系" width="220" align="center">
          <template slot="header" slot-scope="scope">
            <p>所属院系</p>
            <el-input v-model="search4" size="mini" placeholder="输入搜索" />
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.department" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editUser(scope.$index)">编辑</el-button>
            <el-button type="success" size="mini" @click="saveUser(scope.$index)">保存</el-button>
            <el-button type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
          </template>
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
  name: "userInfo",
  data() {
    return {
      search1: '',
      search2: '',
      search3: '',
      search4: '',

      //添加用户表单
      isShowAdd: false,
      addFormData: {},
      //表格数据
      tableData: [],
      loading: true,
      message: '',
      options: [
        {
          value: "0",
          label: "教师",
        },
        {
          value: "1",
          label: "系主任",
        },
        {
          value: "2",
          label: "学院领导",
        },
      ],
      //上传教师名单
      showUpload: false,
    };
  },
  methods: {
    //获取用户信息
    getUserinfo() {
      api.get("/user", "", (resp) => {
        for (let index = 0; index < resp.data.data.length; index++) {
          resp.data.data[index].ised = false;
        }
        this.tableData = resp.data.data;

      });
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },

    //选择上传文件
    handleFileUpload(event) {
      console.log("handleFileUpload被调用");
      this.selectedFile = event.target.files[0];
    },
    //上传文件
    uploadFile() {
      let loadingInstance = Loading.service({ fullscreen: true });
      const formData = new FormData();
      formData.append("file", this.selectedFile);
      axios.post(global.runTiemPath + "/user/userInfo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          if (response.data.flag) {
            this.showUpload = !this.showUpload;
            this.$message({
              type: "success",
              message: response.data.message,
            });
            loadingInstance.close();
            this.getUserinfo();

          } else {
            this.$message({
              type: "error",
              message: response.data.message,
            });
            loadingInstance.close();
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error.data.message,
          });
        });
    },

    //添加用户信息
    addUser() {
      api.post("/user/addUser", this.addFormData, (resp) => {
        if (resp.data.flag) {
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

<style lang="css" scoped>
.ButtonStyle {
  margin-bottom: 10px;
}
</style>