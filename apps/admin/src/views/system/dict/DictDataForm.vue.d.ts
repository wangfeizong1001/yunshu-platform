import type { SysDictData } from '@yunshu/shared';
interface Props {
  modelValue: boolean;
  dictData?: SysDictData | null;
  dictType: string;
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
//# sourceMappingURL=DictDataForm.vue.d.ts.map
