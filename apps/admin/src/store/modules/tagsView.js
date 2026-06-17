import { defineStore } from 'pinia';
function useLocalStorage(key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    let value;
    try {
        value = storedValue ? JSON.parse(storedValue) : defaultValue;
    }
    catch {
        value = defaultValue;
    }
    return {
        get value() {
            return value;
        },
        set value(newValue) {
            value = newValue;
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    };
}
export const useTagsViewStore = defineStore('tagsView', () => {
    const visitedViews = useLocalStorage('visited-views', []);
    const cachedViews = useLocalStorage('cached-views', []);
    const addVisitedView = (view) => {
        if (visitedViews.value.some((v) => v.path === view.path)) {
            return;
        }
        visitedViews.value.push({
            ...view,
            title: view.meta?.title || view.name || '未命名'
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
    const delRightViews = (view) => {
        const index = visitedViews.value.findIndex((v) => v.path === view.path);
        if (index !== -1) {
            const rightViews = visitedViews.value.slice(index + 1);
            rightViews.forEach((v) => {
                if (!v.meta?.affix) {
                    delVisitedView(v);
                }
            });
        }
    };
    const delLeftViews = (view) => {
        const index = visitedViews.value.findIndex((v) => v.path === view.path);
        if (index !== -1) {
            const leftViews = visitedViews.value.slice(0, index);
            leftViews.forEach((v) => {
                if (!v.meta?.affix) {
                    delVisitedView(v);
                }
            });
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
        updateVisitedView,
        delLeftViews,
        delRightViews
    };
});
//# sourceMappingURL=tagsView.js.map