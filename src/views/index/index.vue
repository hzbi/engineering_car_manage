<template>
    <div class="app-container home">
        <el-row :gutter="20">
            <el-col :span="checkRole(['admin']) ? 18 : 24">
                <el-card>
                    <template #header>
                        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
                            <el-form-item :label="$t('index.dateRange.startDate.label')" prop="startTime">
                                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" :disabled-date="disabledStartDate" :placeholder="$t('components.select.placeholder')"></el-date-picker>
                            </el-form-item>
                            <el-form-item :label="$t('index.dateRange.endDate.label')" prop="endTime">
                                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" :disabled-date="disabledEndDate" :placeholder="$t('components.select.placeholder')"></el-date-picker>
                            </el-form-item>
                            <form-search @reset="resetQuery" @search="handleQuery" />
                        </el-form>

                        <el-row :gutter="10" class="mb8" v-if="!checkRole(['admin'])">
                            <el-col :span="1.5">
                                <el-button type="primary" icon="plus" @click="onToJump('workload')">{{ $t('index.link.workload') }}</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" icon="plus" @click="onToJump('maintainRecords')">{{ $t('index.link.maintainRecords') }}</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" icon="plus" @click="onToJump('driverPerformance')">{{ $t('index.link.driverPerformance') }}</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" icon="plus" @click="onToJump('accessoryStock')">{{ $t('index.link.accessoryStock') }}</el-button>
                            </el-col>
                        </el-row>
                    </template>

                    <div class="title-cont">
                        <span class="title-cont-label">{{ $t('index.registrationRecordStatistics.title') }}</span>
                    </div>

                    <el-row :gutter="20">
                        <el-col v-for="(item, index) in numList" :key="index" :span="6">
                            <div class="card">
                                <div class="card-left">
                                    <div class="icon-cont">
                                        <div class="icon-cont-bg" :style="{ backgroundColor: item.color }"></div>
                                        <div class="icon-cont-after" :style="{ backgroundColor: item.color }"></div>
                                        <img :src="item.icon" />
                                    </div>
                                </div>
                                <div class="card-right">
                                    <span class="value">
                                        {{ item.value }}
                                        <span class="unit">{{ $t('index.registrationRecordStatistics.unit') }}</span>
                                    </span>
                                    <span class="name">{{ item.name }}</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="6" v-hasRole="['admin']">
                <el-card>
                    <div class="title-cont">
                        <span class="title-cont-label">{{ $t('index.partsInventory.title') }}</span>
                        <span class="title-cont-icon" @click="onToJump('accessoryNum')">
                            <el-icon><ArrowRightBold /></el-icon>
                        </span>
                    </div>

                    <el-table stripe border v-loading="loading" :data="tableData" max-height="500">
                        <el-table-column :label="$t('index.partsInventory.tableColumn[0].label')" align="center" prop="accessoryType" min-width="120" show-overflow-tooltip>
                            <template #default="scope">
                                <dict-tag :options="accessory_type" :value="scope.row.accessoryType" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('index.partsInventory.tableColumn[1].label')" align="center" prop="num" min-width="120" show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <!-- <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="18">
                <el-card>
                    <template #header>
                        <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
                            <el-form-item label="开始日期" prop="startTime">
                                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束日期" prop="endTime">
                                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" :placeholder="$t('components.datePicker.placeholder')"></el-date-picker>
                            </el-form-item>
                            <form-search @reset="resetQuery" @search="handleQuery" />
                        </el-form>
                    </template>

                    <div class="title-cont">
                        <span class="title-cont-label">登记记录数量统计</span>
                    </div>

                    <div></div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="title-cont">
                        <span class="title-cont-label">登记记录数量统计</span>
                        <span class="title-cont-icon">
                            <el-icon><ArrowRightBold /></el-icon>
                        </span>
                    </div>
                </el-card>
            </el-col>
        </el-row> -->
    </div>
</template>

<script setup name="Index" lang="ts">
import { getIndexAllNum, getAccessoryStockList } from '@/api/statistics/index'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
import { dayjs, ElForm } from 'element-plus'
import router from '@/router'
import { $t } from '@/lang'

