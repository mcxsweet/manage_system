<template>
    <el-container>
      <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">
        <el-select v-model="major" placeholder="请选择专业" @focus="focusOnSelect()">
          <el-option v-for="item in majorOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button icon="el-icon-search" style="margin: 10px" @click="getCurrentCourseExam()">确定</el-button>
      </el-header>
        <!--数据展示-->
      <div v-show="ischoose">
        <el-card>
          <el-button type="success" @click="add">新增</el-button>
          <el-collapse accordion @change="handleChange" style="margin: 20px;">
            <div v-for="item, index in CourseType" :key="index">
              <el-collapse-item :name="item.value">
                <template slot="title">
                  <el-row style="font-size: large;">
                    {{ item.name }}
                  </el-row>
                </template>
                <el-table
                    :data="tableData.filter(data => !search || data.courseName.toLowerCase().includes(search.toLowerCase()) ||data.courseCode.toLowerCase().includes(search.toLowerCase()))"
                    style="width: 100%"
                    v-loading="loading"
                    >
                  <el-table-column label="课程名称" width="200" prop="courseName">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.courseName" v-show="scope.row.ised"></el-input>
                      <span v-show="!scope.row.ised">{{ scope.row.courseName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="专业代码" width="120" prop="courseCode">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.courseCode" v-show="scope.row.ised"></el-input>
                      <span v-show="!scope.row.ised">{{ scope.row.courseCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="学分" width="70" prop="credit">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.credit" v-show="scope.row.ised"></el-input>
                      <span v-show="!scope.row.ised">{{ scope.row.credit }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="理论时长" width="100" prop="theoreticalHours">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.theoreticalHours" v-show="scope.row.ised"></el-input>
                      <span v-show="!scope.row.ised">{{ scope.row.theoreticalHours }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="实验学时" width="100" prop="labHours">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.labHours" v-show="scope.row.ised"></el-input>
                      <span v-show="!scope.row.ised">{{ scope.row.labHours }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="courseNature"
                      label="课程性质"
                      width="100"
                      :filters="[{ text: '必修', value: '必修' }, { text: '选修', value: '选修' }]"
                      :filter-method="filterTag"
                      filter-placement="bottom-end">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.courseNature" v-show="scope.row.ised"></el-input>
                      <el-tag
                          v-show="!scope.row.ised"
                          :type="scope.row.courseNature === '必修' ? 'primary' : 'success'"
                          disable-transitions>{{scope.row.courseNature}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="负责人" prop="uploadUser" width="100">
                    <template slot-scope="scope">
                      <el-select
                          v-model="scope.row.uploadUser" v-show="scope.row.ised"
                          clearable
                          filterable
                          placeholder="请输入或选择"
                          class="product-input"
                          @blur="UserSelect"
                          @focus="focusOnUserOptions()"
                          allow-create
                      >
                        <el-option
                            v-for="(item,index) in UserOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                      <span v-show="!scope.row.ised">{{ scope.row.uploadUser }}</span>
                    </template>
                  </el-table-column>
  
                  <el-table-column align="left" width="208" label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="editCourse(scope.$index)">编辑</el-button>
                      <el-button type="success" size="mini" @click="saveCourse(scope.$index)">保存</el-button>
                      <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column align="right" width="200" >
                    <template slot="header" slot-scope="scope">
                      <el-input v-model="search" placeholder="输入课程名称或专业代码搜索" />
                    </template>
                  </el-table-column>
  
                </el-table>
                <!--              <el-footer >
                              <p style="color:green;font-size:20px;">总共有{{tableData.length }}门课程</p>
                              </el-footer>-->
              </el-collapse-item>
            </div>
          </el-collapse>
  
        </el-card>
      </div>
  
      <!-- 新增课程     -->
      <el-dialog title="添加课程" :visible.sync="centerDialogVisible" width="50%" center >
        <el-form ref="form" :model="form" label-width="200px">
          <el-form-item label="课程名称">
            <el-col :span="15">
              <el-input v-model="form.courseName"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="课程代码">
            <el-col :span="15">
              <el-input v-model="form.courseCode"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="专业">
            <el-col :span="15">
              <span >{{ this.major }}</span>
            </el-col>
  
            <!--          <el-select
                          v-model="form.major"
                          clearable
                          filterable
                          placeholder="请输入或选择"
                          class="product-input"
                          @blur="productSelect"
                          @focus="focusOnSelect()"
                          allow-create
                      >
                        <el-option
                            v-for="(item,index) in majorOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>-->
          </el-form-item>
          <el-form-item label="学分">
            <el-col :span="15">
              <el-input v-model="form.credit"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="理论时长">
            <el-col :span="15">
              <el-input v-model="form.theoreticalHours"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="实验学时">
            <el-col :span="15">
              <el-input v-model="form.labHours"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="课程性质" >
            <el-select v-model="form.courseNature" placeholder="请选择课程性质" style="width:320px">
              <el-option label="必修" value="必修"></el-option>
              <el-option label="选修" value="选修"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类别">
            <el-select v-model="form.courseType" placeholder="请选择课程类型" style="width:320px">
              <el-option label="公共基础课" value="公共基础课"></el-option>
              <el-option label="专业基础课" value="专业基础课"></el-option>
              <el-option label="专业核心课" value="专业核心课"></el-option>
              <el-option label="专业特色课" value="专业特色课"></el-option>
              <el-option label="专业集中性实践教学" value="专业集中性实践教学"></el-option>
              <el-option label="专业素质教育" value="专业素质教育"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程负责人">
            <el-select
                
                v-model="form.uploadUser"
                clearable
                filterable
                placeholder="请输入或选择"
                class="product-input"
                @blur="UserSelect"
                @focus="focusOnUserOptions()"
                allow-create
                style="width:320px"
            >
              <el-option
                  v-for="(item,index) in UserOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
      </el-dialog>
    </el-container>
  </template>
  
  <script>
  import api from '@/api/api';
  
  
  
  export default {
    data() {
      return {
        user: "",
        tableData: [],
        search: '',
        major: "",
        loading: true,
        ischoose: false,
        isShowUpload: false,
        /* majorOptions:[],*///专业下拉选择框
        /*courseTypeOptions:[],*/ //新增时课程类别下拉选择框
        /*CourseType:[],*/
        UserOptions:[],
        majorOptions:[
          {
            label:'计算机科学与技术',
            value:'计算机科学与技术'
          },
          {
            label:'数据科学与大数据技术',
            value:'数据科学与大数据技术'
          },
          {
            label:'电子信息工程',
            value:'电子信息工程'
          }
        ],
        CourseType:[
          {
            name:'公共基础课',
            value:'公共基础课'
          },
          {
            name:'专业基础课',
            value:'专业基础课'
          },
          {
            name:'专业核心课',
            value:'专业核心课'
          },
          {
            name:'专业特色课',
            value:'专业特色课'
          },
          {
            name:'专业集中性实践教学',
            value:'专业集中性实践教学'
          },
          {
            name:'专业素质教育',
            value:'专业素质教育'
          }
        ],
        form:{
          uploadUser:'',
          courseType:'',
          courseNature:'',
          labHours:'',
          theoreticalHours:'',
          credit:'',
          major:'',
          courseCode:'',
          courseName:'',
        },
  
        centerDialogVisible:false,
  
      }
    },
    methods: {
      //课程性质筛选
      filterTag(value, row) {
        return row.courseNature === value;
      },
      //设置新增专业时可填可选
      productSelect(e) {
        let value = e.target.value; // 输入框值
        if(value) { // 你输入才有这个值 不为空，如果你下拉框选择的话 这个值为空
          this.form.major = value
        }
      },
      //设置新增课程类别时可填可选
      productTypeSelect(e){
        let value = e.target.value; // 输入框值
        if(value) { // 你输入才有这个值 不为空，如果你下拉框选择的话 这个值为空
          this.form.courseType = value
        }
      },
  
      //设置修改负责人可填可选
      UserSelect(e){
        let value = e.target.value; // 输入框值
        if(value) { // 你输入才有这个值 不为空，如果你下拉框选择的话 这个值为空
          this.user.name = value
        }
      },
  
      //增加
      add(){
        this.centerDialogVisible = true
      },
      //删除
      del(item){
        this.$confirm('是否删除 ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.del("/courseSyllabus", item, (resp) => {
            this.getCurrentCourseExam()
            if (resp.data.flag) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //查询选中专业的课程
      handleChange(item) {
        if (item) {
          //this.loading=true;
          this.currentType = item;
          api.post("/courseSyllabus/searchCourse", { "major": this.major, "type": item }, (resp) => {
            this.loading=false;
            if(resp.data.flag){
              for(let index = 0;index <resp.data.data.length;index++)
              {
                resp.data.data[index].ised = false;//隐藏每条课程编辑时的input输入框
              }
              this.tableData = resp.data.data;
            }
  
          })
          this.loading=true;
        }
      },
      //保存
      save(){
        this.form.major=this.major;
        api.post("/courseSyllabus/addcourse/" , this.form,(resp) => {
          console.log(resp)
          this.getCurrentCourseExam() //新增成功后刷新页面
          for (let key in this.form) { //清空表单
            this.form[key] = ''
          }
          if(resp.data.flag)
          {
            this.centerDialogVisible = false
            this.$message({
              showClose: true,
              message: '添加成功！',
              type: 'success'
            });
  
          }
          else
          {
            this.$message({
              showClose: true,
              message: '添加失败！',
              type: 'error'
            });
          }
        })
      },
      //修改
      editCourse(index){
        this.tableData[index].ised = true; //显示编辑课程时的input输入框
      },
      saveCourse(index){
        api.put("/courseSyllabus/updateCourse", this.tableData[index], (resp) => {
          if (resp.data.flag) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.tableData[index].ised = false;
          } else {
            this.$message({
              type: 'error',
              message: resp.data.message
            });
          }
        })
      },
      getCurrentCourseExam() {
        this.ischoose = true;
        this.handleChange(this.currentType);
        //this.focusOnCourseType()
      },
      //专业下拉框
      focusOnSelect() {
        // this.major = "";
        this.ischoose = false;
        //this.loading = true;
        /*api.get("/courseSyllabus/allCourse",'',(resp)=>{
          if(resp.data.flag){
            this.majorOptions = [];
            for(let index = 0;index < resp.data.data.length;index++){
              let newdata;
              newdata = {
                value: resp.data.data[index].major,
                label: resp.data.data[index].major
              }
              this.$set(this.majorOptions,index,newdata);//动态渲染
               //this.op[index] = newdata
            }
          }
        })*/
      },
  
      //课程类别下拉框
      /* focusOnCourseType(){
         this.loading = true;
         api.get("/courseSyllabus/searchCourseType",'',(resp)=>{
           if(resp.data.flag){
             this.courseTypeOptions = [];
             this.CourseType = [];
             for(let index = 0;index < resp.data.data.length;index++){
               let newdata;
               let newtype;
               newdata = {
                 value: resp.data.data[index].courseType,
                 label: resp.data.data[index].courseType
               }
               newtype = {
                 name: resp.data.data[index].courseType,
                 value: resp.data.data[index].courseType
               }
               this.$set(this.courseTypeOptions,index,newdata);//动态渲染
               this.$set(this.CourseType,index,newtype);
             }
           }
         })
  
       },*/
  
      //负责人下拉框
      focusOnUserOptions(){
        api.get("/user/searchTeacher",'',(resp)=>{
            this.loading=false;
          if(resp.data.flag){
            this.UserOptions = [];
            for(let index = 0;index < resp.data.data.length;index++){
              let newtype;
              newtype = {
                name: resp.data.data[index].teacherName,
                value: resp.data.data[index].teacherName
              }
              //动态渲染
              this.$set(this.UserOptions,index,newtype);
            }
          }
        })
      },
    },
    mounted() {
      this.user = localStorage.getItem("TeacherName");
    },
  }
  </script>

  <style>
  .el-loading-spinner {
      margin-left: -55px;
      padding: 20px;
      border-radius: 4px;
      width: auto;
      text-align: center;
      position: absolute
    }
</style>
  
  