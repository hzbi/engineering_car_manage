<template>
    <div class="login">
        <div class="el-login-header">
            <LangSelect></LangSelect>
        </div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">{{ $t('login.title') }}</h3>
            <el-form-item prop="username">
                <el-input maxlength="100" v-model="loginForm.username" type="text" auto-complete="off" :placeholder="$t('login.username')">
                    <template #prefix>
                        <svg-icon icon-class="user" class="el-input__icon input-icon" />
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input maxlength="100" v-model="loginForm.password" type="password" auto-complete="off" :placeholder="$t('login.password')" @keyup.enter="handleLogin">
                    <template #prefix>
                        <svg-icon icon-class="password" class="el-input__icon input-icon" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input maxlength="100" v-model="loginForm.code" auto-complete="off" :placeholder="$t('login.code')" style="width: 55%" @keyup.enter="handleLogin">
                    <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
                </el-input>
                <div class="login-code">
                    <img v-if="codeUrl" :src="codeUrl" @click="getCode()" class="login-code-img" :title="$t('login.imgTitle')" />
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">{{ $t('login.rememberMe') }}</el-checkbox>
            <el-form-item style="width: 100%">
                <el-button :loading="loading" type="primary" size="large" style="width: 100%" @click.native="handleLogin">
                    <span v-if="!loading">{{ $t('login.logIn') }}</span>
                    <span v-else>{{ $t('login.loggingIn') }}</span>
                </el-button>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <!-- <div class="el-login-footer">
            <span>Copyright © 2018-2021 ruoyi.vip All Rights Reserved.</span>
        </div> -->
    </div>
</template>

<script lang="ts" name="Login" setup>
import Login from '@/api/request/login'
const { loginFormRef, loginForm, loginRules, codeUrl, loading, getCode, handleLogin } = Login()
</script>

<style lang="scss" scoped>
.el-login-header {
    position: fixed;
    top: 0;
    right: 50px;
}

.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('../assets/images/login-background.jpg');
    background-size: cover;
}

.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
}

.login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;

    .el-input {
        height: 38px;

        input {
            height: 38px;
        }
    }

    .input-icon {
        color: #000;
        height: 39px;
        width: 14px;
        margin-left: 2px;
    }
}

.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}

.login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
        cursor: pointer;
        vertical-align: middle;
        margin: 0 0 0 30%;
    }
}

.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}

.login-code-img {
    height: 38px;
}
</style>
