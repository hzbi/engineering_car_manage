<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="车牌号" prop="carNumber">
                <el-input v-model="queryParams.carNumber" placeholder="请输入车牌号" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车型" prop="carType">
                <el-select v-model="queryParams.carType" placeholder="请选择车型" clearable style="width: 200px">
                    <el-option v-for="dict in truck_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
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

        <el-table stripe border v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" label="序号" align="center" />
            <el-table-column label="编号" align="center" prop="carId"></el-table-column>
            <el-table-column label="车牌号" align="center" prop="carNumber"></el-table-column>
            <el-table-column label="车型" align="center" prop="carType">
                <template #default="scope">
                    <dict-tag :options="truck_type" :value="scope.row.carType" />
                </template>
            </el-table-column>
            <el-table-column label="吨位" align="center" prop="carWeight"></el-table-column>
            <el-table-column label="车辆制造日期" align="center" prop="carCreateTime" width="180">
                <template #default="scope">
                    <span>{{ scope.row.carCreateTime ? parseTime(new Date(scope.row.carCreateTime), '{y}-{m}-{d}') : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="年检日期" align="center" prop="carInspectionTime" width="180">
                <template #default="scope">
                    <span>{{ scope.row.carInspectionTime ? parseTime(new Date(scope.row.carInspectionTime), '{y}-{m}-{d}') : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark"></el-table-column>
            <el-table-column label="状态" align="center" prop="carStatus">
                <template #default="scope">
                    <dict-tag :options="truck_status" :value="scope.row.carStatus" />
                </template>
            </el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="200"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['system:info:edit']">详情</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:info:edit']">修改</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['system:info:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />

        <!-- 添加或修改车辆信息对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-form ref="infoRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="编号:" prop="carId">
                    <el-input v-model="form.carId" placeholder="请输入编号" />
                </el-form-item>
                <el-form-item label="车牌号:" prop="carNumber">
                    <el-input v-model="form.carNumber" placeholder="请输入车牌号" />
                </el-form-item>
                <el-form-item label="车型:" prop="carType">
                    <el-select v-model="form.carType" placeholder="请选择车型">
                        <el-option v-for="dict in truck_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="吨位:" prop="carWeight">
                    <el-input v-model="form.carWeight" placeholder="请输入吨位" />
                </el-form-item>
                <el-form-item label="制造日期:" prop="carCreateTime">
                    <el-date-picker clearable v-model="form.carCreateTime" type="date" value-format="YYYY-MM-DD" placeholder="选择制造日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="年检日期:" prop="carInspectionTime">
                    <el-date-picker clearable v-model="form.carInspectionTime" type="date" value-format="YYYY-MM-DD" placeholder="选择年检日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="form.carStatus" placeholder="请选择状态">
                        <el-option v-for="dict in truck_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="form.remark" type="textarea" rows="5" placeholder="请输入内容" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 车辆信息详情对话框 -->
        <el-dialog :title="title" v-model="openInfo" width="800px" append-to-body>
            <el-form ref="infoRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="编号:" prop="carId">
                    <span>{{ form.carId }}</span>
                </el-form-item>
                <el-form-item label="车牌号:" prop="carNumber">
                    <span>{{ form.carNumber }}</span>
                </el-form-item>
                <el-form-item label="车型:" prop="carType">
                    <dict-tag :options="truck_type" :value="form.carType" />
                </el-form-item>
                <el-form-item label="吨位:" prop="carWeight">
                    <span>{{ form.carWeight }}</span>
                </el-form-item>
                <el-form-item label="制造日期:" prop="carCreateTime">
                    <span>{{ form.carCreateTime ? parseTime(new Date(form.carCreateTime), '{y}-{m}-{d}') : '' }}</span>
                </el-form-item>
                <el-form-item label="年检日期:" prop="carInspectionTime">
                    <span>{{ form.carInspectionTime ? parseTime(new Date(form.carInspectionTime), '{y}-{m}-{d}') : '' }}</span>
                </el-form-item>
                <el-form-item label="状态:" prop="carStatus">
                    <dict-tag :options="truck_status" :value="form.carStatus" />
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
import { listInfo, getInfo, addInfo, updateInfo, delInfo } from '@/api/truck/truckInfo'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload } from 'element-plus'
import { getToken } from '@/utils/auth'
const baseURL = import.meta.env.VITE_APP_BASE_API

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

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
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNumber: null,
        carType: null
    },
    rules: {}
})

const { queryParams, form, rules }: any = toRefs(data)

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    listInfo(queryParams.value).then((response: any) => {
        infoList.value = response.rows
        total.value = parseInt(response.total)
        loading.value = false
    })
}

// 取消按钮
const cancel = () => {
    open.value = false
    openInfo.value = false
    reset()
}

// 表单重置
const reset = () => {
    form.value = {
        id: null,
        carId: null,
        carNumber: null,
        carType: null,
        carWeight: null,
        carStatus: '0',
        carCreateTime: null,
        carInspectionTime: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
    }
    proxy.resetForm('infoRef')
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
    reset()
    const id = row.id
    getInfo(id).then((response: any) => {
        form.value = response.data
        openInfo.value = true
        title.value = '车辆信息详情'
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    reset()
    open.value = true
    title.value = '新增车辆信息'
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    reset()
    const id = row.id
    getInfo(id).then((response: any) => {
        form.value = response.data
        open.value = true
        title.value = '编辑车辆信息'
    })
}

/** 提交按钮 */
const submitForm = () => {
    proxy.$refs['infoRef'].validate((valid: any) => {
        if (valid) {
            if (form.value.id != null) {
                updateInfo(form.value).then(() => {
                    proxy.$modal.msgSuccess('修改成功')
                    open.value = false
                    getPageList()
                })
            } else {
                addInfo(form.value).then(() => {
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
        .confirm('是否确认删除车辆信息编号为"' + row.id + '"的数据项？')
        .then(() => {
            return delInfo(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess('删除成功')
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
const handleFileSuccess = (response: any, file: any, fileList: any) => {
    upload.value.open = false
    upload.isUploading = false
    cleanUploadRef()
    proxy.$alert(response.msg, '导入结果', {
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
</style>
