<template>
    <el-config-provider :locale="useAppStore().language == 'zh' ? Zh : En">
        <router-view />
    </el-config-provider>
</template>
<script setup lang="ts">
import En from 'element-plus/es/locale/lang/en'
import Zh from 'element-plus/es/locale/lang/zh-cn'
import useAppStore from '@/store/modules/app'
</script>
