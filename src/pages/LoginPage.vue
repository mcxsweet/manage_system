<template>
    <div class="body">
        <div class="container" v-bind:class="success">
            <h1>Welcome</h1>
            <div class="form">
                <input type="text" placeholder="您的账号" v-model="formData.name">
                <input type="password" placeholder="您的密码" v-model="formData.password">
                <!-- <router-link to="/MainPage"> -->
                <button class="btn-login" @click="submit()">登录</button>
                <button class="btn-login" @click="jump()">跳过登录</button>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api/api';
export default {
    name: " LoginPage",
    data() {
        return {
            success: "",
            formData: {
                name: '',
                password: ''
            },
        }
    },
    methods: {
        //跳过登录
        jump() {
            this.success = "success"
            setTimeout(() => {
                this.$router.push({ path: '/MainPage' });
            }, 2000);
        },
        submit() {
            api.post("/user", this.formData, (resp) => {
                if (resp.data.flag == true) {
                    this.success = "success"
                    localStorage.setItem("name", this.formData.name);
                    localStorage.setItem("password", this.formData.password);
                    localStorage.setItem("UserId", resp.data.data.id);
                    setTimeout(() => {
                        this.$router.push({ path: '/MainPage' });
                    }, 2000);
                } else {
                    this.$message({
                        type: 'error',
                        message: '用户名或密码错误!'
                    });
                }
            })

        }
    },
    mounted() {
        if (localStorage.getItem("name")) {
            this.$router.push({ path: '/MainPage' });
        }
    }
}

</script>
<style scoped>
* {
    /* 初始化 */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.body {
    height: 100vh;
    /* 弹性布局 居中显示 */
    display: flex;
    justify-content: center;
    align-items: center;
    /* 渐变背景 */
    background: linear-gradient(to top left, #0c08e2, #03e8f4, #fefefe);

    /* 溢出隐藏 */
    overflow: hidden;
}

.container {
    text-align: center;
    color: #fff;
}

.container h1 {
    font-size: 40px;
    font-weight: 100;
    letter-spacing: 2px;
    margin-bottom: 30px;
    /* 过渡效果 */
    transition: 1s ease-in-out;
}

.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    opacity: 1;
    /* 不透明度改变时的过渡效果 */
    transition: opacity 0.5s;
}

.form input {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.2);
    width: 250px;
    padding: 10px 15px;
    border-radius: 3px;
    margin: 0 auto 10px auto;
    text-align: center;
    color: #fff;
    font-size: 15px;
    transition: 0.25s;
}

.form input::placeholder {
    color: #fff;
    font-size: 14px;
    font-weight: 300;
}

.form input:hover {
    background-color: rgba(255, 255, 255, 0.4);
}

.form input:focus {
    background-color: #fff;
    width: 300px;
    color: #ff719a;
}

.btn-login {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.2);
    width: 250px;
    padding: 10px 15px;
    border-radius: 3px;
    margin: 10px auto 0px auto;
    text-align: center;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
    transition: 0.25s;
}

.btn-login:hover {
    background-color: #16a6df;
}

.btn-regin {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.2);
    width: 250px;
    padding: 10px 15px;
    border-radius: 3px;
    margin: 10px auto 10px auto;
    text-align: center;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
    transition: 0.25s;
}

.btn-regin:hover {
    background-color: #16a6df;
}


.container.success h1 {
    transform: translateY(75px);
}

.container.success .form {
    opacity: 0;
}
</style>