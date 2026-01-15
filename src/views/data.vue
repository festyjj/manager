<template>
    <div class="title">
        双碳可视化平台
    </div>
    <div class="carbon-dashboard">
        <!-- 顶部时间显示 -->
        <div class="header-time">{{ currentDateTime }}</div>

        <!-- 主体布局：左、中、右三列 -->
        <div class="dashboard-layout">
            <!-- 左侧区域 -->
            <div class="layout-left">
                <!-- 1. 能耗总览仪表盘 -->
                <div class="card">
                    <div class="card-title">能耗总览</div>
                    <div class="gauge-container">
                        <div class="gauge-item">
                            <div ref="electricGauge" class="gauge-chart"></div>
                            <div class="gauge-label">耗电量 (kWh)</div>
                        </div>
                        <div class="gauge-item">
                            <div ref="waterGauge" class="gauge-chart"></div>
                            <div class="gauge-label">耗水量 (m³)</div>
                        </div>
                        <div class="gauge-item">
                            <div ref="carbonGauge" class="gauge-chart"></div>
                            <div class="gauge-label">碳排放量 (kg)</div>
                        </div>
                    </div>
                </div>

                <!-- 2. 能耗占比环状图 -->
                <div class="card">
                    <div class="card-title">能耗占比</div>
                    <div ref="energyPie" class="chart-container"></div>
                </div>

                <!-- 3. 库存预警滚动表格 -->
                <div class="card">
                    <div class="card-title">库存预警</div>
                    <div class="scroll-table-container" ref="inventoryTableRef">
                        <el-table :data="inventoryTableData" border size="small" :cell-style="setInventoryStatusStyle">
                            <el-table-column prop="id" label="编号" width="80" />
                            <el-table-column prop="materialName" label="物料名称" width="150" />
                            <el-table-column prop="warehouseName" label="仓库名称" width="150" />
                            <el-table-column prop="stockNum" label="当前库存" width="120" />
                            <el-table-column prop="status" label="状态" width="100" />
                        </el-table>
                    </div>
                </div>
            </div>

            <!-- 中间区域 -->
            <div class="layout-middle">
                <!-- 4. 数据总览 -->
                <div class="card">
                    <div class="card-title">数据总览</div>
                    <div class="data-overview">
                        <!-- 销售额/碳排放统计 -->
                        <div class="overview-top">
                            <div class="overview-item">
                                <div class="overview-label">今年累计销售额</div>
                                <div class="overview-value">{{ salesData.yearTotal }} 万元</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-label">本月累计销售额</div>
                                <div class="overview-value">{{ salesData.monthTotal }} 万元</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-label">今日累计销售额</div>
                                <div class="overview-value">{{ salesData.todayTotal }} 万元</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-label">本年累计碳排放</div>
                                <div class="overview-value">{{ carbonData.yearTotal }} kg</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-label">本月累计碳排放</div>
                                <div class="overview-value">{{ carbonData.monthTotal }} kg</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-label">今日累计碳排放</div>
                                <div class="overview-value">{{ carbonData.todayTotal }} kg</div>
                            </div>
                        </div>
                        <!-- 碳排放排行榜 -->
                        <div class="overview-bottom">
                            <div class="overview-subtitle">碳排放排行榜(TOP8)</div>
                            <el-table :data="carbonRankData" border size="small">
                                <el-table-column prop="id" label="编号" width="80" />
                                <el-table-column prop="equipment" label="设备" width="150" />
                                <el-table-column prop="productionNum" label="生产数量" width="120" />
                                <el-table-column prop="carbonEmission" label="碳排放(kg)" width="150" />
                            </el-table>
                        </div>
                    </div>
                </div>

                <!-- 5. 销售计划完成率组合图 -->
                <div class="card">
                    <div class="card-title">销售计划完成率</div>
                    <div ref="salesCompleteChart" class="chart-container"></div>
                </div>
            </div>

            <!-- 右侧区域 -->
            <div class="layout-right">
                <!-- 6. 销售统计曲线图 -->
                <div class="card">
                    <div class="card-title">销售统计</div>
                    <div ref="salesTrendChart" class="chart-container"></div>
                </div>

                <!-- 7. 销售排名(TOP8)柱状图 -->
                <div class="card">
                    <div class="card-title">销售排名(TOP8)</div>
                    <div ref="salesRankChart" class="chart-container"></div>
                </div>

                <!-- 8. 生产统计滚动表格 -->
                <div class="card">
                    <div class="card-title">生产统计</div>
                    <div class="scroll-table-container" ref="productionTableRef">
                        <el-table :data="productionTableData" border size="small">
                            <el-table-column prop="id" label="编号" width="80" />
                            <el-table-column prop="productName" label="产品名称" width="150" />
                            <el-table-column prop="model" label="型号" width="120" />
                            <el-table-column prop="spec" label="规格" width="120" />
                            <el-table-column prop="unit" label="单位" width="80" />
                            <el-table-column prop="stock" label="库存" width="80" />
                            <el-table-column prop="produced" label="已生产" width="100" />
                            <el-table-column prop="toProduce" label="待生产" width="100" />
                            <el-table-column prop="carbonEmission" label="碳排放(kg)" width="120" />
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getEmissionOverall } from "@/api/carbonReport/monitorChartReport";
import { saleCustomer, saleStat, achieveRate, saleOverall } from "@/api/carbonReport/saleReport";
import {listEquipmentPowerReport} from "@/api/carbonReport/equipmentPowerReport";
import {productPowerReportOverall} from "@/api/carbonReport/productPowerReport";
import {listMaterialInventoryDetailReport} from "@/api/wmsReport/materialInventoryDetailReport";

