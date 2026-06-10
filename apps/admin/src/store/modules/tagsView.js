import { defineStore } from 'pinia';
export const useTagsViewStore = defineStore('tagsView', () => {
    const visitedViews = useLocalStorage('visited-views', []);
    const cachedViews = useLocalStorage('cached-views', []);
    const addVisitedView = (view) => {
        if (visitedViews.value.some((v) => v.path === view.path)) {
            return;
        }
        visitedViews.value.push({
            ...view,
            title: view.meta?.title || '未命名'
        });
        if (view.name && !cachedViews.value.includes(view.name)) {
            cachedViews.value.push(view.name);
        }
    };
    const delVisitedView = (view) => {
        const index = visitedViews.value.findIndex((v) => v.path === view.path);
        if (index !== -1) {
            visitedViews.value.splice(index, 1);
        }
        const cacheIndex = cachedViews.value.findIndex((name) => name === view.name);
        if (cacheIndex !== -1) {
            cachedViews.value.splice(cacheIndex, 1);
        }
    };
    const delOtherViews = (view) => {
        visitedViews.value = visitedViews.value.filter((v) => {
            return v.path === view.path || (v.meta?.affix && v.path !== view.path);
        });
        cachedViews.value = cachedViews.value.filter((name) => {
            return name === view.name || visitedViews.value.some((v) => v.name === name);
        });
    };
    const delAllViews = () => {
        const affixViews = visitedViews.value.filter((v) => v.meta?.affix);
        visitedViews.value = affixViews;
        cachedViews.value = [];
    };
    const delCachedView = (view) => {
        const index = cachedViews.value.findIndex((name) => name === view.name);
        if (index !== -1) {
            cachedViews.value.splice(index, 1);
        }
    };
    const updateVisitedView = (view) => {
        const index = visitedViews.value.findIndex((v) => v.path === view.path);
        if (index !== -1) {
            visitedViews.value[index] = { ...visitedViews.value[index], ...view };
        }
    };
    return {
        visitedViews,
        cachedViews,
        addVisitedView,
        delVisitedView,
        delOtherViews,
        delAllViews,
        delCachedView,
        updateVisitedView
    };
});
// 使用 useLocalStorage 的 polyfill
function useLocalStorage(key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    const value = storedValue ? JSON.parse(storedValue) : defaultValue;
    return {
        get value() {
            return value;
        },
        set value(newValue) {
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    };
}
//# sourceMappingURL=tagsView.js.map