/**
 * 站内消息 API
 */
export interface MessageQuery {
    pageNum?: number;
    pageSize?: number;
    title?: string;
    type?: string;
    status?: string;
    senderId?: number;
    receiverId?: number;
}
export interface MessageForm {
    messageId?: number;
    title?: string;
    content?: string;
    type?: string;
    priority?: string;
    receiverIds?: number[];
    receiverNames?: string[];
}
export interface MessageInfo {
    messageId: number;
    title: string;
    content: string;
    type: string;
    priority: string;
    status: string;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
    sendTime: string;
    readTime?: string;
}
export interface SendMessageResult {
    successCount: number;
    failCount: number;
    message: string;
}
export declare const getMessageList: (params?: MessageQuery) => Promise<unknown>;
export declare const getMessagePage: (params?: MessageQuery) => Promise<unknown>;
export declare const getUnreadMessageCount: () => Promise<unknown>;
export declare const getMessage: (messageId: number) => Promise<unknown>;
export declare const sendMessage: (data: MessageForm) => Promise<unknown>;
export declare const deleteMessage: (messageId: number) => Promise<unknown>;
export declare const batchDeleteMessage: (messageIds: number[]) => Promise<unknown>;
export declare const markAsRead: (messageId: number) => Promise<unknown>;
export declare const markAllAsRead: () => Promise<unknown>;
export declare const getSentMessages: (params?: MessageQuery) => Promise<unknown>;
//# sourceMappingURL=message.api.d.ts.map