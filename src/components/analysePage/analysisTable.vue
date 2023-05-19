<template>
    <div class="container">
        <div v-for="item, index in data" :key="index" style="margin-top: 50px ">
            <myChart :title="index + 1" :data="item"></myChart>
        </div>
    </div>
</template>

<script>
import api from '@/api/api'
import myChart from './myChart.vue'
export default {
    data() {
        return {
            data: [],
            title: "课程目标达成情况",
        }
    },
    components: { myChart },
    methods: {
        getDataTest() {
            api.get("/student/12/scatterData", "", (resp) => {
                var array = JSON.parse(resp.data.value);
                console.log(array);
                this.data = array;
            })
        },
    },
    mounted() {
        this.getDataTest();
    },
}
</script>

<style scoped>
.container {
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    /* background-color: red; */
}
</style>
