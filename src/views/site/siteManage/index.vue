<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="工地名称" prop="siteName">
                <el-input maxlength="100" v-model="queryParams.siteName" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['site:siteManage:add']">{{ $t('operationButtons.add.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="download" size="small" @click="handleImport" v-hasPermi="['site:siteManage:import']">{{ $t('operationButtons.import.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="upload" size="small" @click="handleExport" v-hasPermi="['site:siteManage:export']">{{ $t('operationButtons.export.label') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>

        <el-table stripe border v-loading="loading" :data="tableData">
            <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
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
            <el-table-column :label="$t('tableColumn.operation')" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['site:siteManage:info']">{{ $t('operationButtons.info.label') }}</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['site:siteManage:edit']">{{ $t('operationButtons.edit.label') }}</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['site:siteManage:delete']">{{ $t('operationButtons.delete.label') }}</el-button>
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
				:action="upload.url + '?updateSupport=' + upload.updateSupport + '&language=' + useAppStore().language"
				:disabled="upload.isUploading"
				:on-progress="handleFileUploadProgress"
				:on-success="handleFileSuccess"
				:auto-upload="false"
                v-model:file-list="fileList"
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

        <!-- 添加或修改工地对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-row justify="center" style="max-height: 600px; overflow-y: auto">
                <el-form ref="infoRef" :model="form" :rules="rules" label-width="auto">
                    <el-form-item label="工地编码:" prop="siteId">
                        <el-input maxlength="100" v-model="form.siteId" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item label="工地名称:" prop="siteName">
                        <el-input maxlength="100" v-model="form.siteName" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item label="地址:" prop="siteAddress">
                        <el-input maxlength="100" v-model="form.siteAddress" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item label="联系人:" prop="contactPerson">
                        <el-input maxlength="100" v-model="form.contactPerson" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item label="联系方式:" prop="contactPhone">
                        <el-input maxlength="100" v-model="form.contactPhone" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item label="状态:" prop="status">
                        <el-select v-model="form.status" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in site_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                        </el-select>
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

        <!-- 工地详情对话框 -->
        <el-dialog :title="title" v-model="openInfo" width="800px" append-to-body>
            <el-row justify="center" style="max-height: 600px; overflow-y: auto">
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
            </el-row>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="SiteManage" lang="ts">
import { getSiteList, getSiteInfo, addSite, updateSite, delSite } from '@/api/site/siteManage'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload, UploadUserFile } from 'element-plus'
import { getToken } from '@/utils/auth'
import { $t } from '@/lang'
import useAppStore from '@/store/modules/app'

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
        siteId: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        siteName: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        siteAddress: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        contactPerson: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        contactPhone: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        status: [{ required: true, message: $t('components.select.placeholder'), trigger: 'change' }]
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
                    proxy.$modal.msgSuccess($t('components.message.edit'))
                    open.value = false
                    getPageList()
                })
            } else {
                addSite(form.value).then(() => {
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
            return delSite(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess($t('components.message.delete.text'))
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/Site/export', { ...queryParams.value }, `${$t('menu.SiteManage')}${new Date().getTime()}.xlsx`)
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
    url: baseURL + '/truck/Site/import'
})
const fileList = ref<UploadUserFile[]>([])

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
const handleFileSuccess = (response: any, file: any, fileList: any) => {
    upload.value.open = false
    upload.value.isUploading = false
    cleanUploadRef()
    proxy.$alert(response.msg, $t('import.result'), {
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
