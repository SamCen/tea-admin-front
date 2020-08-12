<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="page-title">数据统计</h3>
            </div>
            <div>
                <el-row :gutter="20" type="flex" justify="space-between">
                    <el-col>
                        <el-form :inline="true" :model="queryParams" class="demo-form-inline" label-width="100px">
                            <el-form-item label="产品">
                                <el-select v-model="queryParams.product_name" placeholder="请选择">
                                    <el-option
                                            v-for="item in productList"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="查询日期范围">
                                <el-date-picker
                                        v-model="dates"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        @change="pickDate">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="">
                                <el-button type="primary" @click="queryIndex">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <el-table
                            v-loading="indexLoading"
                            :data="sumStatisticsList"
                            stripe
                            style="width: 100%">
                        <el-table-column
                                prop="product_name"
                                label="产品"
                        >
                        </el-table-column>
                        <el-table-column
                                label="入库"
                        >
                            <template slot-scope="scope">
                                {{scope.row.input}}{{scope.row.product_unit}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="出库"
                        >
                            <template slot-scope="scope">
                                {{scope.row.output}}{{scope.row.product_unit}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="库存"
                        >
                            <template slot-scope="scope">
                                {{scope.row.storage}}{{scope.row.product_unit}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </div>
        </el-card>
        <!--详情对话框-->

    </div>
</template>

<script>
    import api from '@/apis/index';

    export default {
        name: "Statistics",
        data() {
            return {
                queryParams:{
                    product_id: 0,
                    product_name: '',
                    beginDate: '',
                    endDate: ''
                },
                productList: [

                ],
                indexLoading:false,
                dates:'',
                sumStatisticsList:[

                ],
            };
        },
        methods: {
            formatDate(date) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
            pickDate(){
                this.queryParams.beginDate = this.formatDate(this.dates[0]);
                this.queryParams.endDate = this.formatDate(this.dates[1]);
            },
            queryIndex(){
                this.indexLoading = true;
                api.product.sumStatistics(this.queryParams).then(res=>{
                    this.sumStatisticsList = res.data.data;
                    this.indexLoading = false;
                }).catch(err=>{
                    this.$message.error('网络异常');
                    this.indexLoading = false;
                })
            },
            querySelectProductList(){
                api.product.productSelectList().then(res=>{
                    this.productList = res.data.data;
                }).catch(err=>{
                    this.$message.error('网络异常');
                })
            }
        },
        mounted() {
            this.querySelectProductList();
            this.queryIndex();
        }
    }
</script>

<style scoped>
    .page-title {
        margin-top: 10px;
    }

    .page-block {
        margin-top: 10px;
    }
</style>
