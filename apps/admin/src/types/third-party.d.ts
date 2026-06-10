/**
 * 第三方库类型扩展
 *
 * 为缺乏官方 TypeScript 类型的第三方库提供类型声明，
 * 确保在使用这些库时获得完整的类型提示。
 */

// ==================== NProgress 扩展 ====================

declare module 'nprogress' {
  interface NProgressOptions {
    /** 动画 easing 效果 */
    easing?: string;
    /** 动画速度 */
    speed?: number;
    /** 是否显示加载条 */
    showSpinner?: boolean;
    /** 动画包裹器背景色 */
    parent?: string;
    /** 进度条颜色 */
    color?: string;
    /** 进度条高度 */
    height?: number;
    /** 是否使用全局 CSS 类 */
    globalClass?: string;
    /** 是否自动递增 */
    trickle?: boolean;
    /** 自动递增间隔 */
    trickleSpeed?: number;
    /** 起始进度 */
    start?: number;
    /** 终止进度 */
    end?: number;
  }

  interface NProgress {
    /** 版本号 */
    version: string;
    /** 配置 */
    configure: (options: Partial<NProgressOptions>) => NProgress;
    /** 开始进度 */
    start: () => NProgress;
    /** 结束进度 */
    done: (force?: boolean) => NProgress;
    /** 增加进度 */
    inc: (amount?: number) => NProgress;
    /** 获取状态 */
    status: number | null;
  }

  const nprogress: NProgress;
  export default nprogress;
}

// ==================== ECharts 扩展 ====================

declare module 'echarts' {
  // ECharts 实例类型
  export type ECharts = import('echarts').ECharts;

  // ECharts 选项类型
  export type EChartsOption = import('echarts').EChartsOption;

  // 主题配置
  export interface EChartsTheme {
    color?: string[];
    backgroundColor?: string;
    textStyle?: {
      color?: string;
      fontSize?: number;
    };
    title?: {
      textStyle?: {
        color?: string;
      };
    };
    legend?: {
      textStyle?: {
        color?: string;
      };
    };
    tooltip?: {
      backgroundColor?: string;
      textStyle?: {
        color?: string;
      };
    };
    xAxis?: {
      axisLine?: {
        lineStyle?: {
          color?: string;
        };
      };
      axisLabel?: {
        color?: string;
      };
    };
    yAxis?: {
      axisLine?: {
        lineStyle?: {
          color?: string;
        };
      };
      axisLabel?: {
        color?: string;
      };
    };
  }

  // ECharts 初始化选项
  export interface InitOptions {
    renderer?: 'canvas' | 'svg';
    width?: number | 'auto';
    height?: number | 'auto';
    locale?: string;
  }

  // 导出 init 函数
  export function init(
    dom: HTMLElement | HTMLCanvasElement | HTMLSvgElement,
    theme?: string | EChartsTheme,
    opts?: InitOptions,
  ): ECharts;

  // 导出其他常用函数
  export function connect(group: string | string[]): void;
  export function disconnect(group: string): void;
  export function dispose(target: ECharts | HTMLElement): void;
  export function getInstanceByDom(target: HTMLElement): ECharts | undefined;
  export function registerTheme(name: string, theme: EChartsTheme): void;
  export function registerMap(mapName: string, geoData: unknown, opt?: unknown): void;
  export function getMap(mapName: string): unknown;
  export function setCanvasCreator(creator: unknown): void;
  export function use(mod: unknown): void;
}

// ==================== vue-echarts 扩展 ====================

declare module 'vue-echarts' {
  import type { DefineComponent } from 'vue';

  export const VChart: DefineComponent<{
    /** 图表选项 */
    option?: import('echarts').EChartsOption;
    /** 主题配置 */
    theme?: string | import('echarts').EChartsTheme;
    /** 初始化选项 */
    initOptions?: {
      renderer?: 'canvas' | 'svg';
      width?: number | string;
      height?: number | string;
    };
    /** 是否自动 resize */
    autoresize?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 加载选项 */
    loadingOptions?: Record<string, unknown>;
    /** 图表组 */
    group?: string;
    /** 是否手动设置尺寸 */
    manualUpdate?: boolean;
  }>;

  export { use };
}

// ==================== vuedraggable 扩展 ====================

declare module 'vuedraggable' {
  import type { Component, ObjectDirective } from 'vue';

