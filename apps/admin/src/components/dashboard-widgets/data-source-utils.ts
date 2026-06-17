/**
 * 数据源工具函数
 * 用于从不同数据源获取数据（Mock 或 API）
 */

import { request } from '@/utils/httpClient';

// 数据源配置类型
interface IDataSourceConfig {
  type: 'mock' | 'api';
  url?: string;
  method?: 'GET' | 'POST';
  xField?: string;
  yField?: string;
  seriesField?: string;
  nameField?: string;
  valueField?: string;
  params?: Record<string, unknown>;
}

// 数据获取结果类型
interface IFetchResult {
  xData?: string[];
  yData?: number[];
  seriesData?: Record<string, number[]>;
  pieData?: Array<{ name: string; value: number }>;
  tableData?: Array<Record<string, unknown>>;
  gaugeValue?: number;
  rawData?: unknown;
}

/**
 * 从数据源获取数据
 * @param dataSource 数据源配置
 * @returns 获取的数据结果
 */
export async function fetchDataFromSource(dataSource: IDataSourceConfig): Promise<IFetchResult | null> {
  if (!dataSource || dataSource.type === 'mock') {
    return null;
  }

  if (!dataSource.url) {
    console.warn('数据源 URL 未配置');
    return null;
  }

  try {
    const response = await request<unknown>({
      url: dataSource.url,
      method: dataSource.method || 'GET',
      params: dataSource.method === 'GET' ? dataSource.params : undefined,
      data: dataSource.method === 'POST' ? dataSource.params : undefined,
    });

    // 处理响应数据
    const rawData = response as Record<string, unknown>;
    
    // 根据字段映射转换数据
    const result: IFetchResult = {
      rawData,
    };

    // 如果是数组数据，进行字段映射转换
    if (Array.isArray(rawData)) {
      // 折线图/柱状图/面积图数据转换
      if (dataSource.xField && dataSource.yField) {
        result.xData = rawData.map((item: Record<string, unknown>) => 
          String(item[dataSource.xField as string] || '')
        );
        
        // 如果有系列字段，按系列分组
        if (dataSource.seriesField) {
          const seriesMap: Record<string, number[]> = {};
          rawData.forEach((item: Record<string, unknown>) => {
            const seriesName = String(item[dataSource.seriesField as string] || 'default');
            const yValue = Number(item[dataSource.yField as string] || 0);
            if (!seriesMap[seriesName]) {
              seriesMap[seriesName] = [];
            }
            seriesMap[seriesName].push(yValue);
          });
          result.seriesData = seriesMap;
        } else {
          result.yData = rawData.map((item: Record<string, unknown>) => 
            Number(item[dataSource.yField as string] || 0)
          );
        }
      }

      // 饼图/环形图数据转换
      if (dataSource.nameField && dataSource.valueField) {
        result.pieData = rawData.map((item: Record<string, unknown>) => ({
          name: String(item[dataSource.nameField as string] || ''),
          value: Number(item[dataSource.valueField as string] || 0),
        }));
      }

      // 表格数据
      result.tableData = rawData;
    } else if (rawData && typeof rawData === 'object') {
      // 处理嵌套数据结构（如 { data: [...] }）
      const dataField = rawData.data || rawData.list || rawData.rows;
      if (Array.isArray(dataField)) {
        // 递归处理嵌套数据
        const nestedResult = await fetchDataFromSource({
          ...dataSource,
          type: 'api',
        });
        
        // 手动处理嵌套数据
        if (dataSource.xField && dataSource.yField) {
          result.xData = dataField.map((item: Record<string, unknown>) => 
            String(item[dataSource.xField as string] || '')
          );
          
          if (dataSource.seriesField) {
            const seriesMap: Record<string, number[]> = {};
            dataField.forEach((item: Record<string, unknown>) => {
              const seriesName = String(item[dataSource.seriesField as string] || 'default');
              const yValue = Number(item[dataSource.yField as string] || 0);
              if (!seriesMap[seriesName]) {
                seriesMap[seriesName] = [];
              }
              seriesMap[seriesName].push(yValue);
            });
            result.seriesData = seriesMap;
          } else {
            result.yData = dataField.map((item: Record<string, unknown>) => 
              Number(item[dataSource.yField as string] || 0)
            );
          }
        }

        if (dataSource.nameField && dataSource.valueField) {
          result.pieData = dataField.map((item: Record<string, unknown>) => ({
            name: String(item[dataSource.nameField as string] || ''),
            value: Number(item[dataSource.valueField as string] || 0),
          }));
        }

        result.tableData = dataField;
      }

      // 仪表盘单值数据
      if (dataSource.valueField) {
        result.gaugeValue = Number(rawData[dataSource.valueField as string] || 0);
      }
    }

    return result;
  } catch (error) {
    console.error('获取数据源数据失败:', error);
    return null;
  }
}

/**
 * Mock 数据生成器
 * 用于生成测试数据
 */
export function generateMockData(type: string): IFetchResult {
  switch (type) {
    case 'line':
    case 'bar':
    case 'area':
      return {
        xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        yData: [820, 932, 901, 934, 1290, 1330, 1320],
      };
    case 'pie':
    case 'ring':
      return {
        pieData: [
          { name: '直接访问', value: 335 },
          { name: '邮件营销', value: 310 },
          { name: '联盟广告', value: 234 },
          { name: '视频广告', value: 135 },
          { name: '搜索引擎', value: 1548 },
        ],
      };
    case 'table':
      return {
        tableData: [
          { name: '项目A', value: 100, status: '正常' },
          { name: '项目B', value: 200, status: '正常' },
          { name: '项目C', value: 150, status: '异常' },
          { name: '项目D', value: 300, status: '正常' },
        ],
      };
    case 'gauge':
      return {
        gaugeValue: 75,
      };
    default:
      return {};
  }
}