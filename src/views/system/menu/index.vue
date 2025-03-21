<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
            <el-form-item :label="$t('menuManage.searchBar.menuName.label')" prop="menuName">
                <el-input maxlength="100" v-model="queryParams.menuName" :placeholder="$t('components.input.placeholder')" style="width: 200px" clearable @keyup.enter="handleQuery()" @clear="handleQuery()" />
            </el-form-item>
            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain size="small" icon="plus" @click="handleAdd" v-hasPermi="['system:menu:add']">{{ $t('operationButtons.add.label') }}</el-button>
            </el-col>
            <!-- prettier-ignore -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="handleQuery()" />
        </el-row>

        <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="menuId" :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <!-- prettier-ignore -->
            <el-table-column prop="menuName" :label="$t('menuManage.tableColumn[0].label')" :show-overflow-tooltip="true" min-width="120" />
            <el-table-column prop="icon" :label="$t('menuManage.tableColumn[1].label')" align="center" min-width="120">
                <template #default="scope">
                    <svg-icon :icon-class="scope.row.icon" />
                </template>
            </el-table-column>
            <!-- prettier-ignore -->
            <el-table-column prop="orderNum"  :label="$t('menuManage.tableColumn[2].label')" align="center" min-width="120"/>
            <!-- prettier-ignore -->
            <el-table-column prop="perms" :label="$t('menuManage.tableColumn[3].label')"  min-width="120" :show-overflow-tooltip="true" />
            <!-- prettier-ignore -->
            <el-table-column prop="component"  :label="$t('menuManage.tableColumn[4].label')" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column prop="status" :label="$t('menuManage.tableColumn[5].label')" min-width="120">
                <template #default="scope">
                    <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('menuManage.tableColumn[6].label')" align="center" prop="createTime" min-width="120">
                <template #default="scope">
                    <span>{{ dateTimeSub(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('menuManage.tableColumn[7].label')" align="center" prop="updateTime" min-width="120">
                <template #default="scope">
                    <span>{{ scope.row.updateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('tableColumn.operation')" align="center" min-width="200" class-name="small-padding fixed-width" fixed="right">
                <template #default="scope">
                    <el-link class="table_link_btn" :underline="false" type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['system:menu:edit']">
                        <span class="table_link_text">{{ $t('operationButtons.edit.label') }}</span>
                    </el-link>
                    <el-link class="table_link_btn" :underline="false" type="primary" @click="handleAdd(scope.row)" v-hasPermi="['system:menu:add']">
                        <span class="table_link_text">{{ $t('operationButtons.add.label') }}</span>
                    </el-link>
                    <el-link class="table_link_btn" :underline="false" type="primary" @click="handleDelete(scope.row)" v-hasPermi="['system:menu:remove']">
                        <span class="table_link_text">{{ $t('operationButtons.delete.label') }}</span>
                    </el-link>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="pageTable && total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPage()" />

        <!-- 添加或修改菜单对话框 -->
        <el-dialog :title="title" v-model="open" width="40%" append-to-body @closed="cleanSelect()">
            <el-form ref="menuRef" :model="form" :rules="rules" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('menuManage.fields[0].label')">
                            <!-- prettier-ignore -->
                            <el-tree-select
								v-model="form.parentId"
								:data="menuOptions"
								:props="elTreeProps"
								value-key="menuId"
								:placeholder="$t('components.select.placeholder')"
								check-strictly
                                style="width: 100%;"
                                :render-after-expand="false"
							/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('menuManage.fields[1].label')" prop="menuType">
                            <el-radio-group v-model="form.menuType">
                                <el-radio label="M">{{ $t('menuManage.fields[1].options[0]') }}</el-radio>
                                <el-radio label="C">{{ $t('menuManage.fields[1].options[1]') }}</el-radio>
                                <el-radio label="F">{{ $t('menuManage.fields[1].options[2]') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="form.menuType != 'F'">
                        <el-form-item :label="$t('menuManage.fields[2].label')" prop="icon">
                            <el-popover placement="bottom-start" :width="560" v-model:visible="showChooseIcon" trigger="click">
                                <template #reference>
                                    <!-- prettier-ignore -->
                                    <el-input maxlength="100" v-model="form.icon" :placeholder="$t('components.input.placeholder')" @click="showSelectIcon" readonly >
										<template #prefix>
                                            <!-- prettier-ignore -->
											<svg-icon
												v-if="form.icon"
												:icon-class="form.icon"
												class="el-input__icon"
												style="height: 32px;width: 16px;"
											/>
                                            <!-- prettier-ignore -->
											<el-icon v-else style="height: 32px;width: 16px;"><search/></el-icon>
										</template>
									</el-input>
                                </template>
                                <!-- prettier-ignore -->
                                <icon-select ref="iconSelectRef" @visible="showSelectIcon" @selected="selected" v-click-outside="hideSelectIcon" />
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('menuManage.fields[3].label')" prop="menuName">
                            <el-input maxlength="100" v-model="form.menuName" :placeholder="$t('components.input.placeholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('menuManage.fields[4].label')" prop="orderNum">
                            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item prop="path" :label="$t('menuManage.fields[5].label')">
                            <el-input maxlength="100" v-model="form.path" :placeholder="$t('components.input.placeholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item prop="component" :label="$t('menuManage.fields[6].label')">
                            <el-input maxlength="100" v-model="form.component" :placeholder="$t('components.input.placeholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'M'">
                        <el-form-item :label="$t('menuManage.fields[7].label')">
                            <el-input v-model="form.perms" :placeholder="$t('components.input.placeholder')" maxlength="100" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item :label="$t('menuManage.fields[8].label')">
                            <el-input v-model="form.query" :placeholder="$t('components.input.placeholder')" maxlength="255" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item :label="$t('menuManage.fields[9].label')">
                            <el-radio-group v-model="form.isCache">
                                <el-radio label="0">{{ $t('menuManage.fields[9].options[0]') }}</el-radio>
                                <el-radio label="1">{{ $t('menuManage.fields[9].options[1]') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item>
                            <template #label>
                                <span>
                                    <el-tooltip :content="$t('menuManage.fields[10].tooltip')" placement="top">
                                        <el-icon><question-filled /></el-icon>
                                    </el-tooltip>
                                    {{ $t('menuManage.fields[10].label') }}
                                </span>
                            </template>
                            <el-radio-group v-model="form.visible">
                                <el-radio v-for="dict in sys_show_hide" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item>
                            <template #label>
                                <span>
                                    <el-tooltip :content="$t('menuManage.fields[11].tooltip')" placement="top">
                                        <el-icon><question-filled /></el-icon>
                                    </el-tooltip>
                                    {{ $t('menuManage.fields[11].label') }}
                                </span>
                            </template>
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <!-- prettier-ignore -->
                    <el-button type="primary" @click="submitForm()">{{$t('components.btn.confirmButton')}}</el-button>
                    <el-button @click="cancel()">{{ $t('components.btn.cancelButton') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name="Menu" setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
import IconSelect from '@/components/IconSelect/index.vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import Menu from '@/api/request/system/menu'
// prettier-ignore
const {
    loading, open, queryRef, showSearch, title, menuList, menuOptions, isExpandAll, refreshTable, showChooseIcon, iconSelectRef, menuRef, queryParams,
    form, rules, sys_show_hide, sys_normal_disable, elTreeProps, total, pageTable,
    cancel, showSelectIcon, selected, handleQuery, resetQuery, handleAdd, handleUpdate, submitForm, hideSelectIcon,
    handleDelete, getPage, cleanSelect,
} = Menu();
</script>
<style scoped lang="scss">
.icon-body {
    width: 100%;
    padding: 10px;
    .icon-list {
        height: 200px;
        overflow-y: scroll;
        div {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            margin: 5px 0 -5px 10px;
            cursor: pointer;
            width: 30%;
            float: left;
        }
        span {
            display: inline-block;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
        }
    }
}
</style>
