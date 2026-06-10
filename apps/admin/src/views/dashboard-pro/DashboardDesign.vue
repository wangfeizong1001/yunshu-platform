<template>
  <div class="dashboard-design">
    <!-- 顶部操作栏 -->
    <div class="design-header">
      <div class="header-left">
        <el-input v-model="dashboardName" placeholder="大屏名称" class="name-input" />
        <el-select v-model="selectedTemplate" placeholder="选择模板" class="template-select">
          <el-option label="企业运营监控" value="enterprise" />
          <el-option label="销售数据分析" value="sales" />
          <el-option label="自定义" value="custom" />
        </el-select>
      </div>
      <div class="header-right">
        <el-button :icon="RefreshLeft" @click="resetConfig">重置</el-button>
        <el-button @click="preview">预览</el-button>
        <el-button type="primary" :icon="Check" @click="saveDashboard">保存</el-button>
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
        <div class="canvas" @dragover.prevent @drop="handleDrop">
          <div
            v-for="(widget, index) in canvasWidgets"
            :key="widget.id"
            class="canvas-widget"
            :style="{
              left: widget.x + 'px',
              top: widget.y + 'px',
              width: widget.width + 'px',
              height: widget.height + 'px',
            }"
            @click="selectWidget(index)"
          >
            <div class="widget-header">
              <span>{{ widget.name }}</span>
              <el-icon class="delete-icon" @click.stop="removeWidget(index)"><Delete /></el-icon>
            </div>
            <div class="widget-content">
              <component :is="getWidgetComponent(widget.type)" :data="widget.data" />
            </div>
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
            <el-form-item label="组件名称">
              <el-input v-model="selectedWidget!.name" />
            </el-form-item>
            <el-form-item label="宽度">
              <el-input-number v-model="selectedWidget!.width" :min="100" :max="800" />
            </el-form-item>
            <el-form-item label="高度">
              <el-input-number v-model="selectedWidget!.height" :min="100" :max="600" />
            </el-form-item>
            <el-divider />
            <el-form-item label="背景色">
              <el-color-picker v-model="selectedWidget!.backgroundColor" />
            </el-form-item>
            <el-form-item label="边框颜色">
              <el-color-picker v-model="selectedWidget!.borderColor" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" title="预览" width="90%" top="5vh">
      <div class="preview-container">
        <DashboardScreen />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
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
    User,
    Monitor,
  } from '@element-plus/icons-vue';
  import DashboardScreen from './DashboardScreen.vue';

  const dashboardName = ref('新增大屏');
  const selectedTemplate = ref('custom');
  const selectedWidgetIndex = ref<number | null>(null);
  const previewVisible = ref(false);

  interface Widget {
    id: string;
    type: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    backgroundColor?: string;
    borderColor?: string;
    data?: any;
  }

  const widgetTypes = [
    { type: 'line', name: '折线图', icon: TrendCharts },
    { type: 'bar', name: '柱状图', icon: DataLine },
    { type: 'pie', name: '饼图', icon: PieChart },
    { type: 'table', name: '数据表格', icon: Grid },
    { type: 'number', name: '数字卡片', icon: User },
    { type: 'gauge', name: '仪表盘', icon: Monitor },
  ];

  const canvasWidgets = ref<Widget[]>([]);

  const selectedWidget = computed(() => {
    if (selectedWidgetIndex.value !== null) {
      return canvasWidgets.value[selectedWidgetIndex.value];
    }
    return null;
  });

  const LineChartWidget = {
    template:
      '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#00d4ff;">折线图</div>',
  };

  const BarChartWidget = {
    template:
      '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ffd700;">柱状图</div>',
  };

  const PieChartWidget = {
    template:
      '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#00ff88;">饼图</div>',
  };

  const TableWidget = {
    template:
      '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#a855f7;">数据表格</div>',
  };

  const NumberWidget = {
    template:
      '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ff6b6b;">数字卡片</div>',
  };

  const GaugeWidget = {
    template:
      '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6366f1;">仪表盘</div>',
  };

  const getWidgetComponent = (type: string) => {
    const components: Record<string, any> = {
      line: LineChartWidget,
      bar: BarChartWidget,
      pie: PieChartWidget,
      table: TableWidget,
      number: NumberWidget,
      gauge: GaugeWidget,
    };
    return components[type] || 'div';
  };

  const handleDragStart = (event: DragEvent, widget: any) => {
    event.dataTransfer?.setData('widgetType', widget.type);
    event.dataTransfer?.setData('widgetName', widget.name);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const widgetType = event.dataTransfer?.getData('widgetType');
    const widgetName = event.dataTransfer?.getData('widgetName');

    if (widgetType && widgetName) {
      const canvas = (event.target as HTMLElement).closest('.canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - 100;
        const y = event.clientY - rect.top - 50;

        const newWidget: Widget = {
          id: Date.now().toString(),
          type: widgetType,
          name: widgetName,
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: 300,
          height: 200,
          backgroundColor: 'rgba(0, 102, 255, 0.1)',
          borderColor: '#00d4ff',
          data: {},
        };

        canvasWidgets.value.push(newWidget);
      }
    }
  };

  const selectWidget = (index: number) => {
    selectedWidgetIndex.value = index;
  };

  const removeWidget = (index: number) => {
    canvasWidgets.value.splice(index, 1);
    if (selectedWidgetIndex.value === index) {
      selectedWidgetIndex.value = null;
    } else if (selectedWidgetIndex.value !== null && selectedWidgetIndex.value > index) {
      selectedWidgetIndex.value--;
    }
  };

  const resetConfig = () => {
    canvasWidgets.value = [];
    selectedWidgetIndex.value = null;
    ElMessage.info('已重置');
  };

  const preview = () => {
    previewVisible.value = true;
  };

  const saveDashboard = () => {
    ElMessage.success('保存成功！');
    console.log('保存的配置:', {
      name: dashboardName.value,
      widgets: canvasWidgets.value,
    });
  };
</script>

<style scoped lang="scss">
  .dashboard-design {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f7fa;
  }

  .design-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;

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
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    overflow-y: auto;
  }

  .panel-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
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
      background: #f5f7fa;
      border-radius: 6px;
      cursor: grab;
      transition: all 0.2s;

      &:hover {
        background: #ecf5ff;
        color: #409eff;
      }

      &:active {
        cursor: grabbing;
      }
    }
  }

  .canvas-container {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    overflow: auto;
  }

  .canvas {
    position: relative;
    min-height: 600px;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
    border-radius: 4px;
    border: 2px dashed #409eff;
  }

  .canvas-widget {
    position: absolute;
    background: rgba(0, 102, 255, 0.1);
    border: 2px solid #00d4ff;
    border-radius: 8px;
    overflow: hidden;
    cursor: move;

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
      color: #00d4ff;
      font-size: 12px;

      .delete-icon {
        cursor: pointer;

        &:hover {
          color: #ff6b6b;
        }
      }
    }

    .widget-content {
      height: calc(100% - 36px);
    }
  }

  .empty-tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #909399;

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

  .preview-container {
    height: 80vh;
    overflow: hidden;
  }
</style>
