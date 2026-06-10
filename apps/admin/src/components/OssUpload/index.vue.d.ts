interface Props {
    /** 绑定的文件路径 */
    modelValue?: string;
    /** 上传地址 */
    action?: string;
    /** 额外参数 */
    extraData?: Record<string, any>;
    /** 接受的文件类型 */
    accept?: string;
    /** 文件大小限制 (MB) */
    maxSize?: number;
    /** 是否禁用 */
    disabled?: boolean;
    /** 文件数量限制 */
    limit?: number;
    /** 是否多选 */
    multiple?: boolean;
    /** 是否拖拽上传 */
    drag?: boolean;
    /** 是否显示文件列表 */
    showFileList?: boolean;
    /** 提示文字 */
    tip?: string;
    /** 文件类型验证正则 */
    fileType?: string[];
}
declare function submit(): void;
declare function clearFiles(): void;
declare function abort(file?: any): void;
declare var __VLS_7: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {
    submit: typeof submit;
    clearFiles: typeof clearFiles;
    abort: typeof abort;
    uploadRef: import("vue").Ref<any, any>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    success: (data: any) => any;
    error: (error: any) => any;
    progress: (event: any) => any;
    "update:modelValue": (value: string) => any;
    change: (file: any, fileList: any[]) => any;
    remove: (file: any, fileList: any[]) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSuccess?: ((data: any) => any) | undefined;
    onError?: ((error: any) => any) | undefined;
    onProgress?: ((event: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onChange?: ((file: any, fileList: any[]) => any) | undefined;
    onRemove?: ((file: any, fileList: any[]) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: string;
    multiple: boolean;
    action: string;
    drag: boolean;
    showFileList: boolean;
    accept: string;
    limit: number;
    tip: string;
    fileType: string[];
    maxSize: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=index.vue.d.ts.map