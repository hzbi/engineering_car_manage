export default {
    login: {
        title: 'Engineering Truck Management System',
        logIn: 'Login',
        loggingIn: 'Logging in...',
        username: 'Account',
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
                title: 'Modify Avatar',
                select: 'Select',
                submit: 'Submit'
            },
            userName: 'User Account',
            phoneNumber: 'Phone Number',
            role: 'Affiliated Role',
            creationDate: 'Creation Date'
        },
        basicInfo: {
            tab: {
                basicInfo: 'Basic Information',
                editPassword: 'Change Password'
            },
            title: 'Basic Information',
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
        Truck: 'Vehicle Management',
        TruckInfo: 'Vehicle Information Management',
        MaintainRecords: 'Maintenance Records Management',
        AccessoryUse: 'Accessory Usage Records',
        AccessoryStock: 'Accessory Inventory Management',
        Driver: 'Driver Management',
        DriverInfo: 'Driver Information Management',
        DriverPerformance: 'Driver Performance Records',
        Workload: 'Workload Records',
        Statistics: 'Statistical Reports',
        TruckStatistics: 'Statistics by Vehicle',
        SiteStatistics: 'Statistics by Construction Site',
        MaintenanceRecord: 'Maintenance Record Analysis',
        AccessoryNum: 'Accessory Inventory Dashboard',
        System: 'System Management',
        User: 'User Management',
        Role: 'Role Management',
        Menu: 'Menu Management',
        Dict: 'Dictionary Management',
        Site: 'Basic Data',
        SiteManage: 'Construction Site Management',
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
            accessoryStock: 'Accessory Inventory'
        },
        registrationRecordStatistics: {
            title: 'Registration Record Quantity Statistics',
            unit: 'item(s)',
            records: [
                {
                    type: 'Workload Registration'
                },
                {
                    type: 'Maintenance Records'
                },
                {
                    type: 'Driver Performance'
                },
                {
                    type: 'Accessory Records'
                }
            ]
        },
        partsInventory: {
            title: 'Accessory Inventory',
            tableColumn: [
                {
                    label: 'Accessory Type'
                },
                {
                    label: 'Total Remaining Quantity'
                }
            ]
        }
    },
    truckInfo: {
        searchBar: {
            plateNumber: {
                label: 'License Plate Number'
            },
            vehicleType: {
                label: 'Vehicle Type'
            }
        },
        tableColumn: [
            {
                label: 'License Plate Number'
            },
            {
                label: 'Vehicle Type'
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
                label: 'License Plate Number'
            },
            {
                label: 'Vehicle Type'
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
                label: 'License Plate Number'
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
                label: 'License Plate Number'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Maintenance Type'
            },
            {
                label: 'Fuel Consumption'
            },
            {
                label: 'Mileage'
            },
            {
                label: 'Detailed Description'
            },
            {
                label: 'Currency Unit'
            },
            {
                label: 'Cost'
            },
            {
                label: 'Repair Vendor'
            },
            {
                label: 'Maintenance Staff'
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
                label: 'License Plate Number'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Maintenance Type'
            },
            {
                label: 'Fuel Consumption'
            },
            {
                label: 'Mileage'
            },
            {
                label: 'Detailed Description'
            },
            {
                label: 'Repair Method',
                options: ['Internal Staff Repair', 'External Repair Vendor Repair']
            },
            {
                label: 'Maintenance Staff'
            },
            {
                label: 'Repair Vendor'
            },
            {
                label: 'Next Maintenance Date'
            },
            {
                label: 'Currency Unit'
            },
            {
                label: 'Cost'
            }
        ],
        basicInfo: {
            title: 'Basic Information',
            maintenanceDate: 'Maintenance Date',
            plateNumber: 'License Plate Number',
            constructionSiteName: 'Construction Site Name',
            maintenanceType: 'Maintenance Type',
            fuelConsumption: 'Fuel Consumption',
            mileage: 'Mileage',
            repairMethod: 'Repair Method',
            repairMethodOptions: ['Internal Staff Repair', 'External Repair Vendor Repair'],
            maintenanceOptions: ['Maintenance Staff', 'Repair Vendor'],
            nextMaintenanceDate: 'Next Maintenance Date',
            creator: 'Creator',
            creationTime: 'Creation Time',
            description: 'Detailed Description'
        },
        partsUsageRecords: {
            title: 'Accessory Usage Records',
            tableColumn: [
                {
                    label: 'Accessory Type'
                },
                {
                    label: 'Accessory Name'
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
                label: 'License Plate Number'
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
                label: 'License Plate Number'
            },
            {
                label: 'Accessory Type'
            },
            {
                label: 'Accessory Name'
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
                label: 'License Plate Number'
            },
            {
                label: 'Accessory Type'
            },
            {
                label: 'Accessory Name'
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
                label: 'Outbound Staff'
            }
        ]
    },
    accessoryStock: {
        searchBar: {
            partName: {
                label: 'Accessory Name'
            },
            partType: {
                label: 'Accessory Type'
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
                label: 'Accessory Name'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Accessory Type'
            },
            {
                label: 'Supplier'
            },
            {
                label: 'Currency Unit'
            },
            {
                label: 'Price'
            },
            {
                label: 'In - stock Quantity'
            },
            {
                label: 'Remaining Quantity'
            },
            {
                label: 'In - stock Date'
            },
            {
                label: 'In - stock Staff'
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
                label: 'Accessory Name'
            },
            {
                label: 'Construction Site Name'
            },
            {
                label: 'Accessory Type'
            },
            {
                label: 'Supplier'
            },
            {
                label: 'Quantity'
            },
            {
                label: 'In - stock Date'
            },
            {
                label: 'In - stock Staff'
            },
            {
                label: 'Remarks'
            },
            {
                label: 'Currency Unit'
            },
            {
                label: 'Price'
            }
        ],
        basicInfo: {
            title: 'Basic Information',
            partName: 'Accessory Name',
            constructionSiteName: 'Construction Site Name',
            partType: 'Accessory Type',
            supplier: 'Supplier',
            price: 'Price',
            inStockStaff: 'In - stock Staff',
            inStockQuantity: 'In - stock Quantity',
            remainingQuantity: 'Remaining Quantity',
            inStockDate: 'In - stock Date',
            creator: 'Creator',
            creationTime: 'Creation Time',
            remark: 'Remarks'
        },
        outboundRecords: {
            title: 'Outbound Records',
            tableColumn: [
                {
                    label: 'Outbound Quantity'
                },
                {
                    label: 'Outbound Date'
                },
                {
                    label: 'Outbound Staff'
                },
                {
                    label: 'Outbound Type',
                    options: ['Repair Outbound', 'Individual Outbound']
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
                    label: 'Outbound Date'
                },
                {
                    label: 'Outbound Staff'
                },
                {
                    label: 'Remarks'
                }
            ]
        }
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
        tagsView: 'Enable Tags - View',
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
            text3: "Note: Only files in 'xls' or 'xlsx' format are allowed to be imported!",
            message: 'The file format is incorrect. Please upload image types, such as files with JPG or PNG suffixes.'
        },
        message: {
            add: 'Addition Successful',
            edit: 'Modification Successful',
            delete: {
                text: 'Deletion Successful',
                content: 'Are you sure you want to delete this data item?'
            },
            upload: 'Upload Successful'
        },
        validator: {
            nickName: 'User nickname cannot be empty',
            email: {
                empty: 'Email address cannot be empty',
                error: 'Please enter a valid email address'
            },
            phonenumber: {
                empty: 'Phone number cannot be empty',
                error: 'Please enter a valid phone number'
            },
            oldPassword: 'Old password cannot be empty',
            newPassword: 'New password cannot be empty',
            lengthPassword: 'Length should be between 6 and 20 characters',
            confirmPassword: 'Confirm password cannot be empty',
            equalToPassword: 'The two passwords entered do not match',
            inventoryInsufficient: 'Insufficient inventory'
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
        }
    },
    dialog: {
        addTitle: 'Add',
        editTitle: 'Edit',
        infoTitle: 'Details',
        priceTitle: 'Price Maintenance'
    },
    import: {
        title: 'Data Import',
        result: 'Import Result'
    }
}
