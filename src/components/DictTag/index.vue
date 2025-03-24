<template>
    <div>
        <template v-for="(item, index) in options">
            <template v-if="values.includes(item.value)">
                <span v-if="item.elTagType == 'default' || item.elTagType == ''" :key="item.value" :index="index" :class="item.elTagClass">{{ useAppStore().language == 'zh' ? item.label : item.labelEn }}</span>
                <el-tag v-else :disable-transitions="true" :key="item.value + ''" :index="index" :type="item.elTagType === 'primary' ? '' : item.elTagType" :class="item.elTagClass">{{ useAppStore().language == 'zh' ? item.label : item.labelEn }}</el-tag>
            </template>
        </template>
    </div>
</template>

<script setup>
import useAppStore from '@/store/modules/app'
import { computed } from 'vue'
const props = defineProps({
    // 数据
    options: {
        type: Array,
        default: null
    },
    // 当前的值
    value: [Number, String, Array]
})

props.options.map((item) => {
    if (props.options.length == 2 && item.value == 0) {
        item.elTagType = 'primary'
    } else if (props.options.length == 2 && item.value == 1) {
        item.elTagType = 'info'
    }
    return item
})

const values = computed(() => {
    if (props.value !== null && typeof props.value !== 'undefined') {
        return Array.isArray(props.value) ? props.value : [String(props.value)]
    } else {
        return []
    }
})
</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
}
</style>
