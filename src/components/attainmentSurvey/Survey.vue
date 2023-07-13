<template>
  <div class="survey">
    <el-card class="box-card card" v-for="(survey,i) in surveys" :key="i">
          <div slot="header" class="clearfix">
            <span class="title">{{i+1}}、{{ survey.courseTarget }}</span>
            <span style="color:red" v-show="noChoice && survey.attainment===null">
              (请选择)
            </span>
          </div>
          <el-radio-group v-model="survey.attainment" 
          :disabled="radio.length>0 && radio[i]!==null" class="radio_group">
              <el-radio v-for="(option,o) in options" :key="o" :label="o"
              class="radio">
                {{ option }}
                </el-radio>
            </el-radio-group>
    </el-card>
    <div class="add_survey" v-if ="radio.length>0 && radio[0]===null">
            <el-button type="primary" @click="addSurvey()">提交</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/api';
export default {
  name: "Survey",
  props: {
    courseId: {
      type: Number,
      require:true 
    },
    number: {
      type: String,
      require:true 
    },
  },
  data() {
    return {
      surveys:[],
      options:['A. 完全达成','B. 较好达成','C. 基本达成','D. 未达成'],
      radio: [],
      noChoice:false
    };
  },
  mounted () {
    this.getSurvey();
  },
  methods: {
    getSurvey() {
       api.get('/survey/getCourseSurvey?number='+this.number+'&courseId='+this.courseId, null,res=>{
        let {data,flag} = res.data
        if(flag){
          data.forEach((e,i,arr) => {
            this.radio.push(e.attainment);
            arr[i].studentNumber = this.number
          });
          this.surveys = data
        }
      })
    },
    addSurvey(){
      this.noChoice=true
      
      for (const e of this.surveys) {
          if(e.attainment===null){
            this.$message.warning('请选择！')
            return
          }
      }
      const loading = this.$loading({lock: true,});
      api.post('/survey/addSurvey',this.surveys,res=>{
        let {flag} = res.data
          if (flag) {
            this.$emit('selected',this.courseId)
            this.surveys.forEach((e,i) => {
              this.radio[i] = e.attainment
            });
            this.$message.success('提交成功')
          }else{
            this.$message.error('提交失败，请重试！')
          }
          this.noChoice=false
          loading.close();
      })
    }
  },
};
</script>

<style scope>
.survey{
  margin-left: 20px;
}
.card{
    margin-bottom: 20px;
}
.title::before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
}
.radio_group{
    display: flex !important;;
    flex-direction: column;
}
.radio{
    margin-top: 18px;
}
.add_survey button{
    margin: 20px;
    float: right;
}
</style>