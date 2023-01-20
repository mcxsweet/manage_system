<template>
  <el-container>
    <el-main>
      <el-table :data="tableData" border style="width: 100%">
        <!-- <el-table-column prop="id" label="序号" width="80%">
          <template slot-scope="scope"> -->
            <!-- <input v-model="scope.row.id" v-show="scope.row.ised"/> -->
            <!-- <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="name" label="课程目标">
          <template slot-scope="scope">
            <textarea  v-model="scope.row.name" v-show="scope.row.ised"></textarea>
            <span v-show="!scope.row.ised">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="毕业要求指标点">
          <template slot-scope="scope">
            <textarea v-model="scope.row.address" v-show="scope.row.ised"></textarea>
            <span v-show="!scope.row.ised">{{ scope.row.address }}</span>
          </template>
         </el-table-column>
         <el-table-column prop="approach" label="达成途径">
            <template slot-scope="scope">
              <textarea v-model="scope.row.approach" v-show="scope.row.ised"></textarea>
              <span v-show="!scope.row.ised">{{ scope.row.approach }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="gist" label="评价依据">
          <template slot-scope="scope">
              <textarea v-model="scope.row.gist" v-show="scope.row.ised"></textarea>
              <span v-show="!scope.row.ised">{{ scope.row.gist }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="editta(scope.row,scope)">编辑</el-button>
            <el-button type="danger" @click="saveta(scope.row)">保存</el-button>
          </template>
        </el-table-column>
    </el-table>
    </el-main>
  </el-container>
    
    
</template>

<script>
export default {
    name:'programObjective',
    data() {
      return {
        tableData: [{
          id: 1,
          name: '课程目标1：理解信号的特征、分类，理解系统的描述和分类，掌握信号的运算和连续时不变系统的性质和判断；',
          address: '指标点1.1:掌握数学、自然科学、工程基础和电子信息专业知识的基本概念，并将其运用到复杂工程问题的适当表述之中',
          approach:'通过课堂讲授',
          gist:'作业、考试',
          ised:false
        }, {
          id: 2,
          name: '课程目标 2：掌握信号、线性系统的时域特征，建立电路等系统的时域数学模型，能应用时域分析方法（卷积积分）分析线性时不变系统；',
          address: '指标点1.2:针对一个复杂系统或者过程选择恰当的数学模型，对模型正确性进行严谨的推理，并能正确求解',
          approach:'通过课堂讲授',
          gist:'作业、考试',
          ised:false
        }, {
          id: 3,
          name: '课程目标 3：掌握信号、线性系统的频域特征，建立电路等系统的频域数学模型，能应用频域分析方法（傅里叶级数、傅里叶变换）分析线性时不变系统；',
          address: '指标点1.2:针对一个复杂系统或者过程选择恰当的数学模型，对模型正确性进行严谨的推理，并能正确求解',
          approach:'通过课堂讲授',
          gist:'作业、考试',
          ised:false
        }, {
          id: 4,
          name: '课程目标 4：掌握拉普拉斯变换，理解信号、系统的复频域特征，建立电路等系统的复频域数学模型，能应用复频域分析方法（拉普拉斯变换）分析线性时不变系统；',
          address: '指标点1.2:针对一个复杂系统或者过程选择恰当的数学模型，对模型正确性进行严谨的推理，并能正确求解',
          approach:'通过课堂讲授',
          gist:'作业、考试',
          ised:false
        },{
          id: this.$route.query.id,
          name: '课程目标5：掌握z变换，理解信号、系统的z域特征，建立电路等系统的z域数学模型，能应用z域分析方法分析离散线性时不变系统；',
          address: '指标点1.2:针对一个复杂系统或者过程选择恰当的数学模型，对模型正确性进行严谨的推理，并能正确求解',
          approach:'通过课堂讲授',
          gist:'作业、考试',
          ised:false
        }
        ]} 
    },
      methods:{
        editta(row,index){
          row.ised = true;
          
        },
        saveta(row,index){
          row.ised = false
        },
        testchange(event,id){
          const name = '王小虎';
          const [firstId] = id;
          const obj = {};
          obj[firstId] = [{name,address:'上海市普陀区金沙江路'}];
          console.log(obj)
        }
      }
    }

</script>

<style>

</style>