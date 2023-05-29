<template>
  <pdf-upload pfdType="teachingPro"></pdf-upload>  
</template>

<script>
import pdfUpload from '../pdfUpload.vue'
export default {
    name:'teachingPro',
    components:{pdfUpload},
    data(){
        return{
          ischoose:false
        }
    }
}
</script>

<style>

</style>