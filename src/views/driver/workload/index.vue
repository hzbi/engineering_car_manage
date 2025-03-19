<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="车牌号" prop="carNumber">
                <el-input maxlength="100" v-model="queryParams.carNumber" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="司机姓名" prop="name">
                <el-input maxlength="100" v-model="queryParams.name" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="开始日期" prop="startTime">
                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="endTime">
                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" :disabled-date="disabledEndDate" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['driver:workload:add']">{{ $t('operationButtons.add.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="download" size="small" @click="handleImport" v-hasPermi="['driver:workload:import']">{{ $t('operationButtons.import.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="upload" size="small" @click="handleExport" v-hasPermi="['driver:workload:export']">{{ $t('operationButtons.export.label') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>

        <el-table stripe border v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
            <el-table-column label="日期" align="center" prop="workloadTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="车牌号" align="center" prop="carNumber" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="司机姓名" align="center" prop="name" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="工地名称" align="center" prop="siteName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="工作时间" align="center" prop="workTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="车数" align="center" prop="workload" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="货币单位" align="center" prop="monetaryUnit" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="currency_unit_type" :value="scope.row.monetaryUnit" />
                </template>
            </el-table-column>
            <el-table-column label="单价" align="center" prop="unitPrice" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="收费金额" align="center" prop="money" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="备注" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('tableColumn.operation')" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['driver:workload:info']">{{ $t('operationButtons.info.label') }}</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['driver:workload:edit']">{{ $t('operationButtons.edit.label') }}</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['driver:workload:delete']">{{ $t('operationButtons.delete.label') }}</el-button>
                    <el-button type="text" @click="handlePrice(scope.row)" v-hasPermi="['driver:workload:price']">{{ $t('operationButtons.price.label') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-row justify="center" style="max-height: 600px; overflow-y: auto">
                <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="日期:" prop="workloadTime">
                        <el-date-picker clearable v-model="form.workloadTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')" style="width: 300px"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="司机姓名:" prop="carNumber">
                        <el-select v-model="form.carNumber" :placeholder="$t('components.select.placeholder')" @change="handleChangeName" clearable>
                            <el-option v-for="dict in driverAndTruckOptions" :key="dict.carNumber" :label="dict.name" :value="dict.carNumber" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车牌号:" prop="carNumber">
                        <el-input maxlength="100" v-model="form.carNumber" :placeholder="$t('components.input.placeholder')" disabled clearable />
                    </el-form-item>
                    <el-form-item label="工地名称:" prop="siteId">
                        <el-select v-model="form.siteId" :placeholder="$t('components.select.placeholder')" @change="handleChangeSite" clearable>
                            <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="结算方式:" prop="closeStatus">
                        <el-radio-group v-model="form.closeStatus">
                            <el-radio label="0">按工时</el-radio>
                            <el-radio label="1">按车数</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="form.closeStatus == 0">
                        <el-form-item label="工作时间(小时):" prop="workTime">
                            <el-input maxlength="100" v-model="form.workTime" :placeholder="$t('components.input.placeholder')" clearable />
                        </el-form-item>
                    </template>
                    <template v-if="form.closeStatus == 1">
                        <el-form-item label="车数:" prop="workload">
                            <el-input maxlength="100" v-model="form.workload" :placeholder="$t('components.input.placeholder')" clearable />
                        </el-form-item>
                    </template>
                    <el-form-item label="备注:" prop="remark">
                        <el-input maxlength="200" v-model="form.remark" type="textarea" :rows="5" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                </el-form>
            </el-row>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">{{ $t('components.btn.confirmButton') }}</el-button>
                    <el-button @click="cancel">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 详情对话框 -->
        <el-dialog :title="title" v-model="openInfo" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="日期:" prop="workloadTime">
                    <span>{{ form.workloadTime }}</span>
                </el-form-item>
                <el-form-item label="司机姓名:" prop="name">
                    <span>{{ form.name }}</span>
                </el-form-item>
                <el-form-item label="车牌号:" prop="carNumber">
                    <span>{{ form.carNumber }}</span>
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteId">
                    <span>{{ form.siteName }}</span>
                </el-form-item>
                <el-form-item label="结算方式:" prop="closeStatus">
                    <span>{{ form.closeStatus == 0 ? '按工时' : '按车数' }}</span>
                </el-form-item>
                <template v-if="form.closeStatus == 0">
                    <el-form-item label="工作时间(小时):" prop="workTime">
                        <span>{{ form.workTime }}</span>
                    </el-form-item>
                </template>
                <template v-if="form.closeStatus == 1">
                    <el-form-item label="车数:" prop="workload">
                        <span>{{ form.workload }}</span>
                    </el-form-item>
                </template>
                <el-form-item label="备注:" prop="remark">
                    <span>{{ form.remark }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 价格维护对话框 -->
        <el-dialog :title="title" v-model="openPrice" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="日期:" prop="workloadTime">
                    <span>{{ form.workloadTime }}</span>
                </el-form-item>
                <el-form-item label="司机姓名:" prop="name">
                    <span>{{ form.name }}</span>
                </el-form-item>
                <el-form-item label="车牌号:" prop="carNumber">
                    <span>{{ form.carNumber }}</span>
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteId">
                    <span>{{ form.siteName }}</span>
                </el-form-item>
                <el-form-item label="结算方式:" prop="closeStatus">
                    <span>{{ form.closeStatus == 0 ? '按工时' : '按车数' }}</span>
                </el-form-item>
                <template v-if="form.closeStatus == 0">
                    <el-form-item label="工作时间(小时):" prop="workTime">
                        <span>{{ form.workTime }}</span>
                    </el-form-item>
                </template>
                <template v-if="form.closeStatus == 1">
                    <el-form-item label="车数:" prop="workload">
                        <span>{{ form.workload }}</span>
                    </el-form-item>
                </template>
                <el-form-item label="货币单位:" prop="monetaryUnit">
                    <el-select v-model="form.monetaryUnit" :placeholder="$t('components.select.placeholder')" clearable>
                        <el-option v-for="dict in currency_unit_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单价:" prop="unitPrice">
                    <el-input maxlength="100" v-model="form.unitPrice" :placeholder="$t('components.input.placeholder')" clearable @input="handleCount()" />
                </el-form-item>
                <el-form-item label="收费金额:" prop="money">
                    <el-input maxlength="100" v-model="form.money" :placeholder="$t('components.input.placeholder')" disabled />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">{{ $t('components.btn.confirmButton') }}</el-button>
                    <el-button @click="cancel">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 列表导入对话框 -->
        <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body @close="cleanUploadRef()">
            <!-- prettier-ignore -->
            <el-upload
				ref="uploadRef"
				:limit="1"
				accept=".xlsx, .xls"
				:headers="upload.headers"
				:action="upload.url + '?updateSupport=' + upload.updateSupport + '&language=' + useAppStore().language"
				:disabled="upload.isUploading"
				:on-progress="handleFileUploadProgress"
				:on-success="handleFileSuccess"
				:auto-upload="false"
				drag
			>
				<i class="upload"></i>
				<div class="el-upload__text">
					{{$t('components.upload.text1')}}
					<em>{{$t('components.upload.text2')}}</em>
				</div>
                <!-- prettier-ignore -->
				<div class="el-upload__tip" style="color:red" slot="tip">{{$t('components.upload.text3')}}</div>
			</el-upload>
            <template #footer>
                <div class="dialog-footer">
                    <!-- prettier-ignore -->
                    <el-button type="primary" @click="submitFileForm">{{$t('components.btn.confirmButton')}}</el-button>
                    <!-- prettier-ignore -->
                    <el-button @click="upload.open = false">{{$t('components.btn.cancelButton')}}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="Info" lang="ts">
import { getWorkloadList, getWorkloadInfo, addWorkload, updateWorkload, delWorkload } from '@/api/driver/workload'
import { getSiteList } from '@/api/site/siteManage'
import { getDriverAndTruck } from '@/api/driver/driverInfo'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload } from 'element-plus'
import { getToken } from '@/utils/auth'
import { $t } from '@/lang'
import useAppStore from '@/store/modules/app'

const baseURL = import.meta.env.VITE_APP_BASE_API

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const formRef = ref<InstanceType<typeof ElForm>>()

const { currency_unit_type } = proxy.useDict('currency_unit_type')

const tableData = ref([])
const open = ref(false)
const openInfo = ref(false)
const openPrice = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNumber: null,
        startTime: null,
        endTime: null
    },
    form: {
        id: null,
        workloadTime: null,
        name: null,
        carNumber: null,
        siteId: null,
        closeStatus: null,
        workTime: null,
        workload: null,
        monetaryUnit: null,
        unitPrice: null,
        money: null,
        remark: null
    },
    rules: {
        workloadTime: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        name: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        carNumber: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        siteId: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        closeStatus: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        workTime: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        workload: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        monetaryUnit: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        unitPrice: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }]
    }
})

const { queryParams, form, rules }: any = toRefs(data)

/** 查询司机表现列表 */
const getPageList = () => {
    loading.value = true
    getWorkloadList(queryParams.value).then((res: any) => {
        tableData.value = res.rows
        total.value = parseInt(res.total)
        loading.value = false
    })
}

const disabledEndDate = (time: any) => {
    if (queryParams.value.startTime) {
        return time.getTime() < new Date(queryParams.value.startTime).getTime()
    }
    return false
}

const driverAndTruckOptions = ref([]) as any

/** 获取司机和车辆 */
const getDriverAndTruckOptions = () => {
    getDriverAndTruck({}).then((res: any) => {
        driverAndTruckOptions.value = res.data
    })
}

const siteOptions = ref([]) as any

const getSiteOptions = () => {
    getSiteList({ status: 0 }).then((res: any) => {
        siteOptions.value = res.rows
    })
}

// 取消按钮
const cancel = () => {
    open.value = false
    openInfo.value = false
    openPrice.value = false
    formRef.value?.resetFields()
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

const handleChangeName = (value: any) => {
    const result = driverAndTruckOptions.value.filter((item: any) => item.carNumber == value)
    form.value.name = result.length > 0 ? result[0].name : ''
}

const handleChangeSite = (value: any) => {
    const result = siteOptions.value.filter((item: any) => item.siteId == value)
    form.value.siteName = result.length > 0 ? result[0].siteName : ''
}

/** 详情按钮操作 */
const handleInfo = (row: any) => {
    openInfo.value = true
    title.value = $t('dialog.infoTitle')
    formRef.value?.resetFields()
    const id = row.id
    getWorkloadInfo(id).then((res: any) => {
        form.value = res.data
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    open.value = true
    title.value = $t('dialog.addTitle')
    formRef.value?.resetFields()
    form.value.id = null
    getDriverAndTruckOptions()
    getSiteOptions()
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    open.value = true
    title.value = $t('dialog.editTitle')
    formRef.value?.resetFields()
    const id = row.id
    getDriverAndTruckOptions()
    getSiteOptions()
    getWorkloadInfo(id).then((res: any) => {
        Object.keys(form.value).forEach((item) => {
            form.value[item] = res.data[item]
        })
    })
}

/** 价格维护按钮操作 */
const handlePrice = (row: any) => {
    openPrice.value = true
    title.value = '价格维护'
    formRef.value?.resetFields()
    const id = row.id
    getWorkloadInfo(id).then((res: any) => {
        form.value = res.data
    })
}

const handleCount = () => {
    if (form.value.closeStatus == 0) {
        if (form.value.workTime && form.value.unitPrice) {
            form.value.money = form.value.workTime * form.value.unitPrice
        }
    } else {
        if (form.value.workload && form.value.unitPrice) {
            form.value.money = form.value.workload * form.value.unitPrice
        }
    }
}

/** 提交按钮 */
const submitForm = () => {
    proxy.$refs['formRef'].validate((valid: any) => {
        if (valid) {
            if (form.value.id != null) {
                updateWorkload(form.value).then(() => {
                    proxy.$modal.msgSuccess($t('components.message.edit'))
                    open.value = false
                    openPrice.value = false
                    getPageList()
                })
            } else {
                addWorkload(form.value).then(() => {
                    proxy.$modal.msgSuccess($t('components.message.add'))
                    open.value = false
                    openPrice.value = false
                    getPageList()
                })
            }
        }
    })
}

/** 删除按钮操作 */
const handleDelete = (row: any) => {
    proxy.$modal
        .confirm($t('components.message.delete.content'), {
            confirmButtonText: $t('components.btn.confirmButton'),
            cancelButtonText: $t('components.btn.cancelButton')
        })
        .then(() => {
            return delWorkload(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess($t('components.message.delete.text'))
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/workload/export', { ...queryParams.value }, `${$t('menu.Workload')}${new Date().getTime()}.xlsx`)
}

const uploadRef = ref<InstanceType<typeof ElUpload>>()
// 用户导入参数
const upload = ref<any>({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: '',
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { Authorization: 'Bearer ' + getToken() },
    // 上传的地址
    url: baseURL + '/truck/workload/import'
})

/** 导入按钮操作 */
const handleImport = () => {
    upload.value.title = $t('import.title')
    upload.value.open = true
}

/**
 * 清除上传控件选中文件
 */
const cleanUploadRef = () => {
    uploadRef.value?.clearFiles()
    upload.value.updateSupport = 0
}

// 文件上传中处理
const handleFileUploadProgress = (event: any, file: any, fileList: any) => {
    upload.value.isUploading = true
}

// 文件上传成功处理
const handleFileSuccess = (res: any, file: any, fileList: any) => {
    upload.value.open = false
    upload.value.isUploading = false
    cleanUploadRef()
    proxy.$alert(res.msg, $t('import.result'), {
        confirmButtonText: $t('components.btn.confirmButton'),
        dangerouslyUseHTMLString: true
    })
    getPageList()
}

// 提交上传文件
const submitFileForm = () => {
    proxy.$refs.uploadRef.submit()
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