  export interface DraggableOptions {
    /** 模型值 */
    modelValue?: unknown[] | unknown;
    /** 分组 */
    group?:
      | string
      | {
          name: string;
          pull?:
            | boolean
            | 'clone'
            | ((to: unknown, from: unknown, el: HTMLElement) => boolean | number);
          put?: boolean | boolean[] | ((to: unknown, from: unknown, el: HTMLElement) => boolean);
        };
    /** 动画 */
    animation?: number;
    /** 是否禁用 */
    disabled?: boolean;
    /** 排序方向 */
    direction?: 'vertical' | 'horizontal';
    /** 处理类名 */
    handle?: string;
    /** 过滤器类名 */
    filter?: string;
    /** 防止选择类名 */
    preventOnFilter?: boolean;
    /** 排序 */
    sortable?: boolean;
    /** 延迟 */
    delay?: number;
    /** 延迟更新 */
    delayOnTouchOnly?: boolean;
    /** touch 阈值 */
    touchStartThreshold?: number;
    /** 强制填充容器的占位符 */
    forceFallback?: boolean;
    /** 回退元素 */
    fallbackClass?: string;
    /** 回退元素可见性 */
    fallbackOnBody?: boolean;
    /** 回退元素透传 */
    fallbackTolerance?: number;
    /** 数据传输 */
    dataTransfer?: unknown;
    /** 取消选择 */
    cancelSelected?: boolean;
    /** 移除无用的克隆元素 */
    removeCloneOnHide?: boolean;
    /** 荆轮模式 */
    wheel?: boolean;
    /** 气泡模式 */
    bubble?: boolean;
    /** 升降序 */
    invertSwap?: boolean;
    /** 左键阈值 */
    leftSwapThreshold?: number;
    /** 右键阈值 */
    rightSwapThreshold?: number;
    /** 切换阈值 */
    swapThreshold?: number;
  }

  export interface DraggableComponent extends Component {
    /** 重新排序 */
    reorder: (oldIndex: number, newIndex: number) => void;
    /** 获取组件实例 */
    getEl: () => HTMLElement;
  }

  const Draggable: DraggableComponent;
  export default Draggable;
}

// ==================== xlsx 扩展 ====================

declare module 'xlsx' {
  export interface WorkBook {
    /** 工作表名称 */
    SheetNames: string[];
    /** 工作表 */
    Sheets: { [sheet: string]: WorkSheet };
  }

  export interface WorkSheet {
    /** 单元格范围 */
    '!ref'?: string;
    /** 合并单元格 */
    '!merges'?: CellRange[];
    /** 列宽 */
    '!cols'?: ColInfo[];
    /** 行高 */
    '!rows'?: RowInfo[];
  }

  export interface CellRange {
    s: CellAddress;
    e: CellAddress;
  }

  export interface CellAddress {
    c: number;
    r: number;
  }

  export interface ColInfo {
    width?: number;
    hidden?: boolean;
  }

  export interface RowInfo {
    height?: number;
    hidden?: boolean;
  }

  export interface CellObject {
    t: string;
    v: unknown;
    w?: string;
    f?: string;
    r?: string;
  }

  export interface Sheet2JSONOpts {
    /** 标题行 */
    header?: number | string[];
    /** 是否跳过空行 */
    blankrows?: boolean;
    /** 默认值 */
    defval?: unknown;
    /** 包含原始值 */
    raw?: boolean;
    /** 日期解析 */
    dateNF?: string;
  }

  export interface JSON2SheetOpts {
    /** 起始行 */
    skipHeader?: boolean;
    /** 标题 */
    header?: string[];
  }

  export interface AOASheetOpts {
    /** 起始行 */
    skipHeader?: boolean;
  }

  export interface Utils {
    sheet_to_json: <T = Record<string, unknown>>(sheet: WorkSheet, opts?: Sheet2JSONOpts) => T[];
    json_to_sheet: (data: Record<string, unknown>[], opts?: JSON2SheetOpts) => WorkSheet;
    aoa_to_sheet: (data: unknown[][], opts?: AOASheetOpts) => WorkSheet;
    sheet_to_csv: (sheet: WorkSheet) => string;
    csv_to_sheet: (csv: string) => WorkSheet;
    aoa_to_csv: (data: unknown[][]) => string;
    book_new: () => WorkBook;
    book_append_sheet: (wb: WorkBook, ws: WorkSheet, name: string) => void;
  }

  export interface ParsingOptions {
    type?: string;
    cellFormula?: boolean;
    cellDates?: boolean;
    cellNF?: boolean;
    cellStyles?: boolean;
  }

  export interface WritingOptions {
    type?: string;
    bookType?: string;
    bookSST?: boolean;
    compression?: boolean;
  }

  export const utils: Utils;
  export const read: (
    data: ArrayBuffer | ArrayBufferView | string,
    opts?: ParsingOptions,
  ) => WorkBook;
  export const readFile: (filename: string, opts?: ParsingOptions) => WorkBook;
  export const write: (wb: WorkBook, opts?: WritingOptions) => ArrayBuffer;
  export const writeFile: (wb: WorkBook, filename: string, opts?: WritingOptions) => void;
  export const writeFileAsync: (
    wb: WorkBook,
    filename: string,
    opts?: WritingOptions,
  ) => Promise<void>;
}

// ==================== html2canvas 扩展 ====================

