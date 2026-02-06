<template>
  <div class="carbon-dashboard">
    <!-- 顶部标题栏 -->
    <div class="title">双碳可视化平台</div>
    <div class="dashboard-header">
      <div class="header-time">{{ currentDateTime }}</div>
    </div>

    <!-- 主体布局：替换为 Element 栅格组件 -->
    <el-row :gutter="20" class="dashboard-layout">
      <!-- 左侧区域：栅格列，占 8/24（1/3），响应式适配 -->
      <el-col :xs="24" :sm="24" :lg="8" class="layout-col">
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
              <el-table :data="inventoryTableData" border size="small" :cell-style="setInventoryStatusStyle" >
                <el-table-column prop="id" label="编号" width="50" />
                <el-table-column prop="materialName" label="物料名称" width="100" />
                <el-table-column prop="warehouseName" label="仓库名称" width="100" />
                <el-table-column prop="stockNum" label="当前库存" width="100" />
                <el-table-column prop="status" label="状态"  width="100" />
              </el-table>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 中间区域：栅格列，占 8/24（1/3） -->
      <el-col :xs="24" :sm="24" :lg="8" class="layout-col">
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
      </el-col>

      <!-- 右侧区域：栅格列，占 8/24（1/3） -->
      <el-col :xs="24" :sm="24" :lg="8" class="layout-col">
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
                <el-table-column prop=
                
                
                "model" label="型号" width="120" />
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
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getEmissionOverall } from "@/api/carbonReport/monitorChartReport";
import { saleCustomer, saleStat, achieveRate, saleOverall } from "@/api/carbonReport/saleReport";
import { listEquipmentPowerReport } from "@/api/carbonReport/equipmentPowerReport";
import { productPowerReportOverall,productPowerReportByMonth,productPowerReportByDay,productPowerReportByYear } from "@/api/carbonReport/productPowerReport";
import { listMaterialInventoryDetailReport } from "@/api/wmsReport/materialInventoryDetailReport";

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
    // 并行请求年、月、日三个接口
    const month = await productPowerReportByMonth({ productYear: "2026" });
     const year = await productPowerReportByYear({ productYear: "2026" });
      const day = await productPowerReportByDay({ productYear: "2026" });

    // 核心：从接口返回的 rows[0] 中提取 totalCarbonEmission
    // 多层空值检查，避免任意一层为 undefined 报错
    const getCarbonValue = (res) => {
      // 检查 res、rows、rows[0] 是否存在，兜底为 0
      return res?.rows?.[0]?.totalCarbonEmission ;
    };

    // 提取年、月、日的碳排放数据
    const yearCarbon = getCarbonValue(year);
    const monthCarbon = getCarbonValue(month);
    const dayCarbon = getCarbonValue(day);

    // 赋值到响应式数据
    carbonData.value = {
      todayTotal: dayCarbon,    // 日碳排放
      monthTotal: monthCarbon,  // 月碳排放
      yearTotal: yearCarbon     // 年碳排放
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
   console.log('库存状态值：', row.status, '当前行完整数据：', row);
  if (row.status === '不足') return { color: '#3FFFA3' }
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
        itemStyle: { color: '#19a7ce' } // 替换原#FF6B6B，使用科技蓝
      },
      axisLine: { lineStyle: { width: 20 } },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 13,
        offsetCenter: [0, 0],
        formatter: '{value}',
        color: "#ffffff"
      },
      data: [{ value: electricValue, name: '耗电量' }]

      // 其他配置不变...
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
        fontSize: 13,
        offsetCenter: [0, 0],
        formatter: '{value}',
        color: "#ffffff"
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
        fontSize: 13,
        offsetCenter: [0, 0],
        formatter: '{value}',
        color: "#ffffff"
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
      const Data = res.data["2026"];
      officeWastepower = Data.totalOfficePowerConsume || 0;
      officeUseWater = Data.totalOfficeWaterConsume || 0;
      productUseWater = Data.totalWaterConsume || 0;
      productWastepower = Data.totalPowerConsume || 0;
    }
  } catch (err) {
    console.error("获取能耗占比数据失败：", err);
  }

  // 统一配置
  const pieConfig = {
    center: ["50%", "40%"], // 饼图中心（和series保持一致）
    fontSize: 16,
    decimalDigits: 2
  };

  const energyData = [
    { name: '办公耗电量', value: officeWastepower },
    { name: '办公用水量', value: officeUseWater },
    { name: '生产用水量', value: productUseWater },
    { name: '生产耗电量', value: productWastepower },
  ];

  const totalEnergy = energyData.reduce((sum, item) => sum + Number(item.value), 0);
  const formatTotal = totalEnergy.toFixed(pieConfig.decimalDigits);

  initECharts(energyPie, "energyPie", {
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    // 中心总数（绝对居中版）
    graphic: totalEnergy > 0 ? [{
      type: "text",
      left: pieConfig.center[0],
      top: pieConfig.center[1],
      z: 10,
      style: {
        text: formatTotal,
        fontSize: pieConfig.fontSize,
        fill: "#ffffff",
        fontWeight: "bold",
        textAlign: "center", // 水平居中
        textBaseline: "middle" // 垂直居中
      }
    }] : [],
    legend: {
      bottom: "5%",
      left: 'center',
      textStyle: { color: '#ffffff' },
      data: ['办公耗电量', '办公用水量', '生产用水量', '生产耗电量']
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: pieConfig.center, // 和graphic的center完全一致
        label: {
          show: true,
          position: "outside",
          formatter: ({ name, data }) => `${name}: ${data.value.toFixed(2)}`
        },
        labelLine: { show: true },
        data: energyData,
        itemStyle: {
          color: (params) => ["#FF6B6B", "#4ECDC4", "#FFD166", "#6A0572"][params.dataIndex]
        }
      }
    ]
  });
};



