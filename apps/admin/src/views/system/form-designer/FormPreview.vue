<template>
  <div class="form-preview">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="left">
        <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
        <span class="form-title">{{ formInfo?.formName || '表单预览' }}</span>
      </div>
      <div class="right">
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" :icon="Check" @click="handleSubmit">提交</el-button>
      </div>
    </div>

    <div class="preview-container">
      <div class="preview-card">
        <div v-if="formInfo?.description" class="form-description">
          {{ formInfo.description }}
        </div>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="preview-form"
        >
          <el-form-item
            v-for="component in components"
            :key="component.id"
            :label="component.label"
            :prop="component.field"
            :required="component.required"
          >
            <!-- 输入框 -->
            <el-input
              v-if="component.type === 'input'"
              v-model="formData[component.field]"
              :placeholder="component.placeholder"
              :disabled="component.disabled"
            />

            <!-- 文本域 -->
            <el-input
              v-else-if="component.type === 'textarea'"
              v-model="formData[component.field]"
              type="textarea"
              :rows="4"
              :placeholder="component.placeholder"
              :disabled="component.disabled"
            />

            <!-- 单选框 -->
            <el-radio-group
              v-else-if="component.type === 'radio'"
              v-model="formData[component.field]"
              :disabled="component.disabled"
            >
              <el-radio
                v-for="option in component.options"
                :key="String(option.value)"
                :value="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>

            <!-- 复选框 -->
            <el-checkbox-group
              v-else-if="component.type === 'checkbox'"
              v-model="formData[component.field]"
              :disabled="component.disabled"
            >
              <el-checkbox
                v-for="option in component.options"
                :key="String(option.value)"
                :label="String(option.value)"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>

            <!-- 下拉框 -->
            <el-select
              v-else-if="component.type === 'select'"
              v-model="formData[component.field]"
              :placeholder="component.placeholder"
              :disabled="component.disabled"
              clearable
            >
              <el-option
                v-for="option in component.options"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <!-- 日期选择 -->
            <el-date-picker
              v-else-if="component.type === 'date'"
              v-model="formData[component.field]"
              type="date"
              :placeholder="component.placeholder"
              :disabled="component.disabled"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />

            <!-- 日期时间 -->
            <el-date-picker
              v-else-if="component.type === 'datetime'"
              v-model="formData[component.field]"
              type="datetime"
              :placeholder="component.placeholder"
              :disabled="component.disabled"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />

            <!-- 时间选择 -->
            <el-time-picker
              v-else-if="component.type === 'time'"
              v-model="formData[component.field]"
              :placeholder="component.placeholder"
              :disabled="component.disabled"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
            />

            <!-- 数字输入 -->
            <el-input-number
              v-else-if="component.type === 'number'"
              v-model="formData[component.field]"
              :min="component.min"
              :max="component.max"
              :step="component.step"
              :disabled="component.disabled"
            />

            <!-- 开关 -->
            <el-switch
              v-else-if="component.type === 'switch'"
              v-model="formData[component.field]"
              :disabled="component.disabled"
            />

            <!-- 评分 -->
            <el-rate
              v-else-if="component.type === 'rate'"
              v-model="formData[component.field]"
              :disabled="component.disabled"
            />

            <!-- 滑块 -->
            <el-slider
              v-else-if="component.type === 'slider'"
              v-model="formData[component.field]"
              :disabled="component.disabled"
            />

            <!-- 上传 -->
            <el-upload
              v-else-if="component.type === 'upload'"
              v-model:file-list="formData[component.field]"
              :action="'#'"
              :multiple="component.multiple"
              :limit="component.maxCount"
              :accept="component.accept"
              :disabled="component.disabled"
              :auto-upload="false"
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  {{ component.placeholder || '请上传文件' }}
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Refresh, Check } from '@element-plus/icons-vue'
import { getForm, submitFormData, type FormComponent, type FormInfo } from '@/api/system/form.api'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 表单信息
const formInfo = ref<FormInfo | null>(null)

// 表单组件列表
const components = ref<FormComponent[]>([])

// 表单数据
const formData = reactive<Record<string, unknown>>({})

// 表单引用
const formRef = ref<FormInstance>()

// 表单验证规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  components.value.forEach(component => {
    if (component.required) {
      rules[component.field] = [
        { required: true, message: `请输入${component.label}`, trigger: 'blur' }
      ]
    }
  })
  return rules
})

// 初始化表单数据
function initFormData() {
  components.value.forEach(component => {
    if (component.type === 'checkbox') {
      formData[component.field] = component.defaultValue || []
    } else if (component.type === 'switch') {
      formData[component.field] = component.defaultValue || false
    } else if (component.type === 'upload') {
      formData[component.field] = []
    } else {
      formData[component.field] = component.defaultValue || ''
    }
  })
}

// 返回
function handleBack() {
  router.push('/system/form')
}

// 重置
function handleReset() {
  initFormData()
  ElMessage.success('已重置')
}

// 提交
async function handleSubmit() {
  if (!formRef.value || !formInfo.value) return
  await formRef.value.validate(async valid => {
    if (valid) {
      try {
        await submitFormData(formInfo.value!.formId, formData)
        ElMessage.success('提交成功')
      } catch (error) {
        console.error('提交失败', error)
      }
    }
  })
}

// 获取表单信息
async function fetchFormInfo() {
  const formId = Number(route.params.id)
  try {
    const res = await getForm(formId)
    const formData_ = res?.data as unknown as FormInfo | undefined
    formInfo.value = formData_ ?? null
    components.value = formData_?.components ?? []
    initFormData()
  } catch (error) {
    console.error('获取表单信息失败', error)
  }
}

// 初始化
onMounted(() => {
  fetchFormInfo()
})
</script>

<style scoped lang="scss">
.form-preview {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--surface-2);

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background-color: var(--background);
    border-bottom: 1px solid var(--border);

    .left {
      display: flex;
      align-items: center;

      .form-title {
        margin-left: 16px;
        font-size: 16px;
        font-weight: 500;
        color: var(--text-primary);
      }
    }
  }

  .preview-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  .preview-card {
    width: 100%;
    max-width: 800px;
    background-color: var(--background);
    border-radius: 4px;
    padding: 40px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .form-description {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 14px;
    }

    .preview-form {
      :deep(.el-form-item) {
        margin-bottom: 24px;
      }

      :deep(.el-form-item__label) {
        font-weight: 500;
      }
    }
  }
}
</style>
