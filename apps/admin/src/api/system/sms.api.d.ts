/**
 * 短信服务 API
 */
export interface SmsQuery {
  pageNum?: number;
  pageSize?: number;
  phone?: string;
  type?: string;
}
export interface SmsForm {
  smsId?: number;
  phone?: string;
  type?: string;
  content?: string;
  status?: string;
  sendTime?: string;
  remark?: string;
}
export interface SmsInfo {
  smsId: number;
  phone: string;
  type: string;
  content: string;
  status: string;
  sendTime: string;
  remark: string;
}
export interface SmsConfig {
  smsType: string;
  accessKey: string;
  secretKey: string;
  region: string;
  signName: string;
  templateCode: string;
}
export declare const getSmsList: (params?: SmsQuery) => Promise<unknown>;
export declare const getSmsPage: (params?: SmsQuery) => Promise<unknown>;
export declare const getSms: (smsId: number) => Promise<unknown>;
export declare const getSmsConfig: () => Promise<unknown>;
export declare const saveSmsConfig: (data: SmsConfig) => Promise<unknown>;
export declare const sendSms: (phone: string, content: string) => Promise<unknown>;
export declare const getSmsLogList: (params?: SmsQuery) => Promise<unknown>;
//# sourceMappingURL=sms.api.d.ts.map
