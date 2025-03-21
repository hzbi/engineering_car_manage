<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch" label-width="auto">
            <el-form-item :label="$t('dictManage.searchBar.dictName.label')" prop="dictName">
                <el-input maxlength="100" v-model="queryParams.dictName" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item :label="$t('dictManage.searchBar.dictType.label')" prop="dictType">
                <el-input maxlength="100" v-model="queryParams.dictType" :placeholder="$t('components.input.placeholder')" clearable style="width: 200px" />
            </el-form-item>
            <form-search @reset="resetQuery" @search="handleQuery" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" size="small" @click="handleAdd" v-hasPermi="['system:dict:add']">{{ $t('operationButtons.add.label') }}</el-button>
            </el-col>
            <!-- prettier-ignore -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </el-row>

        <el-table stripe border height="560px" v-loading="loading" ref="pageTableRef" :data="typeList">
            <el-table-column :label="$t('dictManage.tableColumn[0].label')" align="center" prop="dictId" min-width="120" />
            <el-table-column :label="$t('dictManage.tableColumn[1].label')" align="center" prop="dictName" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('dictManage.tableColumn[2].label')" align="center" prop="dictEngName" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('dictManage.tableColumn[3].label')" align="center" min-width="120" :show-overflow-tooltip="true">
                <template #default="scope">
                    <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">
                        <span>{{ scope.row.dictType }}</span>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column :label="$t('dictManage.tableColumn[4].label')" align="center" prop="status" min-width="120">
                <template #default="scope">
                    <!-- prettier-ignore -->
                    <!-- <data-single-tag :single-data.sync="scope.row.status" :status-options="statusOptions"/> -->
                    <!-- prettier-ignore -->
                    <!-- <status-switch
                        :status-data.sync="scope.row.status"
                        @handleChange.native="updateStatus($event, scope.row)"
                    /> -->
                    <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('dictManage.tableColumn[5].label')" align="center" prop="remark" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('dictManage.tableColumn[6].label')" align="center" prop="createTime" min-width="120">
                <template #default="scope">
                    <span>{{ dateTimeSub(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('tableColumn.operation')" align="center" width="200" fixed="right">
                <template #default="scope">
                    <el-link class="table_link_btn" :underline="false" type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['system:dict:edit']">
                        <span class="table_link_text">{{ $t('operationButtons.edit.label') }}</span>
                    </el-link>
                    <el-link :underline="false" size="small" type="primary" @click="handleDelete(scope.row)" v-hasPermi="['system:dict:remove']">
                        <span class="table_link_text">{{ $t('operationButtons.delete.label') }}</span>
                    </el-link>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body @closed="cleanSelect()">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-form-item :label="$t('dictManage.fields[0].label')" prop="dictName">
                    <el-input maxlength="100" v-model="form.dictName" :placeholder="$t('components.input.placeholder')" />
                </el-form-item>
                <el-form-item :label="$t('dictManage.fields[1].label')" prop="dictEngName">
                    <el-input maxlength="100" v-model="form.dictEngName" :placeholder="$t('components.input.placeholder')" />
                </el-form-item>
                <el-form-item :label="$t('dictManage.fields[2].label')" prop="dictType">
                    <el-input maxlength="100" v-model="form.dictType" :placeholder="$t('components.input.placeholder')" />
                </el-form-item>
                <el-form-item :label="$t('dictManage.fields[3].label')" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ useAppStore().language == 'zh' ? dict.dictLabel : dict.dictEngLabel }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('dictManage.fields[4].label')" prop="remark">
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

<script lang="ts" name="Dict" setup>
import Dict from '@/api/request/system/dict'
import useAppStore from '@/store/modules/app'
// prettier-ignore
const {
    loading, showSearch, total, typeList, title, open, statusOptions, queryParams, form, formRef, queryFormRef, rules,
    getList, cancel, handleQuery, resetQuery, handleAdd, handleUpdate, updateStatus, submitForm, handleDelete,
    pageTableRef, cleanSelect,sys_normal_disable
} = Dict();
</script>
