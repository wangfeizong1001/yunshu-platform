interface MenuItem {
  path: string;
  menuName?: string;
  meta?: {
    title?: string;
    icon?: string;
    hidden?: boolean;
  };
  children?: MenuItem[];
}
type __VLS_Props = {
  item: MenuItem;
  basePath: string;
};
declare const _default: import('vue').DefineComponent<
  __VLS_Props,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').PublicProps,
  Readonly<__VLS_Props> & Readonly<{}>,
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
//# sourceMappingURL=SidebarItem.vue.d.ts.map
