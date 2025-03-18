<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item :label="$t('truckInfo.searchBar.plateNumber.label')" prop="carNumber">
                <el-input maxlength="100" v-model="queryParams.carNumber" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('truckInfo.searchBar.vehicleType.label')" prop="carType">
                <el-select v-model="queryParams.carType" :placeholder="$t('components.select.placeholder')" clearable style="width: 200px">
                    <el-option v-for="dict in truck_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['truck:truckInfo:add']">{{ $t('operationButtons.add.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="upload" size="small" @click="handleImport" v-hasPermi="['truck:truckInfo:import']">{{ $t('operationButtons.import.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="download" size="small" @click="handleExport" v-hasPermi="['truck:truckInfo:export']">{{ $t('operationButtons.export.label') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>

        <el-table stripe border v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
            <el-table-column :label="$t('truckInfo.tableColumn[0].label')" align="center" prop="carNumber" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('truckInfo.tableColumn[1].label')" align="center" prop="carType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="truck_type" :value="scope.row.carType" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('truckInfo.tableColumn[2].label')" align="center" prop="carWeight" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('truckInfo.tableColumn[3].label')" align="center" prop="carCreateTime" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ scope.row.carCreateTime ? parseTime(new Date(scope.row.carCreateTime), '{y}-{m}-{d}') : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('truckInfo.tableColumn[4].label')" align="center" prop="carInspectionTime" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ scope.row.carInspectionTime ? parseTime(new Date(scope.row.carInspectionTime), '{y}-{m}-{d}') : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('truckInfo.tableColumn[5].label')" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('truckInfo.tableColumn[6].label')" align="center" prop="carStatus" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="truck_status" :value="scope.row.carStatus" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('truckInfo.tableColumn[7].label')" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('truckInfo.tableColumn[8].label')" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('tableColumn.operation')" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['truck:truckInfo:info']">{{ $t('operationButtons.info.label') }}</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['truck:truckInfo:edit']">{{ $t('operationButtons.edit.label') }}</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['truck:truckInfo:delete']">{{ $t('operationButtons.delete.label') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />

        <!-- 添加或修改车辆信息对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-row justify="center" style="max-height: 600px; overflow-y: auto">
                <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                    <el-form-item :label="$t('truckInfo.fields[0].label')" prop="carNumber">
                        <el-input maxlength="100" v-model="form.carNumber" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('truckInfo.fields[1].label')" prop="carType">
                        <el-select v-model="form.carType" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in truck_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('truckInfo.fields[2].label')" prop="carWeight">
                        <el-input maxlength="100" v-model="form.carWeight" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('truckInfo.fields[3].label')" prop="carCreateTime">
                        <el-date-picker clearable v-model="form.carCreateTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')" style="width: 300px"></el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('truckInfo.fields[4].label')" prop="carInspectionTime">
                        <el-date-picker clearable v-model="form.carInspectionTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')" style="width: 300px"></el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('truckInfo.fields[5].label')" prop="carStatus">
                        <el-select v-model="form.carStatus" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in truck_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('truckInfo.fields[6].label')" prop="remark">
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

        <!-- 车辆信息详情对话框 -->
        <el-dialog :title="title" v-model="openInfo" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item :label="$t('truckInfo.fields[0].label')" prop="carNumber">
                    <span>{{ form.carNumber }}</span>
                </el-form-item>
                <el-form-item :label="$t('truckInfo.fields[1].label')" prop="carType">
                    <dict-tag :options="truck_type" :value="form.carType" />
                </el-form-item>
                <el-form-item :label="$t('truckInfo.fields[2].label')" prop="carWeight">
                    <span>{{ form.carWeight }}</span>
                </el-form-item>
                <el-form-item :label="$t('truckInfo.fields[3].label')" prop="carCreateTime">
                    <span>{{ form.carCreateTime ? parseTime(new Date(form.carCreateTime), '{y}-{m}-{d}') : '' }}</span>
                </el-form-item>
                <el-form-item :label="$t('truckInfo.fields[4].label')" prop="carInspectionTime">
                    <span>{{ form.carInspectionTime ? parseTime(new Date(form.carInspectionTime), '{y}-{m}-{d}') : '' }}</span>
                </el-form-item>
                <el-form-item :label="$t('truckInfo.fields[5].label')" prop="carStatus">
                    <dict-tag :options="truck_status" :value="form.carStatus" />
                </el-form-item>
                <el-form-item :label="$t('truckInfo.fields[6].label')" prop="remark">
                    <span>{{ form.remark }}</span>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
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
				:action="upload.url + '?updateSupport=' + upload.updateSupport"
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
import { getTruckList, getTruckInfo, addTruck, updateTruck, delTruck } from '@/api/truck/truckInfo'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload } from 'element-plus'
import { getToken } from '@/utils/auth'
import { $t } from '@/lang'
const baseURL = import.meta.env.VITE_APP_BASE_API

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const formRef = ref<InstanceType<typeof ElForm>>()

const { truck_type, truck_status } = proxy.useDict('truck_type', 'truck_status')

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
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNumber: null,
        carType: null
    },
    form: {
        id: null,
        carNumber: null,
        carType: null,
        carWeight: null,
        carCreateTime: null,
        carInspectionTime: null,
        carStatus: '0',
        remark: null
    },
    rules: {
        carNumber: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        carType: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }]
    }
})

const { queryParams, form, rules }: any = toRefs(data)

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    getTruckList(queryParams.value).then((res: any) => {
        infoList.value = res.rows
        total.value = parseInt(res.total)
        loading.value = false
    })
}

// 取消按钮
const cancel = () => {
    open.value = false
    openInfo.value = false
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

/** 详情按钮操作 */
const handleInfo = (row: any) => {
    openInfo.value = true
    title.value = $t('dialog.infoTitle')
    formRef.value?.resetFields()
    const id = row.id
    getTruckInfo(id).then((res: any) => {
        form.value = res.data
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    open.value = true
    title.value = $t('dialog.addTitle')
    formRef.value?.resetFields()
    form.value.id = null
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    open.value = true
    title.value = $t('dialog.editTitle')
    formRef.value?.resetFields()
    const id = row.id
    getTruckInfo(id).then((res: any) => {
        form.value = res.data
    })
}

/** 提交按钮 */
const submitForm = () => {
    proxy.$refs['formRef'].validate((valid: any) => {
        if (valid) {
            if (form.value.id != null) {
                updateTruck(form.value).then(() => {
                    proxy.$modal.msgSuccess($t('components.message.edit'))
                    open.value = false
                    getPageList()
                })
            } else {
                addTruck(form.value).then(() => {
                    proxy.$modal.msgSuccess($t('components.message.add'))
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
        .confirm($t('components.message.delete.content'), {
            confirmButtonText: $t('components.btn.confirmButton'),
            cancelButtonText: $t('components.btn.cancelButton')
        })
        .then(() => {
            return delTruck(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess($t('components.message.delete.text'))
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('carInfo/export', {}, `info_${new Date().getTime()}.xlsx`)
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
    url: baseURL + '/carInfo/import'
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