// 初始化销售计划完成率组合图
const initSalesCompleteChart = async () => {
  try {
    const response = await achieveRate({ productYear: "2026" });
    const { category, barData, lineData, rateData } = response.data;

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
          formatter: (value) => value.replace('-', '月'),
          color: "#ffffff"
        }
      },
      yAxis: [
        { type: 'value', name: '销售数量', position: 'left', axisLabel: { color: "#ffffff" }, nameTextStyle: { color: "#ffffff" } },
        { type: 'value', name: '完成率(%)', position: 'right', max: 120, axisLabel: { color: "#ffffff" }, nameTextStyle: { color: "#ffffff" } },

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
          color: '#ffffff'
        }
      },
      yAxis: {
        type: 'value',
        name: '销售额(万元)',
        nameTextStyle: {
          color: '#ffffff', // 你可以改成任意想要的颜色，比如 #4ECDC4
          fontSize: 12      // 可选：调整字体大小
        },

        min: 0,
        axisLabel: {
          formatter: '{value}',
          color: '#ffffff'
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
      formatter: '{b}:{c} 万元'
    },
    grid: {
      top: "1px",
      left: '1%',
      right: '20%',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '销售额(万元)',
      nameTextStyle: { color: "#ffffff" },
      axisLabel: {
        color: '#ffffff'
      }
    },
    yAxis: {
      type: 'category',
      data: companyNames,
      axisLabel: {
        fontWeight: 'bold',
        interval: 0,
        color: '#ffffff'
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
        formatter: '{c}',
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
  // 清除旧定时器（必须先清除，防止多个定时器同时运行）
  if (inventoryScrollTimer) {
    clearInterval(inventoryScrollTimer);
    inventoryScrollTimer = null;
  }
  if (productionScrollTimer) {
    clearInterval(productionScrollTimer);
    productionScrollTimer = null;
  }

  // 等待DOM完全渲染
  nextTick(() => {
    // ===== 库存表格滚动 =====
    const initInventoryScroll = () => {
      // 方式1：直接获取Element UI表格的tbody（滚动的真实主体）
      const inventoryTable = inventoryTableRef.value?.querySelector('.el-table__body-wrapper tbody');
      const inventoryWrapper = inventoryTableRef.value;
      
      // console.log('库存表格滚动调试:', {
      //   wrapperExist: !!inventoryWrapper,
      //   tbodyExist: !!inventoryTable,
      //   wrapperHeight: inventoryWrapper?.clientHeight || 0,
      //   tbodyHeight: inventoryTable?.scrollHeight || 0,
      //   dataLength: inventoryTableData.value.length
      // });

      // 条件：tbody存在 + 数据长度大于0 + 内容高度大于可视高度
      if (inventoryTable && inventoryTableData.value.length > 0 && inventoryTable.scrollHeight > inventoryWrapper.clientHeight + 20) {
        inventoryScrollTimer = setInterval(() => {
          // 每次滚动1px，可调整速度
          inventoryTable.scrollTop += 10;
          // 滚动到底部，重置到顶部（加一点偏移，避免卡顿）
          if (inventoryTable.scrollTop >= inventoryTable.scrollHeight - inventoryWrapper.clientHeight - 5) {
            inventoryTable.scrollTop = 0;
          }
        }, 3); // 30ms间隔，值越小滚动越快
      } else {
        console.warn('库存表格不满足滚动条件');
      }
    };

    // ===== 生产表格滚动（重点修复） =====
    const initProductionScroll = () => {
      // 方式1：直接获取Element UI表格的tbody（滚动的真实主体）
      const productionTable = productionTableRef.value?.querySelector('.el-table__body-wrapper tbody');
      const productionWrapper = productionTableRef.value;
      
      // console.log('生产表格滚动调试:', {
      //   wrapperExist: !!productionWrapper,
      //   tbodyExist: !!productionTable,
      //   wrapperHeight: productionWrapper?.clientHeight || 0,
      //   tbodyHeight: productionTable?.scrollHeight || 0,
      //   dataLength: productionTableData.value.length
      // });

      // 条件：tbody存在 + 数据长度大于0 + 内容高度大于可视高度
      if (productionTable && productionTableData.value.length > 0 && productionTable.scrollHeight > productionWrapper.clientHeight + 20) {
        productionScrollTimer = setInterval(() => {
          productionTable.scrollTop += 1;
          // 滚动到底部，重置到顶部
          if (productionTable.scrollTop >= productionTable.scrollHeight - productionWrapper.clientHeight - 5) {
            productionTable.scrollTop = 0;
          }
        }, 30);
      } else {
        console.warn('生产表格不满足滚动条件:', {
          dataEmpty: productionTableData.value.length === 0,
          heightEnough: productionTable?.scrollHeight <= productionWrapper?.clientHeight + 20
        });
      }
    };

    // 启动滚动初始化，增加延迟确保表格渲染完成
    setTimeout(() => {
      initInventoryScroll();
      initProductionScroll();
    }, 800);
  });
};

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

  // 首次初始化滚动（延迟1秒，确保数据和DOM都渲染完毕）
  setTimeout(() => {
    initTableScroll();
  }, 1000);

  // 启动实时刷新定时器
  refreshTimer = setInterval(() => {
    Promise.all([
      getCarbonRankData(),
      getProductCheckData(),
      getInventoryData()
    ]).then(() => {
      // 数据更新后，重新初始化滚动
      initTableScroll();
    });
  }, REFRESH_INTERVAL);

  // 监听窗口大小变化
  const resizeObserver = new ResizeObserver(() => {
    Object.values(gaugeInstances).forEach(instance => instance?.resize());
    Object.values(chartInstances).forEach(instance => instance?.resize());
    initTableScroll();
  });
  resizeObserver.observe(document.querySelector('.dashboard-layout'));

  // 监听数据变化，深度监听数组内容
  watch([
    () => inventoryTableData.value.length,
    () => productionTableData.value.length
  ], () => {
    // 数据长度变化时，重新滚动
    setTimeout(() => {
      initTableScroll();
    }, 500);
  }, { deep: true });

  // 监听销售额/碳排放数据变化
  watch([salesData, carbonData], () => {
    ElMessage.success('数据已更新');
    if (chartInstances.salesComplete) {
      chartInstances.salesComplete.resize();
    }
  }, { deep: true });
});

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
.carbon-dashboard {
  width: 100%;
  /* 修复：替换100vw，避免横向溢出 */
  height: 100vh;
  padding: 10px;
  /* 这里修改你想要的内边距，只保留这一处定义 */
  box-sizing: border-box;
  background-color: #124A6D;
  background-attachment: fixed;
  /* 新增：固定背景，滚动时不移动 */
  overflow: hidden;
  font-family: 'Microsoft Yahei', sans-serif;
  /* 合并字体样式 */
}

