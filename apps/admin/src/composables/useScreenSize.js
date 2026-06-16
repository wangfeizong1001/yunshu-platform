import { ref, onMounted, onUnmounted } from 'vue';
export function useScreenSize() {
    const screenSize = ref({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const handleResize = () => {
        screenSize.value = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    };
    onMounted(() => {
        window.addEventListener('resize', handleResize);
    });
    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });
    const isMobile = () => screenSize.value.width < 768;
    const isTablet = () => screenSize.value.width >= 768 && screenSize.value.width < 1200;
    const isDesktop = () => screenSize.value.width >= 1200;
    return {
        screenSize,
        isMobile,
        isTablet,
        isDesktop
    };
}
//# sourceMappingURL=useScreenSize.js.map