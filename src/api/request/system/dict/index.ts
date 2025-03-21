import { getCurrentInstance, ref } from 'vue'
// prettier-ignore
import { listType, getDataType, delType, addType, updateType, exportType, clearCache, updateDictTypeStatus, } from "@/api/system/dict/type";
import { ElForm, ElTable } from 'element-plus'
import { $t } from '@/lang'
import useAppStore from '@/store/modules/app'

export default () => {
    const { proxy } = getCurrentInstance() as any
    // 遮罩层
    const loading = ref<boolean>(true)
    // 选中数组
    const ids = ref<any>([])
    // 非单个禁用
    const single = ref<boolean>(true)
    // 非多个禁用
    const multiple = ref<boolean>(true)
    // 显示搜索条件
    const showSearch = ref<boolean>(true)
    // 总条数
    const total = ref<number>(0)
    // 字典表格数据
    const typeList = ref<any>()
    // 弹出层标题
    const title = ref<string>('')
    // 是否显示弹出层
    const open = ref<boolean>(false)
    // 状态数据字典
    const statusOptions = ref<any>()
    const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
    // 查询参数
    const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
    })
    // 日期范围
    const dateRange = ref<any>()
    // 表单参数
    const form = ref<any>()
    const formRef = ref<InstanceType<typeof ElForm>>()
    const queryFormRef = ref<InstanceType<typeof ElForm>>()
    const pageTableRef = ref<InstanceType<typeof ElTable>>()
    // 表单校验
    const rules = ref({
        dictName: [
            {
                required: true,
                message: useAppStore().language == 'zh' ? '字典名称不能为空' : 'Dictionary name cannot be empty',
                trigger: 'blur'
            }
        ],
        dictEngName: [
            {
                required: true,
                message: useAppStore().language == 'zh' ? '字典英文名称不能为空' : 'Dictionary En name cannot be empty',
                trigger: 'blur'
            }
        ],
        dictType: [
            {
                required: true,
                message: useAppStore().language == 'zh' ? '字典类型不能为空' : 'The dictionary type cannot be empty',
                trigger: 'blur'
            }
        ]
    })

    /** 查询字典类型列表 */
    const getList = () => {
        typeList.value = []
        loading.value = true
        listType(proxy.addDateRange(queryParams.value, dateRange.value)).then((response: any) => {
            typeList.value = response.rows
            total.value = parseInt(response.total)
            loading.value = false
        })
    }
    // 字典状态字典翻译
    const statusFormat = (row: any) => {
        return proxy.selectDictLabel(statusOptions.value, row.status)
    }

    /**
     * 取消表格选中
     */
    const cleanSelect = () => {
        proxy.cleanTableSelection(pageTableRef)
    }

    // 取消按钮
    const cancel = () => {
        open.value = false
        reset()
        cleanSelect()
    }
    // 表单重置
    const reset = () => {
        form.value = {
            dictId: undefined,
            dictName: undefined,
            dictEngName: undefined,
            dictType: undefined,
            status: '0',
            remark: undefined
        }
        proxy.resetForm(formRef)
    }
    /** 搜索按钮操作 */
    const handleQuery = () => {
        queryParams.value.pageNum = 1
        getList()
    }
    /** 重置按钮操作 */
    const resetQuery = () => {
        dateRange.value = []
        proxy.resetForm(queryFormRef)
        handleQuery()
    }
    /** 新增按钮操作 */
    const handleAdd = () => {
        reset()
        title.value = $t('dialog.addTitle')
        open.value = true
    }
    // 多选框选中数据
    const handleSelectionChange = (selection: any) => {
        ids.value = selection.map((item: any) => item.dictId)
        single.value = selection.length != 1
        multiple.value = !selection.length
    }
    /** 修改按钮操作 */
    const handleUpdate = (row: any) => {
        reset()
        const dictId = row.dictId || ids.value
        getDataType(dictId).then((response: any) => {
            form.value = response.data
            title.value = $t('dialog.editTitle')
            proxy.setTableRowSelected(pageTableRef, row, true)
            open.value = true
        })
    }
    /**
     * 修改状态
     *
     * @param val 当前选中的值
     * @param row 当前行数据
     */
    const updateStatus = async (val: any, row: any) => {
        /* console.log("aaaaa", row.status);
        const text = row.status === "0" ? "停用" : "启用";
        await proxy.$confirm(
            "确认要" + text + "吗?", "警告",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }
        ).then(() => {
            return updateDictTypeStatus(row.dictId, val);
        })
        .then((response: any) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess(response.msg);
                getList();
            }
        })
        .catch(() => {
            console.log("ssssss", row.status, val);
            row.status = val === "0" ? "1" : "0";
        }); */
        await updateDictTypeStatus(row.dictId, val).then((response: any) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess(response.msg)
                getList()
            }
        })
    }
    /** 提交按钮 */
    const submitForm = () => {
        formRef.value?.validate((valid) => {
            if (valid) {
                if (form.value.dictId != undefined) {
                    updateType(form.value).then((response: any) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess($t('components.message.edit'))
                            open.value = false
                            getList()
                        }
                    })
                } else {
                    addType(form.value).then((response: any) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess($t('components.message.add'))
                            open.value = false
                            getList()
                        }
                    })
                }
            }
        })
    }
    /** 删除按钮操作 */
    const handleDelete = (row: any) => {
        const dictIds = row.dictId || ids.value
        if (row) {
            proxy.setTableRowSelected(pageTableRef, row, true)
        }
        // prettier-ignore
        proxy.$modal
            .confirm($t('components.message.delete.content'), {
                confirmButtonText: $t('components.btn.confirmButton'),
                cancelButtonText: $t('components.btn.cancelButton')
            })
            .then(() => {
                return delType(dictIds)
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList()
                    proxy.$modal.msgSuccess($t('components.message.delete'))
                }
            })
            .catch(() => {
                cleanSelect()
            })
    }
    /** 导出按钮操作 */
    const handleExport = () => {
        // prettier-ignore
        proxy.download('/system/dict/type/exportByStream', { ...queryParams }, `${$t('menu.Dict')}${new Date().getTime()}.xlsx`)
    }
    /** 清理缓存按钮操作 */
    const handleClearCache = () => {
        clearCache().then((response) => {
            // proxy.$modal.msgSuccess('清理成功')
        })
    }

    getList()
    proxy.getDicts('sys_normal_disable').then((response: { data: any }) => {
        statusOptions.value = response.data
    })

    // prettier-ignore
    return {
        loading,
        single,
        multiple,
        showSearch,
        total,
        typeList,
        title,
        open,
        statusOptions,
        queryParams,
        dateRange,
        form,
        formRef,
        queryFormRef,
        rules,
        getList,
        cancel,
        handleQuery,
        resetQuery,
        handleSelectionChange,
        handleAdd,
        handleUpdate,
        updateStatus,
        submitForm,
        handleDelete,
        handleExport,
        handleClearCache,
        pageTableRef,
        cleanSelect,
        sys_normal_disable
    }
}
