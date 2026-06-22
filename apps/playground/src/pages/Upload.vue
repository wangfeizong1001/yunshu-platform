<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>文件上传</h1>
      <p>支持单文件、多文件上传，带预览功能</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本上传</h2>
        <p>点击或拖拽上传文件</p>
      </div>
      <div class="demo-content">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
          </template>
        </el-upload>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带预览的上传</h2>
        <p>图片上传后可预览</p>
      </div>
      <div class="demo-content">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
        >
          <el-button type="primary">
            <el-icon><Plus /></el-icon>
            上传图片
          </el-button>
        </el-upload>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>缩略图上传</h2>
        <p>以缩略图形式展示已上传文件</p>
      </div>
      <div class="demo-content">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture-card"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>自定义属性</h2>
        <p>实时调整上传属性</p>
      </div>
      <div class="demo-content">
        <div class="props-panel">
          <div class="prop-item">
            <span class="prop-label">多选</span>
            <el-switch v-model="multiple" />
          </div>
          <div class="prop-item">
            <span class="prop-label">自动上传</span>
            <el-switch v-model="autoUpload" />
          </div>
          <div class="prop-item">
            <span class="prop-label">列表类型</span>
            <el-select v-model="listType" class="prop-select">
              <el-option label="文本" value="text" />
              <el-option label="图片" value="picture" />
              <el-option label="卡片" value="picture-card" />
            </el-select>
          </div>
        </div>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :multiple="multiple"
          :auto-upload="autoUpload"
          :list-type="listType"
          :file-list="fileList2"
          :on-change="handleChange"
        >
          <el-button type="primary">
            <el-icon><Plus /></el-icon>
            选择文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip">自定义配置上传</div>
          </template>
        </el-upload>
        <div v-if="!autoUpload" style="margin-top: 12px;">
          <el-button type="success" @click="submitUpload">上传文件</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadFilled, Plus } from '@element-plus/icons-vue';
import type { UploadFile, UploadProps } from 'element-plus';

const fileList = ref<UploadFile[]>([
  {
    name: 'example.jpg',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200',
  },
]);

const fileList2 = ref<UploadFile[]>([]);
const multiple = ref(true);
const autoUpload = ref(true);
const listType = ref<'text' | 'picture' | 'picture-card'>('text');

const uploadRef = ref<InstanceType<typeof UploadProps>>();

const handleRemove = (file: UploadFile, list: UploadFile[]) => {
  console.log(file, list);
};

const handlePreview = (file: UploadFile) => {
  console.log(file);
};

const handleChange = (file: UploadFile) => {
  console.log(file);
};

const submitUpload = () => {
  uploadRef.value?.submit();
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

.upload-demo {
  margin-bottom: 0;
}

.props-panel {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.prop-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prop-label {
  font-size: 14px;
  color: #606266;
  min-width: 60px;

  .dark & {
    color: #c0c4cc;
  }
}

.prop-select {
  width: 120px;
}
</style>