// ========== 1. 基础数据定义 ==========
// 当前时间
const currentDateTime = ref('')
// 销售额/碳排放数据
const salesData = ref({
    yearTotal: 0,
    monthTotal: 0,
    todayTotal: 0
});
const carbonData = ref({
    yearTotal: 0,
    monthTotal: 0,
    todayTotal: 0
});
const fetchSalesData = async () => {
    try {
        const response = await saleOverall({ productYear: "2026" });
        const { todayTotal, monthTotal, yearTotal } = response.data;
        salesData.value = { todayTotal, monthTotal, yearTotal };
    } catch (error) {
        console.error('获取销售额数据失败：', error);
        ElMessage.error('销售额数据加载失败，请稍后重试');
    }
};

// 获取碳排放数据
const fetchCarbonData = async () => {
    try {
        const response = await getEmissionOverall({ productYear: "2026" });
        const { todayCarbonEmission, monthCarbonEmission, totalCarbonEmission } = response.data;
        carbonData.value = {
            todayTotal: todayCarbonEmission,
            monthTotal: monthCarbonEmission,
            yearTotal: totalCarbonEmission
        };
    } catch (error) {
        console.error('获取碳排放数据失败：', error);
        ElMessage.error('碳排放数据加载失败，请稍后重试');
    }
};

// 统一加载所有数据
const fetchAllData = async () => {
    await Promise.all([
        fetchSalesData(),
        fetchCarbonData(),
        initGaugeCharts(),
        initEnergyPie(),
        initSalesCompleteChart(),
        initSalesTrendChart(),
        initSalesRankChart()
    ]);
};
// 库存预警表格数据
const inventoryTableData = ref([])
// 生产统计表格数据（保留原有定义）
const productionTableData = ref([])
// 加载状态
const inventoryLoading = ref(false)

// 获取库存状态数据（核心方法）
const getInventoryData = async (query = {}) => {
  inventoryLoading.value = true
  try {
    // 调用后端真实库存接口
    const res = await listMaterialInventoryDetailReport(query)
    
    // 处理接口返回数据（核心：适配真实字段）
    if (res?.code === 200 && Array.isArray(res?.rows)) {
      inventoryTableData.value = res.rows.map((item, index) => {
        // 计算库存状态（接口inventoryStatusName为null，需根据库存/上下限判断）
        let status = '正常'
        const currentInventory = item.inventory
        const minInventory = item.minInventory
        const maxInventory = item.maxInventory

        if (currentInventory < minInventory) {
          status = '不足' // 低于下限 → 库存不足
        } else if (currentInventory > maxInventory && maxInventory !== 0) {
          status = '溢出' // 高于上限 → 库存溢出
        }

        return {
          id: index + 1, // 表格序号
          materialName: item.materialName, // 物料名称
          warehouseName: item.whName, // 仓库名称（接口是whName）
          stockNum: currentInventory, // 当前库存（接口是inventory）
          status: status // 计算后的库存状态
        }
      })
    } else {
      inventoryTableData.value = []
      ElMessage.warning('暂无库存数据')
    }
  } catch (error) {
    console.error('获取库存数据失败：', error)
    inventoryTableData.value = []
    ElMessage.error('库存数据加载失败，请稍后重试')
  } finally {
    inventoryLoading.value = false
  }
}

