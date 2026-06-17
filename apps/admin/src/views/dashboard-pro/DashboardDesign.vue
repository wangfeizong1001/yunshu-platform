<template>
  <div class="dashboard-design">
    <!-- 顶部操作栏 -->
    <div class="design-header">
      <div class="header-left">
        <el-input v-model="dashboardName" placeholder="大屏名称" class="name-input" />
        <el-select v-model="selectedTemplateId" placeholder="选择模板" class="template-select" @change="loadTemplate">
          <el-option label="自定义" value="" />
          <el-option
            v-for="template in templates"
            :key="template.id"
            :label="template.name"
            :value="template.id"
          />
        </el-select>
      </div>
      <div class="header-right">
        <el-button :icon="RefreshLeft" @click="resetConfig">重置</el-button>
        <el-button @click="preview">预览</el-button>
        <el-button type="primary" :icon="Check" @click="openSaveDialog">保存</el-button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="design-body">
      <!-- 左侧组件面板 -->
      <div class="widget-panel">
        <div class="panel-title">组件库</div>
        <div class="widget-list">
          <div
            v-for="widget in widgetTypes"
            :key="widget.type"
            class="widget-item"
            draggable="true"
            @dragstart="handleDragStart($event, widget)"
          >
            <el-icon :size="24"><component :is="widget.icon" /></el-icon>
            <span>{{ widget.name }}</span>
          </div>
        </div>
      </div>

      <!-- 中间画布 -->
      <div class="canvas-container">
        <div
          ref="canvasRef"
          class="canvas"
          @dragover.prevent
          @drop="handleDrop"
          @mousedown="handleCanvasClick"
        >
          <div
            v-for="(widget, index) in canvasWidgets"
            :key="widget.id"
            class="canvas-widget"
            :class="{ selected: selectedWidgetIndex === index }"
            :style="getWidgetStyle(widget)"
            @mousedown.stop="handleWidgetMouseDown($event, index)"
          >
            <!-- 组件内容 -->
            <div class="widget-header">
              <span>{{ widget.name }}</span>
              <el-icon class="delete-icon" @click.stop="removeWidget(index)"><Delete /></el-icon>
            </div>
            <div class="widget-content">
              <component :is="getWidgetComponent(widget.type)" :config="widget.config" />
            </div>
            
            <!-- 选中状态下显示调整大小手柄 -->
            <template v-if="selectedWidgetIndex === index">
              <!-- 8个方向的调整大小手柄 -->
              <div class="resize-handle nw" @mousedown.stop="handleResizeStart($event, index, 'nw')"></div>
              <div class="resize-handle n" @mousedown.stop="handleResizeStart($event, index, 'n')"></div>
              <div class="resize-handle ne" @mousedown.stop="handleResizeStart($event, index, 'ne')"></div>
              <div class="resize-handle e" @mousedown.stop="handleResizeStart($event, index, 'e')"></div>
              <div class="resize-handle se" @mousedown.stop="handleResizeStart($event, index, 'se')"></div>
              <div class="resize-handle s" @mousedown.stop="handleResizeStart($event, index, 's')"></div>
              <div class="resize-handle sw" @mousedown.stop="handleResizeStart($event, index, 'sw')"></div>
              <div class="resize-handle w" @mousedown.stop="handleResizeStart($event, index, 'w')"></div>
            </template>
          </div>
          <div v-if="canvasWidgets.length === 0" class="empty-tip">
            <el-icon :size="48"><Box /></el-icon>
            <p>从左侧拖拽组件到画布</p>
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="property-panel" v-if="selectedWidgetIndex !== null">
        <div class="panel-title">组件属性</div>
        <div class="property-form">
          <el-form label-width="80px" size="small">
            <!-- 基础属性 -->
            <el-form-item label="组件名称">
              <el-input v-model="selectedWidget!.name" />
            </el-form-item>
            <el-form-item label="宽度">
              <el-input-number v-model="selectedWidget!.width" :min="100" :max="800" />
            </el-form-item>
            <el-form-item label="高度">
              <el-input-number v-model="selectedWidget!.height" :min="100" :max="600" />
            </el-form-item>
            <el-form-item label="X坐标">
              <el-input-number v-model="selectedWidget!.x" :min="0" />
            </el-form-item>
            <el-form-item label="Y坐标">
              <el-input-number v-model="selectedWidget!.y" :min="0" />
            </el-form-item>
            <el-divider />
            
            <!-- 样式属性 -->
            <el-form-item label="背景色">
              <el-color-picker v-model="selectedWidget!.backgroundColor" />
            </el-form-item>
            <el-form-item label="边框颜色">
              <el-color-picker v-model="selectedWidget!.borderColor" />
            </el-form-item>
            <el-divider />
            
            <!-- 数据源配置 -->
            <div class="data-source-section">
              <div class="section-title">数据源配置</div>
              <el-form-item label="数据类型">
                <el-select v-model="selectedWidget!.config.dataSource.type">
                  <el-option label="Mock数据" value="mock" />
                  <el-option label="后端接口" value="api" />
                </el-select>
              </el-form-item>
              
              <template v-if="selectedWidget!.config.dataSource.type === 'api'">
                <el-form-item label="接口URL">
                  <el-input v-model="selectedWidget!.config.dataSource.url" placeholder="/api/data" />
                </el-form-item>
                <el-form-item label="请求方法">
                  <el-select v-model="selectedWidget!.config.dataSource.method">
                    <el-option label="GET" value="GET" />
                    <el-option label="POST" value="POST" />
                  </el-select>
                </el-form-item>
                
                <!-- 字段映射配置 -->
                <template v-if="['line', 'bar', 'area'].includes(selectedWidget!.type)">
                  <el-form-item label="X轴字段">
                    <el-input v-model="selectedWidget!.config.dataSource.xField" placeholder="date" />
                  </el-form-item>
                  <el-form-item label="Y轴字段">
                    <el-input v-model="selectedWidget!.config.dataSource.yField" placeholder="value" />
                  </el-form-item>
                  <el-form-item label="系列字段">
                    <el-input v-model="selectedWidget!.config.dataSource.seriesField" placeholder="category" />
                  </el-form-item>
                </template>
                
                <template v-if="['pie', 'ring'].includes(selectedWidget!.type)">
                  <el-form-item label="名称字段">
                    <el-input v-model="selectedWidget!.config.dataSource.nameField" placeholder="name" />
                  </el-form-item>
                  <el-form-item label="值字段">
                    <el-input v-model="selectedWidget!.config.dataSource.valueField" placeholder="value" />
                  </el-form-item>
                </template>
                
                <template v-if="selectedWidget!.type === 'gauge'">
                  <el-form-item label="值字段">
                    <el-input v-model="selectedWidget!.config.dataSource.valueField" placeholder="value" />
                  </el-form-item>
                  <el-form-item label="最小值">
                    <el-input-number v-model="selectedWidget!.config.min" :min="0" />
                  </el-form-item>
                  <el-form-item label="最大值">
                    <el-input-number v-model="selectedWidget!.config.max" :min="1" />
                  </el-form-item>
                </template>
              </template>
            </div>
            
            <!-- 图表标题配置 -->
            <el-divider />
            <el-form-item label="图表标题">
              <el-input v-model="selectedWidget!.config.title" />
            </el-form-item>
            
            <!-- 文本组件特有配置 -->
            <template v-if="selectedWidget!.type === 'text'">
              <el-form-item label="文本内容">
                <el-input type="textarea" v-model="selectedWidget!.config.content" :rows="3" />
              </el-form-item>
              <el-form-item label="字体大小">
                <el-input-number v-model="selectedWidget!.config.fontSize" :min="12" :max="48" />
              </el-form-item>
              <el-form-item label="字体颜色">
                <el-color-picker v-model="selectedWidget!.config.fontColor" />
              </el-form-item>
              <el-form-item label="对齐方式">
                <el-select v-model="selectedWidget!.config.textAlign">
                  <el-option label="左对齐" value="left" />
                  <el-option label="居中" value="center" />
                  <el-option label="右对齐" value="right" />
                </el-select>
              </el-form-item>
            </template>
            
            <!-- 图片组件特有配置 -->
            <template v-if="selectedWidget!.type === 'image'">
              <el-form-item label="图片URL">
                <el-input v-model="selectedWidget!.config.imageUrl" placeholder="https://..." />
              </el-form-item>
              <el-form-item label="填充方式">
                <el-select v-model="selectedWidget!.config.fit">
                  <el-option label="填充" value="fill" />
                  <el-option label="包含" value="contain" />
                  <el-option label="覆盖" value="cover" />
                  <el-option label="原始" value="none" />
                </el-select>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" title="预览" width="90%" top="5vh">
      <div class="preview-container">
        <DashboardPreview :widgets="canvasWidgets" :name="dashboardName" />
      </div>
    </el-dialog>

    <!-- 保存对话框 -->
    <el-dialog v-model="saveDialogVisible" title="保存大屏" width="400px">
      <el-form label-width="80px">
        <el-form-item label="大屏名称">
          <el-input v-model="saveDashboardName" placeholder="请输入大屏名称" />
        </el-form-item>
        <el-form-item label="大屏描述">
          <el-input type="textarea" v-model="saveDashboardDesc" :rows="3" placeholder="请输入大屏描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确认保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 大屏设计器主组件
 * 实现组件拖拽、调整大小、数据源配置、保存持久化等功能
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  RefreshLeft,
  Check,
  Delete,
  Box,
  TrendCharts,
  DataLine,
  PieChart,
  Grid,
  Monitor,
  Document,
  Picture,
} from '@element-plus/icons-vue';
import DashboardPreview from './DashboardPreview.vue';
import {
  LineChartWidget,
  BarChartWidget,
  PieChartWidget,
  RingChartWidget,
  AreaChartWidget,
  GaugeWidget,
  TableWidget,
  TextWidget,
  ImageWidget,
  widgetComponentMap,
} from '@/components/dashboard-widgets';
import {
  getDashboardTemplates,
  getDashboard,
  saveDashboard,
  updateDashboard,
} from '@/api/admin-dashboard.api';

