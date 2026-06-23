<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>代码预览</h1>
      <p>代码片段展示与复制组件</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本用法</h2>
        <p>展示代码并支持复制</p>
      </div>
      <div class="demo-content">
        <CodePreview :code="basicCode" language="vue" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带标题</h2>
        <p>带文件名的代码展示</p>
      </div>
      <div class="demo-content">
        <CodePreview :code="basicCode" language="vue" filename="Button.vue" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>深色主题</h2>
        <p>深色背景的代码展示</p>
      </div>
      <div class="demo-content">
        <CodePreview :code="basicCode" language="vue" theme="dark" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>浅色主题</h2>
        <p>浅色背景的代码展示</p>
      </div>
      <div class="demo-content">
        <CodePreview :code="basicCode" language="vue" theme="light" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>多语言支持</h2>
        <p>不同语言的代码高亮</p>
      </div>
      <div class="demo-content">
        <CodePreview :code="tsCode" language="typescript" filename="api.ts" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>可编辑模式</h2>
        <p>支持在线编辑代码</p>
      </div>
      <div class="demo-content">
        <CodePreview :code="editableCode" language="vue" :editable="true" @code-change="handleCodeChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CodePreview from '@/components/CodePreview.vue';

const basicCode = `<template>
  <el-button type="primary" @click="handleClick">
    点击按钮
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const handleClick = () => {
  count.value++;
  console.log('按钮点击次数:', count.value);
};
<\/script>

<style scoped>
button {
  margin: 10px;
}
</style>`;

const tsCode = `import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

interface IResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加 token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = \`Bearer \${token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, params?: Record<string, unknown>): Promise<IResponse<T>> {
    return this.instance.get(url, { params });
  }

  public async post<T>(url: string, data?: unknown): Promise<IResponse<T>> {
    return this.instance.post(url, data);
  }
}

export default new HttpClient({
  baseURL: '/api',
  timeout: 10000,
});`;

const editableCode = ref(`<template>
  <div class="counter">
    <el-button type="primary" @click="count++">
      点击次数: {{ count }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
<\/script>

<style scoped>
.counter {
  padding: 20px;
}
</style>`);

const handleCodeChange = (newCode: string) => {
  editableCode.value = newCode;
};
</script>

<style lang="scss" scoped>
.demo-page {
  max-width: 1000px;
}

.demo-header {
  margin-bottom: 40px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
    margin-bottom: 8px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 14px;
    color: #909399;

    .dark & {
      color: #c0c4cc;
    }
  }
}

.demo-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;

  .dark & {
    background: #2d3748;
    border-color: #4a5568;
  }
}

.section-header {
  margin-bottom: 20px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 13px;
    color: #909399;

    .dark & {
      color: #c0c4cc;
    }
  }
}

.demo-content {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;

  .dark & {
    background: #1a202c;
  }
}
</style>
