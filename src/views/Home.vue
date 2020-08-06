<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{ date }}</span>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                date: new Date()
            };
        },
        mounted() {
            const _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
            this.timer = setInterval(() => {
                _this.date = new Date(); // 修改数据date
            }, 1000)
        },
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        padding: 18px 0;
    }

    .box-card {
        width: 480px;
    }
</style>