// 状态变量
const dashboardName = ref('新增大屏');
const selectedTemplateId = ref('');
const selectedWidgetIndex = ref<number | null>(null);
const previewVisible = ref(false);
const saveDialogVisible = ref(false);
const saveDashboardName = ref('');
const saveDashboardDesc = ref('');
const currentDashboardId = ref<number | null>(null);
const canvasRef = ref<HTMLElement | null>(null);

// 模板列表
const templates = ref<Array<{ id: string; name: string; config: string }>>([]);

// 组件类型定义
interface IWidget {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
  borderColor?: string;
  config: {
    title?: string;
    dataSource: {
      type: 'mock' | 'api';
      url?: string;
      method?: 'GET' | 'POST';
      xField?: string;
      yField?: string;
      seriesField?: string;
      nameField?: string;
      valueField?: string;
    };
    chartConfig?: Record<string, unknown>;
    // 文本组件配置
    content?: string;
    fontSize?: number;
    fontColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    // 图片组件配置
    imageUrl?: string;
    fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    // 仪表盘配置
    min?: number;
    max?: number;
  };
}

// 组件类型列表
const widgetTypes = [
  { type: 'line', name: '折线图', icon: TrendCharts },
  { type: 'bar', name: '柱状图', icon: DataLine },
  { type: 'pie', name: '饼图', icon: PieChart },
  { type: 'ring', name: '环形图', icon: PieChart },
  { type: 'area', name: '面积图', icon: TrendCharts },
  { type: 'gauge', name: '仪表盘', icon: Monitor },
  { type: 'table', name: '数据表格', icon: Grid },
  { type: 'text', name: '文本', icon: Document },
  { type: 'image', name: '图片', icon: Picture },
];

