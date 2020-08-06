<template>
    <div class="app-header">
        <div class="logo">
            <router-link to="/home"><i class="iconfont home-icon">&#xe608;</i></router-link>
        </div>
        <div class="header-info">
        </div>
        <div class="userinfo-submenu">
        <el-dropdown  @command="handleCommand">
            <span class="el-dropdown-link">
              <span>{{ userInfo ? userInfo.name : '' }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item>个人资料</el-dropdown-item>
                <el-dropdown-item command="logout" devided>退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    export default {
        name: "AppHeader",
        computed: {
            ...mapState({
                access_token: state => state.auth.access_token,
                userInfo: state => state.auth.userInfo,
            })
        },
        methods: {
            ...mapActions([
                'logout',
            ]),
            handleCommand(command) {
                if(command == 'logout'){
                    this.logout();
                };
            }
        },
        watch: {
            access_token(value) {
                if (!value) {
                    this.$router.replace({
                        path: '/login'
                    })
                }
            }
        },
    }
</script>

<style lang="scss">
    .app-header {
        height: 60px;
        background: #19426d;
        display: flex;
        flex-direction: row;
        line-height: 60px;
        color: #fff;

        .logo {
            width: 240px;
            height: inherit;
            text-align: center;

            a {
                text-decoration: none;
                color: #fff;
            }
        }

        .header-info {
            flex: 1;
            margin: 0 10px;
            line-height: 50px;
        }

        .userinfo-submenu {
            width: 200px;
            height: inherit;
            text-align: right;
            margin-right: 2rem;

            .el-dropdown {
                color: #fff;
            }
        }

        .home-icon {
            font-size: 2.5em;
        }
    }
</style>
