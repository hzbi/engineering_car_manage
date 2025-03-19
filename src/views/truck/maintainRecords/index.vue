<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item :label="$t('maintainRecords.searchBar.plateNumber.label')" prop="carNumber">
                <el-input maxlength="100" v-model="queryParams.carNumber" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item :label="$t('maintainRecords.searchBar.constructionSiteName.label')" prop="siteId">
                <el-select v-model="queryParams.siteId" :placeholder="$t('components.select.placeholder')" clearable style="width: 200px">
                    <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('maintainRecords.searchBar.maintenanceType.label')" prop="maintenanceType">
                <el-select v-model="queryParams.maintenanceType" :placeholder="$t('components.select.placeholder')" clearable style="width: 200px">
                    <el-option v-for="dict in maintenance_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('maintainRecords.searchBar.startDate.label')" prop="startTime">
                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('maintainRecords.searchBar.endDate.label')" prop="endTime">
                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" :disabled-date="disabledEndDate" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['truck:maintainRecords:add']">{{ $t('operationButtons.add.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="download" size="small" @click="handleImport" v-hasPermi="['truck:maintainRecords:import']">{{ $t('operationButtons.import.label') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="upload" size="small" @click="handleExport" v-hasPermi="['truck:maintainRecords:export']">{{ $t('operationButtons.export.label') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>

        <el-table stripe border v-loading="loading" :data="maintenanceList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
            <el-table-column :label="$t('maintainRecords.tableColumn[0].label')" align="center" prop="maintenanceTime" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ parseTime(scope.row.maintenanceTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[1].label')" align="center" prop="carNumber" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[2].label')" align="center" prop="siteName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[3].label')" align="center" prop="maintenanceType" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="maintenance_type" :value="scope.row.maintenanceType" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[4].label')" align="center" prop="oilConsumption" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[5].label')" align="center" prop="kilometres" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[6].label')" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[7].label')" align="center" prop="monetaryUnit" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <dict-tag :options="currency_unit_type" :value="scope.row.monetaryUnit" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[8].label')" align="center" prop="amount" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[9].label')" align="center" prop="maintenanceProvider" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ scope.row.maintenanceMode == 1 ? scope.row.maintenanceProvider : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[10].label')" align="center" prop="upkeep" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ scope.row.maintenanceMode == 0 ? scope.row.upkeep : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[11].label')" align="center" prop="nextTime" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ parseTime(scope.row.nextTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[12].label')" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('maintainRecords.tableColumn[13].label')" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('tableColumn.operation')" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                <template #default="scope">
                    <el-button type="text" @click="handleInfo(scope.row)" v-hasPermi="['truck:maintainRecords:info']">{{ $t('operationButtons.info.label') }}</el-button>
                    <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['truck:maintainRecords:edit']">{{ $t('operationButtons.edit.label') }}</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['truck:maintainRecords:delete']">{{ $t('operationButtons.delete.label') }}</el-button>
                    <el-button type="text" @click="handlePrice(scope.row)" v-hasPermi="['truck:maintainRecords:price']">{{ $t('operationButtons.price.label') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />

        <!-- 添加或修改维护记录管理对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-row justify="center">
                <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                    <el-form-item :label="$t('maintainRecords.fields[0].label')" prop="maintenanceTime">
                        <el-date-picker clearable v-model="form.maintenanceTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')" style="width: 300px"></el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[1].label')" prop="carNumber">
                        <el-select v-model="form.carNumber" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in truckOptions" :key="dict.carNumber" :label="dict.carNumber" :value="dict.carNumber"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[2].label')" prop="siteId">
                        <el-select v-model="form.siteId" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in siteOptions" :key="dict.siteId" :label="dict.siteName" :value="dict.siteId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[3].label')" prop="maintenanceType">
                        <el-select v-model="form.maintenanceType" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in maintenance_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[4].label')" prop="oilConsumption">
                        <el-input maxlength="100" v-model="form.oilConsumption" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[5].label')" prop="kilometres">
                        <el-input maxlength="100" v-model="form.kilometres" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[6].label')" prop="remark">
                        <el-input maxlength="200" v-model="form.remark" type="textarea" :rows="5" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[7].label')" prop="maintenanceMode">
                        <el-radio-group v-model="form.maintenanceMode">
                            <el-radio label="0">{{ $t('maintainRecords.fields[7].options[0]') }}</el-radio>
                            <el-radio label="1">{{ $t('maintainRecords.fields[7].options[1]') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="form.maintenanceMode == 0">
                        <el-form-item :label="$t('maintainRecords.fields[8].label')" prop="upkeep">
                            <el-input maxlength="100" v-model="form.upkeep" :placeholder="$t('components.input.placeholder')" clearable />
                        </el-form-item>
                    </template>
                    <template v-if="form.maintenanceMode == 1">
                        <el-form-item :label="$t('maintainRecords.fields[9].label')" prop="maintenanceProvider">
                            <el-input maxlength="100" v-model="form.maintenanceProvider" :placeholder="$t('components.input.placeholder')" clearable />
                        </el-form-item>
                    </template>
                    <el-form-item :label="$t('maintainRecords.fields[10].label')" prop="nextTime">
                        <el-date-picker clearable v-model="form.nextTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')" style="width: 300px"></el-date-picker>
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
                <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                    <el-form-item :label="$t('maintainRecords.fields[0].label')" prop="maintenanceTime">
                        <span>{{ form.maintenanceTime ? parseTime(new Date(form.maintenanceTime), '{y}-{m}-{d}') : '' }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[1].label')" prop="carNumber">
                        <span>{{ form.carNumber }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[2].label')" prop="siteName">
                        <span>{{ form.siteName }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[3].label')" prop="maintenanceType">
                        <dict-tag :options="maintenance_type" :value="form.maintenanceType" />
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[4].label')" prop="oilConsumption">
                        <span>{{ form.oilConsumption }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[5].label')" prop="kilometres">
                        <span>{{ form.kilometres }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[6].label')" prop="remark">
                        <span>{{ form.remark }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[11].label')" prop="monetaryUnit">
                        <el-select v-model="form.monetaryUnit" :placeholder="$t('components.select.placeholder')" clearable>
                            <el-option v-for="dict in currency_unit_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[12].label')" prop="amount">
                        <el-input maxlength="100" v-model="form.amount" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('maintainRecords.fields[7].label')" prop="maintenanceMode">
                        <span>{{ form.maintenanceMode == 0 ? $t('maintainRecords.fields[7].options[0]') : $t('maintainRecords.fields[7].options[1]') }}</span>
                    </el-form-item>
                    <template v-if="form.maintenanceMode == 0">
                        <el-form-item :label="$t('maintainRecords.fields[8].label')" prop="maintenanceProvider">
                            <span>{{ form.maintenanceProvider }}</span>
                        </el-form-item>
                    </template>
                    <template v-if="form.maintenanceMode == 1">
                        <el-form-item :label="$t('maintainRecords.fields[9].label')" prop="maintenanceProvider">
                            <span>{{ form.maintenanceProvider }}</span>
                        </el-form-item>
                    </template>
                    <el-form-item :label="$t('maintainRecords.fields[10].label')" prop="nextTime">
                        <span>{{ form.nextTime ? parseTime(new Date(form.nextTime), '{y}-{m}-{d}') : '' }}</span>
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

        <!-- 维护记录详情对话框 -->
        <el-drawer :title="title" size="80%" v-model="openInfo">
            <el-divider content-position="left">{{ $t('maintainRecords.basicInfo.title') }}</el-divider>
            <table class="info-table" border="1">
                <tbody>
                    <tr>
                        <td>{{ $t('maintainRecords.basicInfo.maintenanceDate') }}</td>
                        <td>{{ form.maintenanceTime ? parseTime(new Date(form.maintenanceTime), '{y}-{m}-{d}') : '' }}</td>
                        <td>{{ $t('maintainRecords.basicInfo.plateNumber') }}</td>
                        <td>{{ form.carNumber }}</td>
                        <td>{{ $t('maintainRecords.basicInfo.constructionSiteName') }}</td>
                        <td>{{ form.siteName }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('maintainRecords.basicInfo.maintenanceType') }}</td>
                        <td><dict-tag :options="maintenance_type" :value="form.maintenanceType" /></td>
                        <td>{{ $t('maintainRecords.basicInfo.fuelConsumption') }}</td>
                        <td>{{ form.oilConsumption }}</td>
                        <td>{{ $t('maintainRecords.basicInfo.mileage') }}</td>
                        <td>{{ form.kilometres }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('maintainRecords.basicInfo.repairMethod') }}</td>
                        <td>{{ form.maintenanceMode == 0 ? $t('maintainRecords.basicInfo.repairMethodOptions[0]') : $t('maintainRecords.basicInfo.repairMethodOptions[1]') }}</td>
                        <td>{{ form.maintenanceMode == 0 ? $t('maintainRecords.basicInfo.maintenanceOptions[0]') : $t('maintainRecords.basicInfo.maintenanceOptions[1]') }}</td>
                        <td>{{ form.maintenanceProvider }}</td>
                        <td>{{ $t('maintainRecords.basicInfo.nextMaintenanceDate') }}</td>
                        <td>{{ form.nextTime ? parseTime(new Date(form.nextTime), '{y}-{m}-{d}') : '' }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('maintainRecords.basicInfo.creator') }}</td>
                        <td>{{ form.createBy }}</td>
                        <td>{{ $t('maintainRecords.basicInfo.creationTime') }}</td>
                        <td>{{ form.createTime }}</td>
                        <td>{{ $t('maintainRecords.basicInfo.description') }}</td>
                        <td>{{ form.remark }}</td>
                    </tr>
                </tbody>
            </table>
            <el-divider content-position="left">{{ $t('maintainRecords.partsUsageRecords.title') }}</el-divider>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="plus" size="small" @click="handleAddAccessoryUse" v-hasPermi="['truck:maintainRecords:add']">{{ $t('operationButtons.add.label') }}</el-button>
                </el-col>
            </el-row>
            <el-table stripe border v-loading="loading" :data="accessoryUseData">
                <el-table-column type="index" width="80" :label="$t('tableColumn.index')" align="center" />
                <el-table-column :label="$t('maintainRecords.partsUsageRecords.tableColumn[0].label')" align="center" prop="accessoryType" min-width="120" show-overflow-tooltip>
                    <template #default="scope">
                        <dict-tag :options="accessory_type" :value="scope.row.accessoryType" min-width="120" show-overflow-tooltip />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('maintainRecords.partsUsageRecords.tableColumn[1].label')" align="center" prop="accessoryName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('maintainRecords.partsUsageRecords.tableColumn[2].label')" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('maintainRecords.partsUsageRecords.tableColumn[3].label')" align="center" prop="useing" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('maintainRecords.partsUsageRecords.tableColumn[4].label')" align="center" prop="supplier" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('maintainRecords.partsUsageRecords.tableColumn[5].label')" align="center" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('maintainRecords.partsUsageRecords.tableColumn[6].label')" align="center" prop="createBy" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('maintainRecords.partsUsageRecords.tableColumn[7].label')" align="center" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('tableColumn.operation')" align="center" class-name="small-padding fixed-width" min-width="200" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="handleUpdateAccessoryUse(scope.row)" v-hasPermi="['truck:maintainRecords:edit']">{{ $t('operationButtons.edit.label') }}</el-button>
                        <el-button type="text" @click="handleDeleteAccessoryUse(scope.row)" v-hasPermi="['truck:maintainRecords:remove']">{{ $t('operationButtons.delete.label') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>

        <!-- 添加或修改配件使用对话框 -->
        <el-dialog :title="titleAccessoryUse" v-model="openAccessoryUse" width="800px" append-to-body>
            <el-row justify="center" style="max-height: 600px; overflow-y: auto">
                <el-form ref="formRefAccessoryUse" :model="formAccessoryUse" :rules="rulesAccessoryUse" label-width="auto">
                    <el-form-item :label="$t('accessoryUse.fields[0].label')" prop="maintenanceTime">
                        {{ formAccessoryUse.maintenanceTime ? parseTime(new Date(form.maintenanceTime), '{y}-{m}-{d}') : '' }}
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[1].label')" prop="siteName">
                        {{ formAccessoryUse.siteName }}
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[2].label')" prop="carNumber">
                        {{ formAccessoryUse.carNumber }}
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[3].label')" prop="accessoryType">
                        <el-select v-model="formAccessoryUse.accessoryType" :placeholder="$t('components.select.placeholder')" @change="handleChangeAccessoryType" clearable>
                            <el-option v-for="dict in accessory_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[4].label')" prop="accessoryId">
                        <el-select v-model="formAccessoryUse.accessoryId" :placeholder="$t('components.select.placeholder')" @change="handleChangeAccessoryId" clearable>
                            <el-option v-for="dict in accessoryStockOptions" :key="dict.id" :label="dict.accessoryName" :value="dict.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[5].label')" prop="supplier">
                        <el-input maxlength="100" v-model="formAccessoryUse.supplier" :placeholder="$t('components.input.placeholder')" disabled clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[6].label')" prop="num">
                        <el-input maxlength="100" v-model="formAccessoryUse.num" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[7].label')" prop="useing">
                        <el-input maxlength="200" v-model="formAccessoryUse.useing" type="textarea" :rows="5" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[8].label')" prop="remark">
                        <el-input maxlength="200" v-model="formAccessoryUse.remark" type="textarea" :rows="5" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                    <el-form-item :label="$t('accessoryUse.fields[9].label')" prop="putBy">
                        <el-input maxlength="100" v-model="formAccessoryUse.putBy" :placeholder="$t('components.input.placeholder')" clearable />
                    </el-form-item>
                </el-form>
            </el-row>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormAccessoryUse">{{ $t('components.btn.confirmButton') }}</el-button>
                    <el-button @click="cancelAccessoryUse">{{ $t('components.btn.cancelButton') }}</el-button>
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

<script setup name="Maintenance" lang="ts">
import { getMaintainRecordsList, getMaintainRecordsInfo, addMaintainRecords, updateMaintainRecords, delMaintainRecords } from '@/api/truck/maintainRecords'
import { getSiteList } from '@/api/site/siteManage'
import { getTruckList } from '@/api/truck/truckInfo'
import { getAccessoryStockList } from '@/api/truck/accessoryStock'
import { getAccessoryUseList, getAccessoryUseInfo, addAccessoryUse, updateAccessoryUse, delAccessoryUse } from '@/api/truck/accessoryUse'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { ElForm, ElTable, ElUpload } from 'element-plus'
import { getToken } from '@/utils/auth'
import { $t } from '@/lang'
import useAppStore from '@/store/modules/app'

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
        carNumber: null,
        siteId: null,
        maintenanceType: null,
        startTime: null,
        endTime: null
    },
    form: {
        id: null,
        maintenanceTime: null,
        carNumber: null,
        siteId: null,
        siteName: null,
        maintenanceType: null,
        oilConsumption: null,
        kilometres: null,
        maintenanceMode: null,
        maintenanceProvider: null,
        upkeep: null,
        nextTime: null,
        monetaryUnit: null,
        amount: null,
        remark: null
    },
    rules: {
        maintenanceTime: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        carNumber: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        siteId: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        maintenanceType: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        oilConsumption: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        kilometres: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        maintenanceMode: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        maintenanceProvider: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        upkeep: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        monetaryUnit: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        amount: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        nextTime: [
            {
                validator: (rule: any, value: any, callback: any) => {
                    if (new Date(value).getTime() < new Date(form.value.maintenanceTime).getTime()) {
                        callback(new Error($t('components.validator.nextTime')))
                    } else {
                        callback()
                    }
                }
            }
        ]
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
        carNumber: null,
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
        maintenanceTime: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        siteName: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        carNumber: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        accessoryType: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        accessoryId: [{ required: true, message: $t('components.select.placeholder'), trigger: 'blur' }],
        supplier: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }],
        num: [
            { required: true, message: $t('components.input.placeholder'), trigger: 'blur' },
            {
                validator: (rule: any, value: any, callback: any) => {
                    if (value > formAccessoryUse.value.outNum) {
                        callback(new Error($t('components.validator.inventoryInsufficient')))
                    } else {
                        callback()
                    }
                }
            }
        ],
        putBy: [{ required: true, message: $t('components.input.placeholder'), trigger: 'blur' }]
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

const disabledEndDate = (time: any) => {
    if (queryParams.value.startTime) {
        return time.getTime() < new Date(queryParams.value.startTime).getTime()
    }
    return false
}

const truckOptions = ref([]) as any

const getTruckOption = () => {
    getTruckList({ carStatus: 0 }).then((res: any) => {
        truckOptions.value = res.rows
    })
}

const siteOptions = ref([]) as any

const getSiteOptions = () => {
    getSiteList({ status: 0 }).then((res: any) => {
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

const getAccessoryUseData = (carNumber: any) => {
    getAccessoryUseList({ carNumber }).then((res: any) => {
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
    getAccessoryUseData(row.carNumber)
    getMaintainRecordsInfo(id).then((res) => {
        form.value = res.data
    })
}

/** 新增按钮操作 */
const handleAdd = () => {
    open.value = true
    title.value = $t('dialog.addTitle')
    formRef.value?.resetFields()
    form.value.id = null
    form.value.maintenanceProvider = null
    form.value.upkeep = null
    getTruckOption()
}

/** 修改按钮操作 */
const handleUpdate = (row: any) => {
    open.value = true
    title.value = $t('dialog.editTitle')
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
    title.value = $t('dialog.priceTitle')
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
                    proxy.$modal.msgSuccess($t('components.message.edit'))
                    open.value = false
                    openPrice.value = false
                    getPageList()
                })
            } else {
                addMaintainRecords(form.value).then(() => {
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
            return delMaintainRecords(row.id)
        })
        .then(() => {
            getPageList()
            proxy.$modal.msgSuccess($t('components.message.delete.text'))
        })
        .catch(() => {})
}

/** 详情-新增配件使用 */
const handleAddAccessoryUse = () => {
    openAccessoryUse.value = true
    titleAccessoryUse.value = $t('dialog.addTitle')
    formAccessoryUse.value = {
        id: null,
        putTime: form.value.maintenanceTime,
        maintenanceId: form.value.id,
        maintenanceTime: form.value.maintenanceTime,
        siteId: form.value.siteId,
        siteName: form.value.siteName,
        carNumber: form.value.carNumber
    }
    accessoryStockOptions.value = []
}

/** 详情-更新配件使用 */
const handleUpdateAccessoryUse = (row: any) => {
    openAccessoryUse.value = true
    titleAccessoryUse.value = $t('dialog.editTitle')
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
    formAccessoryUse.value.outNum = formAccessoryUse.value.accessoryId = ''
    formAccessoryUse.value.accessoryName = ''
    formAccessoryUse.value.supplier = ''
}

const handleChangeAccessoryId = (value: any) => {
    const result = accessoryStockOptions.value.filter((item: any) => item.id == value)
    formAccessoryUse.value.accessoryName = result.length > 0 ? result[0].accessoryName : ''
    formAccessoryUse.value.supplier = result.length > 0 ? result[0].supplier : ''
    formAccessoryUse.value.outNum = result.length > 0 ? result[0].outNum : ''
}

/** 详情-提交按钮 */
const submitFormAccessoryUse = () => {
    proxy.$refs['formRefAccessoryUse'].validate((valid: any) => {
        if (valid) {
            if (formAccessoryUse.value.id != null) {
                updateAccessoryUse({ ...formAccessoryUse.value, relevance: 0 }).then(() => {
                    proxy.$modal.msgSuccess($t('components.message.edit'))
                    openAccessoryUse.value = false
                    getAccessoryUseData(formAccessoryUse.value.carNumber)
                })
            } else {
                addAccessoryUse({ ...formAccessoryUse.value, relevance: 0 }).then(() => {
                    proxy.$modal.msgSuccess($t('components.message.add'))
                    openAccessoryUse.value = false
                    getAccessoryUseData(formAccessoryUse.value.carNumber)
                })
            }
        }
    })
}

/** 详情-删除按钮 */
const handleDeleteAccessoryUse = (row: any) => {
    proxy.$modal
        .confirm($t('components.message.delete.content'), {
            confirmButtonText: $t('components.btn.confirmButton'),
            cancelButtonText: $t('components.btn.cancelButton')
        })
        .then(() => {
            return delAccessoryUse({ id: row.id, time: form.value.maintenanceTime })
        })
        .then(() => {
            getAccessoryUseData(formAccessoryUse.value.carNumber)
            proxy.$modal.msgSuccess($t('components.message.delete.text'))
        })
        .catch(() => {})
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('truck/maintenance/export', { ...queryParams.value }, `${$t('menu.MaintainRecords')}${new Date().getTime()}.xlsx`)
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
