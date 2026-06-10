<template>
  <div class="login-container">
    <div class="login-left">
      <div class="brand">
        <h1 class="brand-title">云枢中台</h1>
        <p class="brand-subtitle">Yunshu Platform</p>
        <p class="brand-desc">开箱即用的企业级中台解决方案</p>
      </div>
      <div class="features">
        <div class="feature-item">
          <el-icon><Document /></el-icon>
          <span>设计令牌系统</span>
        </div>
        <div class="feature-item">
          <el-icon><Setting /></el-icon>
          <span>RBAC 权限模型</span>
        </div>
        <div class="feature-item">
          <el-icon><Monitor /></el-icon>
          <span>系统监控</span>
        </div>
        <div class="feature-item">
          <el-icon><Tools /></el-icon>
          <span>代码生成器</span>
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-form-wrapper">
        <h2 class="login-title">欢迎登录</h2>
        <p class="login-subtitle">请输入您的账号和密码登录系统</p>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item prop="code" v-if="captchaEnabled">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
              size="large"
              :prefix-icon="CircleCheck"
              style="width: 60%"
              maxlength="4"
              clearable
            />
            <div class="captcha" @click="getCaptcha">
              <el-image :src="captchaData.img" fit="contain" />
            </div>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="login-button"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-tip">
          <p>默认账号：admin / admin123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, CircleCheck, Document, Setting, Monitor, Tools } from '@element-plus/icons-vue'
import { getCaptchaApi, loginApi } from '@/api/auth'
import { getToken, setToken } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

const loginFormRef = ref()
const loading = ref(false)
const captchaEnabled = ref(true)
const captchaData = reactive({
  uuid: '',
  img: '',
  code: ''
})

const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: '',
  rememberMe: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur' }
  ]
}

// 获取验证码
const getCaptcha = async () => {
  try {
    const res: Record<string, unknown> = await getCaptchaApi()
    if (res.code === 200) {
      captchaData.uuid = res.data.uuid
      captchaData.img = res.data.img
      captchaData.code = res.data.code
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true

    try {
      const loginData = {
        username: loginForm.username,
        password: loginForm.password,
        code: loginForm.code,
        uuid: captchaData.uuid
      }

      const res: Record<string, unknown> = await loginApi(loginData)

      if (res.code === 200) {
        const token = res.data.token
        setToken(token)

        ElMessage.success('登录成功')

        // 获取重定向地址
        const redirect = route.query.redirect as string || '/'

        // 跳转到目标页面
        router.push(redirect)
      } else {
        ElMessage.error(res.msg || '登录失败')
        // 刷新验证码
        if (captchaEnabled.value) {
          getCaptcha()
        }
      }
    } catch (error: unknown) {
      const err = error as Record<string, unknown>
      ElMessage.error(err.message as string || '登录失败，请稍后重试')
      // 刷新验证码
      if (captchaEnabled.value) {
        getCaptcha()
      }
    } finally {
      loading.value = false
    }
  })
}

onMounted(() => {
  // 如果已登录，直接跳转
  if (getToken()) {
    router.push('/')
  }

  // 获取验证码
  getCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  .brand {
    text-align: center;
    margin-bottom: 60px;

    .brand-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 10px;
      letter-spacing: 4px;
    }

    .brand-subtitle {
      font-size: 24px;
      margin-bottom: 20px;
      opacity: 0.9;
    }

    .brand-desc {
      font-size: 16px;
      opacity: 0.8;
    }
  }

  .features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-width: 400px;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      backdrop-filter: blur(10px);

      .el-icon {
        font-size: 20px;
      }
    }
  }
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  padding: 40px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  .login-title {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
    text-align: center;
  }

  .login-subtitle {
    font-size: 14px;
    color: #909399;
    margin-bottom: 30px;
    text-align: center;
  }
}

.login-form {
  .captcha {
    margin-left: 10px;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    height: 40px;

    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}

.login-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
  letter-spacing: 10px;
}

.login-tip {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #909399;

  p {
    margin: 5px 0;
  }
}

@media (max-width: 768px) {
  .login-left {
    display: none;
  }

  .login-right {
    flex: 1;
  }
}
</style>
