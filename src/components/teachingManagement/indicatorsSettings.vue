<template>
  <el-container>

    <el-main>
      <el-card>
        <h3>编辑毕业要求指标点</h3>

        <el-header style="background-color: #fff;height: 50px;margin-bottom: 10px;">
          <el-select v-model="major" placeholder="请选择专业">
            <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="version" placeholder="请选择版本" style="margin-left: 10px">
            <el-option v-for="item in versions" :key="item.value" :label="item.label  + '级'" :value="item.value">
            </el-option>
            <el-option value="重新选择版本">
              <el-button type="text" @click="addVersion()">新增一个版本...</el-button>
            </el-option>
          </el-select>
          <el-button icon="el-icon-search" style="margin: 10px" @click="getIndicatorsInfo()">确定</el-button>
          <el-button type="primary" @click="exportAsWord()" :disabled="exportAsWordButton"
                     :loading="exportAsWordLoading">
            {{ exportAsWordText }}
          </el-button>

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
                      <el-button type="primary" class="indicatorEditButton" size="mini"
                                 @click="editIndicator(indicatorOutLineRow.row.name, item)">
                        编辑
                      </el-button>
                      <el-popover trigger="click" placement="top" width="200">
                        <template>
                          <p>此操作不可逆, 确定删除该项指标点吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="cancelDelIndicator()">取消</el-button>
                            <el-button type="danger" size="mini" @click="delIndicator(item, key)">确定</el-button>
                          </div>
                        </template>
                        <el-button slot="reference" type="danger" size="mini" class="clickToToggleStatus">删除</el-button>
                      </el-popover>
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
            <el-row class="indicatorFormMsg">{{ major }}{{ version }}级 ➔ {{ editIndicatorOutLineName }}</el-row>
            <el-form ref="form" :rules="formRules" :model="editIndicatorObj" label-width="100px">
              <el-form-item label="指标点" prop="indicatorName">
                <el-input v-model="editIndicatorObj.indicatorName"></el-input>
              </el-form-item>
              <el-form-item label="指标点内容" prop="indicatorContent">
                <el-input type="textarea" v-model="editIndicatorObj.indicatorContent"></el-input>
              </el-form-item>
              <el-form-item label="指标点课程" prop="courses">
                <el-input type="textarea" v-model="editIndicatorObj.courses" :disabled="true"></el-input>
                <el-button type="primary" @click="showEditMajorIndicatorCoursesDialog()">点此按钮 获取和编辑{{ major }}专业
                  全部课程数据
                </el-button>
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
            <el-row class="indicatorFormMsg">{{ major }}{{ version }}级 ➔ {{ saveIndicatorOutLineName }}</el-row>
            <el-form ref="form" :rules="formRules" :model="saveIndicatorObj" label-width="100px">
              <el-form-item label="指标点" prop="indicatorName">
                <el-input v-model="saveIndicatorObj.indicatorName"></el-input>
              </el-form-item>
              <el-form-item label="指标点内容" prop="indicatorContent">
                <el-input type="textarea" v-model="saveIndicatorObj.indicatorContent"></el-input>
              </el-form-item>
              <el-form-item label="指标点课程" prop="courses">
                <el-input type="textarea" v-model="saveIndicatorObj.courses" :disabled="true"></el-input>
                <el-button type="primary" @click="showMajorIndicatorCoursesDialog()">点此按钮 获取和添加{{ major }}专业 全部课程数据
                </el-button>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="saveIndicatorCancel()">取 消</el-button>
                    <el-button type="primary" @click="saveIndicatorConfirm()">确 定</el-button>
                  </span>
          </el-dialog>
        </div>


        <!--编辑指标点课程表单-->
        <div>
          <el-dialog title="此专业全部课程数据:" :visible.sync="editMajorIndicatorCoursesDialog" width="80%">
            <el-row>{{ major }}专业 ➔ <strong>在输入框内手动编辑 或 点击选中即可添加课程:</strong>
              <el-input type="textarea" v-model="editIndicatorObj.courses"></el-input>
            </el-row>
            <template>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[0] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="公共基础课程名称" border size="mini"
                               :key="course" v-if="isPublicBasicCourse(course.courseType)"
                               @change="editOrRemoveCourse($event, course.courseName)">{{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[1] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业基础课程名称" border size="mini"
                               :key="course" v-if="isProfessionalBasicCourse(course.courseType)"
                               @change="editOrRemoveCourse($event, course.courseName)">{{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[2] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业素质教育" border size="mini"
                               :key="course" v-if="isQualityEducation(course.courseType)"
                               @change="editOrRemoveCourse($event, course.courseName)">{{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[3] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业核心课程名称" border size="mini"
                               :key="course" v-if="isProfessionalCoreCourse(course.courseType)"
                               @change="editOrRemoveCourse($event, course.courseName)">{{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[4] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业特色课程名称" border size="mini"
                               :key="course" v-if="isProfessionalDistinctiveCourse(course.courseType)"
                               @change="editOrRemoveCourse($event, course.courseName)">
                    {{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[5] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业集中性实践教学" border size="mini"
                               :key="course" v-if="isProfessionalCentralizedPracticalTeaching(course.courseType)"
                               @change="editOrRemoveCourse($event, course.courseName)">
                    {{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
            </template>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="editMajorIndicatorCoursesDialog = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>


        <!--新增 指标点课程表单-->
        <div>
          <el-dialog title="此专业全部课程数据:" :visible.sync="majorIndicatorCoursesDialog" width="80%">
            <el-row>{{ major }}专业 ➔ <strong>点击选中即可添加课程(或在输入框内编辑):</strong>
              <el-input type="textarea" v-model="saveIndicatorObj.courses"></el-input>
            </el-row>
            <template>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[0] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="公共基础课程名称" border size="mini"
                               :key="course" v-if="isPublicBasicCourse(course.courseType)"
                               @change="addOrRemoveCourse($event, course.courseName)">{{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[1] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业基础课程名称" border size="mini"
                               :key="course" v-if="isProfessionalBasicCourse(course.courseType)"
                               @change="addOrRemoveCourse($event, course.courseName)">{{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[2] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业素质教育" border size="mini"
                               :key="course" v-if="isQualityEducation(course.courseType)"
                               @change="addOrRemoveCourse($event, course.courseName)">{{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[3] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业核心课程名称" border size="mini"
                               :key="course" v-if="isProfessionalCoreCourse(course.courseType)"
                               @change="addOrRemoveCourse($event, course.courseName)">{{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[4] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业特色课程名称" border size="mini"
                               :key="course" v-if="isProfessionalDistinctiveCourse(course.courseType)"
                               @change="addOrRemoveCourse($event, course.courseName)">
                    {{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
              <div class="courseTypeBorder">
                <strong>{{ majorCourseType[5] }}</strong>
                <template v-for="(course) in majorIndicatorCourses">
                  <el-checkbox label="专业集中性实践教学" border size="mini"
                               :key="course" v-if="isProfessionalCentralizedPracticalTeaching(course.courseType)"
                               @change="addOrRemoveCourse($event, course.courseName)">
                    {{ course.courseName }}
                  </el-checkbox>
                </template>
              </div>
            </template>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="majorIndicatorCoursesDialog = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>

      </el-card>
    </el-main>
  </el-container>
</template>


<script>
import api from '@/api/api';
import global from "@/script/global";
import axios from "axios";

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
      courses: '',
      version: ''
    };
    return {
      //选择专业和版本
      options: [],
      versions: [],


      //表格数据
      indicatorOutline: [],
      indicatorsByMajor: [],
      major: "",
      version: [],

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


      //新增指标点
      saveIndicatorDialog: false,
      saveIndicatorOutLineRowId: '',
      saveIndicatorOutLineName: '',
      saveIndicatorObj: {
        ...indicator,
      },

      // 指标点课程数据
      editMajorIndicatorCoursesDialog: false,
      majorIndicatorCoursesDialog: false,
      majorIndicatorCourses: [],
      majorCourseType: [
        "公共基础课",
        "专业基础课",
        "专业素质教育",
        "专业核心课",
        "专业特色课",
        "专业集中性实践教学",
      ],
      indicatorCourseObj: {
        courseCode: '',
        courseName: "",
        courseNature: "",
        courseType: "",
        credit: '',
        fileAddress: '',
        id: '',
        labHours: '',
        major: "",
        theoreticalHours: '',
        uploadUser: '',
      },
      publicBasicChecked: false,
      publicBasicCourses: [],

      //导出word
      exportAsWordText: "导出为word文档",
      exportAsWordButton: false,
      exportAsWordLoading: false,

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
            required: true, message: '请点击下方按钮输入指标点课程'
          }
        ],
      },

    };
  },

  //获取所有的专业和版本
  beforeMount() {
    api.get("/courseInfo/indicatorMajorsAndVersions", "", (response) => {
      response.data.data[0].forEach((item) => {
        this.options.push({
          value: item.major,
          label: item.major
        })
      });

      response.data.data[1].forEach((item) => {
        this.versions.push({
          value: item.version.substr(0, 4),
          label: item.version.substr(0, 4)
        })
      });

    });
  },

  methods: {
    //获取指标点大纲和指标点内容
    getIndicatorsInfo() {
      this.getIndicatorOutline();
      this.getIndicatorsByMajorAndVersion();
    },

    // 获取专业指标点概要
    getIndicatorOutline() {
      api.get("/courseInfo/indicatorsOutline", "", (response) => {
        this.indicatorOutline = response.data.data;
      })
    },

    // 获取已选择专业和对应版本的具体指标点
    getIndicatorsByMajorAndVersion() {
      api.post("/courseInfo/majorVersionIndicators", {major: this.major, version: this.version}, (response) => {
        this.indicatorsByMajor = response.data.data;
      })
    },

    // 获取专业全部课程
    getMajorIndicatorCourse() {
      api.post("/courseInfo/indicatorCourse", {major: this.major}, (response) => {
        this.majorIndicatorCourses = response.data.data;
      })
    },

    //修改指标点课程对话框
    showEditMajorIndicatorCoursesDialog() {
      this.editMajorIndicatorCoursesDialog = true;
      this.getMajorIndicatorCourse();
    },

    //新增指标点课程对话框
    showMajorIndicatorCoursesDialog() {
      this.majorIndicatorCoursesDialog = true;
      this.getMajorIndicatorCourse();
    },

    //判断指标点在此条指标点指标概要内(共12条指标概要)
    judgementIndicatorsInMajor(indicatorOutLineRowId, indicatorIndex) {
      return indicatorOutLineRowId == indicatorIndex;
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
      this.editIndicatorObj.version = this.version;
      api.put("/courseInfo/indicators", this.editIndicatorObj, (response) => {
        response.data.flag == true ?
            this.successNofity("指标点数据修改成功!") :
            this.failNofify("指标点数据修改失败!")
      })
      this.editIndicatorDialog = false;
    },

    //新增指标点对话框
    saveIndicator(indicatorOutLineRowId, indicatorOutLineRowName) {
      if ('' == this.major || ('' == this.version || '正在新增一个版本...' == this.version)) {
        this.$alert('点击下拉框选择专业和版本后请点击确定以加载数据...', '未选中专业和版本!', {
          confirmButtonText: '好的',
        }).catch(() => {
          window.location.reload()
        });
        return;
      }

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
      this.saveIndicatorObj.version = this.version;
      api.post("/courseInfo/saveIndicator", this.saveIndicatorObj, (response) => {
        (response.data.data == true ?
            this.successNofity("指标点数据新增成功!") :
            this.failNofify("指标点数据新增失败!")) === true ?
            this.indicatorsByMajor.push(this.saveIndicatorObj) : false;
      })
      this.saveIndicatorDialog = false;
    },

    //取消删除指标点
    cancelDelIndicator() {
      document.querySelector(".clickToToggleStatus").click()
      document.querySelector(".clickToToggleStatus").click()
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

    //判断是否为公共基础课
    isPublicBasicCourse(courseType) {
      return courseType == this.majorCourseType[0];
    },

    //判断是否为专业基础课
    isProfessionalBasicCourse(courseType) {
      return courseType == this.majorCourseType[1];
    },

    //判断是否为专业素质教育
    isQualityEducation(courseType) {
      return courseType == this.majorCourseType[2];
    },

    //判断是否为专业核心课
    isProfessionalCoreCourse(courseType) {
      return courseType == this.majorCourseType[3];
    },

    //判断是否为专业特色课
    isProfessionalDistinctiveCourse(courseType) {
      return courseType == this.majorCourseType[4];
    },

    //判断是否为专业集中性实践教学
    isProfessionalCentralizedPracticalTeaching(courseType) {
      return courseType == this.majorCourseType[5];
    },

    //根据复选框添加或移除输入框内课程
    addOrRemoveCourse(checkBoxEvent, courseName) {
      if (true === checkBoxEvent) {
        if (0 == this.saveIndicatorObj.courses.length) {
          this.saveIndicatorObj.courses += courseName;
        } else {
          this.saveIndicatorObj.courses += '、' + courseName
        }
      } else {
        this.saveIndicatorObj.courses = this.saveIndicatorObj.courses.replace('、' + courseName, '');
        this.saveIndicatorObj.courses = this.saveIndicatorObj.courses.replace(courseName, '');
        if ('、' == this.saveIndicatorObj.courses[0]) {
          this.saveIndicatorObj.courses = this.saveIndicatorObj.courses.replace('、', '');
        }
      }
    },

    //根据复选框编辑或移除输入框内课程
    editOrRemoveCourse(checkBoxEvent, courseName) {
      if (true === checkBoxEvent) {
        if (0 == this.editIndicatorObj.courses.length) {
          this.editIndicatorObj.courses += courseName;
        } else {
          this.editIndicatorObj.courses += '、' + courseName
        }
      } else {
        this.editIndicatorObj.courses = this.editIndicatorObj.courses.replace('、' + courseName, '');
        this.editIndicatorObj.courses = this.editIndicatorObj.courses.replace(courseName, '');
        if ('、' == this.editIndicatorObj.courses[0]) {
          this.editIndicatorObj.courses = this.editIndicatorObj.courses.replace('、', '');
        }
      }
    },

    //添加一个版本
    addVersion() {
      this.$prompt('新增' + this.major + "专业指标点版本(注:仅输入四位年份数字,如 2023)", '选中专业后再输入版本号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[12][0-9]{3}$/,
        inputErrorMessage: '版本格式不正确()'
      }).then(({value}) => {
        this.versions.push({
          value: value,
          label: value
        });
        this.getIndicatorsInfo()
        this.successNofity(this.major + '专业新增版本: ' + value)
      }).catch(() => {
        this.cancelNofity("取消输入")
      });
    },

    // 导出为word功能
    exportAsWord() {
      if ('' == this.major || ('' == this.version || '正在新增一个版本...' == this.version)) {
        this.$alert('点击下拉框选择专业和版本后再次尝试...', '未选中专业和版本!', {
          confirmButtonText: '好的',
        }).catch(() => {
          window.location.reload();
        });
        return;
      }
      [this.exportAsWordButton, this.exportAsWordLoading, this.exportAsWordText] = [true, true, "数据加载中..."]
      axios.get(
          global.BaseUrl + "/courseInfo/indicatorsWord/" + this.major + "/" + this.version,
          {responseType: "blob"}
      ).then((res) => {
            const href = URL.createObjectURL(res.data)
            const box = document.createElement('a')
            box.download = this.major + "专业指标点.docx"
            box.href = href
            box.click()
          }
      );
      [this.exportAsWordButton, this.exportAsWordLoading, this.exportAsWordText] = [false, false, "导出为word文档"]
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
        confirmButtonText: '好的',
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

.el-checkbox.is-bordered {
  margin: 0 0 0 5px !important;
}

.courseTypeBorder {
  background-color: #f3f3f8;
  margin: 0 0 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.indicatorEditButton {
  margin-right: 10px !important;
}

</style>