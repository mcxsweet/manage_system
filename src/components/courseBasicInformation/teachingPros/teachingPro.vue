<template>
  <!-- <pdf-upload pfdType="teachingPro" :Id="courseId"></pdf-upload> -->
  <el-container>
    <el-header style="background-color: #fff; height: 50px; display: flex">
      <el-upload v-show="showUpload" style="margin-left: 20px" action="/courseInfo/teachingPDF" :show-file-list="false"
        :file-list="fileList" :data="uploadData" :on-success="handleSuccess" :before-upload="beforeUpload"
        :on-error="handleError" :limit="1" :accept="'application/pdf'">
        <el-button slot="trigger" size="small" type="primary">选择文件上传</el-button>
      </el-upload>
    </el-header>
    <el-empty v-if="!showPDF" description="请先上传课程教学大纲"></el-empty>
    <el-main v-if="showPDF">
      <div>
        <embed :src="pdfUrl" type="application/pdf" width="100%" height="800px" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";
import pdfUpload from '../pdfUpload.vue'
export default {
  name: 'teachingPro',
  components: { pdfUpload },
  data() {
    return {
      ischoose: false,
      courseId: "",

      fileSize: 10,
      showUpload: true,
      showPDF: false,
      pdfUrf: null,
      loading: null,
      uploadData: {
        courseId: this.$route.query.id,
        type: "teachingPro"
      },
    }
  },
  methods: {
    getCurrentCoursePDF() {
      this.showUpload = true;
      this.showPDF = false;
      let url = "/courseInfo/file/teachingPro/teachingPro_" + this.courseId + ".pdf";
      axios.get(url, { responseType: "blob" }).then((response) => {
        if (!response.headers['content-type'].includes("application/pdf")) {
          return;
        }
        this.showPDF = true
        // 将响应数据转换为Blob对象
        const blob = new Blob([response.data], { type: "application/pdf" });

        // 生成URL，将其分配给嵌入元素的src属性
        this.pdfUrl = URL.createObjectURL(blob);
      });
    },
    handleSuccess(res, file, fileList) {
      // 处理上传成功的结果
      if (this.loading) this.loading.close();
      if (!res.flag) {
        this.$message.error('上传失败')
        return
      }
      this.getCurrentCoursePDF()
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
    handleError(error, file, fileList) {
      console.log(error);
      if (this.loading) this.loading.close();
      // 处理上传失败的结果
    },
  },
  mounted() {
    this.courseId = this.$route.query.id;
    this.getCurrentCoursePDF();
  },
}
</script>

<style></style>