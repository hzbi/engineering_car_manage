<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="年份" prop="year">
                <el-date-picker v-model="queryParams.year" type="year" value-format="YYYY" placeholder="请输入" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="月份" prop="mon">
                <el-date-picker v-model="queryParams.mon" type="month" value-format="MM" placeholder="请输入" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车牌号" prop="carId">
                <el-input v-model="queryParams.carId" placeholder="请输入" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车型" prop="carType">
                <el-select v-model="queryParams.carType" placeholder="请选择" clearable style="width: 200px" @keyup.enter.native="handleQuery">
                    <el-option v-for="dict in truck_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="download" size="small" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>

        <el-table stripe border v-loading="loading" :data="tableData">
            <el-table-column type="index" width="80" label="序号" align="center" />
            <el-table-column label="年/月份" align="center" prop="time" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="车牌号" align="center" prop="carNumber" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="车型" align="center" prop="carType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="truck_type" :value="scope.row.carType" />
                </template>
            </el-table-column>
            <el-table-column label="维修次数" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="油耗" align="center" prop="youhao" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="公里数" align="center" prop="kilo" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="维修费用" align="center" prop="money" min-width="120" show-overflow-tooltip></el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />
    </div>
</template>

<script setup name="Info" lang="ts">
import { getMaintenanceRecordList } from '@/api/statistics/maintenanceRecord'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable } from 'element-plus'

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
        pageSize: 1,
        year: null,
        mon: null,
        carId: null,
        carType: null
    }
})

const { queryParams }: any = toRefs(data)

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    getMaintenanceRecordList(queryParams.value).then((res: any) => {
        tableData.value = res.rows
        total.value = parseInt(res.total)
        loading.value = false
    })
}

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
    proxy.download('truck/maintenance/importSelectMain', {}, `info_${new Date().getTime()}.xlsx`)
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
