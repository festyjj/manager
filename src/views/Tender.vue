<template>
  <div class="tender-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2>参与投标</h2>
    </div>

    <!-- 可投标标的列表卡片 -->
    <el-card shadow="hover" class="tender-card">
      <el-table
        v-loading="loading"
        :data="tenderList"
        border
        stripe
        style="width: 100%"
        :empty-text="emptyText"
      >
        <!-- 标的发布名称列：点击跳转招标公告 -->
        <el-table-column
          prop="bidTitle"
          label="标的发布名称"
          min-width="400"
          header-align="center"
          align="left"
        >
          <template #default="scope">
            <el-link
              type="primary"
              @click="openBidNotice(scope.row.id)"
              underline
            >
              {{ scope.row.bidTitle || '未命名标的' }}
            </el-link>
          </template>
        </el-table-column>

        <!-- 投标结束时间列：过期时间标红展示 -->
        <el-table-column
          prop="endDate"
          label="投标结束时间"
          width="200"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <span :class="getStatusClass(scope.row.endDate)">
              {{ formatDateTime(scope.row.endDate) || '未设置' }}
            </span>
          </template>
        </el-table-column>

        <!-- 操作列：报名按钮（过期禁用） -->
        <el-table-column
          label="操作"
          width="120"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleSignUp(scope.row)"
              :disabled="isExpired(scope.row.endDate)"
            >
              报名
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件：仅当有数据时展示 -->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getTenderList"
          @current-change="getTenderList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
/**
 * @file Tender.vue
 * @description 个人中心-参与投标页面，实现可投标标的列表展示、公告查看、投标报名等功能
 * @author 前端开发
 * @date 2026-01-15
 */

// 导入Vue核心API
import { ref, onMounted } from 'vue'
// 导入Element Plus组件
import { ElMessage, ElMessageBox } from 'element-plus'
// 导入招投标相关API接口
import { listBidding, getBidding } from '@/api/bid/bidding'

/**
 * 响应式数据定义
 */
// 列表加载状态（控制loading显示）
const loading = ref(false)
// 可投标标的列表数据
const tenderList = ref([])
// 列表总条数（分页用）
const total = ref(0)
// 空列表提示文本
const emptyText = ref('加载中...')

/**
 * 分页查询参数
 * @type {Object}
 * @property {number} pageNum - 当前页码，默认1
 * @property {number} pageSize - 每页条数，默认10
 * @property {number} status - 标的状态：1=已发布（可投标）
 */
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  status: 1
})

/**
 * 格式化时间字符串
 * @param {string} timeStr - 原始时间字符串（如后端返回的ISO时间/时间戳）
 * @returns {string} 格式化后的时间（YYYY-MM-DD HH:mm:ss）
 */
const formatDateTime = (timeStr) => {
  if (!timeStr) return ''
  try {
    const date = new Date(timeStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-')
  } catch (e) {
    // 时间格式错误时返回原始值
    return timeStr
  }
}

/**
 * 判断标的是否过期
 * @param {string} endDate - 投标结束时间
 * @returns {boolean} true=已过期，false=未过期
 */
const isExpired = (endDate) => {
  if (!endDate) return false
  const now = new Date().getTime()
  const end = new Date(endDate).getTime()
  return now > end
}

/**
 * 获取投标结束时间样式类（过期标红）
 * @param {string} endDate - 投标结束时间
 * @returns {string} 样式类名
 */
const getStatusClass = (endDate) => {
  return isExpired(endDate) ? 'text-red' : ''
}

/**
 * 新标签页打开招标公告
 * @param {string|number} id - 标的ID
 * @returns {Promise<void>}
 */
const openBidNotice = async (id) => {
  // 参数校验
  if (!id) {
    ElMessage.warning('标的ID不能为空')
    return
  }

  try {
    // 调用详情接口获取公告链接（转为数字避免类型错误）
    const res = await getBidding(Number(id))
    const noticeUrl = res.data?.bidNoticeUrl
    console.log("所有标的名称：",noticeUrl);
    if (noticeUrl) {
      // 新标签页打开公告链接
      window.open(noticeUrl, '_blank')
    } else {
      ElMessage.warning('该标的暂无招标公告链接')
    }
  } catch (error) {
    ElMessage.error('获取公告详情失败，请稍后重试')
    console.error('打开招标公告失败：', error)
  }
}

/**
 * 处理投标报名操作
 * @param {Object} row - 标的行数据
 */
const handleSignUp = (row) => {
  // 过期标的禁止报名
  if (isExpired(row.endDate)) {
    ElMessage.warning('该标的投标已结束，无法报名')
    return
  }

  // 报名确认弹窗
  ElMessageBox.confirm(
    `确认报名【${row.bidTitle || '该标的'}】吗？`,
    '报名提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
      center: true
    }
  ).then(async () => {
    try {
      // 模拟报名接口调用（实际项目替换为真实报名接口）
      // await submitBidSignUp({ bidId: Number(row.id) })
      await new Promise(resolve => setTimeout(resolve, 500)) // 模拟接口延迟
      ElMessage.success('报名成功')
    } catch (error) {
      ElMessage.error('报名失败，请稍后重试')
      console.error('投标报名失败：', error)
    }
  }).catch(() => {
    // 取消报名：仅关闭弹窗，无其他操作
  })
}

/**
 * 获取可投标标的列表数据
 * @returns {Promise<void>}
 */
const getTenderList = async () => {
  loading.value = true
  emptyText.value = '加载中...'
  try {
    // 调用列表接口获取数据
    const res = await listBidding(queryParams.value)
    if (res.code === 200) {
      tenderList.value = res.rows || []
      total.value = res.total || 0
      // 空数据提示
      emptyText.value = tenderList.value.length === 0 ? '暂无可投标的标的' : ''
    } else {
      ElMessage.error(res.msg || '获取标的列表失败')
      emptyText.value = '获取数据失败，请刷新重试'
    }
  } catch (error) {
    ElMessage.error('网络异常，获取标的列表失败')
    emptyText.value = '网络异常，请刷新重试'
    console.error('获取可投标标的列表异常：', error)
  } finally {
    // 无论成功失败，关闭loading
    loading.value = false
  }
}

/**
 * 页面挂载生命周期：加载标的列表数据
 */
onMounted(() => {
  getTenderList()
})
</script>

<style scoped>
/* 页面容器样式：基础布局 */
.tender-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 页面标题样式 */
.page-header {
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

/* 标的列表卡片样式 */
.tender-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 分页容器样式：右对齐 */
.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 过期时间样式：红色高亮 */
.text-red {
  color: #f56c6c;
  font-weight: 500;
}

/* 响应式适配：小屏幕下缩小内边距 */
@media (max-width: 768px) {
  .tender-container {
    padding: 10px;
  }
}
</style>
