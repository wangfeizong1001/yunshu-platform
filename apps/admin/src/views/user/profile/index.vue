<template>
  <div class="profile-page">
    <el-row :gutter="16">
      <!-- 左侧：基本信息卡 + 修改密码卡 -->
      <el-col :xs="24" :lg="10">
        <!-- 基本信息卡 -->
        <div class="card profile-card">
          <div class="card-header">
            <el-icon><User /></el-icon>
            <span>基本信息</span>
          </div>
          <div class="card-body">
            <div class="avatar-section">
              <el-avatar :size="120" :src="userStore.avatar">
                <el-icon :size="60"><User /></el-icon>
              </el-avatar>
              <el-upload
                class="avatar-upload"
                action="#"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :http-request="handleAvatarUpload"
              >
                <el-button type="primary" plain size="small">
                  <el-icon><Upload /></el-icon>
                  更换头像
                </el-button>
              </el-upload>
            </div>
            <div class="form-section">
              <el-form
                ref="profileFormRef"
                :model="profileForm"
                label-width="80px"
                label-position="left"
              >
                <el-form-item label="用户昵称">
                  <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="所属部门">
                  <el-input v-model="profileForm.deptName" readonly />
                </el-form-item>
              </el-form>
              <div class="form-actions">
                <el-button type="primary" @click="handleSaveProfile">保存修改</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 修改密码卡 -->
        <div class="card password-card">
          <div class="card-header">
            <el-icon><Lock /></el-icon>
            <span>修改密码</span>
          </div>
          <div class="card-body">
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="100px"
              label-position="left"
            >
              <el-form-item label="原密码" prop="oldPassword">
                <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  show-password
                  placeholder="请输入原密码"
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  show-password
                  placeholder="请输入新密码"
                  @input="handlePasswordInput"
                />
              </el-form-item>
              <el-form-item label="密码强度" v-if="passwordForm.newPassword">
                <div class="password-strength">
                  <el-progress
                    :percentage="passwordStrength.percentage"
                    :color="passwordStrength.color"
                    :show-text="false"
                    :stroke-width="8"
                  />
                  <span class="strength-text" :style="{ color: passwordStrength.color }">
                    {{ passwordStrength.label }}
                  </span>
                </div>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  show-password
                  placeholder="请再次输入新密码"
                />
              </el-form-item>
            </el-form>
            <div class="form-actions">
              <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
              <el-button @click="handleResetPassword">重置</el-button>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧：操作日志卡 -->
      <el-col :xs="24" :lg="14">
        <div class="card log-card">
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>操作日志</span>
          </div>
          <div class="card-body">
            <el-table :data="paginatedLogs" stripe size="default">
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="operType" label="操作类型" width="100">
                <template #default="{ row }">
                  <el-tag :type="getOperTypeTagType(row.operType)" size="small">
                    {{ row.operType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="operTime" label="操作时间" min-width="160">
                <template #default="{ row }">
                  {{ formatTime(row.operTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="ip" label="IP" width="140" />
              <el-table-column prop="status" label="状态" width="80" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusTagType(row.status)" size="small">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-wrapper">
              <el-pagination
                v-model:current-page="pagination.page"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[5, 10, 20]"
                :total="logList.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { User, Upload, Lock, Document } from '@element-plus/icons-vue'

// ========== 用户 Store ==========
const userStore = useUserStore()

// ========== 基本信息表单 ==========
const profileFormRef = ref()
const profileForm = reactive({
  nickname: userStore.nickname,
  email: userStore.email,
  phone: userStore.phone,
  deptName: userStore.deptName
})

/**
 * 保存个人信息
 */
const handleSaveProfile = () => {
  userStore.nickname = profileForm.nickname
  userStore.email = profileForm.email
  userStore.phone = profileForm.phone
  ElMessage.success('个人信息保存成功')
}

/**
 * 头像上传前的校验
 */
const handleBeforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

/**
 * 自定义上传方法（实际项目中替换为真实 API）
 */
const handleAvatarUpload = (options: { file: File }) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    userStore.avatar = result
    ElMessage.success('头像更换成功')
  }
  reader.readAsDataURL(options.file)
}

// ========== 修改密码表单 ==========
const passwordFormRef = ref()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

/**
 * 密码强度检测
 */
interface PasswordStrength {
  percentage: number
  color: string
  label: string
}

const passwordStrength = computed<PasswordStrength>(() => {
  const pwd = passwordForm.newPassword
  if (!pwd) {
    return { percentage: 0, color: '', label: '' }
  }

  let score = 0
  // 长度至少 8 位
  if (pwd.length >= 8) score++
  // 包含小写字母
  if (/[a-z]/.test(pwd)) score++
  // 包含大写字母
  if (/[A-Z]/.test(pwd)) score++
  // 包含数字
  if (/[0-9]/.test(pwd)) score++
  // 包含特殊字符
  if (/[^a-zA-Z0-9]/.test(pwd)) score++

  if (score <= 2) {
    return { percentage: 33, color: 'var(--el-color-danger)', label: '弱' }
  } else if (score <= 3) {
    return { percentage: 66, color: 'var(--el-color-warning)', label: '中' }
  } else {
    return { percentage: 100, color: 'var(--el-color-success)', label: '强' }
  }
})

/**
 * 实时更新密码强度
 */
const handlePasswordInput = () => {
  // 触发响应式更新
}

/**
 * 密码校验规则
 */
const validateNewPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入新密码'))
    return
  }
  if (value.length < 8) {
    callback(new Error('密码长度至少 8 位'))
    return
  }
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
    callback(new Error('密码需包含大小写字母和数字'))
    return
  }
  callback()
}

const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请再次输入新密码'))
    return
  }
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
    return
  }
  callback()
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, validator: validateNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

