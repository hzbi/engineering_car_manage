<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item label="卡车编号" prop="carId">
                <el-input v-model="queryParams.carId" placeholder="请输入" clearable style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="工地名称" prop="siteName">
                <el-select v-model="queryParams.siteId" placeholder="请选择" clearable style="width: 200px" @keyup.enter.native="handleQuery">
                    <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                </el-select>
            </el-form-item>
            <el-form-item label="维护类型" prop="maintenanceType">
                <el-select v-model="queryParams.maintenanceType" placeholder="请选择" clearable style="width: 200px" @keyup.enter.native="handleQuery">
                    <el-option v-for="dict in maintenance_type" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-table-column label="日期" align="center" prop="maintenanceTime" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ parseTime(scope.row.maintenanceTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="卡车编号" align="center" prop="carId" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="工地名称" align="center" prop="siteName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="维护类型" align="center" prop="maintenanceType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="maintenance_type" :value="scope.row.maintenanceType" />
                </template>
            </el-table-column>
            <el-table-column label="油耗" align="center" prop="oilConsumption" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="公里数" align="center" prop="kilometres" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="详细说明" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="货币单位" align="center" prop="monetaryUnit" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="currency_unit_type" :value="scope.row.monetaryUnit" />
                </template>
            </el-table-column>
            <el-table-column label="花费" align="center" prop="amount" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="维修商" align="center" prop="maintenanceProvider" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ scope.row.maintenanceMode == 1 ? scope.row.maintenanceProvider : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="保养人员" align="center" prop="maintenanceProvider" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ scope.row.maintenanceMode == 0 ? scope.row.maintenanceProvider : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="下次维护日期" align="center" prop="nextTime" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ parseTime(scope.row.nextTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
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
                    <el-date-picker clearable v-model="form.maintenanceTime" type="date" value-format="YYYY-MM-DD" placeholder="选择时间" style="width: 300px"></el-date-picker>
                </el-form-item>
                <el-form-item label="卡车编号:" prop="carId">
                    <el-select v-model="form.carId" placeholder="请选择" clearable>
                        <el-option v-for="dict in truckOptions" :key="dict.carId" :label="dict.carId" :value="dict.carId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteId">
                    <el-select v-model="form.siteId" placeholder="请选择" clearable>
                        <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="维护类型:" prop="maintenanceType">
                    <el-select v-model="form.maintenanceType" placeholder="请选择" clearable>
                        <el-option v-for="dict in maintenance_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="油耗:" prop="oilConsumption">
                    <el-input v-model="form.oilConsumption" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="公里数:" prop="kilometres">
                    <el-input v-model="form.kilometres" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="详细说明:" prop="remark">
                    <el-input v-model="form.remark" type="textarea" rows="5" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="维修方式:" prop="maintenanceMode">
                    <el-radio-group v-model="form.maintenanceMode">
                        <el-radio label="0">内部人员维修</el-radio>
                        <el-radio label="1">外部维修商维修</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.maintenanceMode == 0">
                    <el-form-item label="保养人员:" prop="maintenanceProvider">
                        <el-input v-model="form.maintenanceProvider" placeholder="请输入" clearable />
                    </el-form-item>
                </template>
                <template v-if="form.maintenanceMode == 1">
                    <el-form-item label="维修商:" prop="maintenanceProvider">
                        <el-input v-model="form.maintenanceProvider" placeholder="请输入" clearable />
                    </el-form-item>
                </template>
                <el-form-item label="下次维护日期:" prop="nextTime">
                    <el-date-picker clearable v-model="form.nextTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 300px"></el-date-picker>
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
                <el-form-item label="货币单位:" prop="monetaryUnit">
                    <el-select v-model="form.monetaryUnit" placeholder="请选择" clearable>
                        <el-option v-for="dict in currency_unit_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="花费:" prop="amount">
                    <el-input v-model="form.amount" placeholder="请输入" clearable />
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
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="plus" size="small" @click="handleAddAccessoryUse" v-hasPermi="['system:user:add']">新增</el-button>
                </el-col>
            </el-row>
            <el-table stripe border v-loading="loading" :data="accessoryUseData">
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column label="配件类型" align="center" prop="accessoryType" min-width="120" show-overflow-tooltip>
                    <template #default="scope">
                        <dict-tag :options="accessory_type" :value="scope.row.accessoryType" min-width="120" show-overflow-tooltip />
                    </template>
                </el-table-column>
                <el-table-column label="配件名称" align="center" prop="accessoryName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="数量" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="用途" align="center" prop="useing" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="供应商" align="center" prop="supplier" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="handleUpdateAccessoryUse(scope.row)" v-hasPermi="['system:log:edit']">编辑</el-button>
                        <el-button type="text" @click="handleDeleteAccessoryUse(scope.row)" v-hasPermi="['system:log:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>

        <!-- 添加或修改配件使用对话框 -->
        <el-dialog :title="titleAccessoryUse" v-model="openAccessoryUse" width="800px" append-to-body>
            <el-form ref="formRefAccessoryUse" :model="formAccessoryUse" :rules="rulesAccessoryUse" label-width="auto">
                <el-form-item label="日期:" prop="maintenanceTime">
                    {{ formAccessoryUse.maintenanceTime ? parseTime(new Date(form.maintenanceTime), '{y}-{m}-{d}') : '' }}
                </el-form-item>
                <el-form-item label="工地名称:" prop="siteName">
                    {{ formAccessoryUse.siteName }}
                </el-form-item>
                <el-form-item label="卡车编号:" prop="carId">
                    {{ formAccessoryUse.carId }}
                </el-form-item>
                <el-form-item label="配件类型:" prop="accessoryType">
                    <el-select v-model="formAccessoryUse.accessoryType" placeholder="请选择" @change="handleChangeAccessoryType" clearable>
                        <el-option v-for="dict in accessory_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配件名称:" prop="accessoryId">
                    <el-select v-model="formAccessoryUse.accessoryId" placeholder="请选择" @change="handleChangeAccessoryId" clearable>
                        <el-option v-for="dict in accessoryStockOptions" :key="dict.id" :label="dict.accessoryName" :value="dict.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="供应商:" prop="supplier">
                    <el-input v-model="formAccessoryUse.supplier" placeholder="请输入" disabled clearable />
                </el-form-item>
                <el-form-item label="数量:" prop="num">
                    <el-input v-model="formAccessoryUse.num" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="用途:" prop="useing">
                    <el-input v-model="formAccessoryUse.useing" type="textarea" rows="5" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="formAccessoryUse.remark" type="textarea" rows="5" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="出库人员:" prop="putBy">
                    <el-input v-model="formAccessoryUse.putBy" placeholder="请输入" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormAccessoryUse">确 定</el-button>
                    <el-button @click="cancelAccessoryUse">取 消</el-button>
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

<script setup name="Maintenance" lang="ts">
import { getMaintainRecordsList, getMaintainRecordsInfo, addMaintainRecords, updateMaintainRecords, delMaintainRecords } from '@/api/truck/maintainRecords'
import { getSiteList } from '@/api/site/siteManage'
import { getTruckList } from '@/api/truck/truckInfo'
import { getAccessoryStockList } from '@/api/truck/accessoryStock'
import { getAccessoryUseList, getAccessoryUseInfo, addAccessoryUse, updateAccessoryUse, delAccessoryUse } from '@/api/truck/accessoryUse'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload } from 'element-plus'
import { getToken } from '@/utils/auth'
const baseURL = import.meta.env.VITE_APP_BASE_API

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const formRef = ref<InstanceType<typeof ElForm>>()

const formRefAccessoryUse = ref<InstanceType<typeof ElForm>>()

const { maintenance_type, accessory_type, currency_unit_type } = proxy.useDict('maintenance_type', 'accessory_type', 'currency_unit_type')

const maintenanceList = ref([])
const open = ref(false)
const openPrice = ref(false)
const openInfo = ref(false)
const openAccessoryUse = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')
const titleAccessoryUse = ref('')

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        carId: null,
        siteId: null,
        maintenanceType: null,
        startTime: null,
        endTime: null
    },
    form: {
        id: null,
        maintenanceTime: null,
        carId: null,
        siteId: null,
        siteName: null,
        maintenanceType: null,
        oilConsumption: null,
        kilometres: null,
        maintenanceMode: null,
        maintenanceProvider: null,
        nextTime: null,
        monetaryUnit: null,
        amount: null,
        remark: null
    },
    rules: {
        maintenanceTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        carId: [{ required: true, message: '请选择', trigger: 'blur' }],
        siteId: [{ required: true, message: '请选择', trigger: 'blur' }],
        maintenanceType: [{ required: true, message: '请输入', trigger: 'blur' }],
        oilConsumption: [{ required: true, message: '请输入', trigger: 'blur' }],
        kilometres: [{ required: true, message: '请输入', trigger: 'blur' }],
        maintenanceMode: [{ required: true, message: '请选择', trigger: 'blur' }],
        maintenanceProvider: [{ required: true, message: '请输入', trigger: 'blur' }],
        monetaryUnit: [{ required: true, message: '请输入', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入', trigger: 'blur' }]
    }
})

