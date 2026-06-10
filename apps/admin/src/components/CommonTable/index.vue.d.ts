interface Column {
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sortable?: boolean;
  formatter?: (row: any, column: any, cellValue: any) => any;
  slot?: string;
}
interface Props {
  data: any[];
  columns: Column[];
  loading?: boolean;
  stripe?: boolean;
  border?: boolean;
  showSelection?: boolean;
  showPagination?: boolean;
  total?: number;
  pageSize?: number;
}
declare let __VLS_18: string,
  __VLS_19: {
    row: any;
  };
type __VLS_Slots = {} & {
  [K in NonNullable<typeof __VLS_18>]?: (props: typeof __VLS_19) => any;
};
declare const __VLS_component: import('vue').DefineComponent<
  Props,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    selectionChange: (...args: any[]) => void;
    pageChange: (...args: any[]) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<Props> &
    Readonly<{
      onSelectionChange?: ((...args: any[]) => any) | undefined;
      onPageChange?: ((...args: any[]) => any) | undefined;
    }>,
  {
    loading: boolean;
    data: any[];
    columns: Column[];
    stripe: boolean;
    border: boolean;
    showSelection: boolean;
    showPagination: boolean;
    total: number;
    pageSize: number;
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
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
  new (): {
    $slots: S;
  };
};
//# sourceMappingURL=index.vue.d.ts.map
