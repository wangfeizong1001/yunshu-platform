<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>云枢中台</h2>
        <p>权限管理系统</p>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <span>默认账号：admin / admin123</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '@/store/modules/permission.store'

const router = useRouter()
const permissionStore = usePermissionStore()

const formRef = ref()
const loading = ref(false)

const formData = reactive({
  username: 'admin',
  password: 'admin123',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
}

async function handleLogin() {
  try {
    await formRef.value?.validate()
    loading.value = true

    // 模拟登录
    if (formData.username === 'admin' && formData.password === 'admin123') {
      localStorage.setItem('token', 'mock-token')

      // 设置权限信息
      permissionStore.setPermissionInfo({
        permissions: ['*'],
        roles: ['admin'],
        user: {
          userId: 1,
          username: 'admin',
          nickname: '管理员',
          avatar: '',
        },
      })

      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  h2 {
    margin: 0 0 8px;
    font-size: 28px;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #999;
  }
}

.login-form {
  .login-btn {
    width: 100%;
  }
}

.login-tips {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