declare module 'html2canvas' {
  export interface Html2CanvasOptions {
    /** 背景色 */
    backgroundColor?: string | null;
    /** 画布尺寸 */
    width?: number;
    height?: number;
    /** 缩放 */
    scale?: number;
    /** 是否使用 Promise */
    useCORS?: boolean;
    /** 是否允许跨域 */
    allowTaint?: boolean;
    /** 渲染目标 */
    target?: HTMLElement | null;
    /** 滚轴 */
    scrollX?: number;
    scrollY?: number;
    /** 窗口尺寸 */
    windowWidth?: number;
    windowHeight?: number;
    /** 自定义元素 */
    customElement?: (instance: HTMLElement) => HTMLElement;
    /** 忽略元素 */
    ignoreElements?: (element: HTMLElement) => boolean;
    /** 填充背景色 */
    onclone?: (clonedDoc: Document) => void;
    /** 异步 */
    async?: boolean;
    /** 动画帧超时 */
    animationFrameTimeout?: number | null;
    /** proxy 配置 */
    proxy?: string;
    /** 信道工厂 */
    channelFactory?: (message: unknown, targetOrigin: string) => MessageChannel;
    /** 日志 */
    logging?: boolean;
  }

  export interface RenderResult {
    /** Canvas 元素 */
    canvas: HTMLCanvasElement;
    /** 图片宽度 */
    width: number;
    /** 图片高度 */
    height: number;
    /** 获取 canvas */
    getCanvas: () => HTMLCanvasElement;
    /** 获取图像 URI */
    toDataURL: (type?: string, quality?: number) => string;
    /** 获取 blob */
    toBlob: (callback: (blob: Blob | null) => void, type?: string, quality?: number) => void;
  }

  function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<RenderResult>;

  export default html2canvas;
}

// ==================== jspdf 扩展 ====================

declare module 'jspdf' {
  export interface jsPDFOptions {
    /** 方向 */
    orientation?: 'portrait' | 'landscape';
    /** 单位 */
    unit?: 'mm' | 'cm' | 'in' | 'pt';
    /** 格式 */
    format?: string | [number, number];
    /** 压缩 */
    compress?: boolean;
    /** 旋转 */
    rotation?: number;
    /** 精度 */
    precision?: number;
  }

  export interface TextOptions {
    /** 对齐方式 */
    align?: 'left' | 'center' | 'right' | 'justify' | 'center' | 'right' | 'distribute' | 'justify';
    /** 垂直对齐 */
    baseline?:
      | 'top'
      | 'hanging'
      | 'middle'
      | 'bottom'
      | 'ideographic'
      | 'alphabetic'
      | 'mathematical';
    /** 字符间距 */
    charSpace?: number;
    /** 旋转角度 */
    angle?: number;
    /** 斜体 */
    isMarkup?: boolean;
  }

  export interface AddImageOptions {
    /** 图像类型 */
    imageData?: HTMLCanvasElement | HTMLImageElement | string;
    /** 格式 */
    format?: string;
    /** X 位置 */
    x?: number;
    /** Y 位置 */
    y?: number;
    /** 宽度 */
    width?: number;
    /** 高度 */
    height?: number;
    /** 压缩 */
    compression?: string;
    /** 透明度 */
    alias?: string;
    /** 蒙版 */
    mask?: number;
    /** 挤压 */
    rotation?: number;
    /** 修剪 */
    clamp?: boolean;
  }

  export class jsPDF {
    constructor(options?: jsPDFOptions);
    /** 添加文本 */
    text: (text: string | string[], x: number, y: number, options?: TextOptions) => jsPDF;
    /** 添加页面 */
    addPage: () => jsPDF;
    /** 添加图像 */
    addImage: (options: AddImageOptions) => jsPDF;
    /** 保存 */
    save: (filename: string) => void;
    /** 输出 */
    output: (type: 'blob' | 'arraybuffer' | 'datauristring' | 'dataurlstring') => unknown;
    /** 设置字体 */
    setFont: (fontName: string, fontStyle?: string) => jsPDF;
    /** 设置字体大小 */
    setFontSize: (size: number) => jsPDF;
    /** 设置文本颜色 */
    setTextColor: (r: number, g?: number, b?: number) => jsPDF;
    /** 设置绘制颜色 */
    setDrawColor: (r: number, g?: number, b?: number) => jsPDF;
    /** 设置填充颜色 */
    setFillColor: (r: number, g?: number, b?: number) => jsPDF;
    /** 设置线宽 */
    setLineWidth: (width: number) => jsPDF;
    /** 绘制直线 */
    line: (x1: number, y1: number, x2: number, y2: number) => jsPDF;
    /** 绘制矩形 */
    rect: (x: number, y: number, w: number, h: number, style?: 'S' | 'F' | 'DF') => jsPDF;
    /** 绘制圆形 */
    circle: (x: number, y: number, r: number, style?: 'S' | 'F' | 'DF') => jsPDF;
    /** 设置页码 */
    setPage: (page: number) => jsPDF;
    /** 获取页数 */
    getNumberOfPages: () => number;
    /** 删除页面 */
    deletePage: (pageNumber: number) => jsPDF;
  }

  export default jsPDF;
}

// ==================== path-browserify 扩展 ====================

declare module 'path-browserify' {
  export function resolve(...paths: string[]): string;
  export function normalize(str: string): string;
  export function isAbsolute(path: string): boolean;
  export function join(...paths: string[]): string;
  export function relative(from: string, to: string): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
  export function parse(path: string): {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  };
  export function format(pathObject: {
    root?: string;
    dir?: string;
    base?: string;
    ext?: string;
    name?: string;
  }): string;
}
