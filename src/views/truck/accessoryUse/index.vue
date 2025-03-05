<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="卡车编号" prop="carId">
                <el-input v-model="queryParams.carId" placeholder="请输入卡车编号" clearable style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-table stripe border v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" label="序号" align="center" />
            <el-table-column label="日期" align="center" prop="carId"></el-table-column>
            <el-table-column label="卡车编号" align="center" prop="carId"></el-table-column>
            <el-table-column label="配件类型" align="center" prop="accessoryType">
                <template #default="scope">
                    <dict-tag :options="accessory_type" :value="scope.row.accessoryType" />
                </template>
            </el-table-column>
            <el-table-column label="配件名称" align="center" prop="accessoryName"></el-table-column>
            <el-table-column label="数量" align="center" prop="num"></el-table-column>
            <el-table-column label="用途" align="center" prop="useing"></el-table-column>
            <el-table-column label="供应商" align="center" prop="supplier"></el-table-column>
            <el-table-column label="备注" align="center" prop="remark"></el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="200"></el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />
    </div>
</template>

<script setup name="Info" lang="ts">
import { getAccessoryUseList } from '@/api/truck/accessoryUse'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable } from 'element-plus'
const baseURL = import.meta.env.VITE_APP_BASE_API

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const { accessory_type } = proxy.useDict('accessory_type')

const infoList = ref([])
const open = ref(false)
const openInfo = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        carId: null,
        carNumber: null,
        carType: null,
        carWeight: null,
        carStatus: null,
        carCreateTime: null,
        carInspectionTime: null
    },
    rules: {}
})

const { queryParams, form, rules }: any = toRefs(data)

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    getAccessoryUseList(queryParams.value).then((response: any) => {
        infoList.value = response.rows
        total.value = parseInt(response.total)
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

// 多选框选中数据
const handleSelectionChange = (selection: any) => {
    ids.value = selection.map((item: { id: any }) => item.id)
    single.value = selection.length !== 1
    multiple.value = !selection.length
}

getPageList()
</script>

<style lang="scss" scoped>
.el-dialog {
    .el-form {
        .el-input {
            width: 500px;
        }
        .el-textarea {
            width: 500px;
        }
    }
}
</style>
