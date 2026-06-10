interface Props {
    loading?: boolean;
    data?: Record<string, unknown>[];
    total?: number;
    page?: number;
    limit?: number;
    pageSizes?: number[];
    layout?: string;
    showSelection?: boolean;
    showPagination?: boolean;
}
declare var __VLS_1: {}, __VLS_3: {}, __VLS_17: {};
type __VLS_Slots = {} & {
    search?: (props: typeof __VLS_1) => any;
} & {
    toolbar?: (props: typeof __VLS_3) => any;
} & {
    columns?: (props: typeof __VLS_17) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {
    currentPage: globalThis.Ref<number, number>;
    pageSize: globalThis.Ref<number, number>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "selection-change": (selection: unknown[]) => any;
    query: (params: {
        page: number;
        limit: number;
    }) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onSelection-change"?: ((selection: unknown[]) => any) | undefined;
    onQuery?: ((params: {
        page: number;
        limit: number;
    }) => any) | undefined;
}>, {
    loading: boolean;
    data: Record<string, unknown>[];
    showSelection: boolean;
    showPagination: boolean;
    total: number;
    layout: string;
    pageSizes: number[];
    page: number;
    limit: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=LogTable.vue.d.ts.map