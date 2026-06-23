/**
 * pg 模块 mock —— 在内存中模拟 Pool 与 PoolClient，避免依赖真实数据库。
 */

export interface PoolConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  min?: number;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
}

export class Pool {
  public totalCount = 1;
  public idleCount = 1;
  public waitingCount = 0;
  public config: PoolConfig;

  constructor(config: PoolConfig = {}) {
    this.config = config;
  }

  on(_event: string, _handler: (err?: Error) => void): this {
    return this;
  }

  async connect(): Promise<{
    query: (text: string, params?: unknown[]) => Promise<QueryResult>;
    release: () => void;
  }> {
    const pool = this;
    return {
      async query(text: string, params?: unknown[]): Promise<QueryResult> {
        return pool.query(text, params);
      },
      release: () => undefined,
    };
  }

  async query<T extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    _params?: unknown[],
  ): Promise<QueryResult<T>> {
    if (text.trim().toUpperCase().startsWith('SELECT VERSION()')) {
      return { rows: [{ version: 'PostgreSQL 15.2' } as unknown as T], rowCount: 1 };
    }
    if (text.trim().toUpperCase().startsWith('SELECT 1')) {
      return { rows: [{ '?column?': 1 } as unknown as T], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  async end(): Promise<void> {
    return undefined;
  }
}

export class Client {
  constructor(_config?: PoolConfig) {}
  async connect(): Promise<void> { return undefined; }
  async query(): Promise<QueryResult> { return { rows: [], rowCount: 0 }; }
  async end(): Promise<void> { return undefined; }
  release(): void { /* noop */ }
}

export default { Pool, Client };
