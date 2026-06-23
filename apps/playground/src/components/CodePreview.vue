<template>
  <div class="code-preview" :class="[theme]">
    <div class="code-header" v-if="filename || language">
      <span class="code-filename" v-if="filename">{{ filename }}</span>
      <span class="code-language" v-if="language">{{ language }}</span>
      <button class="copy-btn" @click="handleCopy">
        <el-icon v-if="!copied"><DocumentCopy /></el-icon>
        <el-icon v-else class="success"><Check /></el-icon>
        <span>{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    <div class="code-content" :class="{ editable }">
      <textarea
        v-if="editable"
        ref="textareaRef"
        class="code-textarea"
        :value="code"
        @input="handleInput"
        spellcheck="false"
      />
      <pre v-else class="code-pre"><code class="code-block" v-html="highlightedCode" /></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DocumentCopy, Check } from '@element-plus/icons-vue';

interface Props {
  code: string;
  language?: string;
  filename?: string;
  theme?: 'dark' | 'light';
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  language: '',
  filename: '',
  theme: 'dark',
  editable: false,
});

const emit = defineEmits<{
  (e: 'code-change', code: string): void;
}>();

const copied = ref(false);
const textareaRef = ref<HTMLTextAreaElement>();

const highlightedCode = computed(() => {
  let code = props.code;
  // HTML 转义
  code = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 关键词高亮
  const keywords = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'import', 'export', 'from', 'default', 'class', 'extends', 'interface',
    'type', 'async', 'await', 'try', 'catch', 'new', 'this', 'true', 'false',
    'null', 'undefined', 'typeof', 'instanceof',
  ];

  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'g');
    code = code.replace(regex, '<span class="keyword">$1</span>');
  });

  // 字符串高亮
  code = code.replace(/(['"`])(?:(?!\1)[^\\]|\\.)*?\1/g, '<span class="string">$&</span>');

  // 注释高亮
  code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
  code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');

  // 数字高亮
  code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');

  return code;
});

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('code-change', target.value);
};
</script>

<style lang="scss" scoped>
.code-preview {
  border-radius: 8px;
  overflow: hidden;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;

  &.dark {
    background: #1a1a2e;
    border: 1px solid #2d3748;

    .code-header {
      background: #2d3748;
      border-bottom: 1px solid #4a5568;
    }

    .code-filename {
      color: #e4e7ed;
    }

    .code-language {
      color: #909399;
      background: rgba(74, 158, 255, 0.2);
    }

    .copy-btn {
      color: #909399;
      background: transparent;
      border: 1px solid #4a5568;

      &:hover {
        color: #4a9eff;
        border-color: #4a9eff;
      }
    }

    .code-textarea {
      color: #e4e7ed;
      background: #1a1a2e;
    }

    .code-pre {
      color: #e4e7ed;
    }
  }

  &.light {
    background: #fafafa;
    border: 1px solid #e4e7ed;

    .code-header {
      background: #f5f7fa;
      border-bottom: 1px solid #e4e7ed;
    }

    .code-filename {
      color: #303133;
    }

    .code-language {
      color: #606266;
      background: rgba(0, 0, 0, 0.05);
    }

    .copy-btn {
      color: #606266;
      border: 1px solid #dcdfe6;

      &:hover {
        color: #4a9eff;
        border-color: #4a9eff;
      }
    }

    .code-textarea {
      color: #303133;
      background: #fafafa;
    }

    .code-pre {
      color: #303133;
    }
  }
}

.code-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 12px;
}

.code-filename {
  font-weight: 500;
}

.code-language {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}

.copy-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;

  .success {
    color: #67c23a;
  }
}

.code-content {
  &.editable {
    .code-textarea {
      width: 100%;
      min-height: 200px;
      padding: 12px;
      border: none;
      outline: none;
      resize: vertical;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      tab-size: 2;
    }
  }
}

.code-pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
}

.code-block {
  :deep(.keyword) {
    color: #c678dd;
  }

  :deep(.string) {
    color: #98c379;
  }

  :deep(.comment) {
    color: #5c6370;
    font-style: italic;
  }

  :deep(.number) {
    color: #d19a66;
  }
}
</style>
