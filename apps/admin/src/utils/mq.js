/**
 * 消息队列模拟工具
 *
 * 提供发布订阅模式的消息队列实现
 */
/**
 * 消息队列类
 */
class MessageQueue {
    subscribers = new Map();
    messages = new Map();
    config;
    constructor(config = {}) {
        this.config = {
            persistent: false,
            maxMessages: 100,
            ...config
        };
    }
    /**
     * 生成唯一订阅者ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * 订阅主题
     * @param topic 主题名称
     * @param callback 消息回调函数
     * @param once 是否只消费一次
     * @returns 订阅者ID，用于取消订阅
     */
    subscribe(topic, callback, once = false) {
        const subscriber = {
            id: this.generateId(),
            callback,
            once
        };
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, new Set());
        }
        this.subscribers.get(topic).add(subscriber);
        // 如果有持久化的消息，立即发送
        if (this.config.persistent && this.messages.has(topic)) {
            const messages = this.messages.get(topic);
            messages.forEach((message) => {
                callback(message);
                if (once) {
                    this.unsubscribe(topic, subscriber.id);
                }
            });
        }
        return subscriber.id;
    }
    /**
     * 订阅一次
     * @param topic 主题名称
     * @param callback 消息回调函数
     * @returns 订阅者ID
     */
    subscribeOnce(topic, callback) {
        return this.subscribe(topic, callback, true);
    }
    /**
     * 取消订阅
     * @param topic 主题名称
     * @param subscriberId 订阅者ID
     */
    unsubscribe(topic, subscriberId) {
        const topicSubscribers = this.subscribers.get(topic);
        if (!topicSubscribers)
            return false;
        const subscriber = Array.from(topicSubscribers).find(s => s.id === subscriberId);
        if (subscriber) {
            topicSubscribers.delete(subscriber);
            return true;
        }
        return false;
    }
    /**
     * 取消主题的所有订阅
     * @param topic 主题名称
     */
    unsubscribeAll(topic) {
        this.subscribers.delete(topic);
    }
    /**
     * 发布消息到主题
     * @param topic 主题名称
     * @param message 消息内容
     */
    publish(topic, message) {
        // 持久化消息
        if (this.config.persistent) {
            if (!this.messages.has(topic)) {
                this.messages.set(topic, []);
            }
            const topicMessages = this.messages.get(topic);
            topicMessages.push(message);
            // 限制消息数量
            if (this.config.maxMessages && topicMessages.length > this.config.maxMessages) {
                topicMessages.shift();
            }
        }
        // 发送消息给订阅者
        const topicSubscribers = this.subscribers.get(topic);
        if (!topicSubscribers)
            return;
        const toRemove = [];
        topicSubscribers.forEach((subscriber) => {
            try {
                subscriber.callback(message);
                if (subscriber.once) {
                    toRemove.push(subscriber);
                }
            }
            catch (error) {
                console.error(`消息队列回调错误 [${topic}]:`, error);
            }
        });
        // 移除一次性订阅者
        toRemove.forEach((subscriber) => topicSubscribers.delete(subscriber));
    }
    /**
     * 获取主题的订阅者数量
     * @param topic 主题名称
     */
    getSubscriberCount(topic) {
        return this.subscribers.get(topic)?.size || 0;
    }
    /**
     * 获取所有主题
     */
    getTopics() {
        return Array.from(this.subscribers.keys());
    }
    /**
     * 清空消息队列
     */
    clear() {
        this.subscribers.clear();
        this.messages.clear();
    }
    /**
     * 清空主题的消息
     * @param topic 主题名称
     */
    clearTopic(topic) {
        this.messages.delete(topic);
    }
}
/** 全局默认消息队列实例 */
const defaultMQ = new MessageQueue();
/**
 * 创建新的消息队列实例
 */
export function createMQ(config) {
    return new MessageQueue(config);
}
/** 导出默认实例的方法 */
export function subscribe(topic, callback, once = false) {
    return defaultMQ.subscribe(topic, callback, once);
}
export function subscribeOnce(topic, callback) {
    return defaultMQ.subscribeOnce(topic, callback);
}
export function unsubscribe(topic, subscriberId) {
    return defaultMQ.unsubscribe(topic, subscriberId);
}
export function unsubscribeAll(topic) {
    return defaultMQ.unsubscribeAll(topic);
}
export function publish(topic, message) {
    return defaultMQ.publish(topic, message);
}
export function getSubscriberCount(topic) {
    return defaultMQ.getSubscriberCount(topic);
}
export function getTopics() {
    return defaultMQ.getTopics();
}
export function clear() {
    return defaultMQ.clear();
}
export function clearTopic(topic) {
    return defaultMQ.clearTopic(topic);
}
/** 导出类 */
export { MessageQueue };
//# sourceMappingURL=mq.js.map