// 画布上的组件列表
const canvasWidgets = ref<IWidget[]>([]);

// 当前选中的组件
const selectedWidget = computed(() => {
  if (selectedWidgetIndex.value !== null) {
    return canvasWidgets.value[selectedWidgetIndex.value];
  }
  return null;
});

// 拖拽状态
const dragState = ref<{
  isDragging: boolean;
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidgetX: number;
  startWidgetY: number;
  startWidth: number;
  startHeight: number;
  resizeDirection: string;
  widgetIndex: number;
}>({
  isDragging: false,
  isResizing: false,
  startX: 0,
  startY: 0,
  startWidgetX: 0,
  startWidgetY: 0,
  startWidth: 0,
  startHeight: 0,
  resizeDirection: '',
  widgetIndex: -1,
});

// 获取组件样式
const getWidgetStyle = (widget: IWidget) => {
  return {
    left: `${widget.x}px`,
    top: `${widget.y}px`,
    width: `${widget.width}px`,
    height: `${widget.height}px`,
    backgroundColor: widget.backgroundColor || 'rgba(0, 102, 255, 0.1)',
    borderColor: widget.borderColor || '#00d4ff',
  };
};

// 获取组件渲染器
const getWidgetComponent = (type: string) => {
  const componentMap: Record<string, unknown> = {
    line: LineChartWidget,
    bar: BarChartWidget,
    pie: PieChartWidget,
    ring: RingChartWidget,
    area: AreaChartWidget,
    gauge: GaugeWidget,
    table: TableWidget,
    text: TextWidget,
    image: ImageWidget,
  };
  return componentMap[type] || 'div';
};

