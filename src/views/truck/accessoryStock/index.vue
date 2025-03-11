<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="配件名称" prop="accessoryName">
                <el-input v-model="queryParams.accessoryName" placeholder="请输入" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="配件类型" prop="accessoryType">
                <el-select v-model="queryParams.accessoryType" placeholder="请选择" clearable style="width: 200px">
                    <el-option v-for="dict in accessory_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="工地名称" prop="siteId">
                <el-select v-model="queryParams.siteId" placeholder="请选择" clearable style="width: 200px">
                    <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                </el-select>
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
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['system:user:add']">入库</el-button>
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
            <el-table-column label="配件名称" align="center" prop="accessoryName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="工地名称" align="center" prop="siteName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="配件类型" align="center" prop="accessoryType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="accessory_type" :value="scope.row.accessoryType" />
                </template>
            </el-table-column>
            <el-table-column label="供应商" align="center" prop="supplier" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="货币单位" align="center" prop="monetaryUnit" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="currency_unit_type" :value="scope.row.monetaryUnit" />
                </template>
            </el-table-column>
            <el-table-column label="价格" align="center" prop="price" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="入库数量" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="剩余数量" align="center" prop="outNum" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="入库日期" align="center" prop="time" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ scope.row.time ? parseTime(new Date(scope.row.time), '{y}-{m}-{d}') : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="入库人员" align="center" prop="by" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="备注" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['system:info:edit']">详情</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:info:edit']">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['system:info:remove']">删除</el-button>
                    <el-button type="text" @click="handlePrice(scope.row)" v-hasPermi="['system:log:edit']">价格维护</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item label="配件名称:" prop="accessoryName">
                    <el-input v-model="form.accessoryName" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteId">
                    <el-select v-model="form.siteId" placeholder="请选择" clearable>
                        <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配件类型:" prop="accessoryType">
                    <el-select v-model="form.accessoryType" placeholder="请选择" clearable>
                        <el-option v-for="dict in accessory_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="供应商:" prop="supplier">
                    <el-input v-model="form.supplier" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="数量:" prop="num">
                    <el-input v-model="form.num" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="入库日期:" prop="time">
                    <el-date-picker v-model="form.time" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" clearable style="width: 300px"></el-date-picker>
                </el-form-item>
                <el-form-item label="入库人员:" prop="by">
                    <el-input v-model="form.by" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="form.remark" type="textarea" rows="5" placeholder="请输入" clearable />
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
                <el-form-item label="配件名称:" prop="accessoryName">
                    <span>{{ form.accessoryName }}</span>
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteName">
                    <span>{{ form.siteName }}</span>
                </el-form-item>
                <el-form-item label="配件类型:" prop="accessoryType">
                    <dict-tag :options="accessory_type" :value="form.accessoryType" />
                </el-form-item>
                <el-form-item label="供应商:" prop="supplier">
                    <span>{{ form.supplier }}</span>
                </el-form-item>
                <el-form-item label="货币单位:" prop="monetaryUnit">
                    <el-select v-model="form.monetaryUnit" placeholder="请选择" clearable>
                        <el-option v-for="dict in currency_unit_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格:" prop="price">
                    <el-input v-model="form.price" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="数量:" prop="num">
                    <span>{{ form.num }}</span>
                </el-form-item>
                <el-form-item label="入库日期:" prop="time">
                    <span>{{ form.time }}</span>
                </el-form-item>
                <el-form-item label="入库人员:" prop="by">
                    <span>{{ form.by }}</span>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <span>{{ form.remark }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 详情对话框 -->
        <el-drawer :title="title" size="80%" v-model="openInfo">
            <el-divider content-position="left">基本信息</el-divider>
            <table class="info-table" border="1">
                <tbody>
                    <tr>
                        <td>配件名称</td>
                        <td>{{ form.accessoryName }}</td>
                        <td>工地名称</td>
                        <td>{{ form.siteName }}</td>
                        <td>配件类型</td>
                        <td><dict-tag :options="accessory_type" :value="form.accessoryType" /></td>
                    </tr>
                    <tr>
                        <td>供应商</td>
                        <td>{{ form.supplier }}</td>
                        <td>价格</td>
                        <td>{{ form.price }}</td>
                        <td>入库人员</td>
                        <td>{{ form.by }}</td>
                    </tr>
                    <tr>
                        <td>入库数量</td>
                        <td>{{ form.num }}</td>
                        <td>剩余数量</td>
                        <td>{{ form.outNum }}</td>
                        <td>入库日期</td>
                        <td>{{ form.time }}</td>
                    </tr>
                    <tr>
                        <td>创建人</td>
                        <td>{{ form.createBy }}</td>
                        <td>创建时间</td>
                        <td>{{ form.createTime }}</td>
                        <td>备注</td>
                        <td>{{ form.remark }}</td>
                    </tr>
                </tbody>
            </table>
            <el-divider content-position="left">出库记录</el-divider>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="plus" size="small" @click="handleAddAccessoryOut" v-hasPermi="['system:user:add']">单独出库</el-button>
                </el-col>
            </el-row>
            <el-table stripe border v-loading="loading" :data="AccessoryOutData">
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column label="出库数量" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="出库日期" align="center" prop="putTime" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="出库人员" align="center" prop="putBy" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="出库类型" align="center" prop="relevance" min-width="120" show-overflow-tooltip>
                    <template #default="scope">
                        {{ scope.row.relevance == 0 ? '维修出库' : '单独出库' }}
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="handleUpdateAccessoryOut(scope.row)" v-if="scope.row.relevance == 1" v-hasPermi="['system:log:edit']">编辑</el-button>
                        <el-button type="text" @click="handleDeleteAccessoryOut(scope.row)" v-if="scope.row.relevance == 1" v-hasPermi="['system:log:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="titleAccessoryOut" v-model="openAccessoryOut" width="800px" append-to-body>
            <el-form ref="formRefAccessoryOut" :model="formAccessoryOut" :rules="rulesAccessoryOut" label-width="auto">
                <el-form-item label="数量:" prop="num">
                    <el-input v-model="formAccessoryOut.num" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="出库日期:" prop="putTime">
                    <el-date-picker v-model="formAccessoryOut.putTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" clearable style="width: 300px"></el-date-picker>
                </el-form-item>
                <el-form-item label="出库人员:" prop="putBy">
                    <el-input v-model="formAccessoryOut.putBy" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="formAccessoryOut.remark" type="textarea" rows="5" placeholder="请输入" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormAccessoryOut">确 定</el-button>
                    <el-button @click="cancelAccessoryOut">取 消</el-button>
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
import { getAccessoryStockList, getAccessoryStockInfo, addAccessoryStock, updateAccessoryStock, delAccessoryStock } from '@/api/truck/accessoryStock'
import { getAccessoryOutList, getAccessoryOutInfo, addAccessoryOut, updateAccessoryOut, delAccessoryOut } from '@/api/truck/accessoryOut'
import { getSiteList } from '@/api/site/siteManage'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload } from 'element-plus'
import { getToken } from '@/utils/auth'
const baseURL = import.meta.env.VITE_APP_BASE_API

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const formRef = ref<InstanceType<typeof ElForm>>()

