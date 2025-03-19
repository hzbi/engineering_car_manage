<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="工地名称:" prop="siteId">
                <el-select v-model="queryParams.siteId" :placeholder="$t('components.select.placeholder')" clearable style="width: 200px">
                    <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
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

        <div ref="chartRef" style="height: 420px"></div>

        <el-table stripe border v-loading="loading" :data="tableData">
            <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
            <el-table-column label="配件类型" align="center" prop="accessoryType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="accessory_type" :value="scope.row.accessoryType" />
                </template>
            </el-table-column>
            <el-table-column label="剩余总量" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />
    </div>
</template>

<script setup name="Info" lang="ts">
import { getAccessoryStockList } from '@/api/statistics/index'
import { getSiteList } from '@/api/site/siteManage'
import { ref, reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import { ElForm, ElTable } from 'element-plus'
import * as echarts from 'echarts'
import { $t } from '@/lang'

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const chartRef = ref<any>(null)

const { accessory_type } = proxy.useDict('accessory_type')

const tableData = ref([])
const loading = ref(true)
const showSearch = ref(true)

const total = ref(0)

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        year: null,
        mon: null,
        carNumber: null,
        carType: null
    }
})

const { queryParams }: any = toRefs(data)

console.log(accessory_type)
console.log(proxy.selectDictLabel(accessory_type.value, '0'))

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    getAccessoryStockList(queryParams.value).then((res: any) => {
        tableData.value = res.rows
        total.value = parseInt(res.total)

        const commandstatsIntance = echarts.init(chartRef.value, 'macarons')

        commandstatsIntance.setOption({
            grid: {
                left: '20',
                right: '20',
                bottom: '50',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: res.rows && res.rows.map((item: any) => item.accessoryName)
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: res.rows && res.rows.map((item: any) => item.num),
                    type: 'bar',
                    barMaxWidth: 100 //
                }
            ]
        })

        loading.value = false
    })
}

const siteOptions = ref([]) as any

const getSiteOptions = () => {
    getSiteList({ status: 0 }).then((res: any) => {
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
    proxy.download('truck/Accessory/importAllSize', { ...queryParams.value }, `${$t('menu.AccessoryNum')}${new Date().getTime()}.xlsx`)
}

onMounted(() => {
    getPageList()
})
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