const { proxy } = getCurrentInstance() as any

const queryFormRef = ref<InstanceType<typeof ElForm>>()

const { accessory_type } = proxy.useDict('accessory_type')

const tableData = ref([])
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)

const numList = ref([
    { name: $t('index.registrationRecordStatistics.records[0].type'), value: 0, type: 'a', color: '#68d05d', icon: new URL(`../../assets/icons/index/gzl.png`, import.meta.url).href },
    { name: $t('index.registrationRecordStatistics.records[1].type'), value: 0, type: 'b', color: '#F3AC45', icon: new URL(`../../assets/icons/index/whjl.png`, import.meta.url).href },
    { name: $t('index.registrationRecordStatistics.records[2].type'), value: 0, type: 'c', color: '#416BFE', icon: new URL(`../../assets/icons/index/sjbx.png`, import.meta.url).href },
    { name: $t('index.registrationRecordStatistics.records[3].type'), value: 0, type: 'd', color: '#20B7A8', icon: new URL(`../../assets/icons/index/pjjl.png`, import.meta.url).href }
])

const data = reactive({
    queryParams: {
        startTime: dayjs().startOf('year').format('YYYY-MM-DD'),
        endTime: dayjs(new Date().setDate(new Date().getDate())).format('YYYY-MM-DD')
    }
})

const { queryParams }: any = toRefs(data)

/** 查询配件使用列表 */
const getPageList = () => {
    loading.value = true
    getAccessoryStockList({ ...queryParams.value }).then((res: any) => {
        tableData.value = res.rows
        total.value = parseInt(res.total)
        loading.value = false
    })
}

const getPageStatistics = () => {
    loading.value = true
    getIndexAllNum(queryParams.value).then((res: any) => {
        numList.value.forEach((item: any) => {
            item.value = res.data && res.data[0][item.type] !== null ? res.data[0][item.type] : '-'
            return item
        })
        loading.value = false
    })
}

/** 搜索按钮操作 */
const handleQuery = () => {
    total.value = 0
    queryParams.value.pageNum = 1
    getPageList()
    getPageStatistics()
}

/** 重置按钮操作 */
const resetQuery = () => {
    queryFormRef.value?.resetFields()
    total.value = 0
    handleQuery()
    getPageStatistics()
}

const disabledStartDate = (time: any) => {
    if (queryParams.value.endTime) {
        return time.getTime() > new Date(queryParams.value.endTime).getTime()
    }
    return false
}

const disabledEndDate = (time: any) => {
    if (queryParams.value.startTime) {
        return time.getTime() < new Date(queryParams.value.startTime).getTime() - 8.64e7
    }
    return false
}

const onToJump = (type: string) => {
    switch (type) {
        case 'accessoryNum':
            router.push('/statistics/accessoryNum')
            break

        case 'workload':
            router.push('/driver/workload')
            break

        case 'maintainRecords':
            router.push('/truck/maintainRecords')
            break

        case 'driverPerformance':
            router.push('/driver/driverPerformance')
            break

        case 'accessoryStock':
            router.push('/truck/accessoryStock')
            break

        default:
            break
    }
}

getPageList()
getPageStatistics()
</script>

<style scoped lang="scss">
.home {
    min-width: 1720px;
}

.title-cont {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-label {
        font-size: 18px;
        font-weight: 600;
    }

    &-icon {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
}

.card {
    padding: 16px 24px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    display: flex;
    z-index: 0;

    &-left {
        .icon-cont {
            position: relative;
            width: 60px;
            height: 60px;

            &-bg {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                position: absolute; /* 为子元素定位做准备 */
                top: 5px;
                left: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2;
            }
            &-after {
                content: '';
                position: absolute;
                top: 0px;
                left: 0px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                opacity: 0.3;
                z-index: 1; /* 让阴影在图标和背景下方 */
            }

            img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 30px;
                z-index: 3;
            }
        }
    }

    &-right {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .value {
            font-size: 24px;
            font-weight: 600;
        }

        .unit {
            font-size: 14px;
            color: #606266;
        }

        .name {
            font-size: 14px;
            color: #606266;
        }
    }
}
</style>
