/**
 * WebSocket 工具类
 * 用于管理 WebSocket 连接，处理消息推送
 */
export interface WebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
}
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp?: number;
}
type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Event) => void;
declare class WebSocketClient {
  private ws;
  private options;
  private reconnectAttempts;
  private heartbeatTimer;
  private heartbeatTimeoutTimer;
  private messageHandlers;
  private onOpenHandlers;
  private onCloseHandlers;
  private onErrorHandlers;
  private isManualClose;
  constructor(options: WebSocketOptions);
  /**
   * 连接 WebSocket
   */
  connect(): void;
  /**
   * 断开连接
   */
  disconnect(): void;
  /**
   * 发送消息
   */
  send(message: WebSocketMessage): boolean;
  /**
   * 注册消息处理器
   */
  on(type: string, handler: MessageHandler): () => void;
  /**
   * 注册连接成功处理器
   */
  onOpen(handler: ConnectionHandler): () => void;
  /**
   * 注册连接关闭处理器
   */
  onClose(handler: ConnectionHandler): () => void;
  /**
   * 注册错误处理器
   */
  onError(handler: ErrorHandler): () => void;
  /**
   * 检查连接状态
   */
  isConnected(): boolean;
  private handleOpen;
  private handleMessage;
  private handleClose;
  private handleError;
  private startHeartbeat;
  private stopHeartbeat;
  private handlePong;
  private scheduleReconnect;
}
export declare function createWebSocketClient(options: WebSocketOptions): WebSocketClient;
export declare function getWebSocketClient(): WebSocketClient | null;
export declare function destroyWebSocketClient(): void;
export default WebSocketClient;
//# sourceMappingURL=websocket.d.ts.map