// 生产统计表格数据
const getProductCheckData = async () => {
  try {
    loading.value = true
    // 调用能耗/碳排放接口（可传查询参数，如productYear: "2022"）
    const powerRes = await productPowerReportOverall({
      // 可选查询参数：按时间/物料筛选
       productYear: "2026"
    })

    if (powerRes.code === 200 && Array.isArray(powerRes.rows)) {
      // 直接从新接口数据组装表格（含待生产+碳排放）
      productionTableData.value = powerRes.rows.map(item => ({
        id: item.planId || item.materialId, // 用计划ID/物料ID作为表格主键
        productName: item.materialName, // 产品名称
        model: item.materialModel, // 型号
        spec: item.materialSpecification, // 规格
        unit: item.materialUnit, // 单位
        stock: item.productQuantity, // 已生产数量（库存）
        produced: item.productQuantity, // 已生产（可替换为检验数，若需关联检验接口）
        // 核心：计算待生产数量（计划数-已生产数，确保非负）
        toProduce: Math.max(item.requireQuantity - item.productQuantity, 0),
        carbonEmission: item.carbonEmission, // 单台碳排放（直接取值）
        totalCarbonEmission: item.totalCarbonEmission // 可选：总碳排放
      }))
      console.log("整合后表格数据：", productionTableData.value)
    } else {
      productionTableData.value = []
      ElMessage.warning('暂无能耗统计数据')
    }
  } catch (error) {
    console.error('获取能耗/生产数据失败：', error)
    productionTableData.value = []
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 碳排放排行榜数据
const carbonRankData = ref([])
// 加载状态
const loading = ref(false)
// 实时刷新定时器
let refreshTimer = null
// 刷新间隔（毫秒），可根据需求调整（比如5秒刷新一次）
const REFRESH_INTERVAL = 5000

// 核心方法：获取设备碳排放排名数据
const getCarbonRankData = async () => {
  loading.value = true
  try {
    const res = await listEquipmentPowerReport({ 
      limit: 8, 
      sort: 'totalCarbonEmission', 
      order: 'desc' 
    })
    
    if (res?.code === 200 && Array.isArray(res?.rows)) {
      // 步骤1：先对相同设备名称的记录去重+合并数据
      const uniqueDataMap = new Map() // 用Map去重，key=设备名称，value=合并后的数据
      
      res.rows.forEach(item => {
        // 确定设备名称的唯一标识（优先用productLineName，无则用processName）
        const deviceKey = item.productLineName || item.processName
        
        if (uniqueDataMap.has(deviceKey)) {
          // 已有该设备，合并数据（生产数量累加，碳排放累加）
          const existingItem = uniqueDataMap.get(deviceKey)
          uniqueDataMap.set(deviceKey, {
            ...existingItem,
            productQuantity: existingItem.productQuantity + item.productQuantity,
            totalCarbonEmission: existingItem.totalCarbonEmission + item.totalCarbonEmission
          })
        } else {
          // 无该设备，直接存入Map
          uniqueDataMap.set(deviceKey, {
            ...item,
            productQuantity: item.productQuantity,
            totalCarbonEmission: item.totalCarbonEmission
          })
        }
      })

      // 步骤2：将Map转为数组，按总碳排放降序排序
      const uniqueDataArray = Array.from(uniqueDataMap.values()).sort(
        (a, b) => b.totalCarbonEmission - a.totalCarbonEmission
      )

      // 步骤3：截取前8条，映射表格字段
      carbonRankData.value = uniqueDataArray.slice(0, 8).map((item, index) => ({
        id: index + 1,
        equipment: item.productLineName || item.processName,
        productionNum: item.productQuantity,
        carbonEmission: item.totalCarbonEmission
      }))

    } else {
      carbonRankData.value = []
      ElMessage.warning('暂无碳排放排名数据')
    }
  } catch (error) {
    console.error('获取设备碳排放排名失败：', error)
    ElMessage.error('加载碳排放数据失败，请稍后重试')
    carbonRankData.value = []
  } finally {
    loading.value = false
  }
}

// ========== 2. 引用定义 ==========
// ECharts容器引用
const electricGauge = ref(null)
const waterGauge = ref(null)
const carbonGauge = ref(null)
const energyPie = ref(null)
const salesCompleteChart = ref(null)
const salesTrendChart = ref(null)
const salesRankChart = ref(null)

// 表格容器引用（用于滚动）
const inventoryTableRef = ref(null)
const productionTableRef = ref(null)

// 存储ECharts实例 + 定时器/事件引用（用于销毁）
let gaugeInstances = {}
let chartInstances = {}
let timeTimer = null // 时间更新定时器
let inventoryScrollTimer = null // 库存表格滚动定时器
let productionScrollTimer = null // 生产表格滚动定时器
const resizeHandlers = [] // 存储resize事件处理函数

// ========== 3. 工具函数 ==========
// 更新当前时间
const updateDateTime = () => {
    const now = new Date()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const weekDay = weekDays[now.getDay()]
    currentDateTime.value = `${year}-${month}-${day} ${weekDay} ${hours}:${minutes}:${seconds}`
}

// 设置库存状态样式
const setInventoryStatusStyle = ({ row }) => {
    if (row.status === '不足') return { color: '#008000' }
    if (row.status === '溢出') return { color: '#ff0000' }
    return { color: '#000000' }
}

// ========== 4. ECharts初始化通用方法（解决重复初始化问题） ==========
/**
 * 初始化ECharts实例（通用方法，避免重复初始化）
 * @param {Ref} domRef DOM容器引用
 * @param {String} key 实例标识
 * @param {Object} option 图表配置项
 * @returns {EChartsInstance} ECharts实例
 */
const initECharts = (domRef, key, option) => {
    // 1. 销毁旧实例
    if (chartInstances[key]) {
        chartInstances[key].dispose()
        chartInstances[key] = null
    }
    if (gaugeInstances[key]) {
        gaugeInstances[key].dispose()
        gaugeInstances[key] = null
    }

    // 2. 校验DOM存在
    const dom = domRef.value
    if (!dom) {
        console.warn(`ECharts容器 ${key} 不存在`)
        return null
    }

    // 3. 初始化新实例
    const instance = echarts.init(dom)
    instance.setOption(option)

    // 4. 绑定resize事件（避免重复绑定）
    const resizeHandler = () => instance.resize()
    resizeHandlers.push(resizeHandler)
    window.addEventListener('resize', resizeHandler)

    // 5. 存储实例
    if (['electric', 'water', 'carbon'].includes(key)) {
        gaugeInstances[key] = instance
    } else {
        chartInstances[key] = instance
    }

    return instance
}

// ========== 5. 各图表初始化方法 ==========
// 初始化仪表盘
const initGaugeCharts = async () => {
    let electricValue = 0;
    let waterValue = 0;
    let carbonValue = 0;
    try {
        const res = await getEmissionOverall({ productYear: "2026" });
        console.log("仪表盘接口返回：", res);
        if (res?.code === 200 && res?.data) {
            const Data = res.data["2026"];
            electricValue = Data.totalPowerConsume;
            waterValue = Data.totalWaterConsume;
            carbonValue = Data.totalCarbonSave;
        }
    } catch (err) {
        console.error("获取仪表盘数据失败：", err);
    }

    // 耗电量仪表盘
    initECharts(electricGauge, 'electric', {
        series: [{
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: { show: false },
            progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: { color: '#FF6B6B' }
            },
            axisLine: { lineStyle: { width: 20 } },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            title: { show: false },
            detail: {
                valueAnimation: true,
                fontSize: 16,
                offsetCenter: [0, 0],
                formatter: '{value}',
            },
            data: [{ value: electricValue, name: '耗电量' }]
        }]
    })

    // 耗水量仪表盘
    initECharts(waterGauge, 'water', {
        series: [{
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: { show: false },
            progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: { color: '#4ECDC4' }
            },
            axisLine: { lineStyle: { width: 20 } },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            title: { show: false },
            detail: {
                valueAnimation: true,
                fontSize: 16,
                offsetCenter: [0, 0],
                formatter: '{value}',
            },
            data: [{ value: waterValue, name: '耗水量' }]
        }]
    })

    // 碳排放量仪表盘
    initECharts(carbonGauge, 'carbon', {
        series: [{
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: { show: false },
            progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: { color: '#FFD166' }
            },
            axisLine: { lineStyle: { width: 20 } },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            title: { show: false },
            detail: {
                valueAnimation: true,
                fontSize: 16,
                offsetCenter: [0, 0],
                formatter: '{value}',
            },
            data: [{ value: carbonValue, name: '碳排放量' }]
        }]
    })
}

