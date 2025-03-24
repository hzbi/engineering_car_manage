<template>
    <div class="app-container">
        <el-row :gutter="24">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <transition name="fade">
                    <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
                        <el-form-item :label="$t('userManage.searchBar.nickName.label')" prop="nickName">
                            <el-input maxlength="100" v-model="queryParams.nickName" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" />
                        </el-form-item>
                        <el-form-item :label="$t('userManage.searchBar.sex.label')" prop="sex">
                            <el-select v-model="queryParams.sex" :placeholder="$t('components.select.placeholder')" style="width: 200px" clearable @change="handleQuery">
                                <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="useAppStore().language == 'zh' ? dict.label : dict.labelEn" :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <form-search @reset="resetQuery" @search="handleQuery" />
                    </el-form>
                </transition>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['system:user:add']">{{ $t('operationButtons.add.label') }}</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="download" size="small" @click="handleImport" v-hasPermi="['system:user:import']">{{ $t('operationButtons.import.label') }}</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="upload" size="small" @click="handleExport" v-hasPermi="['system:user:export']">{{ $t('operationButtons.export.label') }}</el-button>
                    </el-col>
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList" />
                </el-row>

                <el-table stripe border v-loading="loading" ref="pageTableRef" :data="userList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" :selectable="checkSelected" />
                    <el-table-column :label="$t('userManage.tableColumn[0].label')" width="80" align="center" key="userId" prop="userId" />
                    <el-table-column :label="$t('userManage.tableColumn[1].label')" min-width="120" align="center" key="userName" prop="userName" :show-overflow-tooltip="true" />
                    <el-table-column :label="$t('userManage.tableColumn[2].label')" min-width="120" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
                    <el-table-column :label="$t('userManage.tableColumn[3].label')" min-width="120" align="center" key="sex" prop="sex">
                        <template #default="scope">
                            <dict-tag :options="sys_user_sex" :value="scope.row.sex" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('userManage.tableColumn[4].label')" min-width="120" align="center" key="phonenumber" prop="phonenumber" />
                    <el-table-column :label="$t('userManage.tableColumn[5].label')" min-width="200" align="center" prop="roleNameArray">
                        <template #default="scope">
                            <!-- prettier-ignore -->
                            <data-tag v-model:roles-array="scope.row.roleNameArray"/>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('userManage.tableColumn[6].label')" min-width="120" align="center" key="remark" prop="remark" />
                    <el-table-column :label="$t('userManage.tableColumn[7].label')" min-width="200" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.roleidArray && (scope.row.roleidArray.includes('1') || scope.row.roleidArray.includes('2'))">{{ $t('operationButtons.all.label') }}</div>
                            <div v-else>
                                <template v-if="scope.row.carInfoList && scope.row.carInfoList.length > 0" v-for="(item, index) in scope.row.carInfoList" :key="index">
                                    <span :style="{ color: item.carStatus == 0 ? '#409eff' : '#C0C4CC', cursor: 'pointer' }" @click="handleSettingTruck(scope.row)">{{ (index == scope.row.carInfoList.length - 1 && item.carNumber) || item.carNumber + ',' }}</span>
                                </template>
                                <el-button v-else type="text" @click="handleSettingTruck(scope.row)">{{ $t('operationButtons.settingTruck.label') }}</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('userManage.tableColumn[8].label')" min-width="200" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.roleidArray && (scope.row.roleidArray.includes('1') || scope.row.roleidArray.includes('2'))">{{ $t('operationButtons.all.label') }}</div>
                            <div v-else>
                                <template v-if="scope.row.siteInfoList && scope.row.siteInfoList.length > 0" v-for="(item, index) in scope.row.siteInfoList" :key="index">
                                    <span :style="{ color: item.status == 0 ? '#409eff' : '#C0C4CC', cursor: 'pointer' }" @click="handleSettingSite(scope.row)">{{ (index == scope.row.siteInfoList.length - 1 && item.siteName) || item.siteName + ',' }}</span>
                                </template>
                                <el-button v-else type="text" @click="handleSettingSite(scope.row)">{{ $t('operationButtons.settingSite.label') }}</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="邮箱" width="200" align="center" key="email" prop="email" /> -->
                    <el-table-column :label="$t('userManage.tableColumn[9].label')" min-width="120" align="center" key="status">
                        <template #default="scope">
                            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                            <!-- <status-switch :disabled="scope.row.admin" :status-data.sync="scope.row.status" @handleChange="handleStatusChange($event, scope.row)" /> -->
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="160">
                        <template #default="scope">
                            <span>{{ parseTime(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column :label="$t('tableColumn.operation')" min-width="300" fixed="right" align="center" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <!-- prettier-ignore -->
                            <el-link
								class="table_link_btn"
								:underline="false"
								size="small"
								type="primary"
								@click="handleUpdate(scope.row)"
								v-hasPermi="['system:user:edit']"
                            >
                                <span class="table_link_text">{{ $t('operationButtons.edit.label') }}</span>
                            </el-link>
                            <!-- prettier-ignore -->
                            <el-link
								class="table_link_btn"
								:underline="false"
								size="small"
								type="primary"
								@click="handleResetPwd(scope.row)"
								v-hasPermi="['system:user:resetPwd']"
                            >
                                <span class="table_link_text">{{ $t('operationButtons.reset.label') }}</span>
                            </el-link>
                            <!-- prettier-ignore -->
                            <el-link
								class="table_link_btn"
								:underline="false"
								:disabled="scope.row.userId === '1'"
								size="small"
								type="primary"
								@click="handleDelete(scope.row)"
								v-hasPermi="['system:user:remove']"
								><span class="table_link_text"
									>{{$t('operationButtons.delete.label')}}</span
								></el-link
							>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />
            </el-col>
        </el-row>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" v-model="open" width="40%" append-to-body @close="cleanSelect()">
            <!-- prettier-ignore -->
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
				<el-row>
					<el-col :span="12">
						<el-form-item :label="$t('userManage.fields[0].label')" prop="nickName">
							<el-input
								v-model="form.nickName"
								:placeholder="$t('components.input.placeholder')"
							/>
						</el-form-item>
					</el-col>
                    <el-col :span="12">
						<el-form-item :label="$t('userManage.fields[1].label')" prop="phonenumber">
							<el-input
								v-model="form.phonenumber"
								:placeholder="$t('components.input.placeholder')"
								maxlength="11"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item
							v-if="form.userId == undefined"
							:label="$t('userManage.fields[2].label')"
							prop="userName"
						>
							<el-input
								v-model="form.userName"
								:placeholder="$t('components.input.placeholder')"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							v-if="form.userId == undefined"
							:label="$t('userManage.fields[3].label')"
							prop="password"
						>
							<el-input
								v-model="form.password"
								:placeholder="$t('components.input.placeholder')"
								type="password"
                                show-password
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item :label="$t('userManage.fields[4].label')">
							<el-select v-model="form.sex" :placeholder="$t('components.input.placeholder')" style="width: 100%;">
								<el-option
									v-for="dict in sys_user_sex"
									:key="dict.value"
                                    :label="useAppStore().language == 'zh' ? dict.label : dict.labelEn"
                                    :value="dict.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('userManage.fields[5].label')">
							<el-radio-group v-model="form.status" style="width: 100%;" @change="statusChange">
								<el-radio
                                    v-for="dict in sys_normal_disable"
                                    :key="dict.label"
                                    :label="dict.value"
                                    >{{ useAppStore().language == 'zh' ? dict.label : dict.labelEn }}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item :label="$t('userManage.fields[6].label')" prop="roleIds">
							<el-select
								v-model="form.roleIds"
								:placeholder="$t('components.input.placeholder')"
                                style="width: 100%;"
							>
								<el-option
									v-for="item in roleOptions"
									:key="parseInt(item.roleId)"
									:label="item.roleName"
									:value="parseInt(item.roleId)"
									:disabled="item.status == '1'"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item :label="$t('userManage.fields[7].label')">
							<el-input
								v-model="form.remark"
                                :autosize="{ minRows: 4, maxRows: 8 }"
								type="textarea"
								:placeholder="$t('components.input.placeholder')"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">{{ $t('components.btn.confirmButton') }}</el-button>
                    <el-button @click="cancel">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 用户导入对话框 -->
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
				<!-- <div class="el-upload__tip" slot="tip"> -->
                    <!-- prettier-ignore -->
					<!-- <el-checkbox v-model="upload.updateSupport"/>是否更新已经存在的用户数据
					<el-link
						type="info"
						style="font-size:12px"
						@click="importTemplate"
						>下载模板</el-link
					> -->
				<!-- </div> -->
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

        <el-dialog :title="$t('userManage.truckDialog.title')" v-model="selectObj.truckOpen" width="50%" append-to-body>
            <el-form :model="truckQueryParams" ref="truckQueryFormRef" :inline="true">
                <el-form-item :label="$t('truckInfo.searchBar.plateNumber.label')" prop="carNumber">
                    <el-input maxlength="100" v-model="truckQueryParams.carNumber" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('truckInfo.searchBar.vehicleType.label')" prop="carType">
                    <el-select v-model="truckQueryParams.carType" :placeholder="$t('components.select.placeholder')" clearable style="width: 200px">
                        <el-option v-for="dict in truck_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <form-search @reset="resetTruckQuery" @search="handleTruckQuery" />
            </el-form>

            <div style="margin: 15px 0; color: #409eff">
                {{ $t('userManage.truckDialog.content') }}
                <template v-for="(item, index) in multipleTruckSelection" :key="index">
                    <span :style="{ color: item.carStatus == 0 ? '#409eff' : '#C0C4CC', cursor: 'pointer' }">{{ (index == multipleTruckSelection.length - 1 && item.carNumber) || item.carNumber + ',' }}</span>
                </template>
            </div>

            <el-table stripe border v-loading="loading" :data="truckTableData" ref="multipleTruckTableRef" row-key="id" @selection-change="handleSelectionChangeTruck" max-height="500">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
                <el-table-column :label="$t('truckInfo.tableColumn[0].label')" align="center" prop="carNumber" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('truckInfo.tableColumn[1].label')" align="center" prop="carType" min-width="120" show-overflow-tooltip>
                    <template #default="scope">
                        <dict-tag :options="truck_type" :value="scope.row.carType" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('truckInfo.tableColumn[2].label')" align="center" prop="carWeight" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('truckInfo.tableColumn[6].label')" align="center" prop="carStatus" min-width="120" show-overflow-tooltip>
                    <template #default="scope">
                        <dict-tag :options="truck_status" :value="scope.row.carStatus" />
                    </template>
                </el-table-column>
            </el-table>

            <!-- <pagination v-show="truckTableTotal > 0" :total="truckTableTotal" v-model:page="truckQueryParams.pageNum" v-model:limit="truckQueryParams.pageSize" @pagination="getTruckPageList" /> -->

            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormTruck">{{ $t('components.btn.confirmButton') }}</el-button>
                    <el-button @click="cancelTruck">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog :title="$t('userManage.siteDialog.title')" v-model="selectObj.siteOpen" width="50%" append-to-body>
            <el-form :model="siteQueryParams" ref="siteQueryFormRef" :inline="true">
                <el-form-item :label="$t('siteManage.searchBar.siteName.label')" prop="siteName">
                    <el-input maxlength="100" v-model="siteQueryParams.siteName" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" />
                </el-form-item>
                <form-search @reset="resetSiteQuery" @search="handleSiteQuery" />
            </el-form>

            <div style="margin: 15px 0; color: #409eff">
                {{ $t('userManage.siteDialog.content') }}
                <template v-for="(item, index) in multipleSiteSelection" :key="index">
                    <span :style="{ color: item.status == 0 ? '#409eff' : '#C0C4CC', cursor: 'pointer' }">{{ (index == multipleSiteSelection.length - 1 && item.siteName) || item.siteName + ',' }}</span>
                </template>
            </div>

            <el-table stripe border v-loading="loading" :data="siteTableData" ref="multipleSiteTableRef" row-key="id" @selection-change="handleSelectionChangeSite" max-height="500">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
                <el-table-column :label="$t('siteManage.tableColumn[0].label')" align="center" prop="siteId" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('siteManage.tableColumn[1].label')" align="center" prop="siteName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('siteManage.tableColumn[2].label')" align="center" prop="siteAddress" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('siteManage.tableColumn[3].label')" align="center" prop="contactPerson" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('siteManage.tableColumn[4].label')" align="center" prop="contactPhone" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('siteManage.tableColumn[5].label')" align="center" prop="status" min-width="120" show-overflow-tooltip>
                    <template #default="scope">
                        <dict-tag :options="site_status" :value="scope.row.status" />
                    </template>
                </el-table-column>
            </el-table>

            <!-- <pagination v-show="siteTableTotal > 0" :total="siteTableTotal" v-model:page="siteQueryParams.pageNum" v-model:limit="siteQueryParams.pageSize" @pagination="getTruckPageList" /> -->

            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormSite">{{ $t('components.btn.confirmButton') }}</el-button>
                    <el-button @click="cancelSite">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name="User" setup>
import User from '@/api/request/system/user'
import { reactive, ref, getCurrentInstance } from 'vue'
import { ElForm, TableV2Instance } from 'element-plus'
import { updateUserCarSite } from '@/api/system/user'
import { getTruckList } from '@/api/truck/truckInfo'
import { getSiteList } from '@/api/site/siteManage'
import useAppStore from '@/store/modules/app'
import { $t } from '@/lang'

const { loading, queryFormRef, formRef, sys_normal_disable, showSearch, total, userList, title, open, sys_user_sex, user_status, roleOptions, form, upload, queryParams, rules, pageTableRef, uploadRef, fileList, getPageList, handleStatusChange, cancel, handleQuery, resetQuery, handleSelectionChange, statusChange, handleAdd, handleUpdate, handleResetPwd, submitForm, handleDelete, handleExport, handleImport, handleFileUploadProgress, handleFileSuccess, submitFileForm, checkSelected, cleanSelect, cleanUploadRef, truck_type, truck_status, site_status } = User()

const { proxy } = getCurrentInstance() as any

const selectObj = reactive({
    truckOpen: false,
    siteOpen: false
})

const multipleTruckTableRef = ref<TableV2Instance>() as any
const multipleTruckSelection = ref<any>([])

const truckQueryFormRef = ref<InstanceType<typeof ElForm>>()

const truckQueryParams = ref<any>({
    pageNum: 1,
    carNumber: undefined,
    carType: undefined
})

const truckTableTotal = ref(0)

const truckTableData = ref([])

const getTruckPageList = () => {
    // TODO 查询之前先清空列表(不清空可能会因为数据缓存影响)
    truckTableData.value = []
    getTruckList(truckQueryParams.value).then((res: any) => {
        truckTableData.value = res.rows
        truckTableTotal.value = parseInt(res.total)
    })
}

const handleTruckQuery = () => {
    truckTableTotal.value = 0
    truckQueryParams.value.pageNum = 1
    getTruckPageList()
}

const resetTruckQuery = () => {
    truckQueryFormRef.value?.resetFields()
    truckTableTotal.value = 0
    handleTruckQuery()
}

const rowId = ref('')

const handleSettingTruck = async (row: any) => {
    await getTruckPageList()
    selectObj.truckOpen = true
    rowId.value = row.userId
    setTimeout(() => {
        const result = truckTableData.value.filter((item: any) => row.carId.split(',').some((i: any) => i == item.id))
        if (result.length) {
            result.forEach((item: any) => {
                multipleTruckTableRef.value!.toggleRowSelection(item, undefined, true)
            })
        }
    }, 1000)
}

const handleSelectionChangeTruck = (selection: any) => {
    multipleTruckSelection.value = selection
}

const submitFormTruck = () => {
    updateUserCarSite({ userId: rowId.value, carId: multipleTruckSelection.value.map((item: { id: any }) => item.id).join(',') }).then((response: any) => {
        if (response.code === 200) {
            proxy.$modal.msgSuccess($t('components.message.setting'))
            getPageList()
            selectObj.truckOpen = false
            rowId.value = ''
            resetTruckQuery()
        }
    })
}

const cancelTruck = () => {
    rowId.value = ''
    selectObj.truckOpen = false
    resetTruckQuery()
}

const multipleSiteTableRef = ref<TableV2Instance>() as any
const multipleSiteSelection = ref<any>([])

const siteQueryFormRef = ref<InstanceType<typeof ElForm>>()

const siteQueryParams = ref<any>({
    pageNum: 1,
    carNumber: undefined,
    carType: undefined
})

const siteTableTotal = ref(0)

const siteTableData = ref([])

const getSitePageList = () => {
    // TODO 查询之前先清空列表(不清空可能会因为数据缓存影响)
    siteTableData.value = []
    getSiteList(siteQueryParams.value).then((res: any) => {
        siteTableData.value = res.rows
        siteTableTotal.value = parseInt(res.total)
    })
}

const handleSiteQuery = () => {
    siteTableTotal.value = 0
    siteQueryParams.value.pageNum = 1
    getSitePageList()
}

const resetSiteQuery = () => {
    siteQueryFormRef.value?.resetFields()
    siteTableTotal.value = 0
    handleSiteQuery()
}

const handleSettingSite = async (row: any) => {
    await getSitePageList()
    selectObj.siteOpen = true
    rowId.value = row.userId
    setTimeout(() => {
        const result = siteTableData.value.filter((item: any) => row.siteId.split(',').some((i: any) => i == item.id))
        if (result.length) {
            result.forEach((item: any) => {
                multipleSiteTableRef.value!.toggleRowSelection(item, undefined, true)
            })
        }
    }, 1000)
}

const handleSelectionChangeSite = (selection: any) => {
    multipleSiteSelection.value = selection
}

const submitFormSite = () => {
    updateUserCarSite({ userId: rowId.value, siteId: multipleSiteSelection.value.map((item: { id: any }) => item.id).join(',') }).then((res: any) => {
        if (res.code === 200) {
            proxy.$modal.msgSuccess($t('components.message.setting'))
            getPageList()
            selectObj.siteOpen = false
            rowId.value = ''
            resetSiteQuery()
        }
    })
}

const cancelSite = () => {
    rowId.value = ''
    selectObj.siteOpen = false
    resetSiteQuery()
}
</script>
<style>
.post-tag {
    float: left;
    margin: 5px 0 0 5px;
}
</style>
