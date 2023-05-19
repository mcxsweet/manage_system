<template>
    <ECharts class="chart" :option="option" />
</template>

<script>
export default {
    name: 'myChart',
    data() {
        return {

        }
    },
    props: ["title", "data"],
    computed: {
        option() {
            return {
                title: {
                    text: "课程目标" + this.title + "达成情况",
                    left: 'center',
                    top: 0
                },
                xAxis: {
                    name: "学生人数",
                    // nameLocation: "center",
                    type: 'category',
                    data: this.data.map(d => d.index)
                },
                yAxis: {
                    name: "成绩达成情况",
                    // nameLocation: "center",
                    type: 'value'
                },
                series: [
                    {
                        data: this.data.map(d => d.value),
                        type: 'scatter',
                        markLine: {
                            data: [
                                {
                                    name: '平均线',
                                    type: 'average'
                                },
                            ]
                        }

                    }

                ],

            }
        }
    },
}
</script>

<style>
.chart {
    height: 400px;
    width: 700px;
}
</style>