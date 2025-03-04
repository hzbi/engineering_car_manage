<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="卡车编号" prop="carId">
                <el-input v-model="queryParams.carId" placeholder="请输入卡车编号" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="工地名称" prop="siteName">
                <el-input v-model="queryParams.siteName" placeholder="请输入工地名称" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="维护类型" prop="maintenanceType">
                <el-select v-model="queryParams.maintenanceType" placeholder="请选择维护类型" clearable>
                    <el-option v-for="dict in maintenance_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="开始日期" prop="nextTime">
                <el-date-picker clearable v-model="queryParams.nextTime" type="date" value-format="yyyy-MM-dd" placeholder="选择下次维修时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="maintenanceTime">
                <el-date-picker clearable v-model="queryParams.maintenanceTime" type="date" value-format="yyyy-MM-dd" placeholder="选择时间"></el-date-picker>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="upload" size="small" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="download" size="small" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>

        <el-table stripe border v-loading="loading" :data="maintenanceList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" label="序号" align="center" />
            <el-table-column label="日期" align="center" prop="maintenanceTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.maintenanceTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="卡车编号" align="center" prop="carId"></el-table-column>
            <el-table-column label="工地名称" align="center" prop="siteName"></el-table-column>
            <el-table-column label="维护类型" align="center" prop="maintenanceType">
                <template #default="scope">
                    <dict-tag :options="maintenance_type" :value="scope.row.maintenanceType" />
                </template>
            </el-table-column>
            <el-table-column label="油耗" align="center" prop="oilConsumption"></el-table-column>
            <el-table-column label="公里数" align="center" prop="kilometres"></el-table-column>
            <el-table-column label="详细说明" align="center" prop="remark"></el-table-column>
            <el-table-column label="货币单位" align="center" prop="monetaryUnit"></el-table-column>
            <el-table-column label="花费" align="center" prop="amount"></el-table-column>
            <el-table-column label="维修商" align="center" prop="maintenanceProvider">
                <template #default="scope">
                    <span>{{ scope.row.maintenanceMode == 1 ? scope.row.maintenanceProvider : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="保养人员" align="center" prop="maintenanceProvider">
                <template #default="scope">
                    <span>{{ scope.row.maintenanceMode == 0 ? scope.row.maintenanceProvider : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="下次维护日期" align="center" prop="nextTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.nextTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="200"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['system:log:edit']">详情</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:log:edit']">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['system:log:remove']">删除</el-button>
                    <el-button type="text" @click="handlePrice(scope.row)" v-hasPermi="['system:log:edit']">价格维护</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getPageList" />

        <!-- 添加或修改维护记录管理对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="日期:" prop="maintenanceTime">
                    <el-date-picker clearable v-model="form.maintenanceTime" type="date" value-format="YYYY-MM-DD" placeholder="选择时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="卡车编号:" prop="carId">
                    <el-select v-model="form.carId" placeholder="请选择汽车编号" filterable>
                        <el-option v-for="dict in truckOptions" :key="dict.carId" :label="dict.carId" :value="dict.carId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteName">
                    <el-input v-model="form.siteName" placeholder="请输入工地名称" />
                </el-form-item>
                <el-form-item label="维护类型:" prop="maintenanceType">
                    <el-select v-model="form.maintenanceType" placeholder="请选择维护类型">
                        <el-option v-for="dict in maintenance_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="油耗:" prop="oilConsumption">
                    <el-input v-model="form.oilConsumption" placeholder="请输入油耗" />
                </el-form-item>
                <el-form-item label="公里数:" prop="kilometres">
                    <el-input v-model="form.kilometres" placeholder="请输入公里数" />
                </el-form-item>
                <el-form-item label="详细说明:" prop="remark">
                    <el-input v-model="form.remark" type="textarea" rows="5" placeholder="请输入详细说明" />
                </el-form-item>
                <el-form-item label="维修方式:" prop="maintenanceMode">
                    <el-radio-group v-model="form.maintenanceMode">
                        <el-radio :value="0" label="内部人员维修"></el-radio>
                        <el-radio :value="1" label="外部维修商维修"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.maintenanceMode == 0">
                    <el-form-item label="保养人员:" prop="maintenanceProvider">
                        <el-input v-model="form.maintenanceProvider" placeholder="请输入保养人员" />
                    </el-form-item>
                </template>
                <template v-if="form.maintenanceMode == 1">
                    <el-form-item label="维修商:" prop="maintenanceProvider">
                        <el-input v-model="form.maintenanceProvider" placeholder="请输入维修商" />
                    </el-form-item>
                </template>
                <el-form-item label="下次维护日期:" prop="nextTime">
                    <el-date-picker clearable v-model="form.nextTime" type="date" value-format="yyyy-MM-dd" placeholder="选择下次维护日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 价格维护对话框 -->
        <el-dialog :title="title" v-model="openPrice" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="日期:" prop="maintenanceTime">
                    <span>{{ form.maintenanceTime ? parseTime(new Date(form.maintenanceTime), '{y}-{m}-{d}') : '' }}</span>
                </el-form-item>
                <el-form-item label="卡车编号:" prop="carId">
                    <span>{{ form.carId }}</span>
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteName">
                    <span>{{ form.siteName }}</span>
                </el-form-item>
                <el-form-item label="维护类型:" prop="maintenanceType">
                    <dict-tag :options="maintenance_type" :value="form.maintenanceType" />
                </el-form-item>
                <el-form-item label="油耗:" prop="oilConsumption">
                    <span>{{ form.oilConsumption }}</span>
                </el-form-item>
                <el-form-item label="公里数:" prop="kilometres">
                    <span>{{ form.kilometres }}</span>
                </el-form-item>
                <el-form-item label="详细说明:" prop="remark">
                    <span>{{ form.remark }}</span>
                </el-form-item>
                <el-form-item label="货币单位:" prop="carWeight">
                    <el-input v-model="form.carWeight" placeholder="请输入货币单位" />
                </el-form-item>
                <el-form-item label="花费:" prop="carWeight">
                    <el-input v-model="form.carWeight" placeholder="请输入花费" />
                </el-form-item>
                <el-form-item label="维修方式:" prop="maintenanceMode">
                    <span>{{ form.maintenanceMode == 0 ? '内部人员维修' : '外部维修商维修' }}</span>
                </el-form-item>
                <template v-if="form.maintenanceMode == 0">
                    <el-form-item label="保养人员:" prop="maintenanceProvider">
                        <span>{{ form.maintenanceProvider }}</span>
                    </el-form-item>
                </template>
                <template v-if="form.maintenanceMode == 1">
                    <el-form-item label="维修商:" prop="maintenanceProvider">
                        <span>{{ form.maintenanceProvider }}</span>
                    </el-form-item>
                </template>
                <el-form-item label="下次维护日期:" prop="nextTime">
                    <span>{{ form.nextTime ? parseTime(new Date(form.nextTime), '{y}-{m}-{d}') : '' }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 维护记录详情对话框 -->
        <el-drawer :title="title" size="80%" v-model="openInfo">
            <el-divider content-position="left">基本信息</el-divider>
            <table class="info-table" border="1">
                <tbody>
                    <tr>
                        <td>维护日期</td>
                        <td>{{ form.maintenanceTime ? parseTime(new Date(form.maintenanceTime), '{y}-{m}-{d}') : '' }}</td>
                        <td>卡车编号</td>
                        <td>{{ form.carId }}</td>
                        <td>工地名称</td>
                        <td>{{ form.siteName }}</td>
                    </tr>
                    <tr>
                        <td>维护类型</td>
                        <td><dict-tag :options="maintenance_type" :value="form.maintenanceType" /></td>
                        <td>油耗</td>
                        <td>{{ form.oilConsumption }}</td>
                        <td>公里数</td>
                        <td>{{ form.kilometres }}</td>
                    </tr>
                    <tr>
                        <td>维修方式</td>
                        <td>{{ form.maintenanceMode == 0 ? '内部人员维修' : '外部维修商维修' }}</td>
                        <td>{{ form.maintenanceMode == 0 ? '保养人员' : '维修商' }}</td>
                        <td>{{ form.maintenanceProvider }}</td>
                        <td>下次维护日期</td>
                        <td>{{ form.nextTime ? parseTime(new Date(form.nextTime), '{y}-{m}-{d}') : '' }}</td>
                    </tr>
                    <tr>
                        <td>创建人</td>
                        <td>{{ form.createBy }}</td>
                        <td>创建时间</td>
                        <td>{{ form.createTime }}</td>
                        <td>详细说明</td>
                        <td>{{ form.remark }}</td>
                    </tr>
                </tbody>
            </table>
            <el-divider content-position="left">配件使用记录</el-divider>
            <el-table stripe border v-loading="loading" :data="maintenanceList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column label="日期" align="center" prop="maintenanceTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.maintenanceTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="卡车编号" align="center" prop="carId"></el-table-column>
                <el-table-column label="工地名称" align="center" prop="siteName"></el-table-column>
                <el-table-column label="维护类型" align="center" prop="maintenanceType">
                    <template #default="scope">
                        <dict-tag :options="maintenance_type" :value="scope.row.maintenanceType" />
                    </template>
                </el-table-column>
                <el-table-column label="油耗" align="center" prop="oilConsumption"></el-table-column>
                <el-table-column label="公里数" align="center" prop="kilometres"></el-table-column>
                <el-table-column label="详细说明" align="center" prop="remark"></el-table-column>
                <el-table-column label="货币单位" align="center" prop="monetaryUnit"></el-table-column>
                <el-table-column label="花费" align="center" prop="amount"></el-table-column>
                <el-table-column label="维修商" align="center" prop="maintenanceProvider">
                    <template #default="scope">
                        <span>{{ scope.row.maintenanceMode == 1 ? scope.row.maintenanceProvider : '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="保养人员" align="center" prop="maintenanceProvider">
                    <template #default="scope">
                        <span>{{ scope.row.maintenanceMode == 0 ? scope.row.maintenanceProvider : '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="下次维护日期" align="center" prop="nextTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.nextTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy"></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="200"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['system:log:edit']">详情</el-button>
                        <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:log:edit']">编辑</el-button>
                        <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['system:log:remove']">删除</el-button>
                        <el-button type="text" @click="handlePrice(scope.row)" v-hasPermi="['system:log:edit']">价格维护</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>
        <!-- <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="日期" prop="maintenanceTime">
                    <el-date-picker clearable v-model="form.maintenanceTime" type="date" value-format="yyyy-MM-dd" placeholder="选择时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="卡车编号" prop="carId">
                    <el-select v-model="form.carId" placeholder="请选择汽车编号" filterable>
                        <el-option v-for="dict in truckOptions" :key="dict.carId" :label="dict.carId" :value="dict.carId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工地名称" prop="siteName">
                    <el-input v-model="form.siteName" placeholder="请输入工地名称" />
                </el-form-item>
                <el-form-item label="维护类型" prop="maintenanceType">
                    <el-select v-model="form.maintenanceType" placeholder="请选择维护类型">
                        <el-option v-for="dict in maintenance_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="油耗" prop="oilConsumption">
                    <el-input v-model="form.oilConsumption" placeholder="请输入油耗" />
                </el-form-item>
                <el-form-item label="公里数" prop="kilometres">
                    <el-input v-model="form.kilometres" placeholder="请输入公里数" />
                </el-form-item>
                <el-form-item label="详细说明" prop="remark">
                    <el-input v-model="form.remark" type="textarea" rows="5" placeholder="请输入详细说明" />
                </el-form-item>
                <el-form-item label="维修方式" prop="maintenanceMode">
                    <el-radio-group v-model="form.maintenanceMode">
                        <el-radio :value="0" label="内部人员维修"></el-radio>
                        <el-radio :value="1" label="外部维修商维修"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.maintenanceMode == 0">
                    <el-form-item label="保养人员" prop="maintenanceProvider">
                        <el-input v-model="form.maintenanceProvider" placeholder="请输入保养人员" />
                    </el-form-item>
                </template>
                <template v-if="form.maintenanceMode == 1">
                    <el-form-item label="维修商" prop="maintenanceProvider">
                        <el-input v-model="form.maintenanceProvider" placeholder="请输入维修商" />
                    </el-form-item>
                </template>
                <el-form-item label="下次维护日期" prop="nextTime">
                    <el-date-picker clearable v-model="form.nextTime" type="date" value-format="yyyy-MM-dd" placeholder="选择下次维护日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog> -->
    </div>
</template>

<script setup name="Maintenance" lang="ts">
import { listLog, getLog, delLog, addLog, updateLog } from '@/api/truck/maintainRecords'
import { listInfo } from '@/api/truck/truckInfo'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable } from 'element-plus'

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const { maintenance_type } = proxy.useDict('maintenance_type')

const maintenanceList = ref([])
const open = ref(false)
const openPrice = ref(false)
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
        maintenanceTime: null,
        carId: null,
        siteId: null,
        siteName: null,
        maintenanceType: null,
        maintenanceMode: null,
        oilConsumption: null,
        kilometres: null,
        maintenanceProvider: null,
        nextTime: null,
        monetaryUnit: null,
        amount: null
    },
    rules: {}
})

const { queryParams, form, rules }: any = toRefs(data)

/** 查询维护记录管理列表 */
const getPageList = () => {
    loading.value = true
    listLog(queryParams.value).then((response: any) => {
        maintenanceList.value = response.rows
        total.value = parseInt(response.total)
        loading.value = false
    })
}

const truckOptions = ref([]) as any

const getTruckOption = () => {
    listInfo({}).then((response: any) => {
        truckOptions.value = response.rows
    })
}

// 取消按钮
const cancel = () => {
    open.value = false
    openPrice.value = false
    reset()
}

// 表单重置
const reset = () => {
    form.value = {
        id: null,
        maintenanceTime: null,
        carId: null,
        siteId: null,
        siteName: null,
        maintenanceType: null,
        maintenanceMode: null,
        oilConsumption: null,
        kilometres: null,
        maintenanceProvider: null,
        nextTime: null,
        monetaryUnit: null,
        amount: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
    }
    proxy.resetForm('formRef')
}

/** 搜索按钮操作 */
const handleQuery = () => {
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

/** 详情按钮操作 */
const handleInfo = (row: any) => {
    // reset()
    const id = row.id
    getTruckOption()
    getLog(id).then((response) => {
        form.value = response.data
        openInfo.value = true
        title.value = '维护记录详情'
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    reset()
    open.value = true
    title.value = '新增维护记录'
    getTruckOption()
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    reset()
    const id = row.id
    getTruckOption()
    getLog(id).then((response) => {
        form.value = response.data
        open.value = true
        title.value = '编辑维护记录'
    })
}

/** 价格维护按钮操作 */
const handlePrice = (row: any) => {
    reset()
    const id = row.id
    getTruckOption()
    getLog(id).then((response) => {
        form.value = response.data
        openPrice.value = true
        title.value = '价格维护'
    })
}

/** 提交按钮 */
const submitForm = () => {
    proxy.$refs['formRef'].validate((valid: any) => {
        if (valid) {
            if (form.value.id != null) {
                updateLog(form.value).then(() => {
                    proxy.$modal.msgSuccess('修改成功')
                    open.value = false
                    getPageList()
                })
            } else {
                addLog(form.value).then(() => {
                    proxy.$modal.msgSuccess('新增成功')
                    open.value = false
                    getPageList()
                })
            }
        }
    })
}

/** 删除按钮操作 */
const handleDelete = (row: any) => {
    proxy.$modal
        .confirm('是否确认删除维护记录管理编号为"' + row.id + '"的数据项？')
        .then(() => {
            return delLog(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/maintenance/export', {}, `log_${new Date().getTime()}.xlsx`)
}

getPageList()
</script>

<style lang="scss" scope>
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

.info-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }
}
</style>
