<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="page-title">角色列表</h3>
            </div>
            <div>
                <el-row>
                    <el-col>
                        <el-button type="primary" round @click="addRoleAction">添加角色</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="14" :offset="6">
                        <el-card class="box-card">
                            <el-table
                                    v-loading="indexLoading"
                                    border
                                    :data="roleIndexData.list"
                                    style="width: 100%;"
                                    highlight-current-row
                            >
                                <el-table-column type="expand">
                                    <template slot-scope="props">
                                        <el-card class="box-card" v-if="props.row.admins.length > 0">
                                            <el-table
                                                    :data="props.row.admins"
                                                    style="width: 100%"
                                                    height="250">
                                                <el-table-column
                                                        fixed
                                                        prop="name"
                                                        label="名称"
                                                >
                                                </el-table-column>
                                                <el-table-column
                                                        prop="account"
                                                        label="账号"
                                                >
                                                </el-table-column>
                                            </el-table>
                                            <!--<div v-for="admin in props.row.admins" :key="admin.key" class="text item">-->
                                            <!--{{'名称：' + admin.name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{'账号：' + admin.account }}-->
                                            <!--</div>-->
                                        </el-card>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label="角色ID"
                                        prop="id"
                                        width="100px">
                                </el-table-column>
                                <el-table-column
                                        label="角色名称"
                                        prop="name">
                                </el-table-column>
                                <el-table-column
                                        label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" icon="el-icon-edit" @click="editRoleAction(scope.row.id)"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" @click="deleteAction(scope.row.id)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="page-block">
                                <el-pagination
                                        @size-change="handleSizeChange"
                                        @current-change="handleCurrentPageChange"
                                        :current-page="this.queryParams.page"
                                        :page-sizes="[10, 20, 50, 100]"
                                        :page-size="this.queryParams.size"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="this.roleIndexData.total">
                                </el-pagination>
                            </div>
                        </el-card>
                    </el-col>

                </el-row>
            </div>
        </el-card>
        <el-dialog
                title="添加角色"
                :visible.sync="addDialogVisible"
                width="30%"
                :before-close="addHandleClose"
                @closed="addHandleClosed">
            <el-form :model="addParams" :rules="addRules" ref="addForm" label-width="100px">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="addParams.name"></el-input>
                </el-form-item>
                <el-form-item label="" >
                    <el-button @click="addCancelDialog">取 消</el-button>
                    <el-button type="primary" @click="addRole">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
                title="角色详情"
                :visible.sync="editDialogVisible"
                width="40%"
                :before-close="editHandleClose"
                @closed="editHandleClosed">
            <el-tabs v-model="activeName" tab-position="left">
                <el-tab-pane label="基础信息" name="info" >
                    <el-form :model="editParams" :rules="editRules" ref="editForm" label-width="100px">
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="editParams.name"></el-input>
                        </el-form-item>
                        <el-form-item label="" >
                            <el-button type="primary" @click="editRole()">修改角色基础信息</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="权限管理" name="privilege">
                    <el-card class="box-card">
                        <el-row  v-for = "(item,index) in privilegeData" :key="index">
                            <el-checkbox-group v-model="privilegeGroup[index]" @change="handleCheckedPrivilegeChange(index,privilegeGroup[index])">
                                <el-checkbox :label="item.code">{{item.name}}</el-checkbox>
                                <br>
                                <el-checkbox v-for = "(childItem,childIndex) in item.children" :key="childIndex" :label="childItem.code" :disabled="checkAble[index]">
                                    {{childItem.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                            <br>
                        </el-row>
                        <el-row>
                            <el-col :span="8" :offset="16">
                                <el-button type="primary" @click="updateRolePrivilege">保存角色权限</el-button>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-tab-pane>
            </el-tabs>

        </el-dialog>
    </div>
</template>

<script>
    import api from '@/apis/index';
    import Vue from 'vue';
    export default {
        name: "Role",
        data() {
            return {
                //列表加载
                indexLoading: false,
                //详情选项卡默认值
                activeName:'info',
                //角色列表
                queryParams: {
                    page: 1,
                    size: 10,
                    with: 'admins'
                },
                //添加参数
                addParams:{
                    name:'',
                },
                //添加参数
                editParams:{
                    id:0,
                    name:'',
                },
                //添加验证规则
                addRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                },
                //修改验证规则
                editRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                },
                //列表数据
                roleIndexData: {
                    list: [],
                    total: 0,
                },
                //节点名称
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                checkAble:[],
                //所有权限菜单数据
                privilegeData: [],
                //当前角色的权限
                rolePrivilege: [],
                privilegeGroup:[],
                addDialogVisible:false,
                editDialogVisible:false,
            }
        },
        methods: {
            queryRoleIndex() {
                this.indexLoading = true;
                api.role.index(this.queryParams).then(response => {
                    this.roleIndexData = response.data.data;
                    this.indexLoading = false;
                })
            },
            queryPrivilegeIndex() {
                api.privilege.index().then(response => {
                    this.indexLoading = true;
                    this.privilegeData = response.data.data;
                    for (let i = 0;i < this.privilegeData.length;i++ ){
                        this.privilegeGroup[i] = [];
                        this.checkAble[i] = true;
                    }
                    this.indexLoading = false;
                })
            },
            handleSizeChange(size) {
                this.queryParams.size = size;
                this.queryRoleIndex();
            },
            handleCurrentPageChange(page) {
                this.queryParams.page = page;
                this.queryRoleIndex();
            },
            updateRolePrivilege() {
                let temp = [];
                for (let i in this.privilegeGroup){
                    temp = temp.concat(this.privilegeGroup[i]);
                }
                this.indexLoading = true;
                api.role.updatePri(this.editParams.id,temp).then(response=>{
                    this.editDialogVisible = false;
                    this.indexLoading = false;
                    this.$message.success('修改成功');
                }).catch(err=>{
                    this.$message.error('修改失败');
                });
            },
            handleCheckedPrivilegeChange(index,val){
                if(val.length === 1){
                    if(this.privilegeData[index].code === val[0]){
                        Vue.set(this.checkAble,index,false);
                    }else{
                        Vue.set(this.privilegeGroup,index,[]);
                        Vue.set(this.checkAble,index,true);
                    }
                }
                if(val.length === 0){
                    Vue.set(this.checkAble,index,true);
                }
                if(val.length > 1){
                    if(val.indexOf(this.privilegeData[index].code) === -1){
                        Vue.set(this.privilegeGroup,index,[]);
                        Vue.set(this.checkAble,index,true);
                    }else{
                        Vue.set(this.checkAble,index,false);
                    }
                }
            },
            /**
             * 打开添加对话框
             */
            addRoleAction(){
                this.addDialogVisible = true;
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
                this.addParams.name = '';
            },
            /**
             * 取消添加对话框
             */
            addCancelDialog(){
                this.addDialogVisible = false;
            },
            /**
             * 打开编辑对话框
             */
            editRoleAction(id){
                this.rolePrivilege = [];
                for (let i in this.privilegeGroup){
                    Vue.set(this.privilegeGroup,i,[]);
                }
                api.role.show(id).then(response => {
                    this.editParams.name = response.data.data.name;
                    this.editParams.id = id;
                    this.rolePrivilege = response.data.data.rolePrivileges;
                    for (let i in this.rolePrivilege){
                        for( let j in this.privilegeData){
                            if(this.rolePrivilege[i].code === this.privilegeData[j].code){
                                let rolePriGroup = [];
                                rolePriGroup.push(this.rolePrivilege[i].code);
                                if(this.rolePrivilege[i].children){
                                    for (let k in this.rolePrivilege[i].children){
                                        rolePriGroup.push(this.rolePrivilege[i].children[k].code);
                                    }
                                }
                                Vue.set(this.privilegeGroup,j,rolePriGroup);
                            }

                        }
                    }
                    for (let i in this.privilegeGroup){
                        this.handleCheckedPrivilegeChange(i,this.privilegeGroup[i])
                    }
                    this.editDialogVisible = true;
                }).catch(err=>{
                    this.$message.error('网络异常');
                });
            },
            /**
             * 编辑角色基础信息入库
             */
            editRole(){
                this.indexLoading = true;
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        api.role.update(this.editParams.id,this.editParams).then(response=>{
                            this.$message.success('修改成功');
                            this.queryRoleIndex();
                            this.editDialogVisible = false;
                            this.indexLoading = false;
                        }).catch(err=>{
                            this.indexLoading = false;
                            this.$message.error('网络异常');
                        })
                    } else {
                        this.$message.warning('资料不完善');
                    }
                });
            },
            /**
             * 关闭编辑对话框
             */
            editHandleClose(){
                this.editDialogVisible = false;
            },
            /**
             * 编辑对话框关闭完成后
             */
            editHandleClosed(){
                this.editParams = {
                    id:0,
                    name:'',
                };
                this.editParams.name = '';
                this.activeName = 'info';
            },
            /**
             * 添加角色入库
             */
            addRole(){
                this.indexLoading = true;
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        api.role.create(this.addParams).then(response=>{
                            this.$message.success('添加成功');
                            this.queryRoleIndex();
                            this.addParams = {
                                name:'',
                            };
                            this.indexLoading = false;
                            this.addDialogVisible = false;
                        }).catch(err=>{
                            this.indexLoading = false;
                            this.$message.error('网络异常');
                        })
                    } else {
                        this.$message.warning('资料不完善');
                    }
                });
            },
            deleteAction(id){
                api.role.delete(id).then(response=>{
                    this.$message.success('删除成功');
                    this.queryRoleIndex();
                }).catch(err=>{
                    this.$message.error(err.response.data.msg);
                })
            },
        },
        mounted() {
            this.queryRoleIndex();
            this.queryPrivilegeIndex();
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
