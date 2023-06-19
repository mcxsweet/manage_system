<template>
    <div>
        问卷调查
        {{student}}
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name:"Questionnaires",
    computed: {
        ...mapState('user',['student'])
    },
}
</script>

<style>

</style>