<template>
    <el-form ref="formRef" :model="user" :rules="rules" label-width="auto">
        <el-form-item :label="$t('navbar.basicInfo.oldPassword')" prop="oldPassword">
            <el-input maxlength="100" v-model="user.oldPassword" :placeholder="$t('components.input.placeholder')" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('navbar.basicInfo.newPassword')" prop="newPassword">
            <el-input maxlength="100" v-model="user.newPassword" :placeholder="$t('components.input.placeholder')" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('navbar.basicInfo.confirmPassword')" prop="confirmPassword">
            <el-input maxlength="100" v-model="user.confirmPassword" :placeholder="$t('components.input.placeholder')" type="password" show-password />
        </el-form-item>
        <el-form-item>
            <!-- prettier-ignore -->
            <el-button type="primary" size="small" @click="submit">{{ $t('components.btn.saveButton') }}</el-button>
            <!-- prettier-ignore -->
            <el-button type="danger" size="small" @click="close">{{ $t('components.btn.closeButton') }}</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" name="RestPwd" setup>
import { ref, getCurrentInstance, defineExpose } from 'vue'
import { updateUserPwd } from '@/api/system/user'
import { ElForm } from 'element-plus'
import useTagsViewStore from '@/store/modules/tagsView'
import { $t } from '@/lang'

const { proxy } = getCurrentInstance() as any
const formRef = ref<InstanceType<typeof ElForm>>()
const equalToPassword = (rule: any, value: any, callback: any) => {
    if (user.value.newPassword !== value) {
        callback(new Error($t('components.validator.equalToPassword')))
    } else {
        callback()
    }
}
const user = ref({
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
})
// 表单校验
const rules = ref({
    oldPassword: [
        {
            required: true,
            message: $t('components.validator.oldPassword'),
            trigger: 'blur'
        }
    ],
    newPassword: [
        {
            required: true,
            message: $t('components.validator.newPassword'),
            trigger: 'blur'
        },
        {
            min: 6,
            max: 20,
            message: $t('components.validator.lengthPassword'),
            trigger: 'blur'
        }
    ],
    confirmPassword: [
        {
            required: true,
            message: $t('components.validator.confirmPassword'),
            trigger: 'blur'
        },
        {
            required: true,
            validator: equalToPassword,
            trigger: 'blur'
        }
    ]
})

const submit = () => {
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            // prettier-ignore
            updateUserPwd(user.value.oldPassword, user.value.newPassword).then((response: any) => {
                if (response.code === 200) {
                    proxy.$modal.msgSuccess($t('components.message.edit'));
                    proxy.resetForm(formRef);
                }
            });
        }
    })
}
const close = () => {
    useTagsViewStore().delView(proxy.$route)
    proxy.$router.push({ path: '/index' })
}

const formReset = () => {
    formRef.value?.resetFields()
}

// 暴露方法
defineExpose({
    formReset
})
</script>
