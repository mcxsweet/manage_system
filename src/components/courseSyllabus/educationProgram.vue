<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">

            <el-select v-model="major" placeholder="请选择专业" @focus="focusOnSelect()">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

            <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseExam()"
                v-loading.fullscreen.lock="fullscreenLoading">查看培养方案</el-button>

            <el-button icon="el-icon-upload" style="margin: 10px" @click="showUpload = !showUpload">上传培养方案</el-button>

            <el-empty v-if="!ischoose" description="请先选择专业"></el-empty>
        </el-header>

        <el-dialog title="上传文件" :visible.sync="showUpload">
            <div>
                <el-select v-model="uploadData.major" placeholder="请选择专业" style="width:100%">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>

                <el-upload style="margin-top: 20px;" v-show="showUpload" :action="uploadPath" :show-file-list="false"
                    :file-list="fileList" :data="uploadData" :on-success="handleSuccess" :before-upload="beforeUpload"
                    :on-error="handleError" :limit="1" :accept="'application/pdf'">
                    <el-button slot="trigger" size="small" type="primary">选择文件上传</el-button>
                </el-upload>
            </div>
        </el-dialog>


        <div v-show="ischoose" style="height: 100vh;">
            <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" width="100%" height="100%" />
            <el-result v-if="!pdfUrl" icon="error" title="暂无数据" subTitle="请先上传">
                <template slot="extra">
                    <el-button type="primary" size="medium" @click="isShowPDF = !isShowPDF">返回</el-button>
                </template>
            </el-result>
        </div>


    </el-container>
</template>

<script>
import axios from 'axios';
import global from '@/script/global'

export default {
    name: 'educationProgram',
    data() {
        return {
            fileSize: 10,
            department: "",
            ischoose: false,
            uploadPath: global.runTiemPath + "/courseInfo/educationProgramPDF",
            showUpload: false,
            options: [{
                value: 'ComputerScienceAndTechnology',
                label: '计算机科学与技术'
            }, {
                value: 'ElectronicInformationEngineering',
                label: '电子信息工程'
            }, {
                value: 'DataScienceAndDataTechnology',
                label: '数据科学与大数据技术'
            }],

            major: "",
            uploadData: {
                major: "",
                type: "educationProgram"
            },
            fileList: [],
            fullscreenLoading: false,

            //权限控制
            isAdmin: "",
        }

    },
    methods: {
        getEducationProgramPDF() {
            this.pdfUrl = null;
            let url = global.runTiemPath + "/courseInfo/file/educationProgram/" + this.major + ".pdf";
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
            });
            this.fullscreenLoading = false;

        },
        focusOnSelect() {
            this.major = "";
            this.ischoose = false;

        },
        getCurrentCourseExam() {
            this.fullscreenLoading = true;
            this.getEducationProgramPDF();
        },
        handleSuccess(res, file, fileList) {
            // 处理上传成功的结果
            if (this.loading) this.loading.close();
            if (!res.flag) {
                this.$message.error('上传失败')
                return
            } else {
                this.$message.success('上传成功')
            }
            this.showUpload = false;

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
        this.isAdmin = localStorage.getItem("Isadmin");
    },
}
</script>

<style></style>