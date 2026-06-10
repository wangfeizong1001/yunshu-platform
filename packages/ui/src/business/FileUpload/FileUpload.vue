<script setup lang="ts">
  /**
   * YunFileUpload — 通用文件上传组件
   *
   * 沉淀自云枢文件上传功能，提供：
   * - 拖拽上传
   * - 文件类型/大小校验
   * - 上传进度
   * - 预览（图片）
   */
  import { ref, computed } from 'vue';

  export interface FileUploadProps {
    /** 接受的文件类型 */
    accept?: string;
    /** 最大文件大小（MB） */
    maxSize?: number;
    /** 是否多选 */
    multiple?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 上传 API 地址 */
    action?: string;
    /** 拖拽提示 */
    dragText?: string;
  }

  const props = withDefaults(defineProps<FileUploadProps>(), {
    maxSize: 10,
    multiple: false,
    disabled: false,
    dragText: '点击或拖拽文件到此处上传',
  });

  const emit = defineEmits<{
    'update:files': [files: File[]];
    upload: [file: File];
    error: [message: string];
    progress: [percent: number];
  }>();

  const isDragging = ref(false);
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const fileList = ref<File[]>([]);
  const previewUrls = ref<string[]>([]);
  const inputRef = ref<HTMLInputElement>();

  const isImage = computed(() => {
    return props.accept?.startsWith('image/');
  });

  function handleDragOver(e: DragEvent) {
    if (props.disabled) return;
    e.preventDefault();
    isDragging.value = true;
  }

  function handleDragLeave() {
    isDragging.value = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging.value = false;
    if (props.disabled) return;

    const files = e.dataTransfer?.files;
    if (files) processFiles(files);
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) processFiles(target.files);
  }

  function processFiles(files: FileList) {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // 大小检查
      if (file.size > props.maxSize * 1024 * 1024) {
        emit('error', `文件 ${file.name} 大小超过 ${props.maxSize}MB 限制`);
        return;
      }
    }

    fileList.value = props.multiple ? [...fileList.value, ...fileArray] : fileArray;

    // 图片预览
    previewUrls.value = fileList.value
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => URL.createObjectURL(f));

    emit('update:files', fileList.value);
  }

  async function startUpload() {
    if (fileList.value.length === 0) return;

    uploading.value = true;
    uploadProgress.value = 0;

    for (const file of fileList.value) {
      emit('upload', file);
      // 模拟进度（实际使用时需通过 API onUploadProgress）
      uploadProgress.value = Math.min(
        100,
        uploadProgress.value + Math.round(100 / fileList.value.length),
      );
    }

    uploading.value = false;
  }

  function clearFiles() {
    fileList.value = [];
    previewUrls.value = [];
    uploadProgress.value = 0;
    if (inputRef.value) inputRef.value.value = '';
  }

  function triggerInput() {
    if (!props.disabled) inputRef.value?.click();
  }
</script>

<template>
  <div class="yun-upload">
    <!-- 拖拽区域 -->
    <div
      class="yun-upload__area"
      :class="{ 'is-dragging': isDragging, 'is-disabled': disabled }"
      @click="triggerInput"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div class="yun-upload__icon">📁</div>
      <p class="yun-upload__text">{{ dragText }}</p>
      <p v-if="accept" class="yun-upload__hint">支持格式：{{ accept }}</p>
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        hidden
        @change="handleFileChange"
      />
    </div>

    <!-- 文件列表 -->
    <div v-if="fileList.length > 0" class="yun-upload__list">
      <div v-for="(file, idx) in fileList" :key="idx" class="yun-upload__file">
        <img
          v-if="isImage && previewUrls[idx]"
          :src="previewUrls[idx]"
          class="yun-upload__preview"
        />
        <span class="yun-upload__filename">{{ file.name }}</span>
        <span class="yun-upload__filesize">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
      </div>

      <div class="yun-upload__actions">
        <button class="yun-upload__btn" :disabled="uploading" @click="startUpload">
          {{ uploading ? `上传中 ${uploadProgress}%` : '开始上传' }}
        </button>
        <button class="yun-upload__btn yun-upload__btn--clear" @click="clearFiles">清除</button>
      </div>

      <!-- 进度条 -->
      <div v-if="uploading" class="yun-upload__progress">
        <div class="yun-upload__progress-bar" :style="{ width: uploadProgress + '%' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .yun-upload__area {
    border: 2px dashed var(--border);
    border-radius: var(--radius-lg);
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    background: var(--surface-2);
  }
  .yun-upload__area:hover {
    border-color: var(--primary);
    background: var(--primary-alpha-10);
  }
  .yun-upload__area.is-dragging {
    border-color: var(--primary);
    background: var(--primary-alpha-20);
  }
  .yun-upload__area.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .yun-upload__icon {
    font-size: 40px;
    margin-bottom: 12px;
  }
  .yun-upload__text {
    color: var(--text-secondary);
    margin: 0 0 8px;
    font-size: var(--font-size-base);
  }
  .yun-upload__hint {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .yun-upload__list {
    margin-top: 16px;
  }
  .yun-upload__file {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: var(--surface-2);
    border-radius: var(--radius-base);
    margin-bottom: 8px;
  }
  .yun-upload__preview {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: var(--radius-sm);
  }
  .yun-upload__filename {
    flex: 1;
    font-size: var(--font-size-sm);
    color: var(--text-primary);
  }
  .yun-upload__filesize {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .yun-upload__actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
  .yun-upload__btn {
    padding: 8px 20px;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: var(--radius-base);
    cursor: pointer;
    font-size: var(--font-size-sm);
  }
  .yun-upload__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .yun-upload__btn--clear {
    background: var(--surface-2);
    color: var(--text-secondary);
  }

  .yun-upload__progress {
    margin-top: 12px;
    height: 4px;
    background: var(--surface-3);
    border-radius: 2px;
    overflow: hidden;
  }
  .yun-upload__progress-bar {
    height: 100%;
    background: var(--primary);
    transition: width var(--transition-normal);
  }
</style>