// 初始化能耗占比饼图
const initEnergyPie = async () => {
    let officeWastepower = 0;
    let officeUseWater = 0;
    let productUseWater = 0;
    let productWastepower = 0;
    try {
        const res = await getEmissionOverall({ productYear: "2026" });
        if (res?.code === 200 && res?.data) {
            const Data = res.data["2026"]
            officeWastepower = Data.totalOfficePowerConsume;
            officeUseWater = Data.totalOfficeWaterConsume;
            productUseWater = Data.totalWaterConsume;
            productWastepower = Data.totalOfficePowerConsume;
        }
    } catch (err) {
        console.error("获取能耗占比数据失败：", err);
    }

    const energyData = [
        { name: '办公耗电量', value: officeWastepower },
        { name: '办公用水量', value: officeUseWater },
        { name: '生产用水量', value: productUseWater },
        { name: '生产耗电量', value: productWastepower },
    ]
    const totalEnergy = energyData.reduce((sum, item) => sum + item.value, 0)
    console.log("总计数：",totalEnergy)

    initECharts(energyPie, 'energyPie', {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c} ({d}%)'
            },
            labelLine: { show: true },
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            },
            data: energyData,
            itemStyle: {
                color: (params) => {
                    const colorList = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572']
                    return colorList[params.dataIndex]
                }
            },
            graphic: [{
                type: 'text',
                left: '50%',
                top: '50%',
                style: {
                    text: `总能耗\n${totalEnergy}`,
                    fontSize: 14,
                    textAlign: 'inside'
                },
                transform: {
                    translateX: -30,
                    translateY: -15
                }
            }]
        }]
    })
}