const { queryParams, form, rules }: any = toRefs(data)

const dataAccessoryUse = reactive({
    formAccessoryUse: {
        id: null,
        maintenanceId: null,
        maintenanceTime: null,
        siteId: null,
        siteName: null,
        carId: null,
        accessoryType: null,
        accessoryId: null,
        accessoryName: null,
        supplier: null,
        num: null,
        useing: null,
        remark: null,
        putBy: null,
        putTime: null
    },
    rulesAccessoryUse: {
        maintenanceTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        siteName: [{ required: true, message: '请输入', trigger: 'blur' }],
        carId: [{ required: true, message: '请输入', trigger: 'blur' }],
        accessoryType: [{ required: true, message: '请选择', trigger: 'blur' }],
        accessoryId: [{ required: true, message: '请选择', trigger: 'blur' }],
        supplier: [{ required: true, message: '请输入', trigger: 'blur' }],
        num: [{ required: true, message: '请输入', trigger: 'blur' }],
        putBy: [{ required: true, message: '请输入', trigger: 'blur' }]
    }
})

const { formAccessoryUse, rulesAccessoryUse }: any = toRefs(dataAccessoryUse)

/** 查询维护记录管理列表 */
const getPageList = () => {
    loading.value = true
    getMaintainRecordsList(queryParams.value).then((res: any) => {
        maintenanceList.value = res.rows
        total.value = parseInt(res.total)
        loading.value = false
    })
}

