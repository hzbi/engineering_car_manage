<template>
    <div>
        <el-dropdown trigger="click" @command="handleSetLanguage">
            <div class="icon-size" :style="{ color: color, fontSize: size + 'px' }"><svg-icon icon-class="language" /></div>

            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="zh" :disabled="language === 'zh'">中文</el-dropdown-item>
                    <el-dropdown-item command="en" :disabled="language === 'en'">English</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script setup lang="ts">
import { toRefs, computed, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import useAppStore from '@/store/modules/app'

const props = defineProps({
    color: String,
    size: String
})

const { color, size } = toRefs(props)

// 实例化i18
const i18 = useI18n()
const language = computed(() => useAppStore().language)
// 进行语言切换
const handleSetLanguage = (lang: string) => {
    i18.locale.value = lang
    useAppStore().toggleLanguage(lang)
    localStorage.setItem('language', lang)
    window.location.reload()
}
</script>

<style lang="scss" scoped>
.icon-size {
    margin: 10px;
    font-size: 30px;
    color: #fff;
}
</style>
