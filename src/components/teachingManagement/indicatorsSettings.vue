<template>
  <el-container>

    <el-main>
      <el-card>
        <h3>修改毕业要求指标点</h3>
        <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">
          <el-select v-model="major" placeholder="请选择专业">
            <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
          <el-button icon="el-icon-search" style="margin: 10px" @click="getIndicatorsInfo()">确定</el-button>
        </el-header>
        <el-table :data="indicatorOutline" style="width: 100%">

          <el-table-column type="expand" class="warning-row">
            <template slot-scope="indicatorOutLineRow">

              <el-teble>
                <el-row>
                  <el-col :span="2" class="indicatorsColField">
                    指标点
                  </el-col>
                  <el-col :span="8" class="indicatorsColField">
                    指标点内容
                  </el-col>
                  <el-col :span="8" class="indicatorsColField">
                    指标点课程
                  </el-col>
                  <el-col :span="1" class="indicatorsColFieldmanipulate">
                    操作
                  </el-col>

                  <el-col :span="2" class="manipulate">
                    <el-button type="success" size="mini"
                               @click="saveIndicator(indicatorOutLineRow.row.id, indicatorOutLineRow.row.name)">新增指标点
                    </el-button>
                  </el-col>

                </el-row>

                <template v-for="(item, key) in indicatorsByMajor">

                  <el-row v-bind:key="key" class="indicatorsRow"
                          v-if="judgementIndicatorsInMajor(indicatorOutLineRow.row.id, item.indicatorIndex)">

                    <el-col :span="2" class="indicatorsCol">{{ item.indicatorName }}</el-col>
                    <el-col :span="8" class="indicatorsCol">{{ item.indicatorContent }}</el-col>
                    <el-col :span="8" class="indicatorsCol">{{ item.courses }}</el-col>
                    <el-col :span="3" class="indicatorsColButton">
                      <el-button type="primary" size="mini" @click="editIndicator(indicatorOutLineRow.row.name, item)">
                        编辑
                      </el-button>
                      <el-button type="danger" size="mini" @click="delIndicator(item, key)" class="deleteButton">删除
                      </el-button>
                    </el-col>


                  </el-row>
                </template>
              </el-teble>
            </template>
          </el-table-column>

          <el-table-column label="毕业指标概要" width="200" prop="name">
          </el-table-column>
          <el-table-column label="指标概要内容" width="1000" prop="content">
          </el-table-column>
        </el-table>

        <!--编辑指标点表单-->
        <div>
          <el-dialog title="编辑指标点数据:" :visible.sync="editIndicatorDialog" width="50%">
            <el-row class="indicatorFormMsg">{{ major }} ➔ {{ editIndicatorOutLineName }}</el-row>
            <el-form ref="form" :rules="formRules" :model="editIndicatorObj" label-width="100px">
              <el-form-item label="指标点" prop="indicatorName">
                <el-input v-model="editIndicatorObj.indicatorName"></el-input>
              </el-form-item>
              <el-form-item label="指标点内容" prop="indicatorContent">
                <el-input type="textarea" v-model="editIndicatorObj.indicatorContent"></el-input>
              </el-form-item>
              <el-form-item label="指标点课程" prop="courses">
                <el-input type="textarea" v-model="editIndicatorObj.courses"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editIndicatorCancel()">取 消</el-button>
                    <el-button type="primary" @click="editIndicatorConfirm()">确 定</el-button>
                  </span>
          </el-dialog>
        </div>

        <!--新增指标点表单-->
        <div>
          <el-dialog title="新增指标点数据:" :visible.sync="saveIndicatorDialog" width="50%">
            <el-row class="indicatorFormMsg">{{ major }} ➔ {{ saveIndicatorOutLineName }}</el-row>
            <el-form ref="form" :rules="formRules" :model="saveIndicatorObj" label-width="100px">
              <el-form-item label="指标点" prop="indicatorName">
                <el-input v-model="saveIndicatorObj.indicatorName"></el-input>
              </el-form-item>
              <el-form-item label="指标点内容" prop="indicatorContent">
                <el-input type="textarea" v-model="saveIndicatorObj.indicatorContent"></el-input>
              </el-form-item>
              <el-form-item label="指标点课程" prop="courses">
                <el-input type="textarea" v-model="saveIndicatorObj.courses"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="saveIndicatorCancel()">取 消</el-button>
                    <el-button type="primary" @click="saveIndicatorConfirm()">确 定</el-button>
                  </span>
          </el-dialog>
        </div>


      </el-card>
    </el-main>
  </el-container>
</template>


<script>
import api from '@/api/api';

