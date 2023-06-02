<template>
  <!-- <pdf-upload pfdType="indexPoint"></pdf-upload> -->
  <div v-loading="loading" style="width: 100vw;">
    <embed :src="pdfUrl" type="application/pdf" width="100%" height="100%" />
  </div>
</template>

<script>
import pdfUpload from './pdfUpload.vue'
import axios from 'axios';
export default {
  name: 'indexPoint',
  components: { pdfUpload },
  data() {
    return {
      department: "",
      pdfUrf: null,
      loading: true
    }
  },
  methods: {
    getIndicatorsPDF() {
      let url = "/courseInfo/" + localStorage.getItem("department") + "/indicatorsPDF";
      axios.get(url, { responseType: "blob" }).then((response) => {
        if (!response.headers['content-type'].includes("application/pdf")) {
          return;
        }
        this.showPDF = true
        // 将响应数据转换为Blob对象
        const blob = new Blob([response.data], { type: "application/pdf" });

        // 生成URL，将其分配给嵌入元素的src属性
        this.pdfUrl = URL.createObjectURL(blob);
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getIndicatorsPDF();
  },
}
</script>

<style></style>