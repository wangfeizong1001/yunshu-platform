export declare function useLocale(): {
  locale: globalThis.ComputedRef<string>;
  locales: globalThis.ComputedRef<
    {
      label: string;
      key: string;
      elLocale: string;
    }[]
  >;
  elLocale: globalThis.ComputedRef<string>;
  changeLocale: (newLocale: string) => Promise<void>;
  t: (key: string, params?: Record<string, unknown>) => string;
  isCurrentLocale: (localeKey: string) => boolean;
  availableLocales: string[];
};
export default useLocale;
//# sourceMappingURL=useLocale.d.ts.map
