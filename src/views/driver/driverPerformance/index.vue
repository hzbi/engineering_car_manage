<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="卡车编号" prop="carId">
                <el-input v-model="queryParams.carId" placeholder="请输入" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="司机姓名" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="开始日期" prop="startTime">
                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" placeholder="选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="endTime">
                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" placeholder="选择时间"></el-date-picker>
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

        <el-table stripe border v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" label="序号" align="center" />
            <el-table-column label="日期" align="center" prop="workloadTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="卡车编号" align="center" prop="carId" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="司机姓名" align="center" prop="name" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="表现评分（分）" align="center" prop="performanceScore" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="performance" :value="scope.row.performanceScore" />
                </template>
            </el-table-column>
            <el-table-column label="违规类型" align="center" prop="violationType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="violation_type" :value="scope.row.violationType" />
                </template>
            </el-table-column>
            <el-table-column label="偷盗行为记录" align="center" prop="log" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="备注" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['system:info:edit']">详情</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:info:edit']">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['system:info:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />

        <!-- 添加或修改司机信息对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="日期:" prop="workloadTime">
                    <el-date-picker clearable v-model="form.workloadTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 300px"></el-date-picker>
                </el-form-item>
                <el-form-item label="司机姓名:" prop="carId">
                    <el-select v-model="form.carId" placeholder="请选择" @change="handleChangeName">
                        <el-option v-for="dict in driverAndTruckOptions" :key="dict.carId" :label="dict.name" :value="dict.carId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="卡车编号:" prop="carId">
                    <el-input v-model="form.carId" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="表现评分(总分10分):" prop="performanceScore">
                    <el-select v-model="form.performanceScore" placeholder="请选择">
                        <el-option v-for="dict in performance" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="违规类型:" prop="violationType">
                    <el-select v-model="form.violationType" placeholder="请选择">
                        <el-option v-for="dict in violation_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="偷窃行为记录:" prop="log">
                    <el-input v-model="form.log" type="textarea" rows="5" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="form.remark" type="textarea" rows="5" placeholder="请输入" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 司机信息详情对话框 -->
        <el-dialog :title="title" v-model="openInfo" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="日期:" prop="workloadTime">
                    <span>{{ form.workloadTime }}</span>
                </el-form-item>
                <el-form-item label="司机姓名:" prop="name">
                    <span>{{ form.name }}</span>
                </el-form-item>
                <el-form-item label="卡车编号:" prop="carId">
                    <span>{{ form.carId }}</span>
                </el-form-item>
                <el-form-item label="表现评分(总分10分):" prop="performanceScore">
                    <dict-tag :options="performance" :value="form.performanceScore" />
                </el-form-item>
                <el-form-item label="违规类型:" prop="violationType">
                    <dict-tag :options="violation_type" :value="form.violationType" />
                </el-form-item>
                <el-form-item label="偷窃行为记录:" prop="log">
                    <span>{{ form.log }}</span>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <span>{{ form.remark }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
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
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
                <!-- prettier-ignore -->
				<div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
			</el-upload>
            <template #footer>
                <div class="dialog-footer">
                    <!-- prettier-ignore -->
                    <el-button type="primary" @click="submitFileForm">确 定</el-button>
                    <!-- prettier-ignore -->
                    <el-button @click="upload.open = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="Info" lang="ts">
import { getDriverPerformanceList, getDriverPerformanceInfo, addDriverPerformance, updateDriverPerformance, delDriverPerformance } from '@/api/driver/driverPerformance'
import { getDriverAndTruck } from '@/api/driver/driverInfo'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload } from 'element-plus'
import { getToken } from '@/utils/auth'
const baseURL = import.meta.env.VITE_APP_BASE_API

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const formRef = ref<InstanceType<typeof ElForm>>()

const { performance, violation_type } = proxy.useDict('performance', 'violation_type')

const tableData = ref([])
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
        carId: null,
        name: null,
        startTime: null,
        endTime: null
    },
    form: {
        id: null,
        workloadTime: null,
        name: null,
        carId: null,
        performanceScore: null,
        violationType: null,
        log: null,
        remark: null
    },
    rules: {
        workloadTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        carId: [{ required: true, message: '请选择', trigger: 'blur' }],
        performanceScore: [{ required: true, message: '请选择', trigger: 'blur' }]
    }
})

const { queryParams, form, rules }: any = toRefs(data)

/** 查询司机表现列表 */
const getPageList = () => {
    loading.value = true
    getDriverPerformanceList(queryParams.value).then((res: any) => {
        tableData.value = res.rows
        total.value = parseInt(res.total)
        loading.value = false
    })
}

const driverAndTruckOptions = ref([]) as any

/** 获取司机和车辆 */
const getDriverAndTruckOptions = () => {
    getDriverAndTruck({}).then((res: any) => {
        driverAndTruckOptions.value = res.data
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

const handleChangeName = (value: any) => {
    const result = driverAndTruckOptions.value.filter((item: any) => item.carId == value)
    form.value.name = result.length > 0 ? result[0].name : ''
}

/** 详情按钮操作 */
const handleInfo = (row: any) => {
    openInfo.value = true
    title.value = '详情'
    formRef.value?.resetFields()
    const id = row.id
    getDriverPerformanceInfo(id).then((res: any) => {
        form.value = res.data
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    open.value = true
    title.value = '新增'
    formRef.value?.resetFields()
    getDriverAndTruckOptions()
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    open.value = true
    title.value = '编辑'
    formRef.value?.resetFields()
    const id = row.id
    getDriverAndTruckOptions()
    getDriverPerformanceInfo(id).then((res: any) => {
        Object.keys(form.value).forEach((item) => {
            form.value[item] = res.data[item]
        })
    })
}

/** 提交按钮 */
const submitForm = () => {
    proxy.$refs['formRef'].validate((valid: any) => {
        if (valid) {
            if (form.value.id != null) {
                updateDriverPerformance(form.value).then(() => {
                    proxy.$modal.msgSuccess('修改成功')
                    open.value = false
                    getPageList()
                })
            } else {
                addDriverPerformance(form.value).then(() => {
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
        .confirm('是否确认删除此数据项？')
        .then(() => {
            return delDriverPerformance(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/DriverPerformance/export', {}, `info_${new Date().getTime()}.xlsx`)
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
    url: baseURL + '/truck/DriverPerformance/import'
})

/** 导入按钮操作 */
const handleImport = () => {
    upload.value.title = '数据导入'
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
    proxy.$alert(res.msg, '导入结果', {
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
