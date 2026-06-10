import type { SysDept } from '@yunshu/shared';
interface Props {
  modelValue: boolean;
  deptData?: SysDept | null;
  parentDept?: SysDept | null;
}
declare const _default: import('vue').DefineComponent<
  Props,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {} & {
    refresh: () => any;
    'update:modelValue': (value: boolean) => any;
  },
  string,
  import('vue').PublicProps,
  Readonly<Props> &
    Readonly<{
      onRefresh?: (() => any) | undefined;
      'onUpdate:modelValue'?: ((value: boolean) => any) | undefined;
    }>,
  {},
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
//# sourceMappingURL=DeptForm.vue.d.ts.map
