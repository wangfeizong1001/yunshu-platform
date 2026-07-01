<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>语言切换</h1>
      <p>支持中英文切换的组件</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>下拉选择器</h2>
        <p>使用下拉菜单切换语言</p>
      </div>
      <div class="demo-content">
        <div class="language-selector">
          <el-dropdown @command="handleCommand">
            <span class="dropdown-link">
              <el-icon><Document /></el-icon>
              {{ currentLanguage }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN" :class="{ active: locale === 'zh-CN' }">
                  中文
                </el-dropdown-item>
                <el-dropdown-item command="en" :class="{ active: locale === 'en' }">
                  English
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>按钮组形式</h2>
        <p>使用按钮组切换语言</p>
      </div>
      <div class="demo-content">
        <div class="language-buttons">
          <el-button-group>
            <el-button
              :type="locale === 'zh-CN' ? 'primary' : ''"
              @click="setLocale('zh-CN')"
            >
              中文
            </el-button>
            <el-button
              :type="locale === 'en' ? 'primary' : ''"
              @click="setLocale('en')"
            >
              English
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带图标</h2>
        <p>带国旗图标的语言切换</p>
      </div>
      <div class="demo-content">
        <div class="language-with-icon">
          <div class="lang-item" :class="{ active: locale === 'zh-CN' }" @click="setLocale('zh-CN')">
            <span class="flag">🇨🇳</span>
            <span>中文</span>
          </div>
          <div class="lang-item" :class="{ active: locale === 'en' }" @click="setLocale('en')">
            <span class="flag">🇺🇸</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>翻译示例</h2>
        <p>当前语言环境下的界面文本</p>
      </div>
      <div class="demo-content">
        <div class="translation-demo">
          <el-card class="demo-card">
            <template #header>
              <span>{{ t('demo.title') }}</span>
            </template>
            <el-form label-width="80px">
              <el-form-item :label="t('demo.username')">
                <el-input :placeholder="t('demo.usernamePlaceholder')" />
              </el-form-item>
              <el-form-item :label="t('demo.password')">
                <el-input type="password" :placeholder="t('demo.passwordPlaceholder')" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">{{ t('demo.login') }}</el-button>
                <el-button>{{ t('demo.register') }}</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Document, ArrowDown } from '@element-plus/icons-vue';

const locale = ref('zh-CN');
const currentLanguage = ref('中文');

const translations = {
  'zh-CN': {
    demo: {
      title: '用户登录',
      username: '用户名',
      usernamePlaceholder: '请输入用户名',
      password: '密码',
      passwordPlaceholder: '请输入密码',
      login: '登录',
      register: '注册',
    },
  },
  en: {
    demo: {
      title: 'User Login',
      username: 'Username',
      usernamePlaceholder: 'Please enter username',
      password: 'Password',
      passwordPlaceholder: 'Please enter password',
      login: 'Login',
      register: 'Register',
    },
  },
};

const t = (key: string): string => {
  const keys = key.split('.');
  let value: unknown = translations[locale.value as keyof typeof translations] || translations['zh-CN'];
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
};

const handleCommand = (command: string) => {
  setLocale(command);
};

const setLocale = (lang: string) => {
  locale.value = lang;
  currentLanguage.value = lang === 'zh-CN' ? '中文' : 'English';
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

.language-selector {
  display: flex;
  justify-content: center;
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.language-buttons {
  display: flex;
  justify-content: center;
}

.language-with-icon {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.lang-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  border: 2px solid #ebeef5;

  .dark & {
    background: #2d3748;
    border-color: #4a5568;
  }

  &:hover {
    border-color: #4a9eff;
  }

  &.active {
    border-color: #4a9eff;
    background: rgba(74, 158, 255, 0.1);
  }

  .flag {
    font-size: 20px;
  }
}

.translation-demo {
  display: flex;
  justify-content: center;
}

.demo-card {
  width: 100%;
  max-width: 400px;
}
</style>
