/**
 * 表单管理相关 API
 */
export type FormComponentType =
  | 'input'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'datetime'
  | 'time'
  | 'upload'
  | 'number'
  | 'switch'
  | 'rate'
  | 'slider';
export interface FormOption {
  label: string;
  value: string | number | boolean;
}
export interface FormComponent {
  id: string;
  type: FormComponentType;
  label: string;
  field: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  options?: FormOption[];
  rules?: string[];
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string;
  maxCount?: number;
}
export interface FormQuery {
  pageNum?: number;
  pageSize?: number;
  formName?: string;
  status?: string;
}
export interface FormForm {
  formId?: number;
  formName?: string;
  formCode?: string;
  description?: string;
  components?: FormComponent[];
  status?: string;
  remark?: string;
}
export interface FormInfo {
  formId: number;
  formName: string;
  formCode: string;
  description: string;
  components: FormComponent[];
  status: string;
  createTime: string;
  updateTime: string;
  remark: string;
}
export interface FormPageResp {
  total: number;
  rows: FormInfo[];
}
export declare function getFormList(params: FormQuery): Promise<FormPageResp>;
export declare function getFormPage(params: FormQuery): Promise<FormPageResp>;
export declare function getForm(formId: number): Promise<FormInfo>;
export declare function addForm(data: FormForm): Promise<unknown>;
export declare function updateForm(data: FormForm): Promise<unknown>;
export declare function deleteForm(formId: number): Promise<unknown>;
export declare function batchDeleteForm(formIds: number[]): Promise<unknown>;
export declare function copyForm(formId: number): Promise<unknown>;
export declare function publishForm(formId: number): Promise<unknown>;
export declare function stopForm(formId: number): Promise<unknown>;
export declare function submitFormData(formId: number, data: Record<string, any>): Promise<unknown>;
export declare function getFormDataList(formId: number, params: any): Promise<unknown>;
//# sourceMappingURL=form.api.d.ts.map
