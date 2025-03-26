<template>
    <el-form ref="formRef" :model="user" :rules="rules" label-width="auto">
        <el-form-item :label="$t('navbar.basicInfo.nickname')" prop="nickName">
            <el-input maxlength="100" v-model="user.nickName" />
        </el-form-item>
        <el-form-item :label="$t('navbar.basicInfo.phone')" prop="phonenumber">
            <el-input v-model="user.phonenumber" maxlength="20" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item :label="$t('navbar.basicInfo.gender')">
            <el-radio-group v-model="user.sex">
                <el-radio label="0">{{ $t('navbar.basicInfo.genderType.man') }}</el-radio>
                <el-radio label="1">{{ $t('navbar.basicInfo.genderType.woman') }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <!-- prettier-ignore -->
            <el-button type="primary" size="small" @click="submit()">{{ $t('components.btn.saveButton') }}</el-button>
            <!-- prettier-ignore -->
            <el-button type="danger" size="small" @click="close()">{{ $t('components.btn.closeButton') }}</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" name="UserInfo">
import { updateUserProfile } from '@/api/system/user'
import { ElForm } from 'element-plus'
import { ref, getCurrentInstance } from 'vue'
import useTagsViewStore from '@/store/modules/tagsView'
import { $t } from '@/lang'
export default {
    props: {
        user: {
            type: Object as any
        }
    },
    setup(props: any) {
        const { proxy } = getCurrentInstance() as any
        const formRef = ref<InstanceType<typeof ElForm>>()
        const rules = ref<any>({
            nickName: [
                {
                    required: true,
                    message: $t('components.validator.nickName'),
                    trigger: 'blur'
                }
            ],
            email: [
                {
                    required: true,
                    message: $t('components.validator.email.empty'),
                    trigger: 'blur'
                },
                {
                    type: 'email',
                    message: $t('components.validator.email.error'),
                    trigger: ['blur', 'change']
                }
            ],
            phonenumber: [
                {
                    required: true,
                    message: $t('components.validator.phonenumber.empty'),
                    trigger: 'blur'
                }
            ]
        })

        const submit = () => {
            formRef.value?.validate((valid: boolean) => {
                if (valid) {
                    updateUserProfile(props.user).then((response: any) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess($t('components.message.edit'))
                        }
                    })
                }
            })
        }
        const close = () => {
            useTagsViewStore().delView(proxy.$route)
            proxy.$router.push({ path: '/index' })
        }

        // prettier-ignore
        return {
			rules, formRef, submit, close,
        };
    }
}
</script>