// 初始化销售计划完成率组合图
const initSalesCompleteChart = async () => {
    try {
        const response = await achieveRate({ productYear: "2026" });
        const { category, barData, lineData, rateData } = response.data ;

        // 兜底计算完成率（已移除兜底值）
        const finalRateData = rateData;
        initECharts(salesCompleteChart, 'salesComplete', {
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    const month = params[0].axisValue;
                    const actual = params[0].value;
                    const plan = params[1].value;
                    const rate = params[2].value;
                    return `${month}<br/>已销售：${actual} 万元<br/>计划销售：${plan} 万元<br/>完成率：${rate}%`;
                }
            },
            xAxis: {
                type: 'category',
                data: category,
                axisLabel: {
                    formatter: (value) => value.replace('-', '月')
                }
            },
            yAxis: [
                { type: 'value', name: '销售金额(万元)', position: 'left' },
                { type: 'value', name: '完成率(%)', position: 'right', max: 120 }
            ],
            series: [
                {
                    name: '已销售',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: barData,
                    itemStyle: { color: '#4ECDC4' }
                },
                {
                    name: '计划销售',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: lineData,
                    itemStyle: { color: '#FF6B6B' }
                },
                {
                    name: '完成率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: finalRateData,
                    itemStyle: { color: '#FFD166' },
                    markPoint: { data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }] },
                    smooth: true
                }
            ],
            noDataLoadingOption: {
                text: '暂无计划完成率数据',
                effect: 'bubble',
                effectOption: { fontSize: 14 }
            }
        });
    } catch (error) {
        console.error('获取计划完成率数据失败：', error);
        ElMessage.error('加载计划完成率数据失败，请稍后重试');
    }
};

