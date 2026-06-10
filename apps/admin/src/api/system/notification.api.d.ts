/**
 * 通知 API
 */
export interface NotificationQuery {
    pageNum?: number;
    pageSize?: number;
    title?: string;
    type?: string;
    status?: string;
    level?: string;
}
export interface NotificationForm {
    notificationId?: number;
    title?: string;
    content?: string;
    type?: string;
    level?: string;
    targetType?: string;
    targetIds?: number[];
    isPushed?: boolean;
    pushTime?: string;
    expireTime?: string;
}
export interface NotificationInfo {
    notificationId: number;
    title: string;
    content: string;
    type: string;
    level: string;
    status: string;
    targetType: string;
    targetIds?: number[];
    isPushed: boolean;
    pushTime?: string;
    expireTime?: string;
    createBy: string;
    createTime: string;
    updateTime?: string;
}
export declare const getNotificationList: (params?: NotificationQuery) => Promise<unknown>;
export declare const getNotificationPage: (params?: NotificationQuery) => Promise<unknown>;
export declare const getNotification: (notificationId: number) => Promise<unknown>;
export declare const createNotification: (data: NotificationForm) => Promise<unknown>;
export declare const updateNotification: (data: NotificationForm) => Promise<unknown>;
export declare const deleteNotification: (notificationId: number) => Promise<unknown>;
export declare const batchDeleteNotification: (notificationIds: number[]) => Promise<unknown>;
export declare const pushNotification: (notificationId: number) => Promise<unknown>;
export declare const recallNotification: (notificationId: number) => Promise<unknown>;
export declare const getNotificationStats: () => Promise<unknown>;
//# sourceMappingURL=notification.api.d.ts.map