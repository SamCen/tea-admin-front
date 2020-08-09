<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="page-title">手机用户列表</h3>
            </div>
            <div>
                <el-row :gutter="20" type="flex" justify="space-between">
                    <el-col>
                        <el-form :inline="true" :model="queryParams" class="demo-form-inline" label-width="100px">
                            <el-form-item label="用户名">
                                <el-input v-model="queryParams.username" placeholder="" clearable></el-input>
                            </el-form-item>

                            <el-form-item label="手机">
                                <el-input v-model="queryParams.phone" placeholder="" clearable></el-input>
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
                            :data="userIndexData.list"
                            stripe
                            style="width: 100%">
                        <el-table-column
                                prop="id"
                                label="ID"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="username"
                                label="用户名"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                label="手机"
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
                                :total="this.userIndexData.total">
                        </el-pagination>
                    </div>
                </el-row>
            </div>
        </el-card>
        <!--详情对话框-->
        <el-dialog
                title="手机用户详情"
                :visible.sync="showDialogVisible"
                width="30%"
                :before-close="showHandleClose"
                @closed="showHandleClosed">
            <el-form :model="showData" ref="showForm" label-width="100px">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="showData.username"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input v-model="showData.password"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="role">
                    <el-select v-model="showData.role" placeholder="请选择角色">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
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
                title="添加手机用户"
                :visible.sync="addDialogVisible"
                width="30%"
                :before-close="addHandleClose"
                @closed="addHandleClosed">
            <el-form :model="addParams" :rules="addRules" ref="addForm" label-width="100px">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="addParams.username"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input v-model="addParams.password"></el-input>
                </el-form-item>
                <el-form-item label="手机：" prop="phone">
                    <el-input v-model="addParams.phone"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="role">
                    <el-select v-model="addParams.role" placeholder="请选择角色">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
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
        name: "User",
        data() {
            return {
                //表格数据下表
                showIndex: 0,
                //列表加载
                indexLoading: false,
                //列表请求参数
                queryParams: {
                    page: 1,
                    size: 10,
                    username: '',
                    phone:'',
                },
                //产品科目列表数据
                userIndexData: {
                    list: [],
                    total: 0,
                },
                //详情数据
                showData: {
                    username: '',
                    password: '',
                    role: '',
                    phone:'',
                },
                //详情对话框隐藏状态
                showDialogVisible: false,

                //添加对话框隐藏状态
                addDialogVisible: false,
                //添加用户数据
                addParams: {
                    username: '',
                    password: '',
                    role: '',
                    // phone:'',
                },
                //添加验证规则
                addRules: {
                    username: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '请输入手机', trigger: 'blur'},
                    ],
                    role: [
                        {required: true, message: '请码选择角色', trigger: 'blur'},
                    ],
                },
                //角色列表
                roleList: [],
            };
        },
        methods: {
            /**
             * 列表请求
             */
            queryIndex() {
                this.indexLoading = true;
                api.appUser.index(this.queryParams).then(response => {
                    this.userIndexData = response.data.data;
                    this.indexLoading = false;
                }).catch(error => {
                    this.$message.error('网络异常');
                    this.indexLoading = false;
                })
            },
            queryRoleList() {
                api.appUser.roleList().then(response => {
                    this.roleList = response.data.data;
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
                let id = this.userIndexData.list[index].id;
                api.appUser.show(id).then(response => {
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
                api.appUser.update(this.showData.id, this.showData).then(response => {
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
                        api.appUser.create(this.addParams).then(response => {
                            this.queryIndex();
                            this.addParams = {
                                username: '',
                                password: '',
                                role: '',
                                phone:'',
                            };
                            this.addDialogVisible = false;
                            this.$message.success('添加成功');
                        }).catch(err => {
                            this.$message.error('网络异常');
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
            this.queryRoleList();
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
