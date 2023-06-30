<template>
    <el-container>
        <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">

            <el-select v-model="major" placeholder="请选择专业" @focus="focusOnSelect()">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

            <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseExam()">确定</el-button>

            <el-button icon="el-icon-upload" style="margin: 10px" @click="isShowUpload = !isShowUpload">上传教学大纲</el-button>

            <el-dialog title="上传文件" :visible.sync="isShowUpload">
                <div>
                    <el-select v-model="uploadData.major" placeholder="请选择专业" style="width:100%">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="uploadData.courseName" placeholder="请输入课程名称"></el-input>
                    <el-select v-model="uploadData.type" placeholder="请选择课程类别" style="width:100%">
                        <el-option label="专业基础课" value="basicCourses"></el-option>
                        <el-option label="专业特色课" value="FeaturedCourses"></el-option>
                        <el-option label="专业必修课" value="requiredCourse"></el-option>
                    </el-select>

                    <el-upload action="/courseInfo/syllabus" :show-file-list="false" :file-list="fileList"
                        :data="uploadData" :on-success="handleSuccess" :before-upload="beforeUpload" :on-error="handleError"
                        :limit="1" :accept="'application/pdf'">
                        <el-button slot="trigger" size="small" type="primary">选择文件上传</el-button>
                    </el-upload>
                </div>
            </el-dialog>

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
                            <el-table-column label="CourseName" prop="courseName">
                            </el-table-column>
                            <el-table-column align="right">
                                <template slot="header" slot-scope="scope">
                                    <el-input v-model="search" placeholder="输入关键字搜索" />
                                </template>
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="deleteSyllabusPDF(scope.row)">删除</el-button>
                                    <el-button type="primary" @click="getSyllabusPDF(scope.row)">展示</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-collapse-item>
                </div>
            </el-collapse>


            <el-drawer title="教学大纲展示" :visible.sync="isShowPDF" direction="btt" size="90%">
                <embed :src="pdfUrl" type="application/pdf" width="100%" height="100%" />
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
            options: [{
                value: 'ComputerScienceAndTechnology',
                label: '计算机科学与技术'
            }, {
                value: 'ElectronicInformationEngineering',
                label: '电子信息工程'
            }, {
                value: 'DataScienceAndDataTechnology',
                label: '数据科学与数据技术'
            }],

            fileSize: 10,
            uploadData: {
                courseName: "",
                major: "",
                type: ""
            },
            fileList: [],

            isShowUpload: false,
            isShowPDF: false,
            courseType: [
                { name: "专业基础课", value: "basicCourses" },
                { name: "专业特色课", value: "FeaturedCourses" },
                { name: "专业必修课", value: "requiredCourses" },
            ],
            currentType: "",
            pdfUrl: "",
        }
    },
    methods: {
        getCurrentCourseExam() {
            console.log(this.major);
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

            let url = global.runTiemPath + "/courseInfo/file/syllabus/" + this.major + "/" + this.currentType + "/" + item.fileName;
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
        }
    },
}
</script>