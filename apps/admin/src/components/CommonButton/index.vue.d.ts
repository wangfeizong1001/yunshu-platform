interface Props {
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default';
    size?: 'large' | 'default' | 'small';
    disabled?: boolean;
    loading?: boolean;
}
declare var __VLS_10: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_10) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClick?: ((...args: any[]) => any) | undefined;
}>, {
    type: "primary" | "success" | "warning" | "danger" | "info" | "text" | "default";
    loading: boolean;
    size: "large" | "default" | "small";
    disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=index.vue.d.ts.map