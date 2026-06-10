<template>
  <el-dialog
    v-model="visible"
    title="代码预览"
    width="90%"
    :close-on-click-modal="false"
    class="preview-dialog"
    :top="'5vh'"
  >
    <div class="preview-container">
      <div class="file-list">
        <div class="file-list-header">
          <span>生成文件 ({{ fileList.length }})</span>
        </div>
        <div class="file-list-content">
          <div
            v-for="file in fileList"
            :key="file.filePath"
            :class="['file-item', { active: currentFile?.filePath === file.filePath }]"
            @click="handleSelectFile(file)"
          >
            <el-icon><Document /></el-icon>
            <span class="file-name">{{ file.fileName }}</span>
            <el-tag :type="getFileTagType(file.fileName)" size="small">
              {{ getFileExt(file.fileName) }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="code-preview">
        <div class="code-header">
          <div class="header-left">
            <el-icon class="file-icon" :color="getFileIconColor(currentFile?.fileName)">
              <Document v-if="isJavaFile(currentFile?.fileName)" />
              <DocumentCopy v-else-if="isVueFile(currentFile?.fileName)" />
              <Files v-else-if="isTypeScriptFile(currentFile?.fileName)" />
              <Key v-else-if="isSqlFile(currentFile?.fileName)" />
              <Document v-else />
            </el-icon>
            <span class="file-path">{{ currentFile?.filePath }}</span>
          </div>
          <div class="header-right">
            <el-button type="primary" size="small" :icon="DocumentCopy" @click="handleCopy">
              复制代码
            </el-button>
            <el-button size="small" :icon="Refresh" @click="loadPreviewData"> 刷新 </el-button>
          </div>
        </div>
        <div class="code-content" ref="codeContentRef">
          <pre v-if="currentFile"><code v-html="highlightedCode"></code></pre>
          <div v-else class="empty-state">
            <el-empty description="请选择一个文件预览" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="success" :icon="Download" @click="handleDownload"> 下载代码 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, watch, computed, nextTick } from 'vue';
  import { ElMessage } from 'element-plus';
  import { Document, DocumentCopy, Download, Refresh, Files, Key } from '@element-plus/icons-vue';
  import type { IGenPreview, IGenPreviewItem, IGenConfig } from '@yunshu/shared';
  import { previewCode, downloadCode } from '@/api/tool/gen.api';

  const props = defineProps<{
    modelValue: boolean;
    tableName?: string;
    config?: IGenConfig;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();

  const visible = ref(false);
  const loading = ref(false);
  const previewData = ref<IGenPreview | null>(null);
  const codeContentRef = ref<HTMLElement>();

  const fileList = computed(() => previewData.value?.files || []);
  const currentFile = ref<IGenPreviewItem | null>(null);

  const highlightedCode = computed(() => {
    if (!currentFile.value) return '';
    return highlightCode(currentFile.value.content, getFileExt(currentFile.value.fileName));
  });

  watch(
    () => props.modelValue,
    (val) => {
      visible.value = val;
      if (val && props.tableName) {
        loadPreviewData();
      }
    },
  );

  watch(visible, (val) => {
    emit('update:modelValue', val);
  });

  const getFileExt = (fileName: string): string => {
    const ext = fileName.split('.').pop() || '';
    return ext.toLowerCase();
  };

  const getFileTagType = (
    fileName: string,
  ): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined => {
    const ext = getFileExt(fileName);
    const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
      java: 'success',
      vue: 'primary',
      ts: 'warning',
      js: 'warning',
      sql: 'info',
      xml: 'danger',
    };
    return typeMap[ext];
  };

  const getFileIconColor = (fileName?: string): string => {
    if (!fileName) return '#909399';
    const ext = getFileExt(fileName);
    const colorMap: Record<string, string> = {
      java: '#b07219',
      vue: '#42b883',
      ts: '#3178c6',
      js: '#f7df1e',
      sql: '#e38c00',
      xml: '#0060ac',
      html: '#e34c26',
      css: '#563d7c',
    };
    return colorMap[ext] || '#909399';
  };

  const isJavaFile = (fileName?: string): boolean => {
    return getFileExt(fileName || '') === 'java';
  };

  const isVueFile = (fileName?: string): boolean => {
    return getFileExt(fileName || '') === 'vue';
  };

  const isTypeScriptFile = (fileName?: string): boolean => {
    return ['ts', 'tsx'].includes(getFileExt(fileName || ''));
  };

  const isSqlFile = (fileName?: string): boolean => {
    return getFileExt(fileName || '') === 'sql';
  };

  const highlightCode = (code: string, _lang: string): string => {
    let result = escapeHtml(code);

    const keywords = [
      'import',
      'export',
      'from',
      'default',
      'const',
      'let',
      'var',
      'function',
      'return',
      'if',
      'else',
      'for',
      'while',
      'do',
      'switch',
      'case',
      'break',
      'continue',
      'try',
      'catch',
      'finally',
      'throw',
      'class',
      'extends',
      'implements',
      'interface',
      'type',
      'enum',
      'public',
      'private',
      'protected',
      'static',
      'final',
      'abstract',
      'async',
      'await',
      'new',
      'this',
      'super',
      'null',
      'undefined',
      'true',
      'false',
      'void',
      'number',
      'string',
      'boolean',
      'any',
      'never',
      'unknown',
      'object',
      'package',
      'class',
      'interface',
      'extends',
      'implements',
      'public',
      'private',
      'protected',
      'static',
      'final',
      'abstract',
      'synchronized',
      'volatile',
      'transient',
      'native',
      'strictfp',
      'throws',
      'throw',
      'try',
      'catch',
      'finally',
      'if',
      'else',
      'switch',
      'case',
      'default',
      'for',
      'while',
      'do',
      'break',
      'continue',
      'return',
      'goto',
      'const',
      'package',
      'import',
      'public',
      'private',
      'protected',
      'static',
      'final',
      'abstract',
      'class',
      'interface',
      'extends',
      'implements',
      'native',
      'synchronized',
      'transient',
      'volatile',
      'strictfp',
      'throws',
      'throw',
      'try',
      'catch',
      'finally',
      'if',
      'else',
      'switch',
      'case',
      'default',
      'for',
      'while',
      'do',
      'break',
      'continue',
      'return',
      'goto',
      'const',
    ];

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      result = result.replace(regex, '<span class="token keyword">$1</span>');
    });

    const stringRegex = /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g;
    result = result.replace(stringRegex, (match) => `<span class="token string">${match}</span>`);

    const numberRegex = /\b(\d+\.?\d*)\b/g;
    result = result.replace(numberRegex, '<span class="token number">$1</span>');

    const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    result = result.replace(commentRegex, '<span class="token comment">$1</span>');

    const decoratorRegex = /@\w+/g;
    result = result.replace(decoratorRegex, '<span class="token decorator">$&</span>');

    const annotationRegex = /@\w+/g;
    result = result.replace(annotationRegex, '<span class="token annotation">$&</span>');

    return result;
  };

  const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"]/g, (m) => map[m]);
  };

  const loadPreviewData = async () => {
    if (!props.tableName) return;

    loading.value = true;
    try {
      const config: IGenConfig = {
        tableName: props.tableName,
        tableComment: props.config?.tableComment || '',
        className: props.config?.className || '',
        moduleName: props.config?.moduleName || '',
        packageName: props.config?.packageName || 'com.yunshu.generator',
        author: props.config?.author || '云枢',
        email: props.config?.email,
        generateType: props.config?.generateType || 'single',
        generateMenu: props.config?.generateMenu ?? true,
        generateApi: props.config?.generateApi ?? true,
        generateView: props.config?.generateView ?? true,
        generateTypeScript: props.config?.generateTypeScript ?? true,
        businessName: props.config?.businessName,
        functionName: props.config?.functionName,
        treeCodeField: props.config?.treeCodeField,
        treeParentCodeField: props.config?.treeParentCodeField,
        treeNameField: props.config?.treeNameField,
      };

      const res = (await previewCode(config)) as { success: boolean; data: IGenPreview };
      if (res.success) {
        previewData.value = res.data;
        if (fileList.value.length > 0 && !currentFile.value) {
          currentFile.value = fileList.value[0];
        }
        ElMessage.success('代码预览加载成功');
      }
    } catch {
      ElMessage.error('加载预览数据失败');
    } finally {
      loading.value = false;
    }
  };

  const handleSelectFile = (file: IGenPreviewItem) => {
    currentFile.value = file;
    nextTick(() => {
      if (codeContentRef.value) {
        codeContentRef.value.scrollTop = 0;
      }
    });
  };

  const handleCopy = async () => {
    if (!currentFile.value?.content) {
      ElMessage.warning('没有可复制的内容');
      return;
    }

    try {
      await navigator.clipboard.writeText(currentFile.value.content);
      ElMessage.success('代码已复制到剪贴板');
    } catch {
      ElMessage.error('复制失败，请手动复制');
    }
  };

  const handleDownload = () => {
    if (!props.tableName) return;
    downloadCode(props.tableName, props.config);
    ElMessage.success('代码已生成，正在下载...');
  };

  const handleClose = () => {
    visible.value = false;
    currentFile.value = null;
    previewData.value = null;
  };
