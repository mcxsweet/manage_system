import api from '@/api/api';

const state = {
    user: null, // 用户对象
};

const mutations = {
    SET_USER_STATE: (state, user) => {
        state.user = user;
    },
};

const actions = {
   
    // 获取用户信息
    getInfo({commit,state}) {
        return new Promise((resolve, reject) => {
            let {user} = state
            if(user){
                resolve(user)
            }else{
                api.get('/user/info', null, res=>{
                    const {flag,data, message} = res.data
                    if (!flag) {
                        commit("SET_USER_STATE", null)
                        reject(message)
                    }
                    commit("SET_USER_STATE", data)
                    resolve(data)
                })
            }
           
        })
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};