.title {
  text-align: center;
  margin: 0 auto 25px;
  font-size: 28px;
  /* 合并后最终的字号 */
  font-weight: 700;
  color: #ffffff;
  /* 修改：改为白色，提升背景图片上的可读性 */
  line-height: 1.6;
  letter-spacing: 2px;
  /* 合并后最终的字间距 */
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  /* 修改：边框改为白色透明 */
  /* 渐变文字样式调整，适配透明背景 */
  background: linear-gradient(90deg, #ffffff 0%, #f0f8fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.header-time {
  position: absolute;
  top: 30px;
  right: 20px;
  font-size: 15px;
  font-weight: lighter;
  color: #ffffff;
  /* 修改：改为白色，提升可读性 */
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  /* 新增：文字阴影，增强辨识度 */
}

/* 栅格布局容器样式调整 */
.dashboard-layout {
  height: calc(100% - 60px);
  width: 100%;
}

/* 栅格列容器样式 */
.layout-col {
  height: 100%;
}

.layout-left,
.layout-middle,
.layout-right {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 320px;
}

.card {
  background: rgba(255, 255, 255, 0.15);
  /* 修改：大幅降低不透明度，增强透明效果 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  /* 修改：边框改为白色透明 */
  border-radius: 8px;
  padding: 12px;
  /* 最终生效的内边距 */
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  /* 修改：阴影改为深色，适配透明背景 */
  backdrop-filter: blur(8px);
  /* 新增：毛玻璃效果，提升视觉体验 */
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  /* 为伪元素准备 */
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffffff 0%, #f0f8fb 100%);
  /* 修改：渐变改为浅色系 */
  border-radius: 8px 8px 0 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  /* 最终字重 */
  margin-bottom: 12px;
  /* 最终外边距 */
  color: #ffffff;
  /* 修改：改为白色，提升可读性 */
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  /* 新增：文字阴影 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  /* 修改：边框改为白色透明 */
  flex-shrink: 0;
  text-align: center;
  padding-bottom: 6px;
  /* 新增内边距 */
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
  color: #ffffff;
  /* 修改：改为白色 */
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  /* 新增：文字阴影 */
  flex-shrink: 0;
}

/* 核心修复：补充width:100% */
.chart-container {
  flex: 1;
  min-height: 200px;
  width: 100%;
  /* 新增 */
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
  background: rgba(255, 255, 255, 0.1);
  /* 修改：透明背景 */
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  backdrop-filter: blur(4px);
  /* 新增：毛玻璃效果 */
}

.overview-label {
  font-size: 14px;
  color: #ffffff;
  /* 修改：改为白色 */
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  /* 新增：文字阴影 */
  margin-bottom: 5px;
}

.overview-value {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  /* 修改：改为白色 */
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  /* 新增：文字阴影 */
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
  color: #ffffff;
  /* 修改：改为白色 */
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  /* 新增：文字阴影 */
  flex-shrink: 0;
}

.scroll-table-container {
  flex: 1;
  overflow-y: auto;
  max-height: none;
  padding: 0 2px;
}

:deep(.el-table) {
  --el-table-text-color: #ffffff;
  /* 修改：表格文字改为白色 */
  --el-table-header-text-color: #ffffff;
  /* 修改：表头文字改为白色 */
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.2);
  /* 修改：hover背景为透明白色 */
  --el-table-border-color: rgba(255, 255, 255, 0.2);
  /* 新增：表格边框透明 */
  background: rgba(255, 255, 255, 0.05);
  /* 新增：表格背景透明 */
  backdrop-filter: blur(4px);
  /* 新增：毛玻璃效果 */
  height: 100%;
}

:deep(.el-table th) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  /* 修改：表头透明背景 */
}

:deep(.el-table tr) {
  background-color: transparent !important;
  /* 新增：表格行透明 */
}

.scroll-table-container::-webkit-scrollbar {
  width: 4px;
}

.scroll-table-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  /* 修改：滚动条滑块改为白色透明 */
  border-radius: 2px;
}

.scroll-table-container::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
  /* 新增：滚动条轨道透明 */
}
</style>