</script>

<style lang="scss" scoped>
  .preview-dialog {
    :deep(.el-dialog__body) {
      padding: 0;
    }

    .preview-container {
      display: flex;
      height: 75vh;
      max-height: 700px;

      .file-list {
        width: 280px;
        border-right: 1px solid #e4e7ed;
        display: flex;
        flex-direction: column;
        background: #f5f7fa;

        .file-list-header {
          padding: 12px 16px;
          background: #fff;
          border-bottom: 1px solid #e4e7ed;
          font-weight: 600;
          color: #303133;
          font-size: 14px;
        }

        .file-list-content {
          flex: 1;
          overflow-y: auto;
          padding: 8px;

          .file-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            cursor: pointer;
            border-radius: 6px;
            margin-bottom: 4px;
            transition: all 0.2s;
            background: #fff;
            border: 1px solid transparent;

            &:hover {
              background: #ecf5ff;
              border-color: #d9ecff;
            }

            &.active {
              background: #ecf5ff;
              border-color: #409eff;
              color: #409eff;

              .el-icon {
                color: #409eff;
              }
            }

            .file-name {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 13px;
            }

            .el-icon {
              color: #909399;
            }
          }
        }
      }

      .code-preview {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #fff;

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f5f7fa;
          border-bottom: 1px solid #e4e7ed;

          .header-left {
            display: flex;
            align-items: center;
            gap: 10px;

            .file-icon {
              font-size: 20px;
            }

            .file-path {
              font-family: 'Consolas', 'Monaco', monospace;
              font-size: 13px;
              color: #606266;
            }
          }
        }

        .code-content {
          flex: 1;
          overflow: auto;
          padding: 16px;
          background: #1e1e1e;
          margin: 0;

          pre {
            margin: 0;

            code {
              font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
              font-size: 13px;
              line-height: 1.7;
              color: #d4d4d4;
              white-space: pre;
            }
          }

          .token {
            &.keyword {
              color: #569cd6;
              font-weight: 500;
            }

            &.string {
              color: #ce9178;
            }

            &.number {
              color: #b5cea8;
            }

            &.comment {
              color: #6a9955;
            }

            &.decorator,
            &.annotation {
              color: #dcdcaa;
            }
          }

          .empty-state {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #d4d4d4;
          }
        }
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }
</style>
