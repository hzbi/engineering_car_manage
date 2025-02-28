<template>
    <el-config-provider :locale="useAppStore().language == 'zh' ? Zh : En">
        <router-view />
    </el-config-provider>
</template>
<script setup lang="ts">
import En from 'element-plus/lib/locale/lang/en'
import Zh from 'element-plus/lib/locale/lang/zh-cn'
import useAppStore from '@/store/modules/app'
console.log(useAppStore().language)
</script>
