import type { Tenant } from '@yunshu/shared';
type __VLS_Props = {
  modelValue: boolean;
  tenantData?: Tenant | null;
};
declare const _default: import('vue').DefineComponent<
  __VLS_Props,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    refresh: () => any;
    'update:modelValue': (value: boolean) => any;
  },
  string,
  import('vue').PublicProps,
  Readonly<__VLS_Props> &
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
//# sourceMappingURL=TenantForm.vue.d.ts.map
