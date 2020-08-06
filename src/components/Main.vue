<template>
    <div class="main">
        <el-container style="height: 100%;">
            <el-header>
                <AppHeader/>
            </el-header>
            <el-container style="height: 100%;overflow-y: hidden">
                <el-aside>
                    <AppMenu />
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import AppHeader from '@/components/AppHeader';
    import AppMenu from '@/components/AppMenu';
    export default {
        components:{
            AppHeader:AppHeader,
            AppMenu:AppMenu,
        },
        name: "Main"
    }
</script>

<style scoped>
    .el-header{
        padding:0;
    }
    .el-menu {
        border-right: none;
    }
    .el-aside{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.12);
        margin-right: 10px;
        overflow-y: scroll;
        background: #ffffff;
    }
    .main{
        height: 100%;
    }
</style>