// 创建新组件的默认配置
const createDefaultWidgetConfig = (type: string): IWidget['config'] => {
  const baseConfig = {
    title: widgetTypes.find(w => w.type === type)?.name || type,
    dataSource: {
      type: 'mock' as const,
      url: '',
      method: 'GET' as const,
    },
  };

  switch (type) {
    case 'text':
      return {
        ...baseConfig,
        content: '文本内容',
        fontSize: 16,
        fontColor: '#00d4ff',
        textAlign: 'center',
      };
    case 'image':
      return {
        ...baseConfig,
        imageUrl: '',
        fit: 'contain',
      };
    case 'gauge':
      return {
        ...baseConfig,
        min: 0,
        max: 100,
      };
    default:
      return baseConfig;
  }
};

// 拖拽开始（从组件库）
const handleDragStart = (event: DragEvent, widget: { type: string; name: string }) => {
  event.dataTransfer?.setData('widgetType', widget.type);
  event.dataTransfer?.setData('widgetName', widget.name);
};

// 拖拽放置到画布
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const widgetType = event.dataTransfer?.getData('widgetType');
  const widgetName = event.dataTransfer?.getData('widgetName');

  if (widgetType && widgetName && canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const x = event.clientX - rect.left - 100;
    const y = event.clientY - rect.top - 50;

    const newWidget: IWidget = {
      id: Date.now().toString(),
      type: widgetType,
      name: widgetName,
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: 300,
      height: 200,
      backgroundColor: 'rgba(0, 102, 255, 0.1)',
      borderColor: '#00d4ff',
      config: createDefaultWidgetConfig(widgetType),
    };

    canvasWidgets.value.push(newWidget);
    selectedWidgetIndex.value = canvasWidgets.value.length - 1;
  }
};

// 点击画布空白区域取消选中
const handleCanvasClick = () => {
  selectedWidgetIndex.value = null;
};

