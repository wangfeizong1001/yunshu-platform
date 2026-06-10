/**
 * WebSocket 工具类
 * 用于管理 WebSocket 连接，处理消息推送
 */
import { ElMessage } from 'element-plus';
class WebSocketClient {
  ws = null;
  options;
  reconnectAttempts = 0;
  heartbeatTimer = null;
  heartbeatTimeoutTimer = null;
  messageHandlers = new Map();
  onOpenHandlers = new Set();
  onCloseHandlers = new Set();
  onErrorHandlers = new Set();
  isManualClose = false;
  constructor(options) {
    this.options = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      heartbeatTimeout: 10000,
      ...options,
    };
  }
  /**
   * 连接 WebSocket
   */
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket 已连接');
      return;
    }
    this.isManualClose = false;
    try {
      console.log('正在连接 WebSocket:', this.options.url);
      this.ws = new WebSocket(this.options.url);
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket 连接失败:', error);
      this.scheduleReconnect();
    }
  }
  /**
   * 断开连接
   */
  disconnect() {
    this.isManualClose = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  /**
   * 发送消息
   */
  send(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket 未连接，无法发送消息');
      return false;
    }
    try {
      const data = JSON.stringify({
        ...message,
        timestamp: Date.now(),
      });
      this.ws.send(data);
      return true;
    } catch (error) {
      console.error('发送消息失败:', error);
      return false;
    }
  }
  /**
   * 注册消息处理器
   */
  on(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    const handlers = this.messageHandlers.get(type);
    handlers.add(handler);
    // 返回取消注册函数
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(type);
      }
    };
  }
  /**
   * 注册连接成功处理器
   */
  onOpen(handler) {
    this.onOpenHandlers.add(handler);
    return () => this.onOpenHandlers.delete(handler);
  }
  /**
   * 注册连接关闭处理器
   */
  onClose(handler) {
    this.onCloseHandlers.add(handler);
    return () => this.onCloseHandlers.delete(handler);
  }
  /**
   * 注册错误处理器
   */
  onError(handler) {
    this.onErrorHandlers.add(handler);
    return () => this.onErrorHandlers.delete(handler);
  }
  /**
   * 检查连接状态
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
  handleOpen(_event) {
    console.log('WebSocket 连接成功');
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    this.onOpenHandlers.forEach((handler) => handler());
  }
  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'pong') {
        this.handlePong();
        return;
      }
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach((handler) => handler(message));
      }
    } catch (error) {
      console.error('解析消息失败:', error);
    }
  }
  handleClose(event) {
    console.log('WebSocket 连接关闭:', event.code, event.reason);
    this.stopHeartbeat();
    this.onCloseHandlers.forEach((handler) => handler());
    if (!this.isManualClose) {
      this.scheduleReconnect();
    }
  }
  handleError(event) {
    console.error('WebSocket 错误:', event);
    this.onErrorHandlers.forEach((handler) => handler(event));
  }
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', data: {} });
        this.heartbeatTimeoutTimer = window.setTimeout(() => {
          console.warn('心跳超时，断开连接');
          this.ws?.close();
        }, this.options.heartbeatTimeout);
      }
    }, this.options.heartbeatInterval);
  }
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }
  handlePong() {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }
  scheduleReconnect() {
    if (this.isManualClose) return;
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error('WebSocket 重连次数已达上限');
      ElMessage.error('WebSocket 连接失败，请刷新页面重试');
      return;
    }
    this.reconnectAttempts++;
    const delay = this.options.reconnectInterval * this.reconnectAttempts;
    console.log(
      `将在 ${delay}ms 后尝试重连 (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`,
    );
    setTimeout(() => {
      if (!this.isManualClose) {
        this.connect();
      }
    }, delay);
  }
}
// 创建单例
let instance = null;
export function createWebSocketClient(options) {
  if (!instance) {
    instance = new WebSocketClient(options);
  }
  return instance;
}
export function getWebSocketClient() {
  return instance;
}
export function destroyWebSocketClient() {
  if (instance) {
    instance.disconnect();
    instance = null;
  }
}
export default WebSocketClient;
//# sourceMappingURL=websocket.js.map
