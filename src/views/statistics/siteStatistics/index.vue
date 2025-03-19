<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="年份" prop="year">
                <el-date-picker v-model="queryParams.year" type="year" value-format="YYYY" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="月份" prop="mon">
                <el-date-picker v-model="queryParams.mon" type="month" value-format="MM" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="工地名称:" prop="siteName">
                <el-select v-model="queryParams.siteName" :placeholder="$t('components.select.placeholder')" clearable style="width: 200px">
                    <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteName" />
                </el-select>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="upload" size="small" @click="handleExport" v-hasPermi="['system:user:export']">{{ $t('operationButtons.export.label') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>

        <el-table stripe border v-loading="loading" :data="tableData">
            <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
            <el-table-column label="年/月份" align="center" prop="time" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="工地名称" align="center" prop="name" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="总工作量（小时）" align="center" prop="workTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="总车数" align="center" prop="carNum" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="收费金额" align="center" prop="money" min-width="120" show-overflow-tooltip></el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />
    </div>
</template>

<script setup name="Info" lang="ts">
import { getSiteStatisticsList } from '@/api/statistics/index'
import { getSiteList } from '@/api/site/siteManage'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable } from 'element-plus'
import { $t } from '@/lang'

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const { truck_type, truck_status } = proxy.useDict('truck_type', 'truck_status')

const tableData = ref([])
const loading = ref(true)
const showSearch = ref(true)

const total = ref(0)

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNumber: null,
        carType: null
    }
})

const { queryParams }: any = toRefs(data)

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    getSiteStatisticsList(queryParams.value).then((res: any) => {
        tableData.value = res.rows
        total.value = parseInt(res.total)
        loading.value = false
    })
}

const siteOptions = ref([]) as any

const getSiteOptions = () => {
    getSiteList({}).then((res: any) => {
        siteOptions.value = res.rows
    })
}

getSiteOptions()

/** 搜索按钮操作 */
const handleQuery = () => {
    total.value = 0
    queryParams.value.pageNum = 1
    getPageList()
}

/** 重置按钮操作 */
const resetQuery = () => {
    queryFormRef.value?.resetFields()
    total.value = 0
    handleQuery()
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/workload/exportCarNumAndWorkTime', { ...queryParams.value }, `${$t('menu.SiteStatistics')}${new Date().getTime()}.xlsx`)
}

getPageList()
</script>

<style lang="scss" scoped>
.el-dialog {
    .el-form {
        .el-input {
            width: 300px;
        }
        .el-textarea {
            width: 300px;
        }
        .el-select {
            width: 300px;
        }
    }
}
</style>
