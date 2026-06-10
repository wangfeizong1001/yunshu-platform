import '@wangeditor/editor/dist/css/style.css';
import { type KnowledgeInfo } from '@/api/system/knowledge.api';
interface Props {
    modelValue: boolean;
    knowledgeData?: KnowledgeInfo | null;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    refresh: () => any;
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onRefresh?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=KnowledgeForm.vue.d.ts.map