// 初始化销售统计曲线图
const initSalesTrendChart = async () => {
    try {
        const response = await saleStat({ productYear: "2026" });
        const { dateList, numList } = response.data || {};

        initECharts(salesTrendChart, 'salesTrend', {
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    const month = params[0].axisValue;
                    const amount = params[0].value;
                    return `${month}<br/>合同金额：${amount} 万元`;
                }
            },
            xAxis: {
                type: 'category',
                data: dateList,
                axisLabel: {
                    formatter: (value) => value.replace('-', '月'),
                }
            },
            yAxis: {
                type: 'value',
                name: '销售额(万元)',
                min: 0,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: '合同金额',
                    type: 'line',
                    data: numList,
                    itemStyle: { color: '#4ECDC4' },
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                }
            ]
        });
    } catch (error) {
        console.error('获取销售额趋势数据失败：', error);
        ElMessage.error('加载销售额数据失败，请稍后重试');
    }
};

// 初始化销售排名柱状图
const initSalesRankChart = async () => {
    let companyNames = [];
    let salesValues = [];

    try {
        const res = await saleCustomer({ limit: 8, year: 2026 });
        if (res?.code === 200 && Array.isArray(res?.data) && res.data.length > 0) {
            const rankData = res.data.sort((a, b) => b.value - a.value).slice(0, 8);
            console.log('排序后的数据：', rankData)
            companyNames = rankData.map(item => item.name);
            salesValues = rankData.map(item => item.value);
        } else if (res?.code === 200 && res.data.length === 0) {
            companyNames = [];
            salesValues = [];
        }
    } catch (err) {
        console.error('获取销售排名失败：', err);
    }

    initECharts(salesRankChart, 'salesRank', {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: '{b}：{c} 万元'
        },
        grid: {
            top:"1px",
            left: '1%',
            right: '20%',
            bottom: '2%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '销售额(万元)',
        },
        yAxis: {
            type: 'category',
            data: companyNames,
            axisLabel: {
                interval: 0,
            },
            inverse: true
        },
        series: [{
            name: '销售额',
            type: 'bar',
            data: salesValues,
            barWidth: '80%',
            label: {
                show: true,
                position: 'right',
                formatter: '{c}'
            },
            itemStyle: {
                color: (params) => {
                    const colorList = ['#FF6B6B', '#FF8E53', '#FFD166', '#06D6A0', '#4ECDC4', '#118AB2', '#073B4C', '#6A0572'];
                    return colorList[params.dataIndex % colorList.length];
                }
            }
        }]
    })
}

// ========== 7. 表格滚动初始化 ==========
const initTableScroll = () => {
    // 清除旧定时器
    if (inventoryScrollTimer) clearInterval(inventoryScrollTimer);
    if (productionScrollTimer) clearInterval(productionScrollTimer);

    // 等待DOM和数据完全渲染
    nextTick(() => {
        // 库存预警表格滚动
        if (inventoryTableRef.value) {
            const tableContainer = inventoryTableRef.value;
            // 有滚动内容才启动
            if (tableContainer.scrollHeight > tableContainer.clientHeight) {
                inventoryScrollTimer = setInterval(() => {
                    tableContainer.scrollTop += 1;
                    // 滚动到底部重置
                    if (tableContainer.scrollTop >= tableContainer.scrollHeight - tableContainer.clientHeight - 10) {
                        tableContainer.scrollTop = 0;
                    }
                }, 30);
            }
        }

        // 生产统计表格滚动
        if (productionTableRef.value) {
            const tableContainer = productionTableRef.value;
            // 有滚动内容才启动
            if (tableContainer.scrollHeight > tableContainer.clientHeight) {
                productionScrollTimer = setInterval(() => {
                    tableContainer.scrollTop += 1;
                    // 滚动到底部重置
                    if (tableContainer.scrollTop >= tableContainer.scrollHeight - tableContainer.clientHeight - 10) {
                        tableContainer.scrollTop = 0;
                    }
                }, 30);
            }
        }
    });
}

