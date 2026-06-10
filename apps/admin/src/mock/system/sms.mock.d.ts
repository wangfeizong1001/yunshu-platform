/**
 * 短信服务 Mock 数据
 */
import type { SmsConfig, SmsTemplate, SmsTemplatePageResp, SmsLog, SmsLogPageResp, SmsSendResp } from '@yunshu/shared';
export declare const mockSmsConfig: SmsConfig;
export declare const mockSmsTemplateList: SmsTemplate[];
export declare const mockSmsLogList: SmsLog[];
export declare function getMockSmsConfig(): SmsConfig;
export declare function getMockSmsTemplatePage(params: any): SmsTemplatePageResp;
export declare function getMockSmsTemplateDetail(id: number): SmsTemplate | undefined;
export declare function getMockSmsLogPage(params: any): SmsLogPageResp;
export declare function sendMockSms(params: {
    mobile: string;
    templateCode: string;
    params?: Record<string, string>;
}): SmsSendResp;
export declare function testMockSmsSend(params: {
    mobile: string;
    templateCode: string;
    params?: Record<string, string>;
}): SmsSendResp;
//# sourceMappingURL=sms.mock.d.ts.map