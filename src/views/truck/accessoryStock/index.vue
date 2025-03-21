<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item :label="$t('accessoryStock.searchBar.partName.label')" prop="accessoryName">
                <el-input maxlength="100" v-model="queryParams.accessoryName" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('accessoryStock.searchBar.partType.label')" prop="accessoryType">
                <el-select v-model="queryParams.accessoryType" :placeholder="$t('components.select.placeholder')" clearable style="width: 200px">
                    <el-option v-for="dict in accessory_type" :key="dict.value" :label="useAppStore().language == 'zh' ? dict.label : dict.labelEn" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('accessoryStock.searchBar.constructionSiteName.label')" prop="siteId">
                <el-select v-model="queryParams.siteId" :placeholder="$t('components.select.placeholder')" clearable style="width: 200px">
                    <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('accessoryStock.searchBar.startDate.label')" prop="startTime">
                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" :disabled-date="disabledStartDate" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('accessoryStock.searchBar.endDate.label')" prop="endTime">
                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" :disabled-date="disabledEndDate" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['truck:accessoryStock:add']">{{ $t('operationButtons.entry.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="download" size="small" @click="handleImport" v-hasPermi="['truck:accessoryStock:import']">{{ $t('operationButtons.import.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="upload" size="small" @click="handleExport" v-hasPermi="['truck:accessoryStock:export']">{{ $t('operationButtons.export.label') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>

        <el-table stripe border v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
            <el-table-column :label="$t('accessoryStock.tableColumn[0].label')" align="center" prop="accessoryName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[1].label')" align="center" prop="siteName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[2].label')" align="center" prop="accessoryType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="accessory_type" :value="scope.row.accessoryType" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[3].label')" align="center" prop="supplier" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[4].label')" align="center" prop="monetaryUnit" min-width="120" show-overflow-tooltip v-hasRole="['superAdmin', 'admin']">
                <template #default="scope">
                    <dict-tag :options="currency_unit_type" :value="scope.row.monetaryUnit" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[5].label')" align="center" prop="price" min-width="120" show-overflow-tooltip v-hasRole="['superAdmin', 'admin']"></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[6].label')" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[7].label')" align="center" prop="outNum" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[8].label')" align="center" prop="time" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ scope.row.time ? parseTime(new Date(scope.row.time), '{y}-{m}-{d}') : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[9].label')" align="center" prop="by" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[10].label')" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[11].label')" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('accessoryStock.tableColumn[12].label')" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('tableColumn.operation')" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['truck:accessoryStock:info']">{{ $t('operationButtons.info.label') }}</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['truck:accessoryStock:edit']">{{ $t('operationButtons.edit.label') }}</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['truck:accessoryStock:delete']">{{ $t('operationButtons.delete.label') }}</el-button>
                    <el-button type="text" @click="handlePrice(scope.row)" v-hasPermi="['truck:accessoryStock:price']">{{ $t('operationButtons.price.label') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-row justify="center" style="max-height: 600px; overflow-y: auto">
                <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" scroll-to-error>
                    <el-form-item :label="$t('accessoryStock.fields[0].label')" prop="accessoryName">
                        <el-input maxlength="100" v-model="form.accessoryName" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[1].label')" prop="siteId">
                        <el-select v-model="form.siteId" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[2].label')" prop="accessoryType">
                        <el-select v-model="form.accessoryType" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in accessory_type" :key="dict.value" :label="useAppStore().language == 'zh' ? dict.label : dict.labelEn" :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[3].label')" prop="supplier">
                        <el-input maxlength="100" v-model="form.supplier" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[4].label')" prop="num">
                        <el-input maxlength="100" v-model="form.num" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[5].label')" prop="time">
                        <el-date-picker v-model="form.time" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')" clearable style="width: 300px"></el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[6].label')" prop="by">
                        <el-input maxlength="100" v-model="form.by" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[7].label')" prop="remark">
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

        <!-- 价格维护对话框 -->
        <el-dialog :title="title" v-model="openPrice" width="800px" append-to-body>
            <el-row justify="center" style="max-height: 600px; overflow-y: auto">
                <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" scroll-to-error>
                    <el-form-item :label="$t('accessoryStock.fields[0].label')" prop="accessoryName">
                        <span>{{ form.accessoryName }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[1].label')" prop="siteName">
                        <span>{{ form.siteName }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[2].label')" prop="accessoryType">
                        <dict-tag :options="accessory_type" :value="form.accessoryType" />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[3].label')" prop="supplier">
                        <span>{{ form.supplier }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[8].label')" prop="monetaryUnit">
                        <el-select v-model="form.monetaryUnit" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in currency_unit_type" :key="dict.value" :label="useAppStore().language == 'zh' ? dict.label : dict.labelEn" :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[9].label')" prop="price">
                        <el-input maxlength="100" v-model="form.price" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[4].label')" prop="num">
                        <span>{{ form.num }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[5].label')" prop="time">
                        <span>{{ form.time }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[6].label')" prop="by">
                        <span>{{ form.by }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.fields[7].label')" prop="remark">
                        <span>{{ form.remark }}</span>
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
        <el-drawer :title="title" size="80%" v-model="openInfo">
            <el-divider content-position="left">{{ $t('accessoryStock.basicInfo.title') }}</el-divider>
            <table class="info-table" border="1">
                <tbody>
                    <tr>
                        <td>{{ $t('accessoryStock.basicInfo.partName') }}</td>
                        <td>{{ form.accessoryName }}</td>
                        <td>{{ $t('accessoryStock.basicInfo.constructionSiteName') }}</td>
                        <td>{{ form.siteName }}</td>
                        <td>{{ $t('accessoryStock.basicInfo.partType') }}</td>
                        <td><dict-tag :options="accessory_type" :value="form.accessoryType" /></td>
                    </tr>
                    <tr>
                        <td>{{ $t('accessoryStock.basicInfo.supplier') }}</td>
                        <td>{{ form.supplier }}</td>
                        <td>{{ $t('accessoryStock.basicInfo.price') }}</td>
                        <td>{{ form.price }}</td>
                        <td>{{ $t('accessoryStock.basicInfo.inStockStaff') }}</td>
                        <td>{{ form.by }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('accessoryStock.basicInfo.inStockQuantity') }}</td>
                        <td>{{ form.num }}</td>
                        <td>{{ $t('accessoryStock.basicInfo.remainingQuantity') }}</td>
                        <td>{{ form.outNum }}</td>
                        <td>{{ $t('accessoryStock.basicInfo.inStockDate') }}</td>
                        <td>{{ form.time }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('accessoryStock.basicInfo.creator') }}</td>
                        <td>{{ form.createBy }}</td>
                        <td>{{ $t('accessoryStock.basicInfo.creationTime') }}</td>
                        <td>{{ form.createTime }}</td>
                        <td>{{ $t('accessoryStock.basicInfo.remark') }}</td>
                        <td>{{ form.remark }}</td>
                    </tr>
                </tbody>
            </table>
            <el-divider content-position="left">{{ $t('accessoryStock.outboundRecords.title') }}</el-divider>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="plus" size="small" @click="handleAddAccessoryOut" v-hasPermi="['truck:accessoryStock:outStock']">{{ $t('components.btn.outButton') }}</el-button>
                </el-col>
            </el-row>
            <el-table stripe border v-loading="loading" :data="AccessoryOutData">
                <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
                <el-table-column :label="$t('accessoryStock.outboundRecords.tableColumn[0].label')" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('accessoryStock.outboundRecords.tableColumn[1].label')" align="center" prop="putTime" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('accessoryStock.outboundRecords.tableColumn[2].label')" align="center" prop="putBy" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('accessoryStock.outboundRecords.tableColumn[3].label')" align="center" prop="relevance" min-width="120" show-overflow-tooltip>
                    <template #default="scope">
                        {{ scope.row.relevance == 0 ? $t('accessoryStock.outboundRecords.tableColumn[3].options[0]') : $t('accessoryStock.outboundRecords.tableColumn[3].options[1]') }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('accessoryStock.outboundRecords.tableColumn[4].label')" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('accessoryStock.outboundRecords.tableColumn[5].label')" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('accessoryStock.outboundRecords.tableColumn[6].label')" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('tableColumn.operation')" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="handleUpdateAccessoryOut(scope.row)" v-if="scope.row.relevance == 1" v-hasPermi="['truck:accessoryStock:infoEdit']">{{ $t('operationButtons.edit.label') }}</el-button>
                        <el-button type="text" @click="handleDeleteAccessoryOut(scope.row)" v-if="scope.row.relevance == 1" v-hasPermi="['truck:accessoryStock:infoDelete']">{{ $t('operationButtons.delete.label') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="titleAccessoryOut" v-model="openAccessoryOut" width="800px" append-to-body>
            <el-row justify="center" style="max-height: 600px; overflow-y: auto" scroll-to-error>
                <el-form ref="formRefAccessoryOut" :model="formAccessoryOut" :rules="rulesAccessoryOut" label-width="auto">
                    <el-form-item :label="$t('accessoryStock.outboundRecords.fields[0].label')" prop="num">
                        <el-input maxlength="100" v-model="formAccessoryOut.num" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.outboundRecords.fields[1].label')" prop="putTime">
                        <el-date-picker v-model="formAccessoryOut.putTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')" clearable style="width: 300px"></el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.outboundRecords.fields[2].label')" prop="putBy">
                        <el-input maxlength="100" v-model="formAccessoryOut.putBy" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryStock.outboundRecords.fields[3].label')" prop="remark">
                        <el-input maxlength="200" v-model="formAccessoryOut.remark" type="textarea" :rows="5" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                </el-form>
            </el-row>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormAccessoryOut">{{ $t('components.btn.confirmButton') }}</el-button>
                    <el-button @click="cancelAccessoryOut">{{ $t('components.btn.cancelButton') }}</el-button>
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
    </div>
</template>

<script setup name="AccessoryStock" lang="ts">
import { getAccessoryStockList, getAccessoryStockInfo, addAccessoryStock, updateAccessoryStock, delAccessoryStock } from '@/api/truck/accessoryStock'
import { getAccessoryOutList, getAccessoryOutInfo, addAccessoryOut, updateAccessoryOut, delAccessoryOut } from '@/api/truck/accessoryOut'
import { getSiteList } from '@/api/site/siteManage'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload, UploadUserFile } from 'element-plus'
import { getToken } from '@/utils/auth'
import { $t } from '@/lang'
import useAppStore from '@/store/modules/app'

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
        accessoryName: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        siteId: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        accessoryType: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        supplier: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        monetaryUnit: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        price: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        num: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        time: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        by: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }]
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
        num: [
            { required: true, message: $t('components.input.placeholder'), trigger: 'blur' },
            {
                validator: (rule: any, value: any, callback: any) => {
                    if (value - 0 > form.value.outNum - 0) {
                        callback(new Error($t('components.validator.inventoryInsufficient')))
                    } else {
                        callback()
                    }
                }
            }
        ],
        putTime: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        putBy: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }]
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

const disabledStartDate = (time: any) => {
    if (queryParams.value.endTime) {
        return time.getTime() > new Date(queryParams.value.endTime).getTime()
    }
    return false
}

const disabledEndDate = (time: any) => {
    if (queryParams.value.startTime) {
        return time.getTime() < new Date(queryParams.value.startTime).getTime() - 8.64e7
    }
    return false
}

const siteOptions = ref([]) as any

const getSiteOptions = () => {
    getSiteList({ status: 0 }).then((res: any) => {
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
    title.value = $t('dialog.infoTitle')
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
    getAccessoryStockInfo(id).then((res: any) => {
        form.value = res.data
    })
}

/** 价格维护按钮操作 */
const handlePrice = (row: any) => {
    openPrice.value = true
    title.value = $t('dialog.priceTitle')
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
                    proxy.$modal.msgSuccess($t('components.message.edit'))
                    open.value = false
                    openPrice.value = false
                    getPageList()
                })
            } else {
                addAccessoryStock(form.value).then(() => {
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
            return delAccessoryStock(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess($t('components.message.delete.text'))
        })
        .catch(() => {})
}

/** 详情-新增配件使用 */
const handleAddAccessoryOut = () => {
    openAccessoryOut.value = true
    titleAccessoryOut.value = $t('dialog.addTitle')
    formAccessoryOut.value = {
        id: null,
        accessoryType: form.value.accessoryType,
        accessoryId: form.value.id,
        accessoryName: form.value.accessoryName
    }
}

/** 详情-更新配件使用 */
const handleUpdateAccessoryOut = (row: any) => {
    openAccessoryOut.value = true
    titleAccessoryOut.value = $t('dialog.editTitle')
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
                    proxy.$modal.msgSuccess($t('components.message.edit'))
                    openAccessoryOut.value = false
                    getAccessoryOutData(formAccessoryOut.value.accessoryId)
                    getAccessoryStockInfo(form.value.id).then((res: any) => {
                        form.value = res.data
                    })
                })
            } else {
                addAccessoryOut({ ...formAccessoryOut.value, relevance: 1 }).then(() => {
                    proxy.$modal.msgSuccess($t('components.message.add'))
                    openAccessoryOut.value = false
                    getAccessoryOutData(formAccessoryOut.value.accessoryId)
                    getAccessoryStockInfo(form.value.id).then((res: any) => {
                        form.value = res.data
                    })
                })
            }
        }
    })
}

/** 详情-删除按钮 */
const handleDeleteAccessoryOut = (row: any) => {
    proxy.$modal
        .confirm($t('components.message.delete.content'), {
            confirmButtonText: $t('components.btn.confirmButton'),
            cancelButtonText: $t('components.btn.cancelButton')
        })
        .then(() => {
            return delAccessoryOut(row.id)
        })
        .then(() => {
            getAccessoryOutData(formAccessoryOut.value.accessoryId)
            getAccessoryStockInfo(form.value.id).then((res: any) => {
                form.value = res.data
            })
            proxy.$modal.msgSuccess($t('components.message.delete.text'))
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/Accessory/export', { ...queryParams.value, ids: ids.value.join(',') }, `${$t('menu.AccessoryStock')}${new Date().getTime()}.xlsx`)
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

.info-table {
    width: 100%;
    border-collapse: collapse;

    td {
        border: 1px solid #ebeef5;
        padding: 8px;
        text-align: center;
        color: #606266;
        font-size: 14px;

        &:nth-child(odd) {
            width: 10%;
            max-width: 10%;
            background: #f8f8f9;
        }

        &:nth-child(even) {
            width: calc(70% / 3);
            max-width: calc(70% / 3);
        }
    }
}
</style>
