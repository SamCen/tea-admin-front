<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="page-title">后台用户列表</h3>
            </div>
            <div>
                <el-row :gutter="20" type="flex" justify="space-between">
                    <el-col>
                        <el-form :inline="true" :model="queryParams" class="demo-form-inline" label-width="100px">
                            <el-form-item label="账号">
                                <el-input v-model="queryParams.account" placeholder="账号" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select v-model="queryParams.status" placeholder="用户状态" clearable>
                                    <el-option label="启用" value="1"></el-option>
                                    <el-option label="禁用" value="0"></el-option>
                                </el-select>
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
                            :data="userIndexData.list"
                            stripe
                            style="width: 100%">
                        <el-table-column
                                prop="id"
                                label="ID"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="account"
                                label="账号"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="姓名"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="last_login_ip"
                                label="上次登录ip"
                        >
                        </el-table-column>
                        <el-table-column
                                label="状态">
                            <template slot-scope="scope">
                                {{scope.row.status ? '启用':'禁用'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="showAction(scope.$index)"></el-button>
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
                title="用户详情"
                :visible.sync="showDialogVisible"
                width="30%"
                :before-close="showHandleClose"
                @closed="showHandleClosed">
            <el-tabs v-model="activeName" tab-position="left">
                <el-tab-pane label="基础信息" name="info" >
                    <el-form :model="showData"  ref="showForm" label-width="100px">
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="showData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="账号：" prop="account">
                            <el-input v-model="showData.account"></el-input>
                        </el-form-item>
                        <el-form-item label="密码：" prop="password">
                            <el-input v-model="showData.password"></el-input>
                        </el-form-item>
                        <el-form-item label="状态：" prop="status">
                            <el-switch
                                    v-model="showData.status"
                                    active-text="启用"
                                    inactive-text="禁用">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="" >
                            <el-button @click="showCancelDialog">取 消</el-button>
                            <el-button type="primary" @click="editInfo">修改基础信息</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="角色管理" name="role">
                    <el-form label-width="100px">
                        <el-form-item label="角色：" >
                            <el-checkbox-group v-model="activeRoles">
                                <el-checkbox v-for="item in roleIndexData.data" :label="item.id" >{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="" >
                            <el-button @click="showCancelDialog">取 消</el-button>
                            <el-button type="primary" @click="editRole">修改关联角色</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <el-dialog
                title="添加账号"
                :visible.sync="addDialogVisible"
                width="30%"
                :before-close="addHandleClose"
                @closed="addHandleClosed">
            <el-form :model="addParams" :rules="addRules" ref="addForm" label-width="100px">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="addParams.name"></el-input>
                </el-form-item>
                <el-form-item label="账号：" prop="account">
                    <el-input v-model="addParams.account"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input v-model="addParams.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-switch
                            v-model="addParams.status"
                            active-text="启用"
                            inactive-text="禁用">
                    </el-switch>
                </el-form-item>
                <el-form-item label="角色：" >
                    <el-checkbox-group v-model="addUserRoles">
                        <el-checkbox v-for="item in roleIndexData.data" :label="item.id" >{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="" >
                    <el-button @click="addCancelDialog">取 消</el-button>
                    <el-button type="primary" @click="addUser">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/apis/index';
    export default {
        name: "Admin",
        data() {
            return {
                //表格数据下表
                showIndex:0,
                //详情选项卡默认值
                activeName:'info',
                //列表加载
                indexLoading: false,
                //列表请求参数
                queryParams: {
                    page: 1,
                    size: 10,
                    status: '',
                    account: '',
                },
                //用户列表数据
                userIndexData: {
                    list: [],
                    total: 0,
                },
                //详情数据
                showData: {
                    id: '',
                    name: '',
                    account: '',
                    password:'',
                    last_login_ip: '',
                    status: '',
                    roles: [],
                },
                //当前选中的角色
                activeRoles:[],
                //详情对话框隐藏状态
                showDialogVisible: false,
                //角色列表数据(不需要分页)
                roleIndexData:{
                    data:[],
                },
                //添加对话框隐藏状态
                addDialogVisible:false,
                //添加用户数据
                addParams:{
                    account:'',
                    name:'',
                    password:'',
                    status:true,
                },
                //添加用户所选角色
                addUserRoles:[],
                //添加验证规则
                addRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                }

            };
        },
        methods: {
            /**
             * 列表请求
             */
            queryIndex() {
                this.indexLoading = true;
                api.user.index(this.queryParams).then(response => {
                    this.userIndexData = response.data.data;
                    this.indexLoading = false;
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
                this.roleIndexData.data = [];
                this.activeRoles = [];
                api.user.show(id).then(response => {
                    this.showData = response.data.data;
                    this.showData.passwrod = '';
                    api.role.index({}).then(res => {
                        this.roleIndexData.data = res.data.data;
                        for(let i in this.roleIndexData.data){
                            for (let j in this.showData.roles){
                                this.roleIndexData.data[i].id =  this.roleIndexData.data[i].id.toString();
                                if(this.showData.roles[j].id == this.roleIndexData.data[i].id){
                                    this.activeRoles.push(this.roleIndexData.data[i].id)
                                }
                            }
                        }
                        this.showDialogVisible = true;
                    })
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
            showHandleClosed(){
                this.showIndex = 0;
                this.activeName = 'info';
            },
            /**
             * 提交修改用户
             */
            editInfo(){
                api.user.update(this.showData.id,this.showData).then(response=>{
                    this.$message.success('修改成功');
                    this.showDialogVisible = false;
                    this.queryIndex();
                    this.showHandleClosed();
                }).catch(err=>{
                    this.$message.error('网络异常');
                })
            },
            /**
             * 提交修改用户角色
             */
            editRole(){
                api.user.updateRole(this.showData.id,this.activeRoles).then(response=>{
                    this.$message.success('修改成功');
                    this.showDialogVisible = false;
                    this.queryIndex();
                    this.showHandleClosed();
                }).catch(err=>{
                    this.$message.error('网络异常');
                });
            },
            /**
             * 详情取消对话框
             */
            showCancelDialog(){
                this.showDialogVisible = false;
                this.showHandleClosed();
            },
            /**
             * 关闭添加对话框
             */
            addHandleClose(){
                this.addDialogVisible = false;
            },
            /**
             * 添加对话框关闭完成后
             */
            addHandleClosed(){
                this.addUserRoles = [];
            },
            /**
             * 添加对话框取消按钮
             */
            addCancelDialog(){
                this.addDialogVisible = false;
            },
            /**
             * 请求添加用户
             */
            addUser(){
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        this.addParams.roles = this.addUserRoles;
                        api.user.create(this.addParams).then(response=>{
                            this.$message.success('添加成功');
                            this.queryIndex();
                            this.addParams = {
                                account:'',
                                name:'',
                                password:'',
                                status:true,
                            };
                            this.addDialogVisible = false;
                        }).catch(err=>{
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
            addAction(){
                this.addDialogVisible = true;
                this.roleIndexData.data = [];
                this.addUserRoles = [];
                api.role.index({}).then(res => {
                    this.roleIndexData.data = res.data.data;
                })
            },
        },
        mounted() {
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
