<template>
  <div class="form-design">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="left">
        <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
        <span class="form-title">{{ formInfo?.formName || '表单设计' }}</span>
      </div>
      <div class="right">
        <el-button :icon="View" @click="handlePreview">预览</el-button>
        <el-button type="primary" :icon="Check" @click="handleSave">保存</el-button>
      </div>
    </div>

    <div class="design-container">
      <!-- 左侧组件库 -->
      <div class="component-panel">
        <div class="panel-title">组件库</div>
        <div class="component-list">
          <div
            v-for="component in componentLibrary"
            :key="component.type"
            class="component-item"
            @click="handleAddComponent(component)"
          >
            <el-icon class="component-icon">
              <component :is="component.icon" />
            </el-icon>
            <span class="component-name">{{ component.label }}</span>
          </div>
        </div>
      </div>

      <!-- 中间设计区域 -->
      <div class="design-panel">
        <div class="panel-title">设计区域</div>
        <div class="design-area">
          <draggable
            v-model="components"
            item-key="id"
            animation="300"
            handle=".drag-handle"
            class="components-container"
          >
            <template #item="{ element }">
              <div class="form-component" :class="{ active: selectedComponent?.id === element.id }">
                <div class="component-header">
                  <el-icon class="drag-handle">
                    <Rank />
                  </el-icon>
                  <span class="component-label">{{ element.label }}</span>
                  <div class="component-actions">
                    <el-icon class="action-icon" @click.stop="handleCopyComponent(element)">
                      <DocumentCopy />
                    </el-icon>
                    <el-icon
                      class="action-icon delete"
                      @click.stop="handleDeleteComponent(element.id)"
                    >
                      <Delete />
                    </el-icon>
                  </div>
                </div>
                <div class="component-preview" @click="handleSelectComponent(element)">
                  <component :is="renderComponentPreview(element)" v-bind="element" />
                </div>
              </div>
            </template>
            <template #footer>
              <div v-if="components.length === 0" class="empty-tip">点击左侧组件添加到表单</div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="props-panel">
        <div class="panel-title">属性配置</div>
        <div v-if="selectedComponent" class="props-content">
          <el-form :model="selectedComponent" label-width="100px">
            <el-form-item label="标签">
              <el-input v-model="selectedComponent.label" placeholder="请输入标签" />
            </el-form-item>
            <el-form-item label="字段名">
              <el-input v-model="selectedComponent.field" placeholder="请输入字段名" />
            </el-form-item>
            <el-form-item label="占位符">
              <el-input v-model="selectedComponent.placeholder" placeholder="请输入占位符" />
            </el-form-item>
            <el-form-item label="必填">
              <el-switch v-model="selectedComponent.required" />
            </el-form-item>
            <el-form-item label="禁用">
              <el-switch v-model="selectedComponent.disabled" />
            </el-form-item>
            <el-form-item label="默认值">
              <el-input
                v-if="selectedComponent.type !== 'checkbox'"
                v-model="selectedComponent.defaultValue"
                placeholder="请输入默认值"
              />
              <el-select
                v-else
                v-model="selectedComponent.defaultValue"
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="option in selectedComponent.options"
                  :key="String(option.value)"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <!-- 单选、多选、下拉框的选项配置 -->
            <template v-if="['radio', 'checkbox', 'select'].includes(selectedComponent.type)">
              <el-divider content-position="left">选项配置</el-divider>
              <div class="options-list">
                <div
                  v-for="(option, index) in selectedComponent.options"
                  :key="index"
                  class="option-item"
                >
                  <el-input
                    v-model="option.label"
                    placeholder="标签"
                    style="width: 40%; margin-right: 8px"
                  />
                  <el-input v-model="option.value as any" placeholder="值" style="width: 40%" />
                  <el-icon class="option-delete" @click="handleDeleteOption(index)">
                    <Delete />
                  </el-icon>
                </div>
                <el-button type="primary" link @click="handleAddOption">+ 添加选项</el-button>
              </div>
            </template>

            <!-- 数字输入框的配置 -->
            <template v-if="selectedComponent.type === 'number'">
              <el-divider content-position="left">数字配置</el-divider>
              <el-form-item label="最小值">
                <el-input-number v-model="selectedComponent.min" :step="1" />
              </el-form-item>
              <el-form-item label="最大值">
                <el-input-number v-model="selectedComponent.max" :step="1" />
              </el-form-item>
              <el-form-item label="步长">
                <el-input-number v-model="selectedComponent.step" :min="0.01" :step="0.01" />
              </el-form-item>
            </template>

            <!-- 上传组件的配置 -->
            <template v-if="selectedComponent.type === 'upload'">
              <el-divider content-position="left">上传配置</el-divider>
              <el-form-item label="文件类型">
                <el-input v-model="selectedComponent.accept" placeholder="如: image/*" />
              </el-form-item>
              <el-form-item label="最大数量">
                <el-input-number v-model="selectedComponent.maxCount" :min="1" />
              </el-form-item>
              <el-form-item label="多选">
                <el-switch v-model="selectedComponent.multiple" />
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div v-else class="empty-tip">选择组件进行配置</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, h } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import {
    ArrowLeft,
    View,
    Check,
    Delete,
    DocumentCopy,
    Rank,
    Edit,
    Tickets,
    List,
    Select,
    Calendar,
    Clock,
    Upload,
    Operation,
    SwitchButton,
    Star,
    More,
  } from '@element-plus/icons-vue';
  import draggable from 'vuedraggable';
  import { getForm, updateForm, type FormComponent, type FormInfo } from '@/api/system/form.api';

  const router = useRouter();
  const route = useRoute();

  // 表单信息
  const formInfo = ref<FormInfo | null>(null);

  // 表单组件列表
  const components = ref<FormComponent[]>([]);

  // 当前选中的组件
  const selectedComponent = ref<FormComponent | null>(null);

  // 组件库
  const componentLibrary = [
    { type: 'input', label: '输入框', icon: Edit },
    { type: 'textarea', label: '文本域', icon: Edit },
    { type: 'radio', label: '单选框', icon: Tickets },
    { type: 'checkbox', label: '复选框', icon: List },
    { type: 'select', label: '下拉框', icon: Select },
    { type: 'date', label: '日期选择', icon: Calendar },
    { type: 'datetime', label: '日期时间', icon: Calendar },
    { type: 'time', label: '时间选择', icon: Clock },
    { type: 'number', label: '数字输入', icon: Operation },
    { type: 'switch', label: '开关', icon: SwitchButton },
    { type: 'rate', label: '评分', icon: Star },
    { type: 'slider', label: '滑块', icon: More },
    { type: 'upload', label: '上传', icon: Upload },
  ];

  // 生成唯一ID
  function generateId() {
    return 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 创建组件默认配置
  function createComponent(type: string): FormComponent {
    const baseConfig: Partial<FormComponent> = {
      id: generateId(),
      label: '新组件',
      field: 'field_' + Date.now(),
      placeholder: '请输入',
      required: false,
      disabled: false,
      defaultValue: '',
    };

    switch (type) {
      case 'radio':
      case 'select':
        return {
          ...baseConfig,
          type,
          options: [
            { label: '选项1', value: 'option1' },
            { label: '选项2', value: 'option2' },
            { label: '选项3', value: 'option3' },
          ],
        } as FormComponent;
      case 'checkbox':
        return {
          ...baseConfig,
          type,
          options: [
            { label: '选项1', value: 'option1' },
            { label: '选项2', value: 'option2' },
            { label: '选项3', value: 'option3' },
          ],
          defaultValue: [],
        } as FormComponent;
      case 'number':
        return {
          ...baseConfig,
          type,
          min: undefined,
          max: undefined,
          step: 1,
        } as FormComponent;
      case 'upload':
        return {
          ...baseConfig,
          type,
          accept: '',
          maxCount: 1,
          multiple: false,
        } as FormComponent;
      default:
        return { ...baseConfig, type } as FormComponent;
    }
  }

  // 渲染组件预览
  function renderComponentPreview(component: FormComponent) {
    const props: any = {
      modelValue: component.defaultValue,
      placeholder: component.placeholder,
      disabled: component.disabled,
    };

    switch (component.type) {
      case 'input':
        return { name: 'el-input', props };
      case 'textarea':
        return { name: 'el-input', props: { ...props, type: 'textarea', rows: 3 } };
      case 'radio':
        return {
          name: 'el-radio-group',
          props,
          children: component.options?.map((opt) =>
            h('el-radio', { key: String(opt.value), value: opt.value, label: opt.label }),
          ),
        };
      case 'checkbox':
        return {
          name: 'el-checkbox-group',
          props,
          children: component.options?.map((opt) =>
            h('el-checkbox', { key: String(opt.value), value: opt.value, label: opt.label }),
          ),
        };
      case 'select':
        return {
          name: 'el-select',
          props,
          children: component.options?.map((opt) =>
            h('el-option', { key: String(opt.value), value: opt.value, label: opt.label }),
          ),
        };
      case 'date':
        return { name: 'el-date-picker', props: { ...props, type: 'date' } };
      case 'datetime':
        return { name: 'el-date-picker', props: { ...props, type: 'datetime' } };
      case 'time':
        return { name: 'el-time-picker', props };
      case 'number':
        return {
          name: 'el-input-number',
          props: { ...props, min: component.min, max: component.max, step: component.step },
        };
      case 'switch':
        return { name: 'el-switch', props };
      case 'rate':
        return { name: 'el-rate', props };
      case 'slider':
        return { name: 'el-slider', props };
      case 'upload':
        return {
          name: 'el-upload',
          props: { action: '#' },
          children: [h('el-button', { type: 'primary' }, '点击上传')],
        };
      default:
        return { name: 'el-input', props };
    }
  }

  // 添加组件
  function handleAddComponent(component: any) {
    const newComponent = createComponent(component.type);
    newComponent.label = component.label;
    components.value.push(newComponent);
    selectedComponent.value = newComponent;
  }

  // 选择组件
  function handleSelectComponent(component: FormComponent) {
    selectedComponent.value = component;
  }

  // 复制组件
  function handleCopyComponent(component: FormComponent) {
    const copied = JSON.parse(JSON.stringify(component));
    copied.id = generateId();
    copied.field = component.field + '_copy';
    const index = components.value.findIndex((c) => c.id === component.id);
    components.value.splice(index + 1, 0, copied);
    selectedComponent.value = copied;
  }

  // 删除组件
  function handleDeleteComponent(id: string) {
    const index = components.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      components.value.splice(index, 1);
      if (selectedComponent.value?.id === id) {
        selectedComponent.value = null;
      }
    }
  }

  // 添加选项
  function handleAddOption() {
    if (selectedComponent.value && selectedComponent.value.options) {
      const newOption = {
        label: `选项${selectedComponent.value.options.length + 1}`,
        value: `option${selectedComponent.value.options.length + 1}`,
      };
      selectedComponent.value.options.push(newOption);
    }
  }

  // 删除选项
  function handleDeleteOption(index: number) {
    if (selectedComponent.value && selectedComponent.value.options) {
      selectedComponent.value.options.splice(index, 1);
    }
  }

  // 返回
  function handleBack() {
    router.push('/system/form');
  }

  // 预览
  function handlePreview() {
    if (formInfo.value) {
      router.push(`/system/form-preview/${formInfo.value.formId}`);
    }
  }

  // 保存
  async function handleSave() {
    if (!formInfo.value) return;
    try {
      await updateForm({
        formId: formInfo.value.formId,
        components: components.value,
      });
      ElMessage.success('保存成功');
    } catch (error) {
      console.error('保存失败', error);
      ElMessage.error('保存失败');
    }
  }

  // 获取表单信息
  async function fetchFormInfo() {
    const formId = Number(route.params.id);
    try {
      const res = await getForm(formId);
      formInfo.value = res;
      components.value = res.components || [];
    } catch (error) {
      console.error('获取表单信息失败', error);
    }
  }

  // 初始化
  onMounted(() => {
    fetchFormInfo();
  });
