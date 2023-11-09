<template>
  <el-container>
    <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">
      <el-select v-model="major" placeholder="请选择专业" @focus="focusOnSelect()">
        <el-option v-for="item in options" :key="item" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentMajor()">确定</el-button>
      <el-empty v-if="!ischoose" description="请先选择专业"></el-empty>
      <el-button v-show="ischoose" icon="el-icon-plus" @click="insert">添加</el-button>
    </el-header>


    <div v-show="ischoose">
      <div style="margin-left: 36%;font-size: 26px;font-family: fantasy;">
        {{ this.major }}培养方案管理
      </div>

      <el-table :data="tableData" style="margin-left: 2%">
        <el-table-column label="专业名称" align="center" width="250px" prop="major">
        </el-table-column>
        <el-table-column label="版本" align="center" width="150px" prop="majorVersion">
        </el-table-column>
        <el-table-column label="有无上传" align="center" width="98px" prop="isLoad">
          <template slot-scope="scope">
            <P style="color: red;" v-if="scope.row.isLoad===0">无</P>
            <p><a style="color: green;" v-if="scope.row.isLoad==1">有</a></p>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="500px">
          <template slot-scope="scope">
            <div style="display: flex;flex-wrap: nowrap;">

              <!--              <el-button size="medium" icon="el-icon-reading" style="margin-left: 8px;width: 90px;"
                                       type="primary"
                                       @click="edit(scope.row)">编辑
                            </el-button>-->

              <el-upload :action="uploadPath" :show-file-list="false" :file-list="fileList"
                         :data="uploadData" :on-success="handleSuccess" :before-upload="beforeUpload"
                         :on-error="handleError" :accept="'application/pdf'">
                <el-button size="medium" style="width: 90px;margin-left: 8px"
                           icon="el-icon-upload" slot="trigger" type="primary"
                           @click="uploadPDF(scope.row)">更新
                </el-button>
              </el-upload>


              <el-button size="medium" icon="el-icon-reading" style="margin-left: 8px;width: 90px;"
                         type="primary"
                         @click="showPDF(scope.row)">展示
              </el-button>


              <el-button size="medium" icon="el-icon-delete" style="margin-left: 8px;width: 90px;"
                         type="danger" @click="deletePDF(scope.row)">删除
              </el-button>


              <el-button size="medium" icon="el-icon-download" style="margin-left: 8px;width: 90px;"
                         type="success" @click="downloadPDF(scope.row)">下载
              </el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>

      <el-dialog
          title="文件信息"
          :visible.sync="isShow"
          width="38%">
        <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
          <el-form-item label="专业名称" prop="major">
            <el-input v-model="form.major"></el-input>
          </el-form-item>
          <el-form-item label="方案版本号" prop="majorVersion">
            <el-input v-model="form.majorVersion" placeholder="如:2023"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isShow = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
        </span>
      </el-dialog>


      <el-drawer title="培养方案展示" :visible.sync="isShowPDF" direction="btt" size="90%">
        <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" width="100%" height="100%"/>
        <el-result v-if="!pdfUrl" icon="error" title="暂无数据" subTitle="请先上传培养方案">
          <template slot="extra">
            <el-button type="primary" size="medium" @click="isShowPDF = !isShowPDF">返回</el-button>
          </template>
        </el-result>
      </el-drawer>

    </div>
  </el-container>
</template>

<script>
import global from "@/script/global";
import axios from "axios";
import api from "@/api/api";

