interface TagView {
  path: string;
  name: string;
  title?: string;
  query?: Record<string, any>;
  params?: Record<string, any>;
  meta?: Record<string, any>;
}
interface TagsViewState {
  visitedViews: TagView[];
  cachedViews: string[];
}
export type { TagsViewState };
export declare const useTagsViewStore: import('pinia').StoreDefinition<
  'tagsView',
  Pick<
    {
      visitedViews: {
        value: TagView[];
      };
      cachedViews: {
        value: string[];
      };
      addVisitedView: (view: TagView) => void;
      delVisitedView: (view: TagView) => void;
      delOtherViews: (view: TagView) => void;
      delAllViews: () => void;
      delCachedView: (view: TagView) => void;
      updateVisitedView: (view: TagView) => void;
    },
    'visitedViews' | 'cachedViews'
  >,
  Pick<
    {
      visitedViews: {
        value: TagView[];
      };
      cachedViews: {
        value: string[];
      };
      addVisitedView: (view: TagView) => void;
      delVisitedView: (view: TagView) => void;
      delOtherViews: (view: TagView) => void;
      delAllViews: () => void;
      delCachedView: (view: TagView) => void;
      updateVisitedView: (view: TagView) => void;
    },
    never
  >,
  Pick<
    {
      visitedViews: {
        value: TagView[];
      };
      cachedViews: {
        value: string[];
      };
      addVisitedView: (view: TagView) => void;
      delVisitedView: (view: TagView) => void;
      delOtherViews: (view: TagView) => void;
      delAllViews: () => void;
      delCachedView: (view: TagView) => void;
      updateVisitedView: (view: TagView) => void;
    },
    | 'addVisitedView'
    | 'delVisitedView'
    | 'delOtherViews'
    | 'delAllViews'
    | 'delCachedView'
    | 'updateVisitedView'
  >
>;
//# sourceMappingURL=tagsView.d.ts.map
