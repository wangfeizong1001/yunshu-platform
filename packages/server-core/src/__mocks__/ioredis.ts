/**
 * ioredis 模块 mock —— 在内存中实现 Redis 常用命令，避免依赖真实服务。
 */

export interface RedisOptions {
  host?: string;
  port?: number;
  keyPrefix?: string;
  password?: string;
  db?: number;
  connectTimeout?: number;
  maxRetriesPerRequest?: number;
  enableOfflineQueue?: boolean;
  offlineQueueMaxSize?: number;
}

type PipelineItem = { fn: string; args: unknown[] };

function runPipeline(items: PipelineItem[], store: Map<string, string>) {
  return items.map((item) => {
    if (item.fn === 'setex') {
      const [key, _seconds, value] = item.args as [string, number, string];
      store.set(key, value);
      return [null, 'OK'];
    }
    if (item.fn === 'del') {
      const keys = item.args as string[];
      let n = 0;
      for (const k of keys) if (store.delete(k)) n++;
      return [null, n];
    }
    if (item.fn === 'get') {
      const [key] = item.args as [string];
      return [null, store.get(key) ?? null];
    }
    return [null, null];
  });
}

export class Redis {
  public status: string = 'ready';
  private store = new Map<string, string>();
  public readonly options: RedisOptions;

  constructor(opts: RedisOptions = {}) {
    this.options = opts;
  }

  // 基础命令
  async ping(): Promise<string> { return 'PONG'; }
  async info(): Promise<string> {
    return `redis_version:7.0.0\r\nconnected_clients:1\r\nused_memory_human:2M\r\nuptime_in_seconds:3600\r\n`;
  }
  async get(key: string): Promise<string | null> { return this.store.get(key) ?? null; }
  async set(key: string, value: string): Promise<string> {
    this.store.set(key, value);
    return 'OK';
  }
  async setex(key: string, _seconds: number, value: string): Promise<string> {
    this.store.set(key, value);
    return 'OK';
  }
  async exists(key: string): Promise<number> { return this.store.has(key) ? 1 : 0; }
  async del(...keys: string[]): Promise<number> {
    let n = 0;
    for (const k of keys) if (this.store.delete(k)) n++;
    return n;
  }
  async setbit(key: string, offset: number, _value: number): Promise<number> {
    const current = this.store.get(key) ?? '';
    this.store.set(key, current + ',' + String(offset));
    return 0;
  }
  async getbit(key: string, _offset: number): Promise<number> {
    return this.store.has(key) ? 1 : 0;
  }
  async eval(_script: string, _keys: number, ..._args: unknown[]): Promise<number> {
    return 0;
  }
  async scan(_cursor: number | string, ..._args: unknown[]): Promise<[string, string[]]> {
    return ['0', Array.from(this.store.keys())];
  }

  // Pipeline / multi
  pipeline() {
    const redis = this;
    const items: PipelineItem[] = [];
    const pipeline = {
      setex(...args: unknown[]) { items.push({ fn: 'setex', args }); return pipeline; },
      del(...args: unknown[]) { items.push({ fn: 'del', args }); return pipeline; },
      get(...args: unknown[]) { items.push({ fn: 'get', args }); return pipeline; },
      exec: async (): Promise<unknown[]> => {
        return runPipeline(items, redis.store);
      },
    };
    return pipeline;
  }

  multi() { return this.pipeline(); }

  // 事件
  on(_event: string, _handler: (...args: unknown[]) => void): this { return this; }
  once(_event: string, _handler: (...args: unknown[]) => void): this { return this; }

  // 生命周期
  async quit(): Promise<string> { this.status = 'disconnected'; return 'OK'; }
  disconnect(): void { this.status = 'disconnected'; }
}

export default Redis;