</script>

<style scoped lang="scss">
  .form-design {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f7fa;

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background-color: #fff;
      border-bottom: 1px solid #e4e7ed;

      .left {
        display: flex;
        align-items: center;

        .form-title {
          margin-left: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #303133;
        }
      }
    }

    .design-container {
      display: flex;
      flex: 1;
      overflow: hidden;
      padding: 20px;
      gap: 16px;
    }

    .component-panel,
    .design-panel,
    .props-panel {
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .panel-title {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      border-bottom: 1px solid #e4e7ed;
    }

    .component-panel {
      width: 200px;
      flex-shrink: 0;

      .component-list {
        padding: 12px;

        .component-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          margin-bottom: 8px;
          background-color: #f5f7fa;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background-color: #ecf5ff;
            color: #409eff;
          }

          .component-icon {
            margin-right: 8px;
            font-size: 18px;
          }

          .component-name {
            font-size: 14px;
          }
        }
      }
    }

    .design-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .design-area {
        flex: 1;
        overflow-y: auto;
        padding: 20px;

        .components-container {
          min-height: 200px;
        }

        .form-component {
          margin-bottom: 16px;
          padding: 12px;
          border: 2px dashed #e4e7ed;
          border-radius: 4px;
          transition: all 0.3s;

          &:hover {
            border-color: #409eff;
          }

          &.active {
            border-color: #409eff;
            background-color: #f0f9ff;
          }

          .component-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e4e7ed;

            .drag-handle {
              margin-right: 8px;
              cursor: grab;
              color: #909399;

              &:active {
                cursor: grabbing;
              }
            }

            .component-label {
              flex: 1;
              font-size: 14px;
              color: #606266;
            }

            .component-actions {
              display: flex;
              gap: 8px;

              .action-icon {
                cursor: pointer;
                color: #909399;
                transition: color 0.3s;

                &:hover {
                  color: #409eff;
                }

                &.delete:hover {
                  color: #f56c6c;
                }
              }
            }
          }

          .component-preview {
            padding: 8px;
          }
        }

        .empty-tip {
          text-align: center;
          color: #909399;
          padding: 40px 0;
        }
      }
    }

    .props-panel {
      width: 320px;
      flex-shrink: 0;
      overflow-y: auto;

      .props-content {
        padding: 16px;
      }

      .empty-tip {
        text-align: center;
        color: #909399;
        padding: 40px 0;
      }

      .options-list {
        .option-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          .option-delete {
            margin-left: 8px;
            cursor: pointer;
            color: #f56c6c;
          }
        }
      }
    }
  }
</style>
