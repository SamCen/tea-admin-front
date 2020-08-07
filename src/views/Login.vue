<template>
    <div class="login-view">
        <div class="login-panel">
            <el-container>
                <el-header>
                    <h3>后台管理系统</h3>
                </el-header>
                <el-container v-loading="loading">
                    <el-main>
                        <el-form :label-position="labelPosition" :rules="loginRules" ref="loginForm" :model="loginForm">
                            <el-form-item prop="account">
                                <el-input v-model="loginForm.account" placeholder="账号"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input v-model="loginForm.password" show-password placeholder="密码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="submit" @click="loginSubmit()">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script>
    import router from '../router';
    import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
    import RouterGenerator from '@/utils/generateRouter';
    export default {
        name: 'Login',
        data() {
            return {
                loading:false,
                labelPosition: 'right',
                loginForm: {
                    account: '',
                    password: '',
                },
                loginRules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 25, message: '长度在 6 到 18 个字符之间', trigger: 'blur'}
                    ],
                },
            };
        },
        methods: {
            ...mapMutations([
                'SET_LOGIN_FAIL'
            ]),
            ...mapActions([
                'login',
                'getInfo'
            ]),
            loginSubmit() {
                this.$refs['loginForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.login(this.loginForm);
                    } else {
                        return false;
                    }
                });
            },
            registerRouter () {
                let routers = [];
                //调用路由生成器
                RouterGenerator(routers, this.menus);
                //添加路由到 / 路由的children
                router.options.routes[0].children = routers;
                //注册路由
                router.addRoutes(router.options.routes);
            }
        },
        watch: {

            access_token () {
                this.getInfo();
            },

            userInfo () {
                this.loading = false;
                this.registerRouter();
                this.$router.replace({
                    path: router.options.routes[0].children[0].path
                })
            },

            loginFail (value) {
                if (value) {
                    this.$message.error(value);
                    this.loading = false;
                }
                this.SET_LOGIN_FAIL();
            }
        },
        computed: {
            ...mapState ({
                access_token: state => state.auth.access_token,
                userInfo: state => state.auth.userInfo,
                loginFail: state => state.auth.loginFail,
            }),
            ...mapGetters ([
                'menus',
            ]),
        },
    };
</script>

<style scoped>
    .login-view {
        position: fixed;
        width: 100%;
        height: 100%;
        background: #19426d;
    }

    .login-panel {
        width: 30rem;
        height: 20rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 1px 10px rgba(0, 0, 0, .3);
        padding: 20px;
        position: absolute;
        background: #fff;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: 10% auto 0;
    }

    .el-header {
        background-color: #FFFFFF;
        color: #19426d;
        text-align: center;
        line-height: 60px;
    }

    .submit {
        width: 100%;
        background: #19426d;
    }
</style>