export default {
  name: "educationProgramManagement",
  data() {
    return {
      formRules: {
        major: [
          // {required: true,message: "请输入专业名称",trigger: "blur"}
        ],
        majorVersion: [
          {required: true, message: "请输入版本号", trigger: "blur"},
          {pattern:/^(19|20)\d{2}$/,message: "请输入正确数据"}
        ]
      },
      options: [{
        value: '计算机科学与技术',
        label: '计算机科学与技术'
      }, {
        value: '电子信息工程',
        label: '电子信息工程'
      }, {
        value: '数据科学与大数据技术',
        label: '数据科学与大数据技术'
      }, {
        value: '通信工程',
        label: '通信工程'
      }],
      ischoose: false,
      major: "",
      isShowPDF: false,
      pdfUrl: "",
      form: {},
      isShow: false,
      fileSize: 10,
      tableData: [],
      uploadData: {id: ""},
      fileList: [],
      isExitForMajorVersion: false,
      majorVersion: "",
      uploadPath: global.runTiemPath + "/courseInfo/uploadPDF",
      url: global.runTiemPath + "/courseInfo/",
    }
  },
  created() {

  },
  methods: {
    /*    update(){
          //获得下拉的专业列表
          axios.get(this.url+"findMajors").then(res=>{
            for(let i=0;i<res.data.data.length;i++){
              this.options[i]=res.data.data[i].major
            }
          })
          console.log("更新了options")
        },*/
    focusOnSelect() {
      // this.update()
      this.major = "";
      this.ischoose = false;
    },
    getCurrentMajor() {
      if (this.major) {
        this.ischoose = true;
        this.loadTable();
      }
    },
    loadTable() {
      axios.get(this.url + this.major + "/findByMajor").then(res => {
        this.tableData = res.data.data
      })
    },
    handleSuccess(res) {
      // 处理上传成功的结果
      if (this.loading) this.loading.close();
      if (res.code === '520') {
        this.$message.error('上传失败')
        return
      } else {
        this.$message.success('上传成功')
      }
      // this.update()
      this.loadTable()
      this.fileList = []
    },
    beforeUpload(file) {
      // 验证文件类型和大小
      const isPDF = file.type === "application/pdf";
      const isLtFileSize = file.size / 1024 / 1024 < this.fileSize;

      if (!isPDF) {
        this.$message.error("只能上传 PDF 文件");
      }
      if (!isLtFileSize) {
        this.$message.error("上传文件大小不能超过" + this.fileSize + "MB");
      }
      this.loading = this.$loading({
        lock: true,
        text: '上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return isPDF && isLtFileSize;
    },
    handleError(error) {
      console.log(error);
      if (this.loading) {
        this.loading.close();
      }
    },
    insert() {
      this.isShow = true;
      this.form = {}/*清空表单记录*/
      if (this.major === '') {

      } else {
        this.form.major = this.major;
      }
    },
    async add(){
      //判断数据库中是否已经有了当前版本记录
      await axios.get(this.url + "isExitForMajorVersion/" + this.form.major + "/" + this.form.majorVersion).then(res => {
        this.isExitForMajorVersion = res.data.data
      })

      if (this.isExitForMajorVersion === false) {
        /*        if (this.form.id) {
                  // 编辑
                  axios.put(this.url+"educationPrograms/update",this.form).then(res=>{
                    this.isShow = false;
                    this.loadTable();
                  })
                } */
        if (!this.form.id) {
          // 新增
          axios.post(this.url + "educationPrograms", this.form).then(res => {
            this.isShow = false;
            this.loadTable();
          })
          this.$message.success("新增一条记录")
        }
      } else {
        this.isShow = false;
        this.$message.error("版本号已存在")
      }
    },

    /*    edit(item) {
          this.form = item;
          this.isShow = true;
        },*/
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.add()
        } else {
          this.isShow = false;
          this.$message.error("表单格式有误，请重新填写！")
        }
      })


    },
    uploadPDF(item) {
      this.uploadData.id = item.id;
    },
    showPDF(item) {
      this.isShowPDF = true;
      this.pdfUrl = null;
      if (item.isLoad === 0) {
        return
      }
      axios.get(this.url + "showPDF/" + item.major + "/" + item.majorVersion, {responseType: "blob"}).then(res => {
        if (!res.headers['content-type'].includes("application/pdf")) {
          return;
        }
        const blob = new Blob([res.data], {type: "application/pdf;charset=utf-8"})
        this.pdfUrl = URL.createObjectURL(blob);
        console.log(this.pdfUrl)
        this.ischoose = true
      })
    },
    deletePDF(item) {
      axios.delete(this.url + "deleteEducationProgram/" + item.id, {responseType: "json"}).then(res => {
        this.loadTable();
      })
      this.loadTable()
      this.$message.success("删除一条记录")
    },
    downloadPDF(item) {
      console.log("这里是下载信息:")
      console.log(item.id)
      console.log(item.major)
      console.log(item.majorVersion)
      console.log("---------------------")
      if (item.isLoad === 0) {
        alert("请先上传pdf文件!")
        return
      }
      window.location.href = global.BaseUrl + "/courseInfo/download/" + item.major + "/" + item.majorVersion;
    }
  },
  mounted() {

  },
}
</script>

<style scoped>

</style>