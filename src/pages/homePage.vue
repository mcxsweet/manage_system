<template>
    <div class="block">
        <P style="margin-left: 50px;">说明文档</P>
        <el-timeline style="margin:auto 50px;">
            <el-timeline-item timestamp="步骤一" placement="top">
                <el-card>
                    <h4>课程管理</h4>
                    <p>1.<b>添加课程基本信息</b> <br> 依次点击课程管理 <i class="el-icon-right"></i> 课程设置 <i class="el-icon-right"></i>
                        课程基本信息 <i class="el-icon-right"></i> 添加课程
                    </p>
                    <p>2.<b>课程目标设置</b> <br>依次点击课程管理 <i class="el-icon-right"></i> 课程设置 <i class="el-icon-right"></i> 课程目标设置
                        <i class="el-icon-right"></i> 选择课程后点击确定进行设置
                    </p>
                    <p>3.<b>考核评价方式设置</b> <br>依次点击课程管理 <i class="el-icon-right"></i> 课程设置 <i class="el-icon-right"></i>
                        课程考核评价方式<i class="el-icon-right"></i> 选择课程后点击确定进行设置
                    </p>
                    <p>4.<b>试卷设置 (仅限考核评价方式中设置了期末考核并其中有试卷的考核子项目)</b> <br>依次点击课程管理 <i class="el-icon-right"></i> 课程设置 <i
                            class="el-icon-right"></i>
                        考试命题与指标点关系<i class="el-icon-right"></i> 选择课程后点击确定进行设置
                    </p>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="步骤二" placement="top">
                <el-card>
                    <h4>学生成绩管理</h4>
                    <p>1.<b>添加学生名单 (支持导入学校教务系统导出的学生名单xls文件)</b> <br> 依次点击学生成绩管理 <i class="el-icon-right"></i> 学生管理
                        <i class="el-icon-right"></i>学生信息管理 <i class="el-icon-right"></i> 添加学生名单
                    </p>
                    <p>2.<b>添加学生平时成绩</b> <br>依次点击学生成绩管理 <i class="el-icon-right"></i> 平时考核成绩统计
                        <i class="el-icon-right"></i> 成绩管理 <i class="el-icon-right"></i> 在线填写或下载模板填写后再上传
                    </p>
                    <p>3.<b>添加学生期末成绩</b> <br>依次点击学生成绩管理 <i class="el-icon-right"></i> 期末试卷成绩统计
                        <i class="el-icon-right"></i> 成绩管理 <i class="el-icon-right"></i>在线填写或下载模板填写后再上传
                    </p>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="步骤三" placement="top">
                <el-card>
                    <h4>生成课程分析报告</h4>
                    <p>1.<b>期末综合成绩统计</b> <br> 依次点击课程分析报告 <i class="el-icon-right"></i> 学生管理
                        <i class="el-icon-right"></i>成绩分析报告 <i class="el-icon-right"></i> 期末综合成绩统计表
                        (若完成了成绩的录入那么可以展示该课程的综合成绩)
                    </p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>
export default {
    name: " homePage",
    data() {
        return {
        }
    },
    methods: {

    },
    mounted() {

    }
}

</script>
<style scoped>
p {
    margin: 8px;
}
</style>