export declare const useLocaleStore: import('pinia').StoreDefinition<
  'locale',
  Pick<
    {
      currentLocale: {
        value: string;
      };
      locales: {
        name: string;
        value: string;
      }[];
      setLocale: (locale: string) => void;
      getLocale: () => string;
      initLocale: () => void;
    },
    'locales' | 'currentLocale'
  >,
  Pick<
    {
      currentLocale: {
        value: string;
      };
      locales: {
        name: string;
        value: string;
      }[];
      setLocale: (locale: string) => void;
      getLocale: () => string;
      initLocale: () => void;
    },
    never
  >,
  Pick<
    {
      currentLocale: {
        value: string;
      };
      locales: {
        name: string;
        value: string;
      }[];
      setLocale: (locale: string) => void;
      getLocale: () => string;
      initLocale: () => void;
    },
    'setLocale' | 'getLocale' | 'initLocale'
  >
>;
//# sourceMappingURL=locale.d.ts.map