/**
 * 修改密码
 */
const handleChangePassword = async () => {
  try {
    await passwordFormRef.value?.validate()
    // 实际项目中调用修改密码 API
    ElMessage.success('密码修改成功')
    handleResetPassword()
  } catch {
    // 校验失败
  }
}

/**
 * 重置密码表单
 */
const handleResetPassword = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.resetFields()
}

// ========== 操作日志 ==========
/**
 * 操作日志状态常量
 */
const OPERLOG_STATUS_SUCCESS = '0'
const OPERLOG_STATUS_FAIL = '1'

/**
 * 操作日志 Mock 数据（14 条）
 */
interface OperLog {
  id: number
  operType: string
  operTime: string
  ip: string
  status: string
}

const logList: OperLog[] = [
  { id: 1, operType: '登录', operTime: '2024-01-15 09:23:45', ip: '192.168.1.100', status: '0' },
  { id: 2, operType: '查询', operTime: '2024-01-15 09:25:12', ip: '192.168.1.100', status: '0' },
  { id: 3, operType: '新增', operTime: '2024-01-15 10:15:33', ip: '192.168.1.100', status: '0' },
  { id: 4, operType: '修改', operTime: '2024-01-15 11:30:08', ip: '192.168.1.100', status: '0' },
  { id: 5, operType: '删除', operTime: '2024-01-15 14:22:17', ip: '192.168.1.101', status: '0' },
  { id: 6, operType: '导出', operTime: '2024-01-15 15:45:29', ip: '192.168.1.100', status: '0' },
  { id: 7, operType: '导入', operTime: '2024-01-15 16:08:55', ip: '192.168.1.102', status: '0' },
  { id: 8, operType: '登录', operTime: '2024-01-16 08:30:00', ip: '192.168.1.100', status: '0' },
  { id: 9, operType: '重置密码', operTime: '2024-01-16 09:15:42', ip: '192.168.1.101', status: '0' },
  { id: 10, operType: '修改', operTime: '2024-01-16 10:33:18', ip: '192.168.1.100', status: '0' },
  { id: 11, operType: '删除', operTime: '2024-01-16 11:50:07', ip: '192.168.1.103', status: '0' },
  { id: 12, operType: '查询', operTime: '2024-01-16 13:25:36', ip: '192.168.1.100', status: '0' },
  { id: 13, operType: '新增', operTime: '2024-01-16 14:40:21', ip: '192.168.1.102', status: '0' },
  { id: 14, operType: '登出', operTime: '2024-01-16 18:00:00', ip: '192.168.1.100', status: '0' }
]

/**
 * 分页配置
 */
const pagination = reactive({
  page: 1,
  pageSize: 10
})

/**
 * 当前页数据
 */
const paginatedLogs = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return logList.slice(start, end)
})

/**
 * 操作类型 -> tag 类型映射
 */
const OPER_TYPE_TAG_MAP: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
  查询: 'info',
  新增: 'success',
  修改: 'warning',
  删除: 'danger',
  导出: 'primary',
  导入: 'primary',
  登录: 'success',
  登出: 'info',
  重置密码: 'warning'
}

/**
 * 获取操作类型 tag 类型
 */
const getOperTypeTagType = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  return OPER_TYPE_TAG_MAP[type] || 'info'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
  return status === OPERLOG_STATUS_SUCCESS ? '成功' : '失败'
}

/**
 * 获取状态 tag 类型
 */
const getStatusTagType = (status: string) => {
  return status === OPERLOG_STATUS_SUCCESS ? 'success' : 'danger'
}

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  return time
}
</script>

<style scoped lang="scss">
// ========== CSS 变量 ==========
$color-primary: var(--el-color-primary, #409eff);
$color-success: var(--el-color-success, #67c23a);
$color-warning: var(--el-color-warning, #e6a23c);
$color-danger: var(--el-color-danger, #f56c6c);
$color-text-primary: var(--el-text-color-primary, #303133);
$color-text-regular: var(--el-text-color-regular, #606266);
$color-text-secondary: var(--el-text-color-secondary, #909399);
$color-border-lighter: var(--el-border-color-lighter, #ebeef5);
$color-fill-light: var(--el-fill-color-light, #f5f7fa);
$color-fill-blank: var(--el-bg-color, #ffffff);
$shadow-light: var(--el-box-shadow-light, 0 2px 8px rgba(0, 0, 0, 0.04));
$border-radius-large: 12px;

.profile-page {
  padding: 16px;
}

.card {
  background: $color-fill-blank;
  border-radius: $border-radius-large;
  box-shadow: $shadow-light;
  border: 1px solid $color-border-lighter;
  margin-bottom: 16px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  color: $color-text-primary;
  border-bottom: 1px solid $color-border-lighter;

  .el-icon {
    color: $color-primary;
  }
}

.card-body {
  padding: 20px;
}

// ========== 基本信息卡 ==========
.profile-card {
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid $color-border-lighter;

    .avatar-upload {
      :deep(.el-upload) {
        display: block;
      }
    }
  }

  .form-section {
    .el-form {
      :deep(.el-input) {
        width: 100%;
      }
    }

    .form-actions {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid $color-border-lighter;
      text-align: center;

      .el-button {
        min-width: 100px;
      }
    }
  }
}

// ========== 修改密码卡 ==========
.password-card {
  .password-strength {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    .el-progress {
      flex: 1;
    }

    .strength-text {
      font-size: 12px;
      font-weight: 500;
      min-width: 24px;
    }
  }

  .form-actions {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid $color-border-lighter;
    text-align: center;

    .el-button {
      min-width: 80px;
    }
  }
}

// ========== 操作日志卡 ==========
.log-card {
  .card-body {
    padding-bottom: 0;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
  }
}
</style>
