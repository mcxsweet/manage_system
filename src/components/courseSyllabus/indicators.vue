<template>
  <el-container>
    <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">
      <el-select v-model="major" placeholder="请选择专业" @focus="focusOnSelect()">
        <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="version" placeholder="请选择版本" style="margin-left: 10px">
        <el-option v-for="item in versions" :key="item.value" :label="item.label  + '级'" :value="item.value">
        </el-option>
        <el-option label="不作选择(通信工程专业选此)" value="NotSelect"></el-option>
      </el-select>
      <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseExam()"
                 v-loading.fullscreen.lock="fullscreenLoading">确定
      </el-button>
      <el-empty v-if="!ischoose" description="请先选择专业"></el-empty>
    </el-header>


    <div v-show="ischoose">
      <div style="height: 100vh;">
        <embed :src="pdfUrl" type="application/pdf" width="100%" height="100%"/>
      </div>
    </div>


  </el-container>
</template>

<script>
import axios from 'axios';
import global from '@/script/global'
import api from "@/api/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "indicators",
  data() {
    return {
      department: "",
      fullscreenLoading: false,
      ischoose: false,

      versions: [],
      version: "",
      options: [],
      major: "",
    }

  },

  //获取所有的专业和版本
  beforeMount() {
    api.get("/courseInfo/indicatorMajorsAndVersions", "", (response) => {
      response.data.data[0].forEach((item) => {
        this.options.push({
          value: item.major,
          label: item.major
        })
      });

      response.data.data[1].forEach((item) => {
        this.versions.push({
          value: item.version.substr(0, 4),
          label: item.version.substr(0, 4)
        })
      });

    });
  },

  methods: {
    getIndicatorsPDF() {
      let url = global.runTiemPath + "/courseInfo/indicatorsPDF" + "/" + this.major + "/" + this.version;
      axios.get(url, {responseType: "blob"}).then((response) => {
        if (!response.headers['content-type'].includes("application/pdf")) {
          this.fullscreenLoading = false;
          return;
        }
        this.showPDF = true
        // 将响应数据转换为Blob对象
        const blob = new Blob([response.data], {type: "application/pdf"});

        // 生成URL，将其分配给嵌入元素的src属性
        this.pdfUrl = URL.createObjectURL(blob);
        this.loading = false;
        this.ischoose = true;
        this.fullscreenLoading = false;
      });
    },
    focusOnSelect() {
      this.major = "";
      this.ischoose = false;
      this.loading = true;

    },
    getCurrentCourseExam() {
      this.fullscreenLoading = true;
      this.getIndicatorsPDF();
    },
  },
  mounted() {
    // this.getIndicatorsPDF();
  },
}
</script>

<style></style>