// 组件鼠标按下（开始拖拽）
const handleWidgetMouseDown = (event: MouseEvent, index: number) => {
  event.preventDefault();
  selectedWidgetIndex.value = index;

  const widget = canvasWidgets.value[index];
  dragState.value = {
    isDragging: true,
    isResizing: false,
    startX: event.clientX,
    startY: event.clientY,
    startWidgetX: widget.x,
    startWidgetY: widget.y,
    startWidth: widget.width,
    startHeight: widget.height,
    resizeDirection: '',
    widgetIndex: index,
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// 调整大小开始
const handleResizeStart = (event: MouseEvent, index: number, direction: string) => {
  event.preventDefault();
  selectedWidgetIndex.value = index;

  const widget = canvasWidgets.value[index];
  dragState.value = {
    isDragging: false,
    isResizing: true,
    startX: event.clientX,
    startY: event.clientY,
    startWidgetX: widget.x,
    startWidgetY: widget.y,
    startWidth: widget.width,
    startHeight: widget.height,
    resizeDirection: direction,
    widgetIndex: index,
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// 鼠标移动处理
const handleMouseMove = (event: MouseEvent) => {
  if (!dragState.value.isDragging && !dragState.value.isResizing) return;

  const deltaX = event.clientX - dragState.value.startX;
  const deltaY = event.clientY - dragState.value.startY;
  const widget = canvasWidgets.value[dragState.value.widgetIndex];

  if (dragState.value.isDragging) {
    // 拖拽移动
    widget.x = Math.max(0, dragState.value.startWidgetX + deltaX);
    widget.y = Math.max(0, dragState.value.startWidgetY + deltaY);
  } else if (dragState.value.isResizing) {
    // 调整大小
    const direction = dragState.value.resizeDirection;
    let newWidth = dragState.value.startWidth;
    let newHeight = dragState.value.startHeight;
    let newX = dragState.value.startWidgetX;
    let newY = dragState.value.startWidgetY;

    // 根据方向计算新尺寸和位置
    if (direction.includes('e')) {
      newWidth = Math.max(100, dragState.value.startWidth + deltaX);
    }
    if (direction.includes('w')) {
      const widthChange = Math.min(deltaX, dragState.value.startWidth - 100);
      newWidth = dragState.value.startWidth - widthChange;
      newX = dragState.value.startWidgetX + widthChange;
    }
    if (direction.includes('s')) {
      newHeight = Math.max(100, dragState.value.startHeight + deltaY);
    }
    if (direction.includes('n')) {
      const heightChange = Math.min(deltaY, dragState.value.startHeight - 100);
      newHeight = dragState.value.startHeight - heightChange;
      newY = dragState.value.startWidgetY + heightChange;
    }

    widget.width = newWidth;
    widget.height = newHeight;
    widget.x = Math.max(0, newX);
    widget.y = Math.max(0, newY);
  }
};

// 鼠标释放处理
const handleMouseUp = () => {
  dragState.value.isDragging = false;
  dragState.value.isResizing = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

// 选中组件
const selectWidget = (index: number) => {
  selectedWidgetIndex.value = index;
};

// 删除组件
const removeWidget = (index: number) => {
  canvasWidgets.value.splice(index, 1);
  if (selectedWidgetIndex.value === index) {
    selectedWidgetIndex.value = null;
  } else if (selectedWidgetIndex.value !== null && selectedWidgetIndex.value > index) {
    selectedWidgetIndex.value--;
  }
};

// 重置配置
const resetConfig = () => {
  canvasWidgets.value = [];
  selectedWidgetIndex.value = null;
  dashboardName.value = '新增大屏';
  currentDashboardId.value = null;
  selectedTemplateId.value = '';
  ElMessage.info('已重置');
};

// 预览
const preview = () => {
  previewVisible.value = true;
};

// 打开保存对话框
const openSaveDialog = () => {
  saveDashboardName.value = dashboardName.value;
  saveDashboardDesc.value = '';
  saveDialogVisible.value = true;
};

// 处理保存
const handleSave = async () => {
  if (!saveDashboardName.value) {
    ElMessage.warning('请输入大屏名称');
    return;
  }

  const dashboardData = {
    dashboardName: saveDashboardName.value,
    description: saveDashboardDesc.value,
    config: JSON.stringify(canvasWidgets.value),
    status: 'active',
  };

  try {
    if (currentDashboardId.value) {
      // 更新现有大屏
      await updateDashboard(currentDashboardId.value, dashboardData);
      ElMessage.success('更新成功！');
    } else {
      // 创建新大屏
      const result = await saveDashboard(dashboardData);
      if (result && result.dashboardId) {
        currentDashboardId.value = result.dashboardId;
      }
      ElMessage.success('保存成功！');
    }
    dashboardName.value = saveDashboardName.value;
    saveDialogVisible.value = false;
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请重试');
  }
};

// 加载模板
const loadTemplate = async (templateId: string) => {
  if (!templateId) {
    resetConfig();
    return;
  }

  try {
    const template = templates.value.find(t => t.id === templateId);
    if (template && template.config) {
      const config = JSON.parse(template.config);
      canvasWidgets.value = config.widgets || [];
      dashboardName.value = template.name;
      ElMessage.success('模板加载成功');
    }
  } catch (error) {
    console.error('加载模板失败:', error);
    ElMessage.error('加载模板失败');
  }
};

// 加载模板列表
const loadTemplates = async () => {
  try {
    const result = await getDashboardTemplates();
    if (result && Array.isArray(result)) {
      templates.value = result.map((t) => ({
        id: String(t.id || ''),
        name: String(t.name || ''),
        config: String(t.config || ''),
      }));
    }
  } catch (error) {
    console.error('加载模板列表失败:', error);
    // 使用默认模板
    templates.value = [
      { id: 'enterprise', name: '企业运营监控', config: '' },
      { id: 'sales', name: '销售数据分析', config: '' },
    ];
  }
};

// 组件挂载
onMounted(() => {
  loadTemplates();
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped lang="scss">
/* 大屏设计器画布专用 CSS 变量 */
$screen-deep: #0a0e27;
$screen-deep-light: #1a1f3a;
$screen-primary: #00d4ff;

.dashboard-design {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--surface-2);
}

.design-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--background);
  border-bottom: 1px solid var(--border);

  .header-left {
    display: flex;
    gap: 15px;

    .name-input {
      width: 250px;
    }

    .template-select {
      width: 200px;
    }
  }
}

.design-body {
  flex: 1;
  display: grid;
  grid-template-columns: 200px 1fr 280px;
  gap: 15px;
  padding: 15px;
  overflow: hidden;
}

.widget-panel,
.property-panel {
  background: var(--background);
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.widget-list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .widget-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: var(--surface-2);
    border-radius: 6px;
    cursor: grab;
    transition: all 0.2s;

    &:hover {
      background: var(--primary-light-9);
      color: var(--el-color-primary);
    }

    &:active {
      cursor: grabbing;
    }
  }
}

.canvas-container {
  background: var(--background);
  border-radius: 8px;
  padding: 15px;
  overflow: auto;
}

.canvas {
  position: relative;
  min-height: 600px;
  background: linear-gradient(135deg, $screen-deep 0%, $screen-deep-light 50%, $screen-deep 100%);
  border-radius: 4px;
  border: 2px dashed var(--el-color-primary);
}

.canvas-widget {
  position: absolute;
  border: 2px solid $screen-primary;
  border-radius: 8px;
  overflow: hidden;
  cursor: move;
  transition: border-color 0.2s, box-shadow 0.2s;

  &.selected {
    border-color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: rgba(0, 212, 255, 0.2);
    color: $screen-primary;
    font-size: 12px;

    .delete-icon {
      cursor: pointer;

      &:hover {
        color: var(--danger);
      }
    }
  }

  .widget-content {
    height: calc(100% - 36px);
    padding: 5px;
  }

  // 调整大小手柄
  .resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ffd700;
    border-radius: 2px;
    z-index: 10;

    &.nw {
      top: -5px;
      left: -5px;
      cursor: nw-resize;
    }
    &.n {
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
      cursor: n-resize;
    }
    &.ne {
      top: -5px;
      right: -5px;
      cursor: ne-resize;
    }
    &.e {
      top: 50%;
      right: -5px;
      transform: translateY(-50%);
      cursor: e-resize;
    }
    &.se {
      bottom: -5px;
      right: -5px;
      cursor: se-resize;
    }
    &.s {
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      cursor: s-resize;
    }
    &.sw {
      bottom: -5px;
      left: -5px;
      cursor: sw-resize;
    }
    &.w {
      top: 50%;
      left: -5px;
      transform: translateY(-50%);
      cursor: w-resize;
    }
  }
}

.empty-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--text-muted);

  .el-icon {
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

.property-form {
  .el-divider {
    margin: 15px 0;
  }
}

.data-source-section {
  .section-title {
    font-size: 14px;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
}

.preview-container {
  height: 80vh;
  overflow: hidden;
}
</style>