<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch" label-width="70px">
            <el-form-item label="字典名称" prop="dictType">
                <el-select v-model="queryParams.dictType" :placeholder="$t('components.select.placeholder')" clearable filterable @change="handleQuery()">
                    <el-option v-for="item in typeOptions" :key="item.dictId" :label="item.dictName" :value="item.dictType" />
                </el-select>
            </el-form-item>
            <el-form-item label="字典标签" prop="dictLabel">
                <el-input maxlength="100" v-model="queryParams.dictLabel" placeholder="请输入字典标签" clearable @keyup.enter.native="handleQuery()" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="数据状态" clearable @change="handleQuery()">
                    <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间" style="font-weight: bold">
                <el-date-picker v-model="dateRange" style="width: 240px" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleQuery"></el-date-picker>
            </el-form-item>
            <el-form-item class="item-search">
                <!-- prettier-ignore -->
                <el-button icon="refresh" @click="resetQuery">重置</el-button>
                <!-- prettier-ignore -->
                <el-button type="primary" icon="search" @click="handleQuery" >搜索</el-button>
            </el-form-item>
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
            <el-table-column label="字典编码" align="center" prop="dictCode" width="120" />
            <el-table-column label="字典标签" align="center" prop="dictLabel" width="250">
                <template #default="scope">
                    <!-- prettier-ignore -->
                    <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{ scope.row.dictLabel }}</span>
                    <!-- prettier-ignore -->
                    <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{ scope.row.dictLabel }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="字典键值" align="center" prop="dictValue" />
            <el-table-column label="字典排序" align="center" prop="dictSort" />
            <el-table-column label="启用/停用状态" align="center" prop="status" :formatter="statusFormat" />
            <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="300">
                <template #default="scope">
                    <span>{{ dateTimeSub(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('tableColumn.operation')" align="center" width="300" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-link class="table_link_btn" :underline="false" size="small" type="primary" icon="edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dict:edit']"><span class="table_link_text">修改</span></el-link>
                    <el-link class="table_link_btn" :underline="false" size="small" type="primary" icon="delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dict:remove']"><span class="table_link_text">删除</span></el-link>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body @close="cleanSelect">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="字典类型">
                    <el-input maxlength="100" v-model="form.dictType" :disabled="true" />
                </el-form-item>
                <el-form-item label="数据标签" prop="dictLabel">
                    <el-input maxlength="100" v-model="form.dictLabel" placeholder="请输入数据标签" />
                </el-form-item>
                <el-form-item label="数据键值" prop="dictValue">
                    <el-input maxlength="100" v-model="form.dictValue" placeholder="请输入数据键值" />
                </el-form-item>
                <el-form-item label="显示排序" prop="dictSort">
                    <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input maxlength="100" v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
// prettier-ignore
const {
    loading, single, multiple, showSearch, total, dataList, title, open, statusOptions, typeOptions, dateRange, queryParams, form, formRef,
    queryFormRef, rules, pageTableRef, getList, statusFormat, cancel, handleQuery, resetQuery, handleSelectionChange, handleAdd, handleUpdate,
    submitForm, handleDelete, handleExport, cleanSelect,
} = Data();
</script>
