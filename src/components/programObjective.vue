<template>
  <el-container>
    <el-main>
      <el-table :data="tableData1" border style="width: 100%">
        <el-table-column prop="id" label="序号" width="90%">
          <template slot-scope="scope"> 
            <el-span v-model="scope.row.id">{{ '课程目标'+(scope.row.id+1)+':' }}</el-span>
          </template>
        </el-table-column> 
        <el-table-column prop="name" label="课程目标">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" v-show="scope.row.ised"></el-input>
            <span v-show="!scope.row.ised">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="毕业要求指标点" width="220">
          <template slot-scope="scope">
            <el-select v-model="scope.row.value1" multiple placeholder="请选择" v-show="scope.row.ised">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
              </el-option>
            </el-select>
            <div v-for="(item,index) in scope.row.value1" :key="index" v-show="!scope.row.ised">  
              <template boder="true"><span>{{ item }}</span></template>
            </div>
          </template>
         </el-table-column>
         <el-table-column prop="approach" label="达成途径">
            <template slot-scope="scope">
              <el-input v-model="scope.row.approach" v-show="scope.row.ised"></el-input>
              <span v-show="!scope.row.ised">{{ scope.row.approach }}</span>
            </template>
        </el-table-column>
        <el-table-column label="请选择评价依据" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.value2" multiple placeholder="评价依据" v-show="scope.row.ised"> 
                        <el-option label="考试" value="考试"></el-option>
                        <el-option label="作业" value="作业"></el-option>
                    </el-select>
                    <div v-for="(item2,index) in scope.row.value2" :key="index" v-show="!scope.row.ised"> 
                            <span>{{ item2 }}</span>
                          </div> 
            </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editta(scope.row,scope)">编辑</el-button>
            <el-button type="danger" size="mini" @click="saveta(scope.row)">保存</el-button>
            <el-button type="primary" size="mini" @click="delect(scope.row)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-button icon="el-icon-plus" type="primary" @click="add">添加课程目标</el-button>
    </el-main>
  </el-container>
</template>

<script>

export default {
    name:'programObjective',
    data() {
      return {
        newObj:[],
        kecheng:'课程目标',
         obj:{
           id:0,
           name:'',   
           approach:'',
           ised:true
         },
        tableData1: [],
         options: [{
          value: '选项1',
          label: '指标的1'
        }, {
          value: '选项2',
          label: '指标的2'
        }, {
          value: '选项3',
          label: '指标的3'
        }, {
          value: '选项4',
          label: '指标的4'
        }, {
          value: '选项5',
          label: '指标的5'
        }],
        value1: [],
        value2:[]
      } 
    },
      methods:{
        editta(row,index){
          row.ised = true;
        },
        saveta(row,index){
          row.ised = false
         console.log(this.value1)
        },
        delect(obj){
          let j       
          let index =this.tableData1.indexOf(obj);
          this.tableData1.splice(index,1)
          for(let i=0;i<this.tableData1.length;i++){ 
             j = this.tableData1.indexOf(this.tableData1[i]) 
             this.tableData1[i].id = j
           }

        },
        add(){
          this.obj.id = this.tableData1.length
          this.tableData1.push(JSON.parse(JSON.stringify(this.obj)))
        }
      }
    }
</script>

<style>

</style>