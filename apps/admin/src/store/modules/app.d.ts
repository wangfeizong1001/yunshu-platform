interface AppState {
    sidebarCollapsed: boolean;
    language: string;
    size: string;
}
export type { AppState };
export declare const useAppStore: import("pinia").StoreDefinition<"app", Pick<{
    sidebarCollapsed: import("@vueuse/core").RemovableRef<boolean>;
    language: import("@vueuse/core").RemovableRef<string>;
    size: import("@vueuse/core").RemovableRef<string>;
    toggleSidebar: () => void;
    setLanguage: (lang: string) => void;
    setSize: (newSize: string) => void;
}, "size" | "language" | "sidebarCollapsed">, Pick<{
    sidebarCollapsed: import("@vueuse/core").RemovableRef<boolean>;
    language: import("@vueuse/core").RemovableRef<string>;
    size: import("@vueuse/core").RemovableRef<string>;
    toggleSidebar: () => void;
    setLanguage: (lang: string) => void;
    setSize: (newSize: string) => void;
}, never>, Pick<{
    sidebarCollapsed: import("@vueuse/core").RemovableRef<boolean>;
    language: import("@vueuse/core").RemovableRef<string>;
    size: import("@vueuse/core").RemovableRef<string>;
    toggleSidebar: () => void;
    setLanguage: (lang: string) => void;
    setSize: (newSize: string) => void;
}, "toggleSidebar" | "setLanguage" | "setSize">>;
//# sourceMappingURL=app.d.ts.map