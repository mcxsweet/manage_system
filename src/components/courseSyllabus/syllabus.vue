<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">

            <el-select v-model="major" placeholder="请选择专业" @focus="focusOnSelect()">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

            <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseExam()">确定</el-button>

        </el-header>

        <div v-show="ischoose">

            <el-collapse accordion @change="handleChange" style="margin: 20px;">

                <div v-for="item, index in courseType" :key="index">
                    <el-collapse-item :name="item.value">
                        <template slot="title">
                            <el-row style="font-size: large;">
                                {{ item.name }}
                            </el-row>
                        </template>

                        <el-table
                            :data="tableData.filter(data => !search || data.courseName.toLowerCase().includes(search.toLowerCase()))"
                            style="width: 100%">
                            <el-table-column label="课程名称" prop="courseName">
                            </el-table-column>
                            <el-table-column align="right">
                                <template slot="header" slot-scope="scope">
                                    <el-input v-model="search" placeholder="输入关键字搜索" />
                                </template>
                                <template slot-scope="scope">
                                    <el-upload :action="uploadPath" :show-file-list="false" :file-list="fileList"
                                        :data="uploadData" :on-success="handleSuccess" :before-upload="beforeUpload"
                                        :on-error="handleError" :accept="'application/pdf'">
                                        <el-button icon="el-icon-upload" slot="trigger" type="primary"
                                            @click="upload(scope.row)">教学大纲更新</el-button>
                                        <el-button style="margin-left: 20px;" type="primary"
                                            @click="getSyllabusPDF(scope.row)">教学大纲展示</el-button>
                                    </el-upload>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-collapse-item>
                </div>
            </el-collapse>

            <el-drawer title="教学大纲展示" :visible.sync="isShowPDF" direction="btt" size="90%">
                <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" width="100%" height="100%" />
                <el-result v-if="!pdfUrl" icon="error" title="暂无数据" subTitle="请先上传教学大纲">
                    <template slot="extra">
                        <el-button type="primary" size="medium" @click="isShowPDF = !isShowPDF">返回</el-button>
                    </template>
                </el-result>
            </el-drawer>
        </div>

    </el-container>
</template>

<script>
import api from '@/api/api';
import global from '@/script/global'
import axios from 'axios';


export default {
    data() {
        return {
            tableData: [],
            search: '',
            major: "",
            loading: true,
            ischoose: false,
            isShowUpload: false,
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

            fileSize: 10,
            uploadPath: global.runTiemPath + "/courseInfo/syllabus",
            uploadData: {
                id: ""
            },
            fileList: [],
            isShowPDF: false,
            courseType: [
                { name: "公共基础课", value: "公共基础课" },
                { name: "专业基础课", value: "专业基础课" },
                { name: "专业核心课", value: "专业核心课" },
                { name: "专业特色课", value: "专业特色课" },
                { name: "实践教学课", value: "实践教学课" },
            ],
            currentType: "",
            currentItem: "",
            pdfUrl: "",
            selectedFile: "",
        }
    },
    methods: {
        getCurrentCourseExam() {
            this.ischoose = true;
        },
        focusOnSelect() {
            this.major = "";
            this.ischoose = false;
            this.loading = true;
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
            this.handleChange(this.currentType);
            this.isShowUpload = false;
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
        handleChange(item) {
            if (item) {
                this.currentType = item;
                api.post("/courseInfo/syllabusList", { "major": this.major, "type": item }, (resp) => {
                    this.tableData = resp.data.data;
                })
            }
        },
        getSyllabusPDF(item) {
            this.isShowPDF = true;
            this.pdfUrl = null;
            let url = global.runTiemPath + "/courseInfo/file/" + item.id + "/syllabus/";
            axios.get(url, { responseType: "blob" }).then((response) => {
                if (!response.headers['content-type'].includes("application/pdf")) {
                    return;
                }
                this.showPDF = true
                // 将响应数据转换为Blob对象
                const blob = new Blob([response.data], { type: "application/pdf" });

                // 生成URL，将其分配给嵌入元素的src属性
                this.pdfUrl = URL.createObjectURL(blob);
                this.ischoose = true;
            });

        },
        deleteSyllabusPDF(item) {
            this.$confirm('是否删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.del("/courseInfo/file/syllabus/" + this.major + '/' + this.currentType + '/' + item.fileName, "", (resp) => {
                    if (resp.data.flag) {
                        this.$message.success(resp.data.message);
                    } else {
                        this.$message.error(resp.data.message);
                    }
                });
                this.handleChange(this.currentType);
            }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        upload(item) {
            this.uploadData.id = item.id;
        },
    },
}
</script>