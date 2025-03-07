<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="卡车编号" prop="carId">
                <el-input v-model="queryParams.carId" placeholder="请输入卡车编号" clearable style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="开始日期" prop="startTime">
                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" placeholder="选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="endTime">
                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" placeholder="选择时间"></el-date-picker>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-table stripe border v-loading="loading" :data="infoList">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" label="序号" align="center" />
            <el-table-column label="日期" align="center" prop="carId" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="卡车编号" align="center" prop="carId" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="配件类型" align="center" prop="accessoryType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="accessory_type" :value="scope.row.accessoryType" />
                </template>
            </el-table-column>
            <el-table-column label="配件名称" align="center" prop="accessoryName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="数量" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="用途" align="center" prop="useing" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="供应商" align="center" prop="supplier" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="备注" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />
    </div>
</template>

<script setup name="Info" lang="ts">
import { getAccessoryUseList } from '@/api/truck/accessoryUse'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable } from 'element-plus'

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
        carId: null,
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
