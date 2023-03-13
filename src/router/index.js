//用于创建路由器
import VueRouter from "vue-router";

//引入组件
import MainPage from '@/pages/MainPage'
import LoginPage from '@/pages/LoginPage2'
import courseBasicInformation from '@/components/courseBasicInformation/courseBasicInformation'
import programObjective from '@/components/courseBasicInformation/programObjective'
import classInformation from '@/components/courseBasicInformation/classInformation'
import basicInformationTable from '@/components/courseExamMethods/basicInformationTable'

import sudoInformationTable from '@/components/courseBasicInformation/sudoInformationTable'
import hsudoInformationTable from '@/components/courseBasicInformation/hsudoInformationTable'

import welcome from '@/components/welcome'
import finalTable from '@/components/classTables/finalTable'
import usualPreformanceTable from '@/components/classTables/usualPreformanceTable'
import finalStatisticsTable from '@/components/classTables/finalStatisticsTable'
import finalComprehensiveTable from '@/components/classTables/finalComprehensiveTable'
import analysisTable from '@/components/classTables/analysisTable'
import programTable from '@/components/classTables/programTable'

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
                    path: 'sudoInformationTable',
                    component: sudoInformationTable
                },
                {
                    path: 'hsudoInformationTable',
                    component: hsudoInformationTable
                },
                {
                    path: 'analysisTable',
                    component: analysisTable
                },
                {
                    path: 'programTable',
                    component: programTable
                },
                {
                    path: 'finalStatisticsTable',
                    component: finalStatisticsTable
                },

                {
                    path: 'finalComprehensiveTable',
                    component: finalComprehensiveTable
                },
                {
                    path: 'finalTable',
                    component: finalTable
                },
                {
                    path: 'usualPreformanceTable',
                    component: usualPreformanceTable
                },
                {
                    path: 'basicInformationTable',
                    component: basicInformationTable
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
