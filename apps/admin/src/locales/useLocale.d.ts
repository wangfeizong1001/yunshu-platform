export declare function useLocale(): {
    locale: import("vue").ComputedRef<string>;
    locales: import("vue").ComputedRef<{
        label: string;
        key: string;
        elLocale: string;
    }[]>;
    elLocale: import("vue").ComputedRef<string>;
    changeLocale: (newLocale: string) => Promise<void>;
    t: (key: string, params?: Record<string, unknown>) => string;
    isCurrentLocale: (localeKey: string) => boolean;
    availableLocales: string[];
};
export default useLocale;
//# sourceMappingURL=useLocale.d.ts.map