export default {
  name: "indicatorsSettings",
  inject: ['reload'],
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    //指标点对象
    const indicator = {
      id: '',
      indicatorIndex: '',
      indicatorName: '',
      indicatorContent: '',
      major: '',
      courses: ''
    };
    return {
      //表格数据
      indicatorOutline: [],
      indicatorsByMajor: [],
      major: "",

      //指标点编辑表单
      editIndicatorDialog: false,
      editIndicatorOutLineName: '',
      editIndicatorObjTemp: {
        indicatorName: '',
        indicatorContent: '',
        courses: ''
      },
      editIndicatorObj: {
        ...indicator,
      },

      //指标点添加表单
      saveIndicatorDialog: false,
      saveIndicatorOutLineRowId: '',
      saveIndicatorOutLineName: '',
      saveIndicatorObj: {
        ...indicator,
      },

      formRules: {
        indicatorName: [
          {
            required: true, message: '请输入指标点(例: 1.1、1.2)'
          }
        ],
        indicatorContent: [
          {
            required: true, message: '请输入指标点内容'
          }
        ],
        courses: [
          {
            required: true, message: '请输入指标点课程'
          }
        ],
      },


      //选择专业
      options: [{
        value: '计算机科学与技术',
        label: '计算机科学与技术'
      }, {
        value: '电子信息工程',
        label: '电子信息工程'
      }, {
        value: '数据科学与大数据技术',
        label: '数据科学与大数据技术'
      }],
    };
  },


  methods: {
    getIndicatorsInfo() {
      this.getIndicatorOutline();
      this.getIndicatorsByMajor();
    },

    // 获取专业指标点概要
    getIndicatorOutline() {
      api.get("/courseInfo/indicatorsOutline", "", (response) => {
        this.indicatorOutline = response.data.data;
      })
    },

    // 获取已选择专业的具体指标点
    getIndicatorsByMajor() {
      api.post("/courseInfo/indicators", {major: this.major}, (response) => {
        this.indicatorsByMajor = response.data.data;
      })
    },

    //判断指标点在此条指标点指标概要内(共12条指标概要)
    judgementIndicatorsInMajor(indicatorOutLineRowId, indicatorIndex) {
      return indicatorOutLineRowId == indicatorIndex;
    },

    showObj(obj) {
      console.log(obj)
      return true
    },

    //编辑指标点对话框
    editIndicator(indicatorOutLineRowName, indicatorItem) {
      if (indicatorItem.id === "") {
        this.refreshToDel()
      } else {
        this.editIndicatorDialog = true;
        this.editIndicatorOutLineName = indicatorOutLineRowName;
        [this.editIndicatorObjTemp.indicatorName,
          this.editIndicatorObjTemp.indicatorContent,
          this.editIndicatorObjTemp.courses] = [
          indicatorItem.indicatorName,
          indicatorItem.indicatorContent,
          indicatorItem.courses];
        this.editIndicatorObj = indicatorItem;
      }
    },

    //取消编辑指标点
    editIndicatorCancel() {
      [this.editIndicatorObj.indicatorName,
        this.editIndicatorObj.indicatorContent,
        this.editIndicatorObj.courses] = [
        this.editIndicatorObjTemp.indicatorName,
        this.editIndicatorObjTemp.indicatorContent,
        this.editIndicatorObjTemp.courses];

      this.cancelNofity("取消指标点编辑操作!")
      this.editIndicatorDialog = false;
    },

    //确认编辑指标点
    editIndicatorConfirm() {
      api.put("/courseInfo/indicators", this.editIndicatorObj, (response) => {
        response.data.flag == true ?
            this.successNofity("指标点数据修改成功!") :
            this.failNofify("指标点数据修改失败!")
      })
      this.editIndicatorDialog = false;
    },

    //新增指标点对话框
    saveIndicator(indicatorOutLineRowId, indicatorOutLineRowName) {
      Object.keys(this.saveIndicatorObj).forEach(key => this.saveIndicatorObj[key] = '');
      [this.saveIndicatorOutLineRowId,
        this.saveIndicatorOutLineName] = [
        indicatorOutLineRowId,
        indicatorOutLineRowName];
      [this.saveIndicatorObj.major, this.saveIndicatorObj.indicatorIndex] =
          [this.major, indicatorOutLineRowId]
      this.saveIndicatorDialog = true;
    },

    //取消新增指标点
    saveIndicatorCancel() {
      this.cancelNofity("取消指标点新增操作!")
      this.saveIndicatorDialog = false;
    },

    //确认新增指标点
    saveIndicatorConfirm() {
      api.post("/courseInfo/saveIndicator", this.saveIndicatorObj, (response) => {
        (response.data.data == true ?
            this.successNofity("指标点数据新增成功!") :
            this.failNofify("指标点数据新增失败!")) === true ?
            this.indicatorsByMajor.push(this.saveIndicatorObj) : false;
      })
      this.saveIndicatorDialog = false;
    },

    //删除指标点
    delIndicator(item, key) {
      if (item.id === "") {
        this.refreshToDel()
      } else {
        api.del("/courseInfo/indicators", item, (response) => {
          (response.data.flag == true ?
              this.successNofity("指标点数据删除成功!") :
              this.failNofify("指标点数据删除失败!")) === true ?
              this.$delete(this.indicatorsByMajor, key) : false;
        });
      }
    },

    successNofity(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success'
      });
      return true;
    },

    cancelNofity(msg) {
      this.$notify({
        title: '警告',
        message: msg,
        type: 'warning'
      });
    },

    failNofify(msg) {
      this.$notify.error({
        title: '错误',
        message: msg
      });
      return false
    },

    refreshToDel() {
      this.$alert('数据更新中, 点击确定继续...', '请在页面刷新后再次尝试!', {
        confirmButtonText: '确定',
        callback: () => location.reload()
      });
    },


  }
}

</script>

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 100px;
  margin-bottom: 0;
  width: 50%;
}

.indicatorsRow {
  border-top: rgb(235, 238, 245) solid 1px;
}

.indicatorsCol {
  padding: 5px 20px 0 0;
}

.indicatorsColField {
  padding: 0;
  font-size: medium;
  font-weight: 500;
}

.indicatorFormMsg {
  margin: 0 50px 30px;
  font-weight: bold;
}

.el-table__expanded-cell[class*=cell] {
  background-color: #f5f7fa;
}

.indicatorsColButton, .indicatorsColFieldmanipulate {
  margin-left: 100px;
}

.deleteButton {
  margin-left: 32px;
}

</style>