const formRefAccessoryOut = ref<InstanceType<typeof ElForm>>()

const { accessory_type, currency_unit_type } = proxy.useDict('accessory_type', 'currency_unit_type')

const tableData = ref([])
const open = ref(false)
const openPrice = ref(false)
const openInfo = ref(false)
const openAccessoryOut = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')
const titleAccessoryOut = ref('')

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        accessoryName: null,
        accessoryType: null,
        siteId: null,
        startTime: null,
        endTime: null
    },
    form: {
        id: null,
        accessoryName: null,
        siteId: null,
        accessoryType: null,
        supplier: null,
        monetaryUnit: null,
        price: null,
        num: null,
        time: null,
        by: null
    },
    rules: {
        accessoryName: [{ required: true, message: '请输入', trigger: 'blur' }],
        siteId: [{ required: true, message: '请选择', trigger: 'blur' }],
        accessoryType: [{ required: true, message: '请选择', trigger: 'blur' }],
        supplier: [{ required: true, message: '请输入', trigger: 'blur' }],
        monetaryUnit: [{ required: true, message: '请输入', trigger: 'blur' }],
        price: [{ required: true, message: '请输入', trigger: 'blur' }],
        num: [{ required: true, message: '请输入', trigger: 'blur' }],
        time: [{ required: true, message: '请选择', trigger: 'blur' }],
        by: [{ required: true, message: '请输入', trigger: 'blur' }]
    }
})

const { queryParams, form, rules }: any = toRefs(data)

const dataAccessoryOut = reactive({
    formAccessoryOut: {
        id: null,
        accessoryType: null,
        accessoryId: null,
        accessoryName: null,
        num: null,
        putTime: null,
        putBy: null,
        remark: null
    },
    rulesAccessoryOut: {
        num: [{ required: true, message: '请输入', trigger: 'blur' }],
        putTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        putBy: [{ required: true, message: '请输入', trigger: 'blur' }]
    }
})

const { formAccessoryOut, rulesAccessoryOut }: any = toRefs(dataAccessoryOut)

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    getAccessoryStockList(queryParams.value).then((res: any) => {
        tableData.value = res.rows
        total.value = parseInt(res.total)
        loading.value = false
    })
}

