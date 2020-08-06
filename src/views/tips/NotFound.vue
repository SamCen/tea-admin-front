<template>
    <div class="error-page">
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6" :offset="8"><h1 class="code animation-slide-top">404</h1></el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12" :offset="5"><p class="tips">您访问的页面不存在，<span v-html="second"></span>秒后自动返回{{ access_token ? '首页' : '登录' }}</p></el-col>
        </el-row>
    </div>
</template>

<script>
    import router from '../../router'
    import {mapState} from 'vuex'

    export default {
        name: 'NotFound',
        data() {
            return {
                second: 3,
                styles: {
                    height: window.screen.height - 120 + 'px'
                }
            }
        },
        computed: {
            ...mapState({
                access_token: state => state.auth.access_token
            })
        },
        watch: {
            second(value) {
                if (value === 0) {
                    clearInterval();
                    router.push({
                        path: this.access_token ? '/home' : '/login'
                    });
                }
            }
        },
        mounted() {
            /**
             * 设置定时器
             */
            setInterval(() => {
                this.second -= 1;
            }, 1000);
        }
    };
</script>

<style lang="scss">
    .error-page{
        width: 100%;
        margin-top: 350px;
    }
    .code{
        text-align: center;
        font-size: 5rem;
    }
    .tips{
        text-align: center;
    }
    @-webkit-keyframes slide-top {
        0% {
            -webkit-transform: translate3d(0, -100%, 0);
        }
        100% {
            -webkit-transform: translate3d(0, 0, 0);
        }
    }

    [class*=animation-] {
        -webkit-animation-duration: .5s;
        -webkit-animation-timing-function: ease-out;
        -webkit-animation-fill-mode: both;
    }

    .animation-slide-top {
        -webkit-animation-name: slide-top;
    }
</style>
