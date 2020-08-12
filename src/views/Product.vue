<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="page-title">产品列表</h3>
            </div>
            <div>
                <el-row :gutter="20" type="flex" justify="space-between">
                    <el-col>
                        <el-form :inline="true" :model="queryParams" class="demo-form-inline" label-width="100px">
                            <el-form-item label="产品名称">
                                <el-input v-model="queryParams.product_name" placeholder="" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-button type="primary" @click="queryIndex">查询</el-button>
                                <el-button type="success" @click="addAction">添加</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <el-table
                            v-loading="indexLoading"
                            :data="productIndexData.list"
                            stripe
                            style="width: 100%">
                        <el-table-column
                                prop="id"
                                label="ID"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="product_name"
                                label="产品名称"
                        >
                        </el-table-column>
                        <el-table-column
                                label="所属分类"
                        >
                            <template slot-scope="scope">
                                {{scope.row.category.category_name}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="product_unit"
                                label="产品单位"
                        >
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-edit-outline" @click="showAction(scope.$index)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="page-block">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="this.queryParams.page"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="this.queryParams.size"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="this.productIndexData.total">
                        </el-pagination>
                    </div>
                </el-row>
            </div>
        </el-card>
        <!--详情对话框-->
        <el-dialog
                title="产品详情"
                :visible.sync="showDialogVisible"
                width="30%"
                :before-close="showHandleClose"
                @closed="showHandleClosed">
            <el-form :model="showData" ref="showForm" label-width="100px">
                <el-form-item label="名称：" prop="product_name">
                    <el-input v-model="showData.product_name"></el-input>
                </el-form-item>
                <el-form-item label="所属分类：" prop="account">
                    <el-select v-model="showData.category_id" placeholder="请选择产品分类">
                        <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.category_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单位：" prop="account">
                    <el-select v-model="showData.product_unit" placeholder="请选择单位">
                        <el-option
                                v-for="item in unitList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="showCancelDialog">取 消</el-button>
                    <el-button type="primary" @click="editInfo">提交修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog
                title="添加产品"
                :visible.sync="addDialogVisible"
                width="30%"
                :before-close="addHandleClose"
                @closed="addHandleClosed">
            <el-form :model="addParams" :rules="addRules" ref="addForm" label-width="100px">
                <el-form-item label="产品名称：" prop="name">
                    <el-input v-model="addParams.product_name"></el-input>
                </el-form-item>
                <el-form-item label="所属分类：" prop="account">
                    <el-select v-model="addParams.category_id" placeholder="请选择产品分类">
                        <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.category_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单位：" prop="account">
                    <el-select v-model="addParams.product_unit" placeholder="请选择单位">
                        <el-option
                                v-for="item in unitList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="addCancelDialog">取 消</el-button>
                    <el-button type="primary" @click="addProduct">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/apis/index';

    export default {
        name: "Product",
        data() {
            return {
                //表格数据下表
                showIndex: 0,
                //详情选项卡默认值
                activeName: 'info',
                //列表加载
                indexLoading: false,
                //列表请求参数
                queryParams: {
                    page: 1,
                    size: 10,
                    product_name: '',
                },
                //产品科目列表数据
                productIndexData: {
                    list: [],
                    total: 0,
                },
                //详情数据
                showData: {
                    product_name: '',
                    product_unit: '',
                    category_id: '',
                },
                //当前选中的角色
                activeRoles: [],
                //详情对话框隐藏状态
                showDialogVisible: false,
                //角色列表数据(不需要分页)
                roleIndexData: {
                    data: [],
                },
                //添加对话框隐藏状态
                addDialogVisible: false,
                //添加用户数据
                addParams: {
                    product_name: '',
                    category_id: '',
                    product_unit: '',
                },
                //添加验证规则
                addRules: {
                    product_name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    product_unit: [
                        {required: true, message: '请选择单位', trigger: 'blur'},
                    ],
                    category_id: [
                        {required: true, message: '请选择分类', trigger: 'blur'},
                    ],
                },
                //分类列表
                categoryList: [],
                //产品单位列表
                unitList: [],
            };
        },
        methods: {
            /**
             * 列表请求
             */
            queryIndex() {
                this.indexLoading = true;
                api.product.index(this.queryParams).then(response => {
                    this.productIndexData = response.data.data;
                    this.indexLoading = false;
                }).catch(error => {
                    this.$message.error('网络异常');
                    this.indexLoading = false;
                })
            },
            queryUnitList() {
                api.product.unitList().then(response => {
                    this.unitList = response.data.data;
                }).catch(error => {
                    this.$message.error('网络异常');
                    this.indexLoading = false;
                })
            },
            queryCategoryIndex() {
                api.category.allList().then(response => {
                    this.categoryList = response.data.data;
                }).catch(error => {
                    this.$message.error('网络异常');
                    this.indexLoading = false;
                })
            },
            /**
             * 改变每页数量
             * @param size
             */
            handleSizeChange(size) {
                this.queryParams.size = size;
                this.queryIndex();
            },
            /**
             * 改变当前页
             * @param size
             */
            handleCurrentChange(size) {
                this.queryParams.page = size;
                this.queryIndex();
            },
            /**
             * 点击编辑按钮
             * @param index
             */
            showAction(index) {
                this.showIndex = index;
                let id = this.productIndexData.list[index].id;
                api.product.show(id).then(response => {
                    this.showData = response.data.data;
                    this.showDialogVisible = true;
                });
            },
            /**
             * 关闭详情对话框
             */
            showHandleClose() {
                this.showDialogVisible = false;

            },
            /**
             * 详情对话框关闭之后
             */
            showHandleClosed() {
                this.showIndex = 0;
                this.activeName = 'info';
            },
            /**
             * 提交修改产品
             */
            editInfo() {
                api.product.update(this.showData.id, this.showData).then(response => {
                    this.showDialogVisible = false;
                    this.queryIndex();
                    this.showHandleClosed();
                    this.$message.success('修改成功');
                }).catch(err => {
                    this.$message.error('网络异常');
                })
            },
            /**
             * 详情取消对话框
             */
            showCancelDialog() {
                this.showDialogVisible = false;
                this.showHandleClosed();
            },
            /**
             * 关闭添加对话框
             */
            addHandleClose() {

                this.addDialogVisible = false;
            },
            /**
             * 添加对话框关闭完成后
             */
            addHandleClosed() {
                this.addParams = {
                    product_name: '',
                    category_id: '',
                    product_unit: '',
                };
            },
            /**
             * 添加对话框取消按钮
             */
            addCancelDialog() {
                this.addDialogVisible = false;
            },
            /**
             * 请求添加产品
             */
            addProduct() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        api.product.create(this.addParams).then(response => {
                            this.queryIndex();
                            this.addParams = {
                                product_name: '',
                                category_id: '',
                                product_unit: '',
                            };
                            this.addDialogVisible = false;
                            this.$message.success('添加成功');
                        }).catch(err => {
                            this.$message.error(err.response.data.msg);
                        })
                    } else {
                        this.$message.warning('资料不完善');
                    }
                });
            },
            /**
             * 打开添加对话框
             */
            addAction() {
                this.addDialogVisible = true;
            },
        },
        mounted() {
            this.queryIndex();
            this.queryCategoryIndex();
            this.queryUnitList();
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
