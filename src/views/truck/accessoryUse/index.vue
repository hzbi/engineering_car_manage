<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item :label="$t('accessoryUse.searchBar.plateNumber.label')" prop="carNumber">
                <el-input maxlength="100" v-model="queryParams.carNumber" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item :label="$t('accessoryUse.searchBar.startDate.label')" prop="startTime">
                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" :disabled-date="disabledStartDate" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('accessoryUse.searchBar.endDate.label')" prop="endTime">
                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" :disabled-date="disabledEndDate" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-table stripe border v-loading="loading" :data="infoList">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
            <el-table-column :label="$t('accessoryUse.tableColumn[0].label')" align="center" prop="maintenanceTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[1].label')" align="center" prop="carNumber" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[2].label')" align="center" prop="accessoryType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="accessory_type" :value="scope.row.accessoryType" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[3].label')" align="center" prop="accessoryName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[4].label')" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[5].label')" align="center" prop="useing" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[6].label')" align="center" prop="supplier" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[7].label')" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[8].label')" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryUse.tableColumn[9].label')" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />
    </div>
</template>

<script setup name="AccessoryUse" lang="ts">
import { getAccessoryUseList } from '@/api/truck/accessoryUse'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable } from 'element-plus'
import { $t } from '@/lang'
import useAppStore from '@/store/modules/app'

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const { accessory_type } = proxy.useDict('accessory_type')

const infoList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNumber: null,
        startTime: null,
        endTime: null
    },
    form: {},
    rules: {}
})

const { queryParams, form, rules }: any = toRefs(data)

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    getAccessoryUseList(queryParams.value).then((res: any) => {
        infoList.value = res.rows
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

const disabledStartDate = (time: any) => {
    if (queryParams.value.endTime) {
        return time.getTime() > new Date(queryParams.value.endTime).getTime()
    }
    return false
}

const disabledEndDate = (time: any) => {
    if (queryParams.value.startTime) {
        return time.getTime() < new Date(queryParams.value.startTime).getTime() - 8.64e7
    }
    return false
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
