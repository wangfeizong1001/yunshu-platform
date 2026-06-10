interface ScreenSize {
    width: number;
    height: number;
}
export declare function useScreenSize(): {
    screenSize: import("vue").Ref<{
        width: number;
        height: number;
    }, ScreenSize | {
        width: number;
        height: number;
    }>;
    isMobile: () => boolean;
    isTablet: () => boolean;
    isDesktop: () => boolean;
};
export {};
//# sourceMappingURL=useScreenSize.d.ts.map