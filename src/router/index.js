//用于创建路由器
import VueRouter from "vue-router";

//引入组件
import MainPage from '@/pages/MainPage'
import LoginPage from '@/pages/LoginPage'
import courseBasicInformation from '@/components/courseBasicInformation'
import welcome from '@/components/welcome'
import classInformation from '@/components/classInformation'
import programObjective from '@/components/programObjective'
import attendanceManagement from '@/components/attendanceManagement'
import basicInformationTable from '@/components/classTables/basicInformationTable'

export default new VueRouter({
    routes: [
        {
            path: "/",
            component: LoginPage
        },
        {
            path: "/MainPage",
            component: MainPage,
            children: [
                {
                    path:'basicInformationTable',
                    component:basicInformationTable
                },
                {
                    path: 'welcome', //  课程基本信息
                    component: welcome
                },
                {
                    path: 'courseBasicInformation', //  课程基本信息
                    component: courseBasicInformation
                },

                {
                    path: 'attendanceManagement', //  平时成绩管理
                    component: attendanceManagement
                },
                {
                    path: 'classInformation', //  平时成绩管理
                    component: classInformation,
                    props: true,
                    children: [
                        {
                            path: 'programObjective',
                            component: programObjective,
                        }
                    ]
                },
            ]
        },
    ]
})
