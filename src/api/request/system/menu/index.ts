import { ElForm, ElTable } from 'element-plus'
// prettier-ignore
import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
// prettier-ignore
import { addMenu, delMenu, getMenu, listMenu, pageList, updateMenu, } from "@/api/system/menu";
import useAppStore from '@/store/modules/app'
import { $t } from '@/lang'

export default () => {
    const { proxy } = getCurrentInstance() as any
    const open = ref<boolean>(false)
    const loading = ref<boolean>(true)
    const pageLoading = ref<boolean>(true)
    const showSearch = ref<boolean>(true)
    // 选中数组
    const ids = ref<any>()
    // 非单个禁用
    const single = ref<boolean>(true)
    // 非多个禁用
    const multiple = ref<boolean>(true)
    const title = ref<string>('')
    // 总条数
    const total = ref<number>(0)
    const menuList = ref<any>()
    const pageTable = ref<boolean>(false)
    const menuPage = ref<any>()
    const menuOptions = ref<any>([])
    const isExpandAll = ref<boolean>(false)
    const refreshTable = ref<boolean>(true)
    const showChooseIcon = ref<boolean>(false)
    const iconSelectRef = ref<any>()
    const menuRef = ref<InstanceType<typeof ElForm>>()
    const queryRef = ref<InstanceType<typeof ElForm>>()
    const pageTableRef = ref<InstanceType<typeof ElTable>>()
    const dateRange = ref<any>([])
    const dateRange2 = ref<string>('')
    const elTreeProps = ref({
        value: 'menuId',
        label: 'menuName',
        children: 'children'
    })
    const form = ref<any>()
    const queryParams = ref<any>({
        pageNum: 1,
        pageSize: 10,
        menuName: undefined,
        visible: undefined,
        status: undefined,
        editTimeScope: undefined
    })
    const rules = ref({
        menuName: [
            {
                required: true,
                message: useAppStore().language == 'zh' ? '菜单名称不能为空' : 'Menu name cannot be empty',
                trigger: 'blur'
            }
        ],
        orderNum: [
            {
                required: true,
                message: useAppStore().language == 'zh' ? '菜单顺序不能为空' : 'Menu sequence cannot be empty',
                trigger: 'blur'
            }
        ],
        path: [
            {
                required: true,
                message: useAppStore().language == 'zh' ? '路由地址不能为空' : 'The routing address cannot be empty.',
                trigger: 'blur'
            }
        ]
    })

    // prettier-ignore
    const { sys_show_hide, sys_normal_disable } = proxy.useDict("sys_show_hide", "sys_normal_disable");

    const tableSwitch = ref<string>('分页表格')
    const switchIcon = ref<string>('list')

    /** 查询菜单列表 */
    const getList = async () => {
        loading.value = true
        proxy.addDateRange(queryParams.value, dateRange.value)
        queryParams.value.editTimeScope = dateRange2.value.toString()
        await listMenu(queryParams.value).then((response: any) => {
            menuList.value = proxy.handleTree(response.data, 'menuId')
            loading.value = false
        })
    }

    /** 查询菜单分页列表 */
    const getPage = async () => {
        pageLoading.value = true
        queryParams.value.editTimeScope = dateRange2.value.toString()
        proxy.addDateRange(queryParams.value, dateRange.value)
        await pageList(queryParams.value).then((response: any) => {
            if (response.code === 200) {
                const data = response.data
                menuPage.value = data.rows
                total.value = parseInt(data.total)
                pageLoading.value = false
            }
        })
    }
    /** 查询菜单下拉树结构 */
    const getTreeselect = async () => {
        menuOptions.value = []
        await listMenu().then((response: any) => {
            const data = response.data
            const menu = { menuId: 0, menuName: useAppStore().language == 'zh' ? '主类目' : 'Main Category', children: [] }
            menu.children = proxy.handleTree(data, 'menuId')
            menuOptions.value.push(menu)
        })
    }

    /**
     * 清除表格行选中
     */
    const cleanSelect = () => {
        pageTableRef.value?.clearSelection()
    }

    /** 取消按钮 */
    const cancel = () => {
        reset()
        cleanSelect()
        open.value = false
    }
    /** 表单重置 */
    const reset = () => {
        form.value = {
            menuId: undefined,
            parentId: 0,
            menuName: undefined,
            icon: undefined,
            menuType: 'M',
            orderNum: undefined,
            isFrame: '1',
            isCache: '0',
            visible: '0',
            status: '0'
        }
        proxy.resetForm(menuRef)
    }
    /** 展示下拉图标 */
    const showSelectIcon = () => {
        iconSelectRef.value?.reset()
        showChooseIcon.value = true
    }
    /** 选择图标 */
    const selected = (name: string) => {
        form.value.icon = name
        showChooseIcon.value = false
    }
    /** 图标外层点击隐藏下拉列表 */
    const hideSelectIcon = () => {
        showChooseIcon.value = false
    }
    /** 搜索按钮操作 */
    const handleQuery = () => {
        if (total.value === 0 && !pageTable.value) {
            getList()
        } else {
            getPage()
        }
    }
    /** 重置按钮操作 */
    const resetQuery = () => {
        dateRange.value = []
        dateRange2.value = ''
        proxy.resetForm(queryRef)
        handleQuery()
    }
    /** 新增按钮操作 */
    const handleAdd = (row: any) => {
        reset()
        getTreeselect()
        if (row != null && row.menuId) {
            form.value.parentId = row.menuId
        } else {
            form.value.parentId = 0
        }
        open.value = true
        title.value = $t('dialog.addTitle')
    }
    // 多选框选中数据
    const multipleSelection = (selection: any) => {
        ids.value = selection.map((item: any) => item.menuId)
        single.value = selection.length != 1
        multiple.value = !selection.length
    }

    /** 展开/折叠操作 */
    const toggleExpandAll = () => {
        refreshTable.value = false
        isExpandAll.value = !isExpandAll.value
        nextTick(() => {
            refreshTable.value = true
        })
    }
    /** 修改按钮操作 */
    const handleUpdate = (row: any) => {
        const menuId = row.menuId || ids.value
        reset()
        getTreeselect()
        // prettier-ignore
        getMenu(menuId).then((response: any) => {
				if (response.code === 200) {
					const data = response.data;
					// 后端返回parentId为字符串并且是父目录情况下需要转换下parentId，不然会显示为0
					if (data.parentId === "0") {
						data.parentId = parseInt(data.parentId);
					}
					/* [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Number with value 3, got String with value "3".*/
					data.orderNum = parseInt(data.orderNum);
					form.value = data;
				}
			})
			.finally(() => {
				title.value = $t('dialog.editTitle')
				open.value = true;
			});
    }
    /** 提交按钮 */
    const submitForm = async () => {
        await menuRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.menuId !== undefined) {
                    updateMenu(form.value).then((response: any) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess($t('components.message.edit'))
                            open.value = false
                            handleQuery()
                        }
                    })
                } else {
                    addMenu(form.value).then((response: any) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess($t('components.message.add'))
                            open.value = false
                            handleQuery()
                        }
                    })
                }
            }
        })
    }
    /** 删除按钮操作 */
    const handleDelete = (row: any) => {
        // 设置当前行被选中
        proxy.setTableRowSelected(pageTableRef, row, true)
        // prettier-ignore
        proxy.$modal
            .confirm($t('components.message.delete.content'), {
                confirmButtonText: $t('components.btn.confirmButton'),
                cancelButtonText: $t('components.btn.cancelButton')
            })
            .then(() => {
                return delMenu(row.menuId)
            })
            .then((response: any) => {
                if (response.code === 200) {
                    proxy.$modal.msgSuccess($t('components.message.delete'))
                    getList()
                }
            })
            .catch(() => {
                proxy.setTableRowSelected(pageTableRef, row, false)
            })
    }

    onMounted(() => {
        getList()
    })

    // prettier-ignore
    return {
        loading, open, queryRef, showSearch, title, total, menuList, menuOptions, isExpandAll, refreshTable, showChooseIcon, iconSelectRef, menuRef,
        queryParams, form, rules, sys_show_hide, sys_normal_disable, dateRange, elTreeProps, menuPage, pageTable, single, multiple, pageLoading,
        getList, cancel, showSelectIcon, selected, hideSelectIcon, handleQuery, resetQuery, handleAdd, toggleExpandAll, handleUpdate, submitForm,
        handleDelete, getPage, multipleSelection, switchIcon, tableSwitch, ids, pageTableRef, cleanSelect, dateRange2,
    }
}
