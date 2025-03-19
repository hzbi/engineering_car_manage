<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6" :xs="24">
                <el-card class="box-card">
                    <template #header>
                        <div class="clearfix">
                            <span>{{ $t('navbar.personalInfo.title') }}</span>
                        </div>
                    </template>

                    <div>
                        <div class="text-center">
                            <userAvatar :user="user" />
                        </div>
                        <ul class="list-group list-group-striped">
                            <li class="list-group-item">
                                <span>
                                    <!-- <svg-icon icon-class="user" style="margin-right: 5px" /> -->
                                    {{ $t('navbar.personalInfo.userName') }}
                                </span>
                                <span class="pull-right">
                                    {{ user.userName }}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <span>
                                    <!-- <svg-icon icon-class="phone" style="margin-right: 5px" /> -->
                                    {{ $t('navbar.personalInfo.phoneNumber') }}
                                </span>
                                <span class="pull-right">
                                    {{ user.phonenumber }}
                                </span>
                            </li>

                            <li class="list-group-item">
                                <span>
                                    <!-- <svg-icon icon-class="peoples" style="margin-right: 5px" /> -->
                                    {{ $t('navbar.personalInfo.role') }}
                                </span>
                                <span class="pull-right">
                                    <el-tag style="margin: 3px" v-for="item in roleGroup">{{ item }}</el-tag>
                                </span>
                            </li>
                            <li class="list-group-item">
                                <span>
                                    <!-- <svg-icon icon-class="date" style="margin-right: 5px" /> -->
                                    {{ $t('navbar.personalInfo.creationDate') }}
                                </span>
                                <span class="pull-right">
                                    <span style="line-height: 22px">{{ user.createTime }}</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18" :xs="24">
                <el-card>
                    <template #header>
                        <div class="clearfix">
                            <span>{{ $t('navbar.basicInfo.title') }}</span>
                        </div>
                    </template>

                    <!-- <el-tabs v-model="activeTab" @tab-change="tabChange"> -->
                    <el-tabs v-model="activeTab">
                        <el-tab-pane :label="$t('navbar.basicInfo.tab.basicInfo')" name="userinfo">
                            <userInfo :user="user" />
                        </el-tab-pane>
                        <el-tab-pane :label="$t('navbar.basicInfo.tab.editPassword')" name="resetPwd">
                            <resetPwd ref="pwdRef" :user="user" />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" name="Profile" setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import userAvatar from './userAvatar.vue'
import userInfo from './userInfo.vue'
import resetPwd from './resetPwd.vue'
import { getUserProfile } from '@/api/system/user'
import { IUser } from '@/api/request/module/profile'
import { TabPanelName } from 'element-plus'

const { proxy } = getCurrentInstance() as any
const pwdRef = ref<any>()
const activeTab = ref<string>('userinfo')
const user = ref<IUser>({
    userId: '',
    userName: '',
    avatar: '',
    createBy: '',
    createTime: '',
    dept: {
        deptName: ''
    },
    deptId: '',
    email: '',
    nickName: '',
    phonenumber: '',
    remark: ''
})
const roleGroup = ref<any>()
const postGroup = ref<any>()
const getUser = () => {
    getUserProfile().then((response: any) => {
        const data = response.data
        user.value = data.data
        roleGroup.value = data.roleGroup.split(',')
        postGroup.value = data.postGroup.split(',')
    })
}

/**
 * tab点击调用
 *
 * @param tab tab
 */
const tabClick = (tab: any) => {
    if ('resetPwd' === tab.paneName) {
        // proxy.$refs["pwdRef"].formRest();
        pwdRef.value?.formReset()
    }
}

/**
 * tab改变调用
 */
const tabChange = (tabName: TabPanelName) => {
    if ('resetPwd' === tabName) {
        // proxy.$refs["pwdRef"].formRest();
        // 使用vue3的方式
        pwdRef.value?.formReset()
    }
}

onMounted(() => {
    getUser()
})
</script>