// ========== 8. 生命周期函数 ==========
onMounted(async () => {
    // 初始化时间
    updateDateTime();
    timeTimer = setInterval(updateDateTime, 1000);
    
    // 先加载所有数据
    await Promise.all([
        getCarbonRankData(),
        getProductCheckData(),
        getInventoryData(),
        fetchAllData()
    ]);

    // 数据加载完成后初始化滚动
    initTableScroll();

    // 启动实时刷新定时器
    refreshTimer = setInterval(getCarbonRankData, REFRESH_INTERVAL);

    // 监听窗口大小变化，重新调整图表
    const resizeObserver = new ResizeObserver(() => {
        Object.values(gaugeInstances).forEach(instance => instance?.resize());
        Object.values(chartInstances).forEach(instance => instance?.resize());
    });
    resizeObserver.observe(document.querySelector('.dashboard-layout'));

    // 监听数据变化，重新初始化滚动
    watch([inventoryTableData, productionTableData], () => {
        initTableScroll();
    }, { deep: true });

    // 监听销售额/碳排放数据变化
    watch([salesData, carbonData], () => {
        ElMessage.success('数据已更新');
        if (chartInstances.salesComplete) {
            chartInstances.salesComplete.resize();
        }
    }, { deep: true });
})

// 组件卸载时清除所有定时器和事件
onUnmounted(() => {
    if (timeTimer) clearInterval(timeTimer);
    if (refreshTimer) clearInterval(refreshTimer);
    if (inventoryScrollTimer) clearInterval(inventoryScrollTimer);
    if (productionScrollTimer) clearInterval(productionScrollTimer);
    resizeHandlers.forEach(handler => window.removeEventListener('resize', handler));
    Object.values(gaugeInstances).forEach(instance => instance?.dispose());
    Object.values(chartInstances).forEach(instance => instance?.dispose());
})
</script>

<style scoped>
.title {
  text-align: center;
  margin: 0 auto 25px;
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.6;
  letter-spacing: 1px;
  padding: 10px 0;
  border-bottom: 1px solid #e6e6e6;
}

.carbon-dashboard {
  width: 100%; /* 修复：替换100vw，避免横向溢出 */
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f5f5;
  overflow: hidden;
}

.header-time {
  position: absolute;
  top: 30px;
  right: 20px;
  font-size: 15px;
  font-weight: lighter;
  color: #333;
}

.dashboard-layout {
  display: flex;
  gap: 20px;
  height: calc(100% - 60px);
  align-items: stretch; /* 修复：取消注释，强制三列等高 */
}

.layout-left,
.layout-middle,
.layout-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 320px; /* 修复：三列统一最小宽度 */
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.gauge-container {
  display: flex;
  justify-content: space-around;
  flex: 1;
  min-height: 150px;
  align-items: center;
  padding: 10px 0;
}

.gauge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0 5px;
}

.gauge-chart {
  width: 100%;
  max-width: 120px;
  height: 100%;
  min-height: 120px;
}

.gauge-label {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
} 

/* 核心修复：补充width:100% */
.chart-container {
  flex: 1;
  min-height: 200px;
  width: 100%; /* 新增 */
  height: 100%;
  overflow: hidden;
}

.data-overview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
}

.overview-top {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  flex-shrink: 0;
}

.overview-item {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.overview-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.overview-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.overview-bottom {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.overview-subtitle {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  flex-shrink: 0;
}

.scroll-table-container {
  flex: 1;
  overflow-y: auto;
  max-height: none;
  padding: 0 2px;
}

:deep(.el-table) {
  --el-table-text-color: #333;
  --el-table-header-text-color: #666;
  --el-table-row-hover-bg-color: #f8f9fa;
  height: 100%;
}

:deep(.el-table th) {
  background-color: #f8f9fa !important;
}

.scroll-table-container::-webkit-scrollbar {
  width: 4px;
}
.scroll-table-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 2px;
}
</style>
