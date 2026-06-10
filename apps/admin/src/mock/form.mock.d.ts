/**
 * 表单 Mock 数据
 */
import type { FormInfo, FormPageResp } from '@/api/system/form.api';
export declare const mockFormList: FormInfo[];
export declare function getMockFormPage(params: any): FormPageResp;
export declare function getMockFormDetail(formId: number): FormInfo | undefined;
export declare function addMockForm(form: Partial<FormInfo>): FormInfo;
export declare function updateMockForm(formId: number, form: Partial<FormInfo>): FormInfo | undefined;
export declare function deleteMockForm(formId: number): boolean;
export declare function copyMockForm(formId: number): FormInfo | undefined;
//# sourceMappingURL=form.mock.d.ts.map