import axios from 'axios';
import { Message } from 'element-ui';
import router from '../router/index'


//请求拦截器
axios.interceptors.request.use((config) => {
    // 如果存在token，请求携带token
    return config;
}, (error) => {
    Message.error({ message: error });
})

//响应拦截器
axios.interceptors.response.use((success) => {
    if (success.data.flag == false && success.data.message == "Lack of token") {
        router.replace("/");
        Message.error({ message: success.data.message });
    }
    return success;
}, (error) => {
});


/**
 * 公共网络请求
 * @param {*} url 
 * @param {*} paramsData 
 * @returns 
 */

const api = {
    async get(url, data, callback) {
        let res = await axios({
            url: url,
            method: "GET",
            params: data || "",
            // headers: {
            //     token: localStorage.getItem("token")
            // }
            // ContentType: "application/x-www-form-urlencoded"
        })
        callback && callback(res)
    },

    async post(url, data, callback) {
        let res = await axios({
            url: url,
            method: "POST",
            data: data || "",
            // headers: {
            //     token: localStorage.getItem("token")
            // }
            // ContentType: "application/x-www-form-urlencoded"
        })
        callback && callback(res)
    },

    async put(url, data, callback) {
        let res = await axios({
            url: url,
            method: "PUT",
            data: data || "",
            // headers: {
            //     token: localStorage.getItem("token")
            // }
            // ContentType: "application/x-www-form-urlencoded"
        })
        callback && callback(res)
    },

    async del(url, data, callback) {
        let res = await axios({
            url: url,
            method: "DELETE",
            data: data || "",
            // headers: {
            //     token: localStorage.getItem("token")
            // }
            // ContentType: "application/x-www-form-urlencoded"
        })
        callback && callback(res)
    },
}
export default api

