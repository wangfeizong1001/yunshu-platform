import { type SanitizeOptions } from '@/utils/security/sanitize';
interface Props {
  /** 待渲染的 HTML 内容（未经过滤 —— 组件内部会清理） */
  html: string;
  /** 可选的自定义清理规则 */
  sanitizeConfig?: SanitizeOptions;
}
declare const _default: import('vue').DefineComponent<
  Props,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').PublicProps,
  Readonly<Props> & Readonly<{}>,
  {
    sanitizeConfig: SanitizeOptions;
  },
  {},
  {},
  {},
  string,
  import('vue').ComponentProvideOptions,
  false,
  {},
  any
>;
export default _default;
//# sourceMappingURL=index.vue.d.ts.map
