export default {
    login: {
        title: 'Engineering Truck Manage System',
        logIn: 'Log In',
        loggingIn: 'Logging In...',
        username: 'Username',
        password: 'Password',
        code: 'Verification Code',
        rememberMe: 'Remember Password',
        imgTitle: "Can't see clearly? Click to change"
    },
    logout: {
        message: {
            title: 'Prompt',
            content: 'Are you sure you want to log out and exit the system?'
        }
    },
    navbar: {
        welcome: 'Welcome, ',
        mine: 'Personal Center',
        exit: 'Log Out',
        personalInfo: {
            title: 'Personal Information',
            userAvatar: {
                title: 'Change Avatar',
                select: 'Select',
                submit: 'Submit'
            },
            userName: 'User Account',
            phoneNumber: 'Phone Number',
            role: 'Role',
            creationDate: 'Creation Date'
        },
        basicInfo: {
            tab: {
                basicInfo: 'Basic Information',
                editPassword: 'Change Password'
            },
            title: 'Basic Profile',
            nickname: 'Name',
            phone: 'Phone Number',
            gender: 'Gender',
            genderType: {
                man: 'Male',
                woman: 'Female'
            },
            oldPassword: 'Old Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password'
        }
    },
    menu: {
        Index: 'Home',
        Truck: 'Vehicle Manage',
        TruckInfo: 'Vehicle Info Manage',
        MaintainRecords: 'Maintenance Record Manage',
        AccessoryUse: 'Part Usage Record',
        AccessoryStock: 'Part Inventory Manage',
        Driver: 'Driver Manage',
        DriverInfo: 'Driver Info Manage',
        DriverPerformance: 'Driver Performance Record',
        Workload: 'Workload Record',
        Statistics: 'Statistical Report',
        TruckStatistics: 'Vehicle Statistics',
        SiteStatistics: ' Construction Site Statistics',
        MaintenanceRecord: 'Maintenance Record Analysis',
        AccessoryNum: 'Part Inventory Dashboard',
        System: 'System Manage',
        User: 'User Manage',
        Role: 'Role Manage',
        Menu: 'Menu Manage',
        Dict: 'Dictionary Manage',
        Data: 'Dictionary Data',
        Site: 'Basic Data',
        SiteManage: 'Construction Site Manage',
        Profile: 'Personal Center'
    },
    index: {
        dateRange: {
            startDate: {
                label: 'Start Date'
            },
            endDate: {
                label: 'End Date'
            }
        },
        link: {
            workload: 'Workload Registration',
            maintainRecords: 'Maintenance Records',
            driverPerformance: 'Driver Performance',
            accessoryStock: 'Part Inventory'
        },
        registrationRecordStatistics: {
            title: 'Registration Record Quantity Statistics',
            unit: 'item',
            records: [
                {
                    type: 'Workload Registration'
                },
                {
                    type: 'Maintenance Record'
                },
                {
                    type: 'Driver Performance'
                },
                {
                    type: 'Part Record'
                }
            ]
        },
        partsInventory: {
            title: 'Part Inventory',
            tableColumn: [
                {
                    label: 'Part Type'
                },
                {
                    label: 'Remaining Total Quantity'
                }
            ]
        }
    },
    truckInfo: {
        searchBar: {
            plateNumber: {
                label: 'Registration Number '
            },
            vehicleType: {
                label: 'Vehicle Model'
            }
        },
        tableColumn: [
            {
                label: 'Registration Number '
            },
            {
                label: 'Vehicle Model'
            },
            {
                label: 'Tonnage'
            },
            {
                label: 'Vehicle Manufacturing Date'
            },
            {
                label: 'Annual Inspection Date'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Status'
            },
            {
                label: 'Creator'
            },
            {
                label: 'Creation Time'
            }
        ],
        fields: [
            {
                label: 'Registration Number '
            },
            {
                label: 'Vehicle Model'
            },
            {
                label: 'Tonnage'
            },
            {
                label: 'Manufacturing Date'
            },
            {
                label: 'Annual Inspection Date'
            },
            {
                label: 'Status'
            },
            {
                label: 'Remarks'
            }
        ]
    },
    maintainRecords: {
        searchBar: {
            plateNumber: {
                label: 'Registration Number '
            },
            constructionSiteName: {
                label: 'Construction Site Name'
            },
            maintenanceType: {
                label: 'Maintenance Type'
            },
            startDate: {
                label: 'Start Date'
            },
            endDate: {
                label: 'End Date'
            }
        },
        tableColumn: [
            {
                label: 'Date'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Maintenance Type'
            },
            {
                label: 'Oil Consumption'
            },
            {
                label: 'Mileage'
            },
            {
                label: 'Description'
            },
            {
                label: 'Currency'
            },
            {
                label: 'Cost'
            },
            {
                label: 'Service Provider'
            },
            {
                label: 'Mechanic'
            },
            {
                label: 'Next Maintenance Date'
            },
            {
                label: 'Creator'
            },
            {
                label: 'Creation Time'
            }
        ],
        fields: [
            {
                label: 'Date'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Maintenance Type'
            },
            {
                label: 'Oil Consumption'
            },
            {
                label: 'Mileage'
            },
            {
                label: 'Description'
            },
            {
                label: 'Repair Method',
                options: ['In-house Staff Repair', 'External Service Provider Repair']
            },
            {
                label: 'Mechanic'
            },
            {
                label: 'Service Provider'
            },
            {
                label: 'Next Maintenance Date'
            },
            {
                label: 'Currency'
            },
            {
                label: 'Cost'
            }
        ],
        basicInfo: {
            title: 'Basic Information',
            maintenanceDate: 'Maintenance Date',
            plateNumber: 'Registration Number ',
            constructionSiteName: 'Construction Site Name',
            maintenanceType: 'Maintenance Type',
            fuelConsumption: 'Oil Consumption',
            mileage: 'Kilometers',
            repairMethod: 'Repair Method',
            repairMethodOptions: ['In-house Staff Repair', 'External Service Provider Repair'],
            maintenanceOptions: ['Mechanic', 'Service Provider'],
            nextMaintenanceDate: 'Next Maintenance Date',
            creator: 'Creator',
            creationTime: 'Creation Time',
            description: 'Description'
        },
        partsUsageRecords: {
            title: 'Part Usage Record',
            tableColumn: [
                {
                    label: 'Part Type'
                },
                {
                    label: 'Part Name'
                },
                {
                    label: 'Quantity'
                },
                {
                    label: 'Usage'
                },
                {
                    label: 'Supplier'
                },
                {
                    label: 'Remarks'
                },
                {
                    label: 'Creator'
                },
                {
                    label: 'Creation Time'
                }
            ]
        }
    },
    accessoryUse: {
        searchBar: {
            plateNumber: {
                label: 'Registration Number '
            },
            startDate: {
                label: 'Start Date'
            },
            endDate: {
                label: 'End Date'
            }
        },
        tableColumn: [
            {
                label: 'Date'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Part Type'
            },
            {
                label: 'Part Name'
            },
            {
                label: 'Quantity'
            },
            {
                label: 'Usage'
            },
            {
                label: 'Supplier'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Creator'
            },
            {
                label: 'Creation Time'
            }
        ],
        fields: [
            {
                label: 'Date'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Part Type'
            },
            {
                label: 'Part Name'
            },
            {
                label: 'Supplier'
            },
            {
                label: 'Quantity'
            },
            {
                label: 'Usage'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Out Personnel'
            }
        ]
    },
    accessoryStock: {
        searchBar: {
            partName: {
                label: 'Part Name'
            },
            partType: {
                label: 'Part Type'
            },
            constructionSiteName: {
                label: 'Construction Site Name'
            },
            startDate: {
                label: 'Start Date'
            },
            endDate: {
                label: 'End Date'
            }
        },
        tableColumn: [
            {
                label: 'Part Name'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Part Type'
            },
            {
                label: 'Supplier'
            },
            {
                label: 'Currency'
            },
            {
                label: 'Price'
            },
            {
                label: 'In Quantity'
            },
            {
                label: 'Remaining Quantity'
            },
            {
                label: 'In Date'
            },
            {
                label: 'In Personnel'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Creator'
            },
            {
                label: 'Creation Time'
            }
        ],
        fields: [
            {
                label: 'Part Name'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Part Type'
            },
            {
                label: 'Supplier'
            },
            {
                label: 'Quantity'
            },
            {
                label: 'In Date'
            },
            {
                label: 'In Personnel'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Currency'
            },
            {
                label: 'Price'
            }
        ],
        basicInfo: {
            title: 'Basic Information',
            partName: 'Part Name',
            constructionSiteName: 'Construction Site Name',
            partType: 'Part Type',
            supplier: 'Supplier',
            price: 'Price',
            inStockStaff: 'In Personnel',
            inStockQuantity: 'In Quantity',
            remainingQuantity: 'Remaining Quantity',
            inStockDate: 'In Date',
            creator: 'Creator',
            creationTime: 'Creation Time',
            remark: 'Remarks'
        },
        outboundRecords: {
            title: 'Outbound Record',
            tableColumn: [
                {
                    label: 'Out Quantity'
                },
                {
                    label: 'Out Date'
                },
                {
                    label: 'Out Personnel'
                },
                {
                    label: 'Outbound Type',
                    options: ['Repair Outbound', 'Separate Outbound']
                },
                {
                    label: 'Remarks'
                },
                {
                    label: 'Creator'
                },
                {
                    label: 'Creation Time'
                }
            ],
            fields: [
                {
                    label: 'Quantity'
                },
                {
                    label: 'Out Date'
                },
                {
                    label: 'Out Personnel'
                },
                {
                    label: 'Remarks'
                }
            ]
        }
    },
    driverInfo: {
        searchBar: {
            name: {
                label: 'Name'
            },
            idNum: {
                label: 'ID Number'
            },
            sex: {
                label: 'Gender'
            }
        },
        tableColumn: [
            {
                label: 'Name'
            },
            {
                label: 'Contact Information'
            },
            {
                label: 'Gender'
            },
            {
                label: 'Date of Birth'
            },
            {
                label: 'ID Number'
            },
            {
                label: 'Bank Card Number'
            },
            {
                label: 'Bank'
            },
            {
                label: 'Employment Date'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Status'
            },
            {
                label: 'Creator'
            },
            {
                label: 'Creation Time'
            },
            {
                label: 'Assigned Vehicle'
            }
        ],
        fields: [
            {
                label: 'Name'
            },
            {
                label: 'Contact Information'
            },
            {
                label: 'ID Number'
            },
            {
                label: 'Gender'
            },
            {
                label: 'Date of Birth'
            },
            {
                label: 'Employment Date'
            },
            {
                label: 'Status'
            },
            {
                label: 'Bank Card Number'
            },
            {
                label: 'Bank'
            },
            {
                label: 'Remarks'
            }
        ]
    },
    driverPerformance: {
        searchBar: {
            carNumber: {
                label: 'Registration Number '
            },
            name: {
                label: 'Driver Name'
            },
            startTime: {
                label: 'Start Date'
            },
            endTime: {
                label: 'End Date'
            }
        },
        tableColumn: [
            {
                label: 'Date'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Driver Name'
            },
            {
                label: 'Performance Score (Points)'
            },
            {
                label: 'Violation Type'
            },
            {
                label: 'Misconduct Record'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Creator'
            },
            {
                label: 'Creation Time'
            }
        ],
        fields: [
            {
                label: 'Date'
            },
            {
                label: 'Driver Name'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Performance Score (Out of 10)'
            },
            {
                label: 'Violation Type'
            },
            {
                label: 'Misconduct Record'
            },
            {
                label: 'Remarks'
            }
        ]
    },
    workload: {
        searchBar: {
            carNumber: {
                label: 'Registration Number '
            },
            name: {
                label: 'Driver Name'
            },
            startTime: {
                label: 'Start Date'
            },
            endTime: {
                label: 'End Date'
            }
        },
        tableColumn: [
            {
                label: 'Date'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Driver Name'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Hours Worked'
            },
            {
                label: 'Trips Worked'
            },
            {
                label: 'Currency'
            },
            {
                label: 'Unit Price'
            },
            {
                label: 'Amount'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Creator'
            },
            {
                label: 'Creation Time'
            }
        ],
        fields: [
            {
                label: 'Date'
            },
            {
                label: 'Driver Name'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Settlement Method',
                options: ['By Hours Worked', 'By Trips Worked']
            },
            {
                label: 'Hours Worked (Hours)'
            },
            {
                label: 'Trips Worked'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Currency'
            },
            {
                label: 'Unit Price'
            },
            {
                label: 'Amount'
            }
        ]
    },
    truckStatistics: {
        searchBar: {
            year: {
                label: 'Year'
            },
            mon: {
                label: 'Month'
            },
            carNumber: {
                label: 'Registration Number '
            },
            carType: {
                label: 'Vehicle Model'
            }
        },
        tableColumn: [
            {
                label: 'Year/Month'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Vehicle Model'
            },
            {
                label: 'Total Workload (Hours)'
            },
            {
                label: 'Total Number of Vehicles'
            },
            {
                label: 'Amount'
            },
            {
                label: 'Oil Consumption'
            },
            {
                label: 'Maintenance Cost'
            }
        ]
    },
    siteStatistics: {
        searchBar: {
            year: {
                label: 'Year'
            },
            mon: {
                label: 'Month'
            },
            siteName: {
                label: 'Construction Site Name'
            }
        },
        tableColumn: [
            {
                label: 'Year/Month'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Total Workload (Hours)'
            },
            {
                label: 'Total Number of Vehicles'
            },
            {
                label: 'Amount'
            }
        ]
    },
    maintenanceRecord: {
        searchBar: {
            year: {
                label: 'Year'
            },
            mon: {
                label: 'Month'
            },
            carNumber: {
                label: 'Registration Number '
            },
            carType: {
                label: 'Vehicle Model'
            }
        },
        tableColumn: [
            {
                label: 'Year/Month'
            },
            {
                label: 'Registration Number '
            },
            {
                label: 'Vehicle Model'
            },
            {
                label: 'Number of Repairs'
            },
            {
                label: 'Oil Consumption'
            },
            {
                label: 'Mileage'
            },
            {
                label: 'Maintenance Cost'
            }
        ]
    },
    accessoryNum: {
        searchBar: {
            siteName: {
                label: 'Construction Site Name'
            }
        },
        tableColumn: [
            {
                label: 'Part Type'
            },
            {
                label: 'Total Remaining Quantity'
            }
        ]
    },
    userManage: {
        searchBar: {
            nickName: {
                label: 'Name'
            },
            sex: {
                label: 'Gender'
            }
        },
        tableColumn: [
            {
                label: 'ID'
            },
            {
                label: 'User Account'
            },
            {
                label: 'Name'
            },
            {
                label: 'Gender'
            },
            {
                label: 'Contact Number'
            },
            {
                label: 'Role'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Managed Vehicles'
            },
            {
                label: 'Managed Construction Sites'
            },
            {
                label: 'Status'
            }
        ],
        fields: [
            {
                label: 'Name'
            },
            {
                label: 'Contact Number'
            },
            {
                label: 'User Account'
            },
            {
                label: 'Login Password'
            },
            {
                label: 'User Gender'
            },
            {
                label: 'User Status'
            },
            {
                label: 'Affiliated Role'
            },
            {
                label: 'Remarks Information'
            }
        ],
        truckDialog: {
            title: 'Select Managed Vehicles',
            content: 'Selected Vehicles: '
        },
        siteDialog: {
            title: 'Select Managed Construction Sites',
            content: 'Selected Construction Sites: '
        }
    },
    roleManage: {
        searchBar: {
            roleName: {
                label: 'Role Name'
            }
        },
        tableColumn: [
            {
                label: 'Role ID'
            },
            {
                label: 'Role Name'
            },
            {
                label: 'Permission Characters'
            },
            {
                label: 'Display Order'
            },
            {
                label: 'Remarks Information'
            },
            {
                label: 'Status'
            },
            {
                label: 'Creation Time'
            },
            {
                label: 'Modification Time'
            }
        ],
        fields: [
            {
                label: 'Role Name'
            },
            {
                label: 'Permission Characters'
            },
            {
                label: 'Role Order'
            },
            {
                label: 'Role Status'
            },
            {
                label: 'Menu Permissions',
                checkboxs: ['Expand/Collapse', 'Select All/Deselect All', 'Parent-Child Linkage'],
                loading: 'Loading, please wait...'
            },
            {
                label: 'Remarks'
            }
        ],
        roleFields: [
            {
                label: 'Role Name'
            },
            {
                label: 'Permission Characters'
            },
            {
                label: 'Permission Scope'
            },
            {
                label: 'Data Permissions',
                checkboxs: ['Expand/Collapse', 'Select All/Deselect All', 'Parent-Child Linkage'],
                loading: 'Loading, please wait...'
            }
        ]
    },
    menuManage: {
        searchBar: {
            menuName: {
                label: 'Menu Name'
            }
        },
        tableColumn: [
            {
                label: 'Menu Name'
            },
            {
                label: 'Icon'
            },
            {
                label: 'Sorting'
            },
            {
                label: 'Permission Identification'
            },
            {
                label: 'Component Path'
            },
            {
                label: 'Status'
            },
            {
                label: 'Creation Time'
            },
            {
                label: 'Modification Time'
            }
        ],
        fields: [
            {
                label: 'Parent Menu'
            },
            {
                label: 'Menu Type',
                options: ['Directory', 'Menu', 'Button']
            },
            {
                label: 'Menu Icon'
            },
            {
                label: 'Menu Name'
            },
            {
                label: 'Display Sorting'
            },
            {
                label: 'Routing Address'
            },
            {
                label: 'Component Path'
            },
            {
                label: 'Permission Characters'
            },
            {
                label: 'Routing Parameters'
            },
            {
                label: 'Whether to Cache',
                options: ['Cache', 'Do not Cache']
            },
            {
                label: 'Display Status',
                tooltip: 'Selecting "Hide" will prevent the route from appearing in the sidebar, but it can still be accessed.'
            },
            {
                label: 'Menu Status',
                tooltip: 'Selecting "Disabled" will prevent the route from appearing in the sidebar and being accessed.'
            },
            {
                label: 'Menu Permissions',
                checkboxs: ['Expand/Collapse', 'Select All/Deselect All', 'Parent-Child Linkage'],
                loading: 'Loading, please wait...'
            },
            {
                label: 'Remarks'
            }
        ]
    },
    dictManage: {
        searchBar: {
            dictName: {
                label: 'Dictionary Name'
            },
            dictEngName: {
                label: 'Dictionary En Name'
            },
            dictType: {
                label: 'Dictionary Type'
            }
        },
        tableColumn: [
            {
                label: 'Dictionary ID'
            },
            {
                label: 'Dictionary Name'
            },
            {
                label: 'Dictionary En Name'
            },
            {
                label: 'Dictionary Type'
            },
            {
                label: 'Status'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Creation Time'
            }
        ],
        fields: [
            {
                label: 'Dictionary Name'
            },
            {
                label: 'Dictionary En Name'
            },
            {
                label: 'Dictionary Type'
            },
            {
                label: 'Status'
            },
            {
                label: 'Remarks'
            }
        ]
    },
    dictData: {
        searchBar: {
            dictType: {
                label: 'Dictionary Name'
            },
            dictLabel: {
                label: 'Dictionary Label'
            },
            dictEngLabel: {
                label: 'Dictionary En Label'
            },
            status: {
                label: 'Status'
            },
            dateRange: {
                label: 'Creation Time'
            }
        },
        tableColumn: [
            {
                label: 'Dictionary Code'
            },
            {
                label: 'Dictionary Label'
            },
            {
                label: 'Dictionary En Label'
            },
            {
                label: 'Dictionary Key Value'
            },
            {
                label: 'Dictionary Sorting'
            },
            {
                label: 'Enable/Disable Status'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Creation Time'
            }
        ],
        fields: [
            {
                label: 'Dictionary Type'
            },
            {
                label: 'Data Label'
            },
            {
                label: 'Data En Label'
            },
            {
                label: 'Data Key Value'
            },
            {
                label: 'Display Sorting'
            },
            {
                label: 'Status'
            },
            {
                label: 'Remarks'
            }
        ]
    },
    siteManage: {
        searchBar: {
            siteName: {
                label: 'Construction Site Name'
            }
        },
        tableColumn: [
            {
                label: 'Construction Site Code'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Address'
            },
            {
                label: 'Contact Person'
            },
            {
                label: 'Contact Information'
            },
            {
                label: 'Status'
            }
        ],
        fields: [
            {
                label: 'Construction Site Code'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Address'
            },
            {
                label: 'Contact Person'
            },
            {
                label: 'Contact Information'
            },
            {
                label: 'Status'
            }
        ]
    },
    tagsView: {
        refresh: 'Refresh',
        close: 'Close',
        closeOthers: 'Close Others',
        closeAll: 'Close All'
    },
    settings: {
        title: 'System Layout Configuration',
        theme: 'Theme Color',
        tagsView: 'Enable Tags-View',
        fixedHeader: 'Fixed Header',
        sidebarLogo: 'Sidebar Logo'
    },
    components: {
        btn: {
            resetButton: 'Reset',
            searchButton: 'Search',
            confirmButton: 'Confirm',
            cancelButton: 'Cancel',
            saveButton: 'Save',
            closeButton: 'Close',
            outButton: 'Outbound'
        },
        input: {
            placeholder: 'Please input'
        },
        select: {
            placeholder: 'Please select'
        },
        datePicker: {
            placeholder: 'Please select a date'
        },
        upload: {
            text1: 'Drag the file here, or',
            text2: 'Click to upload',
            text3: 'Note: Only "xls" or "xlsx" format files are allowed to be imported!',
            message: 'The file format is incorrect. Please upload image types, such as files with JPG or PNG suffixes.'
        },
        message: {
            add: 'Addition successful',
            edit: 'Modification successful',
            delete: {
                text: 'Deletion successful',
                content: 'Are you sure you want to delete this data item?'
            },
            upload: 'Upload successful',
            setting: 'Setting successful'
        },
        validator: {
            userName: 'User account cannot be empty',
            nickName: 'Name cannot be empty',
            roleIds: 'The associated role cannot be empty',
            email: {
                empty: 'Email address cannot be empty',
                error: 'Please enter a valid email address'
            },
            phonenumber: {
                empty: 'Phone number cannot be empty',
                error: 'Please enter a valid phone number'
            },
            password: 'User password cannot be empty',
            oldPassword: 'Old password cannot be empty',
            newPassword: 'New password cannot be empty',
            lengthPassword: 'Length should be between 6 and 20 characters',
            confirmPassword: 'Confirm password cannot be empty',
            equalToPassword: 'The two passwords entered do not match',
            inventoryInsufficient: 'Inventory is insufficient',
            nextTime: 'The next maintenance date cannot be earlier than the current date',
            carInspectionTime: 'The annual inspection date cannot be earlier than the manufacturing date'
        }
    },
    tableColumn: {
        index: 'Serial Number',
        operation: 'Operation'
    },
    operationButtons: {
        add: {
            label: 'Add'
        },
        import: {
            label: 'Import'
        },
        export: {
            label: 'Export'
        },
        info: {
            label: 'Details'
        },
        edit: {
            label: 'Edit'
        },
        delete: {
            label: 'Delete'
        },
        price: {
            label: 'Price Maintenance'
        },
        select: {
            label: 'Select for Use'
        },
        entry: {
            label: 'Inbound'
        },
        all: {
            label: 'All'
        },
        settingTruck: {
            label: 'Set Managed Vehicles'
        },
        settingSite: {
            label: 'Set Managed Construction Sites'
        },
        reset: {
            label: 'Reset Password'
        },
        permission: {
            label: 'Data Permissions'
        }
    },
    dialog: {
        addTitle: 'Add',
        editTitle: 'Edit',
        infoTitle: 'Details',
        priceTitle: 'Price Maintenance',
        accessoryTitle: 'Select Accessories',
        truckTitle: 'Allocate Vehicles',
        roleTitle: 'Allocate Data Permissions'
    },
    import: {
        title: 'Data Import',
        result: 'Import Result'
    }
}
