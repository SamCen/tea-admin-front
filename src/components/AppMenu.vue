<template>
    <div v-if="menus">
    <el-menu
            :unique-opened="true"
            background-color="#FFFFFF"
            text-color="#19426d"
            active-text-color="#FFF"
            :default-active="active"
            :router="true"
            >
        <el-menu-item :index="item.path" v-if="!item.children" v-for="item in menus" :key="item.id">
            <i class="iconfont" :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
        </el-menu-item>
        <el-submenu :index="String(index)" v-if="item.children" v-for="(item, index) in menus" :key="item.id">
            <template slot="title">
                <i class="iconfont" :class="item.icon"></i>
                <span slot="title">{{ item.name }} </span>
            </template>
            <el-menu-item :index="submenu.path" v-for="(submenu, sub_index) in item.children" :key="submenu.id">
                <i class="iconfont" :class="submenu.icon"></i>
                <span slot="title">{{ submenu.name }} </span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
    </div>
</template>
<script>
    import { mapGetters, mapState } from 'vuex';

    export default {
        name: "AppMenu",
        data() {
            return {
                active:'',
            }
        },
        methods:{

        },
        computed: {
            ...mapGetters([
                'menus'
            ]),
            ...mapState({
                route: state => state.route
            })
        },
        watch: {
            //获取当前URL
            route () {
                this.active = window.location.pathname;
            }
        },
        mounted(){
            this.active = window.location.pathname;
        }
    }
</script>

<style scoped>
    .el-menu-item.is-active{
        background-color:#3b6c9e !important;
    }
</style>
