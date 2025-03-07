<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="工地名称" prop="siteName">
                <el-input v-model="queryParams.siteName" placeholder="请输入" clearable style="width: 200px" @keyup.enter="handleQuery" />
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

        <el-table stripe border v-loading="loading" :data="tableData">
            <el-table-column type="index" width="80" label="序号" align="center" />
            <el-table-column label="工地编码" align="center" prop="siteId" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="工地名称" align="center" prop="siteName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="地址" align="center" prop="siteAddress" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="联系人" align="center" prop="contactPerson" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="联系方式" align="center" prop="contactPhone" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" align="center" prop="status" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="site_status" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['system:info:edit']">详情</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:info:edit']">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['system:info:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />

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

        <!-- 添加或修改工地对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-form ref="infoRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="工地编码:" prop="siteId">
                    <el-input v-model="form.siteId" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteName">
                    <el-input v-model="form.siteName" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="地址:" prop="siteAddress">
                    <el-input v-model="form.siteAddress" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="联系人:" prop="contactPerson">
                    <el-input v-model="form.contactPerson" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="联系方式:" prop="contactPhone">
                    <el-input v-model="form.contactPhone" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="状态:" prop="status">
                    <el-select v-model="form.status" placeholder="请选择" clearable>
                        <el-option v-for="dict in site_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 工地详情对话框 -->
        <el-dialog :title="title" v-model="openInfo" width="800px" append-to-body>
            <el-form ref="infoRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="工地编码:" prop="siteId">
                    <span>{{ form.siteId }}</span>
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteName">
                    <span>{{ form.siteName }}</span>
                </el-form-item>
                <el-form-item label="地址:" prop="siteAddress">
                    <span>{{ form.siteAddress }}</span>
                </el-form-item>
                <el-form-item label="联系人:" prop="contactPerson">
                    <span>{{ form.contactPerson }}</span>
                </el-form-item>
                <el-form-item label="联系方式:" prop="contactPhone">
                    <span>{{ form.contactPhone }}</span>
                </el-form-item>
                <el-form-item label="状态:" prop="status">
                    <dict-tag :options="site_status" :value="form.status" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="Info" lang="ts">
import { getSiteList, getSiteInfo, addSite, updateSite, delSite } from '@/api/site/siteManage'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload } from 'element-plus'
import { getToken } from '@/utils/auth'
const baseURL = import.meta.env.VITE_APP_BASE_API

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const { site_status } = proxy.useDict('site_status')

const tableData = ref([])
const open = ref(false)
const openInfo = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const title = ref('')

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteName: null
    },
    form: {},
    rules: {
        siteId: [{ required: true, message: '请输入', trigger: 'blur' }],
        siteName: [{ required: true, message: '请输入', trigger: 'blur' }],
        siteAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
        contactPerson: [{ required: true, message: '请输入', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '请输入', trigger: 'blur' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }]
    }
})

const { queryParams, form, rules }: any = toRefs(data)

/** 查询工地列表 */
const getPageList = () => {
    loading.value = true
    getSiteList(queryParams.value).then((response: any) => {
        tableData.value = response.rows
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
        siteId: null,
        siteName: null,
        siteAddress: null,
        contactPerson: null,
        contactPhone: null,
        status: '0'
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

/** 详情按钮操作 */
const handleInfo = (row: any) => {
    reset()
    const id = row.id
    getSiteInfo(id).then((response: any) => {
        form.value = response.data
        openInfo.value = true
        title.value = '工地详情'
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    reset()
    open.value = true
    title.value = '新增工地'
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    reset()
    const id = row.id
    getSiteInfo(id).then((response: any) => {
        form.value = response.data
        open.value = true
        title.value = '编辑工地'
    })
}

/** 提交按钮 */
const submitForm = () => {
    proxy.$refs['infoRef'].validate((valid: any) => {
        if (valid) {
            if (form.value.id != null) {
                updateSite(form.value).then(() => {
                    proxy.$modal.msgSuccess('修改成功')
                    open.value = false
                    getPageList()
                })
            } else {
                addSite(form.value).then(() => {
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
            return delSite(row.id)
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
    upload.value.isUploading = false
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
