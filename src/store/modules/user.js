import api from '@/api/api';
import cookie from "vue-cookies"
import router from '@/router';
const state = {
    student:null,
    id: null,
    name: null,
    teacherName: null,
    isAdmin: null,
    department: null
};

const mutations = {
    SET_USER_STATE: (state, user) => {
        if (user) {
            state.id = user.id
            state.name = user.name
            state.teacherName = user.teacherName
            state.isAdmin = user.isAdmin
            state.department = user.department
        }else{
            state.id = null
            state.name = null
            state.teacherName = null
            state.isAdmin = null
            state.department = null
        }
    },
    SET_ISADMIN_STATE: (state, isAdmin) =>{
        state.isAdmin = isAdmin
    },
    SET_STUDENT_STATE: (state, studnet) => {
        state.student = studnet
    },
};

const actions = {
   
    // 获取用户信息
    getInfo({commit,state}) {
        return new Promise((resolve, reject) => {
            let {id} = state
            if(id){
                resolve(state)
            }else{
                api.get('/user/info', null, res=>{
                    const {flag, data, message} = res.data
                    if (!flag) {
                        commit("SET_USER_STATE", null)
                        reject(message)
                    }else if (data.identity==="0"){
                        commit("SET_USER_STATE", data.info)
                        resolve(data.info)
                    }else{
                        commit("SET_STUDENT_STATE", data.info)
                        resolve(data.info)
                    }
                   
                })
            }
           
        })
    },
    logout({commit}){
        return new Promise(() => {
            api.get('/user/logout', null, res=>{
                commit("SET_USER_STATE", null)
                cookie.remove('satoken')   
                localStorage.clear();
                sessionStorage.clear(); 
                router.push('/')          
            })
        })
    },
    setIsAdmin(content, value){

        content.commit("SET_ISADMIN_STATE", value)
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};