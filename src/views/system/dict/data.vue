<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
            <el-form-item :label="$t('dictData.searchBar.dictType.label')" prop="dictType">
                <el-select v-model="queryParams.dictType" :placeholder="$t('components.select.placeholder')" clearable filterable @change="handleQuery()" style="width: 200px">
                    <el-option v-for="item in typeOptions" :key="item.dictId" :label="useAppStore().language == 'zh' ? item.dictName : item.dictEngName" :value="item.dictType" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('dictData.searchBar.dictLabel.label')" prop="dictLabel">
                <el-input maxlength="100" v-model="queryParams.dictLabel" :placeholder="$t('components.input.placeholder')" clearable @keyup.enter.native="handleQuery()" style="width: 200px" />
            </el-form-item>
            <el-form-item :label="$t('dictData.searchBar.dictEngLabel.label')" prop="dictEngLabel">
                <el-input maxlength="100" v-model="queryParams.dictEngLabel" :placeholder="$t('components.input.placeholder')" clearable @keyup.enter.native="handleQuery()" style="width: 200px" />
            </el-form-item>
            <el-form-item :label="$t('dictData.searchBar.status.label')" prop="status">
                <el-select v-model="queryParams.status" :placeholder="$t('components.select.placeholder')" clearable @change="handleQuery()" style="width: 200px">
                    <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('dictData.searchBar.dateRange.label')" style="font-weight: bold">
                <el-date-picker v-model="dateRange" style="width: 200px" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="daterange" range-separator="-" :start-placeholder="$t('components.select.placeholder')" :end-placeholder="$t('components.select.placeholder')" @change="handleQuery"></el-date-picker>
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['system:dict:add']">{{ $t('operationButtons.add.label') }}</el-button>
            </el-col>

            <el-col :span="1.5">
                <el-button type="primary" plain icon="upload" size="small" @click="handleExport" v-hasPermi="['system:dict:export']">{{ $t('operationButtons.export.label') }}</el-button>
            </el-col>
            <!-- prettier-ignore -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </el-row>

        <el-table border stripe v-loading="loading" ref="pageTableRef" :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('dictData.tableColumn[0].label')" align="center" prop="dictCode" width="120" />
            <el-table-column :label="$t('dictData.tableColumn[1].label')" align="center" prop="dictLabel" width="120">
                <template #default="scope">
                    <!-- prettier-ignore -->
                    <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{ scope.row.dictLabel }}</span>
                    <!-- prettier-ignore -->
                    <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{ scope.row.dictLabel }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('dictData.tableColumn[2].label')" align="center" prop="dictEngLabel" width="120">
                <template #default="scope">
                    <!-- prettier-ignore -->
                    <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{ scope.row.dictEngLabel }}</span>
                    <!-- prettier-ignore -->
                    <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{ scope.row.dictEngLabel }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('dictData.tableColumn[3].label')" align="center" prop="dictValue" />
            <el-table-column :label="$t('dictData.tableColumn[4].label')" align="center" prop="dictSort" />
            <el-table-column :label="$t('dictData.tableColumn[5].label')" align="center" prop="status">
                <template #default="scope">
                    <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('dictData.tableColumn[6].label')" align="center" prop="remark" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('dictData.tableColumn[7].label')" align="center" prop="createTime" width="300">
                <template #default="scope">
                    <span>{{ dateTimeSub(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('tableColumn.operation')" align="center" width="300" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-link class="table_link_btn" :underline="false" size="small" type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['system:dict:edit']">
                        <span class="table_link_text">{{ $t('operationButtons.edit.label') }}</span>
                    </el-link>
                    <el-link class="table_link_btn" :underline="false" size="small" type="primary" @click="handleDelete(scope.row)" v-hasPermi="['system:dict:remove']">
                        <span class="table_link_text">{{ $t('operationButtons.delete.label') }}</span>
                    </el-link>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body @close="cleanSelect">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item :label="$t('dictData.fields[0].label')">
                    <el-input maxlength="100" v-model="form.dictType" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('dictData.fields[1].label')" prop="dictLabel">
                    <el-input maxlength="100" v-model="form.dictLabel" :placeholder="$t('components.input.placeholder')" />
                </el-form-item>
                <el-form-item :label="$t('dictData.fields[2].label')" prop="dictEngLabel">
                    <el-input maxlength="100" v-model="form.dictEngLabel" :placeholder="$t('components.input.placeholder')" />
                </el-form-item>
                <el-form-item :label="$t('dictData.fields[3].label')" prop="dictValue">
                    <el-input maxlength="100" v-model="form.dictValue" :placeholder="$t('components.input.placeholder')" />
                </el-form-item>
                <el-form-item :label="$t('dictData.fields[4].label')" prop="dictSort">
                    <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
                </el-form-item>
                <el-form-item :label="$t('dictData.fields[5].label')" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ useAppStore().language == 'zh' ? dict.dictLabel : dict.dictEngLabel }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('dictData.fields[5].label')" prop="remark">
                    <el-input maxlength="100" v-model="form.remark" type="textarea" :placeholder="$t('components.input.placeholder')"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <!-- prettier-ignore -->
                    <el-button type="primary" @click="submitForm">{{$t('components.btn.confirmButton')}}</el-button>
                    <el-button @click="cancel()">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name="Data" setup>
import Data from '@/api/request/system/dict/data'
import useAppStore from '@/store/modules/app'
// prettier-ignore
const {
    loading, showSearch, total, dataList, title, open, statusOptions, typeOptions, dateRange, queryParams, form, formRef,
    queryFormRef, rules, pageTableRef, getList, statusFormat, cancel, handleQuery, resetQuery, handleSelectionChange, handleAdd, handleUpdate,
    submitForm, handleDelete, handleExport, cleanSelect,sys_normal_disable
} = Data();
</script>
