<template>
    <div class="box">
        <div class="content">
            <div class="login-wrapper">
                <h1>专业工程认证系统</h1>
                <div class="login-form">
                    <div class="username form-item">
                        <span>用户名</span>
                        <input type="text" class="input-item" v-model="formData.name">
                    </div>
                    <div class="password form-item">
                        <span>密码</span>
                        <input type="password" class="input-item" v-model="formData.password">
                    </div>
                    <button class="login-btn" @click="submit()">登 录</button>
                </div>
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

                    localStorage.clear();
                    sessionStorage.setItem("token", this.$cookies.get("token"));

                    localStorage.setItem("name", this.formData.name);
                    // localStorage.setItem("password", this.formData.password);
                    localStorage.setItem("UserId", resp.data.data.id);
                    localStorage.setItem("Isadmin", resp.data.data.isAdmin);
                    localStorage.setItem("TeacherName", resp.data.data.teacherName);
                    localStorage.setItem("department", resp.data.data.department);
                    this.$router.push({ path: '/MainPage' });

                } else {
                    this.$message({
                        type: 'error',
                        message: '用户名或密码错误!'
                    });
                }
            })

        },

        checkSubmit() {
            api.post("/courseInfo/checkSubmit", "", (resp) => {
                if (resp.data.flag && localStorage.getItem("name")) {
                    this.$router.push({ path: '/MainPage' });
                }
            })
        }
    },
    mounted() {
        this.checkSubmit();
    }
}

</script>
<style scoped>
@charset "UTF-8";

* {
    margin: 0;
    padding: 0;
}

/*公共CSS*/
.box {
    width: 100vw;
    height: 100vh;
    background-color: rgb(29, 67, 89);
}

.box .content .login-wrapper h1 {
    text-align: center;
}

.box .content .login-wrapper .login-form .form-item {
    margin: 20px 0;
}

.box .content .login-wrapper .login-form .form-item span {
    display: block;
    margin: 5px 20px;
    font-weight: 100;
}

.box .content .login-wrapper .login-form .form-item .input-item {
    width: 100%;
    border-radius: 40px;
    padding: 20px;
    box-sizing: border-box;
    font-size: 20px;
    font-weight: 200;
}

.box .content .login-wrapper .login-form .form-item .input-item:focus {
    outline: none;
}

.box .content .login-wrapper .login-form .login-btn {
    width: 100%;
    border-radius: 40px;
    color: #fff;
    border: 0;
    font-weight: 100;
    margin-top: 10px;
    cursor: pointer;
}


/*一般大于手机的尺寸CSS*/
@media (min-width: 767px) {
    .box {
        background-color: rgb(29, 67, 89);
    }

    .box .content {
        width: 85vw;
        height: 90vh;
        background: url("../assets/test.jpg") no-repeat;
        background-size: 76% 100%;
        position: absolute;
        right: 15%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        background-color: #fff;
    }

    .box .content .login-wrapper {
        width: 25vw;
        position: absolute;
        right: 15%;
        top: 50%;
        transform: translateY(-50%);
    }

    .box .content .login-wrapper h1 {
        text-align: center;
        font-size: 45px;
        color: rgb(81, 100, 115);
        margin-bottom: 40px;
    }

    .box .content .login-wrapper .login-form {
        margin: 10px 0;
    }

    .box .content .login-wrapper .login-form .form-item span {
        color: rgb(81, 100, 115);
    }

    .box .content .login-wrapper .login-form .form-item .input-item {
        height: 60px;
        border: 1px solid rgb(214, 222, 228);
    }

    .box .content .login-wrapper .login-form .login-btn {
        height: 50px;
        background-color: rgb(59, 72, 89);
        font-size: 20px;
    }

    .box .content .login-wrapper .other-login-item {
        border-radius: 20px;
    }

    .box .content .login-wrapper .other-login-item img {
        width: 40px;
        height: 40px;
    }
}

/*手机端CSS*/
@media (max-width: 768px) {
    .box .content {
        width: 100vw;
        height: 100vh;
        background: url("../assets/login_bg_phone.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
    }

    .box .content .login-wrapper {
        width: 70%;
        height: 60%;
        padding-top: 15%;
    }

    .box .content .login-wrapper h1 {
        font-size: 30px;
        color: #fff;
    }

    .box .content .login-wrapper .login-form .form-item {
        margin: 10px 0;
    }

    .box .content .login-wrapper .login-form .form-item span {
        color: rgb(113, 129, 141);
    }

    .box .content .login-wrapper .login-form .form-item .input-item {
        height: 30px;
        border: 1px solid rgb(113, 129, 141);
        background-color: transparent;
        color: #fff;
    }

    .box .content .login-wrapper .login-form .login-btn {
        height: 40px;
        background-color: rgb(235, 95, 93);
        font-size: 16px;
    }



    .box .content .login-wrapper .other-login-item {
        border-radius: 15px;
    }

    .box .content .login-wrapper .other-login-item img {
        width: 35px;
        height: 35px;
    }
}

/*# sourceMappingURL=style.css.map */
</style>