const truckOptions = ref([]) as any

const getTruckOption = () => {
    getTruckList({}).then((res: any) => {
        truckOptions.value = res.rows
    })
}

const siteOptions = ref([]) as any

const getSiteOptions = () => {
    getSiteList({}).then((res: any) => {
        siteOptions.value = res.rows
    })
}

getSiteOptions()

const accessoryStockOptions = ref([]) as any

const getAccessoryStockOptions = (value: any) => {
    getAccessoryStockList({ accessoryType: value }).then((res: any) => {
        accessoryStockOptions.value = res.rows
    })
}

getSiteOptions()

const accessoryUseData = ref([]) as any

const getAccessoryUseData = (carId: any) => {
    getAccessoryUseList({ carId }).then((res: any) => {
        accessoryUseData.value = res.rows
    })
}

// 取消按钮
const cancel = () => {
    open.value = false
    openPrice.value = false
    openInfo.value = false
    formRef.value?.resetFields()
}

const cancelAccessoryUse = () => {
    openAccessoryUse.value = false
    formRefAccessoryUse.value?.resetFields()
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
    openInfo.value = true
    title.value = '详情'
    formRef.value?.resetFields()
    const id = row.id
    getAccessoryUseData(row.carId)
    getMaintainRecordsInfo(id).then((res) => {
        form.value = res.data
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    open.value = true
    title.value = '新增'
    formRef.value?.resetFields()
    getTruckOption()
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    open.value = true
    title.value = '编辑'
    formRef.value?.resetFields()
    const id = row.id
    getTruckOption()
    getMaintainRecordsInfo(id).then((res) => {
        form.value = res.data
    })
}

/** 价格维护按钮操作 */
const handlePrice = (row: any) => {
    openPrice.value = true
    title.value = '价格维护'
    formRef.value?.resetFields()
    const id = row.id
    getTruckOption()
    getMaintainRecordsInfo(id).then((res) => {
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
                updateMaintainRecords(form.value).then(() => {
                    proxy.$modal.msgSuccess('修改成功')
                    open.value = false
                    openPrice.value = false
                    getPageList()
                })
            } else {
                addMaintainRecords(form.value).then(() => {
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
            return delMaintainRecords(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
}

/** 详情-新增配件使用 */
const handleAddAccessoryUse = () => {
    openAccessoryUse.value = true
    titleAccessoryUse.value = '新增'
    formAccessoryUse.value = {
        putTime: form.value.maintenanceTime,
        maintenanceId: form.value.id,
        maintenanceTime: form.value.maintenanceTime,
        siteId: form.value.siteId,
        siteName: form.value.siteName,
        carId: form.value.carId
    }
}

/** 详情-更新配件使用 */
const handleUpdateAccessoryUse = (row: any) => {
    openAccessoryUse.value = true
    titleAccessoryUse.value = '编辑'
    formRefAccessoryUse.value?.resetFields()
    const id = row.id
    getAccessoryStockOptions(formAccessoryUse.value.accessoryId)
    getAccessoryUseInfo(id).then((res) => {
        Object.keys(formAccessoryUse.value).forEach((item) => {
            formAccessoryUse.value[item] = res.data[item]
        })
    })
}

const handleChangeAccessoryType = (value: any) => {
    getAccessoryStockOptions(value)
    formAccessoryUse.value.accessoryId = ''
    formAccessoryUse.value.accessoryName = ''
    formAccessoryUse.value.supplier = ''
}

const handleChangeAccessoryId = (value: any) => {
    const result = accessoryStockOptions.value.filter((item: any) => item.id == value)
    formAccessoryUse.value.accessoryName = result.length > 0 ? result[0].accessoryName : ''
    formAccessoryUse.value.supplier = result.length > 0 ? result[0].supplier : ''
}

/** 详情-提交按钮 */
const submitFormAccessoryUse = () => {
    proxy.$refs['formRefAccessoryUse'].validate((valid: any) => {
        if (valid) {
            if (formAccessoryUse.value.id != null) {
                updateAccessoryUse({ ...formAccessoryUse.value, relevance: 0 }).then(() => {
                    proxy.$modal.msgSuccess('修改成功')
                    openAccessoryUse.value = false
                    getAccessoryUseData(formAccessoryUse.value.carId)
                })
            } else {
                addAccessoryUse({ ...formAccessoryUse.value, relevance: 0 }).then(() => {
                    proxy.$modal.msgSuccess('新增成功')
                    openAccessoryUse.value = false
                    getAccessoryUseData(formAccessoryUse.value.carId)
                })
            }
        }
    })
}

/** 详情-删除按钮 */
const handleDeleteAccessoryUse = (row: any) => {
    proxy.$modal
        .confirm('是否确认删除此数据项？')
        .then(() => {
            return delAccessoryUse({ id: row.id, time: form.value.maintenanceTime })
        })
        .then(() => {
            getAccessoryUseData(formAccessoryUse.value.carId)
            proxy.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/maintenance/export', {}, `log_${new Date().getTime()}.xlsx`)
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
    url: baseURL + '/truck/maintenance/import'
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
