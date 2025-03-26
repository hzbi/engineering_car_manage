export default {
    login: {
        title: '工程卡车管理系统',
        logIn: '登 录',
        loggingIn: '登 录 中...',
        username: '账号',
        password: '密码',
        code: '验证码',
        rememberMe: '记住密码',
        imgTitle: '看不清？点击更换'
    },
    logout: {
        message: {
            title: '提示',
            content: '确定注销并退出系统吗？'
        }
    },
    navbar: {
        welcome: '欢迎您，',
        mine: '个人中心',
        exit: '退出登录',
        personalInfo: {
            title: '个人信息',
            userAvatar: {
                title: '修改头像',
                select: '选择',
                submit: '提交'
            },
            userName: '用户账号',
            phoneNumber: '手机号码',
            role: '所属角色',
            creationDate: '创建日期'
        },
        basicInfo: {
            tab: {
                basicInfo: '基础信息',
                editPassword: '修改密码'
            },
            title: '基本资料',
            nickname: '姓名',
            phone: '手机号码',
            gender: '性别',
            genderType: {
                man: '男',
                woman: '女'
            },
            oldPassword: '旧密码',
            newPassword: '新密码',
            confirmPassword: '确认密码'
        }
    },
    menu: {
        Index: '首页',
        Truck: '车辆管理',
        TruckInfo: '车辆信息管理',
        MaintainRecords: '维护记录管理',
        AccessoryUse: '配件使用记录',
        AccessoryStock: '配件库存管理',
        Driver: '司机管理',
        DriverInfo: '司机信息管理',
        DriverPerformance: '司机表现记录',
        Workload: '工作量记录',
        Statistics: '统计报表',
        TruckStatistics: '按车辆统计',
        SiteStatistics: '按工地统计',
        MaintenanceRecord: '维修记录分析',
        AccessoryNum: '配件库存看板',
        System: '系统管理',
        User: '用户管理',
        Role: '角色管理',
        Menu: '菜单管理',
        Dict: '字典管理',
        Data: '字典数据',
        Site: '基础数据',
        SiteManage: '工地管理',
        Profile: '个人中心'
    },
    index: {
        dateRange: {
            startDate: {
                label: '开始日期'
            },
            endDate: {
                label: '结束日期'
            }
        },
        link: {
            workload: '工作量登记',
            maintainRecords: '维护记录',
            driverPerformance: '司机表现',
            accessoryStock: '配件库存'
        },
        registrationRecordStatistics: {
            title: '登记记录数量统计',
            unit: '条',
            records: [
                {
                    type: '工作量登记'
                },
                {
                    type: '维护记录'
                },
                {
                    type: '司机表现'
                },
                {
                    type: '配件记录'
                }
            ]
        },
        partsInventory: {
            title: '配件库存',
            tableColumn: [
                {
                    label: '配件类型'
                },
                {
                    label: '剩余总量'
                }
            ]
        }
    },
    truckInfo: {
        searchBar: {
            plateNumber: {
                label: '车牌号'
            },
            vehicleType: {
                label: '车型'
            }
        },
        tableColumn: [
            {
                label: '车牌号'
            },
            {
                label: '车型'
            },
            {
                label: '吨位'
            },
            {
                label: '车辆制造日期'
            },
            {
                label: '年检日期'
            },
            {
                label: '备注'
            },
            {
                label: '状态'
            },
            {
                label: '创建人'
            },
            {
                label: '创建时间'
            }
        ],
        fields: [
            {
                label: '车牌号'
            },
            {
                label: '车型'
            },
            {
                label: '吨位'
            },
            {
                label: '制造日期'
            },
            {
                label: '年检日期'
            },
            {
                label: '状态'
            },
            {
                label: '备注'
            }
        ]
    },
    maintainRecords: {
        searchBar: {
            plateNumber: {
                label: '车牌号'
            },
            constructionSiteName: {
                label: '工地名称'
            },
            maintenanceType: {
                label: '维护类型'
            },
            startDate: {
                label: '开始日期'
            },
            endDate: {
                label: '结束日期'
            }
        },
        tableColumn: [
            {
                label: '日期'
            },
            {
                label: '车牌号'
            },
            {
                label: '工地名称'
            },
            {
                label: '维护类型'
            },
            {
                label: '油耗'
            },
            {
                label: '公里数'
            },
            {
                label: '详细说明'
            },
            {
                label: '货币单位'
            },
            {
                label: '花费'
            },
            {
                label: '维修商'
            },
            {
                label: '保养人员'
            },
            {
                label: '下次维护日期'
            },
            {
                label: '创建人'
            },
            {
                label: '创建时间'
            }
        ],
        fields: [
            {
                label: '日期'
            },
            {
                label: '车牌号'
            },
            {
                label: '工地名称'
            },
            {
                label: '维护类型'
            },
            {
                label: '油耗'
            },
            {
                label: '公里数'
            },
            {
                label: '详细说明'
            },
            {
                label: '维修方式',
                options: ['内部人员维修', '外部维修商维修']
            },
            {
                label: '保养人员'
            },
            {
                label: '维修商'
            },
            {
                label: '下次维护日期'
            },
            {
                label: '货币单位'
            },
            {
                label: '花费'
            }
        ],
        basicInfo: {
            title: '基本信息',
            maintenanceDate: '维护日期',
            plateNumber: '车牌号',
            constructionSiteName: '工地名称',
            maintenanceType: '维护类型',
            fuelConsumption: '油耗',
            mileage: '公里数',
            repairMethod: '维修方式',
            repairMethodOptions: ['内部人员维修', '外部维修商维修'],
            maintenanceOptions: ['保养人员', '维修商'],
            nextMaintenanceDate: '下次维护日期',
            creator: '创建人',
            creationTime: '创建时间',
            description: '详细说明'
        },
        partsUsageRecords: {
            title: '配件使用记录',
            tableColumn: [
                {
                    label: '配件类型'
                },
                {
                    label: '配件名称'
                },
                {
                    label: '数量'
                },
                {
                    label: '用途'
                },
                {
                    label: '供应商'
                },
                {
                    label: '备注'
                },
                {
                    label: '创建人'
                },
                {
                    label: '创建时间'
                }
            ]
        }
    },
    accessoryUse: {
        searchBar: {
            plateNumber: {
                label: '车牌号'
            },
            startDate: {
                label: '开始日期'
            },
            endDate: {
                label: '结束日期'
            }
        },
        tableColumn: [
            {
                label: '日期'
            },
            {
                label: '车牌号'
            },
            {
                label: '配件类型'
            },
            {
                label: '配件名称'
            },
            {
                label: '数量'
            },
            {
                label: '用途'
            },
            {
                label: '供应商'
            },
            {
                label: '备注'
            },
            {
                label: '创建人'
            },
            {
                label: '创建时间'
            }
        ],
        fields: [
            {
                label: '日期'
            },
            {
                label: '工地名称'
            },
            {
                label: '车牌号'
            },
            {
                label: '配件类型'
            },
            {
                label: '配件名称'
            },
            {
                label: '供应商'
            },
            {
                label: '数量'
            },
            {
                label: '用途'
            },
            {
                label: '备注'
            },
            {
                label: '出库人员'
            }
        ]
    },
    accessoryStock: {
        searchBar: {
            partName: {
                label: '配件名称'
            },
            partType: {
                label: '配件类型'
            },
            constructionSiteName: {
                label: '工地名称'
            },
            startDate: {
                label: '开始日期'
            },
            endDate: {
                label: '结束日期'
            }
        },
        tableColumn: [
            {
                label: '配件名称'
            },
            {
                label: '工地名称'
            },
            {
                label: '配件类型'
            },
            {
                label: '供应商'
            },
            {
                label: '货币单位'
            },
            {
                label: '价格'
            },
            {
                label: '入库数量'
            },
            {
                label: '剩余数量'
            },
            {
                label: '入库日期'
            },
            {
                label: '入库人员'
            },
            {
                label: '备注'
            },
            {
                label: '创建人'
            },
            {
                label: '创建时间'
            }
        ],
        fields: [
            {
                label: '配件名称'
            },
            {
                label: '工地名称'
            },
            {
                label: '配件类型'
            },
            {
                label: '供应商'
            },
            {
                label: '数量'
            },
            {
                label: '入库日期'
            },
            {
                label: '入库人员'
            },
            {
                label: '备注'
            },
            {
                label: '货币单位'
            },
            {
                label: '价格'
            }
        ],
        basicInfo: {
            title: '基本信息',
            partName: '配件名称',
            constructionSiteName: '工地名称',
            partType: '配件类型',
            supplier: '供应商',
            price: '价格',
            inStockStaff: '入库人员',
            inStockQuantity: '入库数量',
            remainingQuantity: '剩余数量',
            inStockDate: '入库日期',
            creator: '创建人',
            creationTime: '创建时间',
            remark: '备注'
        },
        outboundRecords: {
            title: '出库记录',
            tableColumn: [
                {
                    label: '出库数量'
                },
                {
                    label: '出库日期'
                },
                {
                    label: '出库人员'
                },
                {
                    label: '出库类型',
                    options: ['维修出库', '单独出库']
                },
                {
                    label: '备注'
                },
                {
                    label: '创建人'
                },
                {
                    label: '创建时间'
                }
            ],
            fields: [
                {
                    label: '数量'
                },
                {
                    label: '出库日期'
                },
                {
                    label: '出库人员'
                },
                {
                    label: '备注'
                }
            ]
        }
    },
    driverInfo: {
        searchBar: {
            name: {
                label: '姓名'
            },
            idNum: {
                label: '证件号码'
            },
            sex: {
                label: '性别'
            }
        },
        tableColumn: [
            {
                label: '姓名'
            },
            {
                label: '联系方式'
            },
            {
                label: '性别'
            },
            {
                label: '出生日期'
            },
            {
                label: '证件号码'
            },
            {
                label: '银行卡号'
            },
            {
                label: '所属银行'
            },
            {
                label: '入职日期'
            },
            {
                label: '备注'
            },
            {
                label: '状态'
            },
            {
                label: '创建人'
            },
            {
                label: '创建时间'
            },
            {
                label: '分配车辆'
            }
        ],
        fields: [
            {
                label: '姓名'
            },
            {
                label: '联系方式'
            },
            {
                label: '证件号'
            },
            {
                label: '性别'
            },
            {
                label: '出生日期'
            },
            {
                label: '入职日期'
            },
            {
                label: '状态'
            },
            {
                label: '银行卡号'
            },
            {
                label: '所属银行'
            },
            {
                label: '备注'
            }
        ]
    },
    driverPerformance: {
        searchBar: {
            carNumber: {
                label: '车牌号'
            },
            name: {
                label: '司机姓名'
            },
            startTime: {
                label: '开始日期'
            },
            endTime: {
                label: '结束日期'
            }
        },
        tableColumn: [
            {
                label: '日期'
            },
            {
                label: '车牌号'
            },
            {
                label: '司机姓名'
            },
            {
                label: '表现评分（分）'
            },
            {
                label: '违规类型'
            },
            {
                label: '不当行为记录'
            },
            {
                label: '备注'
            },
            {
                label: '创建人'
            },
            {
                label: '创建时间'
            }
        ],
        fields: [
            {
                label: '日期'
            },
            {
                label: '司机姓名'
            },
            {
                label: '车牌号'
            },
            {
                label: '表现评分(总分10分)'
            },
            {
                label: '违规类型'
            },
            {
                label: '不当行为记录'
            },
            {
                label: '备注'
            }
        ]
    },
    workload: {
        searchBar: {
            carNumber: {
                label: '车牌号'
            },
            name: {
                label: '司机姓名'
            },
            startTime: {
                label: '开始日期'
            },
            endTime: {
                label: '结束日期'
            }
        },
        tableColumn: [
            {
                label: '日期'
            },
            {
                label: '车牌号'
            },
            {
                label: '司机姓名'
            },
            {
                label: '工地名称'
            },
            {
                label: '工作时间'
            },
            {
                label: '车数'
            },
            {
                label: '货币单位'
            },
            {
                label: '单价'
            },
            {
                label: '收费金额'
            },
            {
                label: '备注'
            },
            {
                label: '创建人'
            },
            {
                label: '创建时间'
            }
        ],
        fields: [
            {
                label: '日期'
            },
            {
                label: '司机姓名'
            },
            {
                label: '车牌号'
            },
            {
                label: '工地名称'
            },
            {
                label: '结算方式',
                options: ['按工时', '按车数']
            },
            {
                label: '工作时间(小时)'
            },
            {
                label: '车数'
            },
            {
                label: '备注'
            },
            {
                label: '货币单位'
            },
            {
                label: '单价'
            },
            {
                label: '收费金额'
            }
        ]
    },
    truckStatistics: {
        searchBar: {
            year: {
                label: '年份'
            },
            mon: {
                label: '月份'
            },
            carNumber: {
                label: '车牌号'
            },
            carType: {
                label: '车型'
            }
        },
        tableColumn: [
            {
                label: '年/月份'
            },
            {
                label: '车牌号'
            },
            {
                label: '车型'
            },
            {
                label: '总工作量（小时）'
            },
            {
                label: '总车数'
            },
            {
                label: '收费金额'
            },
            {
                label: '油耗'
            },
            {
                label: '维修费用'
            }
        ]
    },
    siteStatistics: {
        searchBar: {
            year: {
                label: '年份'
            },
            mon: {
                label: '月份'
            },
            siteName: {
                label: '工地名称'
            }
        },
        tableColumn: [
            {
                label: '年/月份'
            },
            {
                label: '工地名称'
            },
            {
                label: '总工作量（小时）'
            },
            {
                label: '总车数'
            },
            {
                label: '收费金额'
            }
        ]
    },
    maintenanceRecord: {
        searchBar: {
            year: {
                label: '年份'
            },
            mon: {
                label: '月份'
            },
            carNumber: {
                label: '车牌号'
            },
            carType: {
                label: '车型'
            }
        },
        tableColumn: [
            {
                label: '年/月份'
            },
            {
                label: '车牌号'
            },
            {
                label: '车型'
            },
            {
                label: '维修次数'
            },
            {
                label: '油耗'
            },
            {
                label: '公里数'
            },
            {
                label: '维修费用'
            }
        ]
    },
    accessoryNum: {
        searchBar: {
            siteName: {
                label: '工地名称'
            }
        },
        tableColumn: [
            {
                label: '配件类型'
            },
            {
                label: '剩余总量'
            }
        ]
    },
    userManage: {
        searchBar: {
            nickName: {
                label: '姓名'
            },
            sex: {
                label: '性别'
            }
        },
        tableColumn: [
            {
                label: '编号'
            },
            {
                label: '用户账号'
            },
            {
                label: '姓名'
            },
            {
                label: '性别'
            },
            {
                label: '联系电话'
            },
            {
                label: '角色'
            },
            {
                label: '备注'
            },
            {
                label: '管理车辆'
            },
            {
                label: '管理工地'
            },
            {
                label: '状态'
            }
        ],
        fields: [
            {
                label: '姓名'
            },
            {
                label: '联系电话'
            },
            {
                label: '用户账号'
            },
            {
                label: '登录密码'
            },
            {
                label: '用户性别'
            },
            {
                label: '用户状态'
            },
            {
                label: '所属角色'
            },
            {
                label: '备注信息'
            }
        ],
        truckDialog: {
            title: '选择管理的车辆',
            content: '已选择车辆：'
        },
        siteDialog: {
            title: '选择管理的工地',
            content: '已选择工地：'
        }
    },
    roleManage: {
        searchBar: {
            roleName: {
                label: '角色名称'
            }
        },
        tableColumn: [
            {
                label: '角色编号'
            },
            {
                label: '角色名称'
            },
            {
                label: '权限字符'
            },
            {
                label: '显示顺序'
            },
            {
                label: '备注信息'
            },
            {
                label: '状态'
            },
            {
                label: '创建时间'
            },
            {
                label: '修改时间'
            }
        ],
        fields: [
            {
                label: '角色名称'
            },
            {
                label: '权限字符'
            },
            {
                label: '角色顺序'
            },
            {
                label: '角色状态'
            },
            {
                label: '菜单权限',
                checkboxs: ['展开/折叠', '全选/全不选', '父子联动'],
                loading: '加载中，请稍后'
            },
            {
                label: '备注'
            }
        ],
        roleFields: [
            {
                label: '角色名称'
            },
            {
                label: '权限字符'
            },
            {
                label: '权限范围'
            },
            {
                label: '数据权限',
                checkboxs: ['展开/折叠', '全选/全不选', '父子联动'],
                loading: '加载中，请稍后'
            }
        ]
    },
    menuManage: {
        searchBar: {
            menuName: {
                label: '菜单名称'
            }
        },
        tableColumn: [
            {
                label: '菜单名称'
            },
            {
                label: '图标'
            },
            {
                label: '排序'
            },
            {
                label: '权限标识'
            },
            {
                label: '组件路径'
            },
            {
                label: '状态'
            },
            {
                label: '创建时间'
            },
            {
                label: '修改时间'
            }
        ],
        fields: [
            {
                label: '上级菜单'
            },
            {
                label: '菜单类型',
                options: ['目录', '菜单', '按钮']
            },
            {
                label: '菜单图标'
            },
            {
                label: '菜单名称'
            },
            {
                label: '显示排序'
            },
            {
                label: '路由地址'
            },
            {
                label: '组件路径'
            },
            {
                label: '权限字符'
            },
            {
                label: '路由参数'
            },
            {
                label: '是否缓存',
                options: ['缓存', '不缓存']
            },
            {
                label: '显示状态',
                tooltip: '选择隐藏则路由将不会出现在侧边栏，但仍然可以访问'
            },
            {
                label: '菜单状态',
                tooltip: '选择停用则路由将不会出现在侧边栏，也不能被访问'
            },
            {
                label: '菜单权限',
                checkboxs: ['展开/折叠', '全选/全不选', '父子联动'],
                loading: '加载中，请稍后'
            },
            {
                label: '备注'
            }
        ]
    },
    dictManage: {
        searchBar: {
            dictName: {
                label: '字典名称'
            },
            dictEngName: {
                label: '字典英文名称'
            },
            dictType: {
                label: '字典类型'
            }
        },
        tableColumn: [
            {
                label: '字典编号'
            },
            {
                label: '字典名称'
            },
            {
                label: '字典英文名称'
            },
            {
                label: '字典类型'
            },
            {
                label: '状态'
            },
            {
                label: '备注'
            },
            {
                label: '创建时间'
            }
        ],
        fields: [
            {
                label: '字典名称'
            },
            {
                label: '字典英文名称'
            },
            {
                label: '字典类型'
            },
            {
                label: '状态'
            },
            {
                label: '备注'
            }
        ]
    },
    dictData: {
        searchBar: {
            dictType: {
                label: '字典名称'
            },
            dictLabel: {
                label: '字典标签'
            },
            dictEngLabel: {
                label: '字典英文标签'
            },
            status: {
                label: '状态'
            },
            dateRange: {
                label: '创建时间'
            }
        },
        tableColumn: [
            {
                label: '字典编码'
            },
            {
                label: '字典标签'
            },
            {
                label: '字典英文标签'
            },
            {
                label: '字典键值'
            },
            {
                label: '字典排序'
            },
            {
                label: '启用/停用状态'
            },
            {
                label: '备注'
            },
            {
                label: '创建时间'
            }
        ],
        fields: [
            {
                label: '字典类型'
            },
            {
                label: '数据标签'
            },
            {
                label: '数据英文标签'
            },
            {
                label: '数据键值'
            },
            {
                label: '显示排序'
            },
            {
                label: '状态'
            },
            {
                label: '备注'
            }
        ]
    },
    siteManage: {
        searchBar: {
            siteName: {
                label: '工地名称'
            }
        },
        tableColumn: [
            {
                label: '工地编码'
            },
            {
                label: '工地名称'
            },
            {
                label: '地址'
            },
            {
                label: '联系人'
            },
            {
                label: '联系方式'
            },
            {
                label: '状态'
            }
        ],
        fields: [
            {
                label: '工地编码'
            },
            {
                label: '工地名称'
            },
            {
                label: '地址'
            },
            {
                label: '联系人'
            },
            {
                label: '联系方式'
            },
            {
                label: '状态'
            }
        ]
    },
    tagsView: {
        refresh: '刷新',
        close: '关闭',
        closeOthers: '关闭其它',
        closeAll: '关闭所有'
    },
    settings: {
        title: '系统布局配置',
        theme: '主题色',
        tagsView: '开启 Tags-View',
        fixedHeader: '固定 Header',
        sidebarLogo: '侧边栏 Logo'
    },
    components: {
        btn: {
            resetButton: '重置',
            searchButton: '搜索',
            confirmButton: '确认',
            cancelButton: '取消',
            saveButton: '保存',
            closeButton: '关闭',
            outButton: '出库'
        },
        input: {
            placeholder: '请输入'
        },
        select: {
            placeholder: '请选择'
        },
        datePicker: {
            placeholder: '请选择日期'
        },
        upload: {
            text1: '将文件拖到此处，或',
            text2: '点击上传',
            text3: '提示：仅允许导入“xls”或“xlsx”格式文件！',
            message: '文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。'
        },
        message: {
            add: '新增成功',
            edit: '修改成功',
            delete: {
                text: '删除成功',
                content: '是否确认删除此数据项？'
            },
            upload: '上传成功',
            setting: '设置成功'
        },
        validator: {
            userName: '用户账号不能为空',
            nickName: '姓名不能为空',
            roleIds: '所属角色不能为空',
            email: {
                empty: '邮箱地址不能为空',
                error: '请输入正确的邮箱地址'
            },
            phonenumber: {
                empty: '手机号码不能为空',
                error: '请输入正确的手机号码'
            },
            password: '用户密码不能为空',
            oldPassword: '旧密码不能为空',
            newPassword: '新密码不能为空',
            lengthPassword: '长度在 6 到 20 个字符',
            confirmPassword: '确认密码不能为空',
            equalToPassword: '两次输入的密码不一致',
            inventoryInsufficient: '库存不足',
            nextTime: '下次维护日期不能早于日期',
            carInspectionTime: '年检时间不得早于制造时间'
        }
    },
    tableColumn: {
        index: '序号',
        operation: '操作'
    },
    operationButtons: {
        add: {
            label: '新增'
        },
        import: {
            label: '导入'
        },
        export: {
            label: '导出'
        },
        info: {
            label: '详情'
        },
        edit: {
            label: '编辑'
        },
        delete: {
            label: '删除'
        },
        price: {
            label: '价格维护'
        },
        select: {
            label: '选择使用'
        },
        entry: {
            label: '入库'
        },
        all: {
            label: '全部'
        },
        settingTruck: {
            label: '设置管理车辆'
        },
        settingSite: {
            label: '设置管理工地'
        },
        reset: {
            label: '重置密码'
        },
        permission: {
            label: '数据权限'
        }
    },
    dialog: {
        addTitle: '新增',
        editTitle: '编辑',
        infoTitle: '详情',
        priceTitle: '价格维护',
        accessoryTitle: '选择配件',
        truckTitle: '分配车辆',
        roleTitle: '分配数据权限'
    },
    import: {
        title: '数据导入',
        result: '导入结果'
    }
}
