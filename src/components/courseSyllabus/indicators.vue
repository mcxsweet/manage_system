<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">
            <el-select v-model="major" placeholder="请选择专业" @focus="focusOnSelect()">
                <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
            </el-select>

            <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseExam()"
                v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
            <el-empty v-if="!ischoose" description="请先选择专业"></el-empty>
        </el-header>


        <div v-show="ischoose">
            <div style="height: 100vh;">
                <embed :src="pdfUrl" type="application/pdf" width="100%" height="100%" />
            </div>
        </div>


    </el-container>
</template>

<script>
import axios from 'axios';
import global from '@/script/global'

export default {
    name: 'indicators',
    data() {
        return {
            department: "",
            fullscreenLoading: false,
            ischoose: false,
            options: [{
                value: '计算机科学与技术',
                label: '计算机科学与技术'
            }, {
                value: '电子信息工程',
                label: '电子信息工程'
            }, {
                value: '数据科学与大数据技术',
                label: '数据科学与大数据技术'
            }],
            major: "",
        }

    },
    methods: {
        getIndicatorsPDF() {
            let url = global.runTiemPath + "/courseInfo/" + this.major + "/indicatorsPDF";
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