const siteOptions = ref([]) as any

const getSiteOptions = () => {
    getSiteList({}).then((res: any) => {
        siteOptions.value = res.rows
    })
}

getSiteOptions()

const AccessoryOutData = ref([]) as any

const getAccessoryOutData = (accessoryId: any) => {
    getAccessoryOutList({ accessoryId }).then((res: any) => {
        AccessoryOutData.value = res.rows
    })
}

// 取消按钮
const cancel = () => {
    open.value = false
    openInfo.value = false
    openPrice.value = false
    formRef.value?.resetFields()
}

const cancelAccessoryOut = () => {
    openAccessoryOut.value = false
    formRefAccessoryOut.value?.resetFields()
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
    title.value = '详情'
    formRef.value?.resetFields()
    const id = row.id
    getAccessoryOutData(row.id)
    getAccessoryStockInfo(id).then((res: any) => {
        form.value = res.data
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    open.value = true
    title.value = '新增'
    formRef.value?.resetFields()
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    open.value = true
    title.value = '编辑'
    formRef.value?.resetFields()
    const id = row.id
    getAccessoryStockInfo(id).then((res: any) => {
        form.value = res.data
    })
}

/** 价格维护按钮操作 */
const handlePrice = (row: any) => {
    openPrice.value = true
    title.value = '价格维护'
    formRef.value?.resetFields()
    const id = row.id
    getAccessoryStockInfo(id).then((res: any) => {
        form.value = res.data
    })
}

/** 提交按钮 */
const submitForm = () => {
    proxy.$refs['formRef'].validate((valid: any) => {
        if (valid) {
            if (form.value.siteId) {
                const result = siteOptions.value.filter((item: any) => item.siteId == form.value.siteId)
                form.value.siteName = result.length > 0 ? result[0].siteName : ''
            }
            if (form.value.id != null) {
                updateAccessoryStock(form.value).then(() => {
                    proxy.$modal.msgSuccess('修改成功')
                    open.value = false
                    openPrice.value = false
                    getPageList()
                })
            } else {
                addAccessoryStock(form.value).then(() => {
                    proxy.$modal.msgSuccess('新增成功')
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
        .confirm('是否确认删除此数据项？')
        .then(() => {
            return delAccessoryStock(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
}

/** 详情-新增配件使用 */
const handleAddAccessoryOut = () => {
    openAccessoryOut.value = true
    titleAccessoryOut.value = '出库'
    formAccessoryOut.value = {
        accessoryType: form.value.accessoryType,
        accessoryId: form.value.id,
        accessoryName: form.value.accessoryName
    }
}

/** 详情-更新配件使用 */
const handleUpdateAccessoryOut = (row: any) => {
    openAccessoryOut.value = true
    titleAccessoryOut.value = '编辑'
    formRefAccessoryOut.value?.resetFields()
    const id = row.id
    getAccessoryOutInfo(id).then((res) => {
        Object.keys(formAccessoryOut.value).forEach((item) => {
            formAccessoryOut.value[item] = res.data[item]
        })
    })
}

/** 详情-提交按钮 */
const submitFormAccessoryOut = () => {
    proxy.$refs['formRefAccessoryOut'].validate((valid: any) => {
        if (valid) {
            if (formAccessoryOut.value.id != null) {
                updateAccessoryOut({ ...formAccessoryOut.value, relevance: 1 }).then(() => {
                    proxy.$modal.msgSuccess('修改成功')
                    openAccessoryOut.value = false
                    getAccessoryOutData(formAccessoryOut.value.accessoryId)
                })
            } else {
                addAccessoryOut({ ...formAccessoryOut.value, relevance: 1 }).then(() => {
                    proxy.$modal.msgSuccess('新增成功')
                    openAccessoryOut.value = false
                    getAccessoryOutData(formAccessoryOut.value.accessoryId)
                })
            }
        }
    })
}

/** 详情-删除按钮 */
const handleDeleteAccessoryOut = (row: any) => {
    proxy.$modal
        .confirm('是否确认删除此数据项？')
        .then(() => {
            return delAccessoryOut(row.id)
        })
        .then(() => {
            getAccessoryOutData(formAccessoryOut.value.accessoryId)
            proxy.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/Accessory/export', {}, `info_${new Date().getTime()}.xlsx`)
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
    url: baseURL + '/truck/Accessory/import'
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

.info-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
        border: 1px solid #ebeef5;
        padding: 8px;
        text-align: center;
        color: #606266;
        font-size: 14px;

        &:nth-child(odd) {
            background: #f8f8f9;
            min-width: 10%;
        }

        &:nth-child(even) {
            min-width: calc(70% / 3);
        }
    }
}
</style>
