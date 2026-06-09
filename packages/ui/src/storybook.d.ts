declare module '@storybook/vue3' {
  export interface Meta<T = unknown> {
    title?: string;
    component?: T;
    tags?: string[];
    argTypes?: Record<string, unknown>;
    args?: Record<string, unknown>;
  }
  export interface StoryObj<T = unknown> {
    args?: Record<string, unknown>;
    render?: (args: Record<string, unknown>) => unknown;
  }
}
