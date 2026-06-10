/**
 * 工作流 Mock 数据
 */
import type { ProcessDefinition, ProcessInstance, Task } from '../api/workflow.api';
export declare const mockProcessDefinitions: ProcessDefinition[];
export declare const mockProcessInstances: ProcessInstance[];
export declare const mockTodoTasks: Task[];
export declare const mockDoneTasks: Task[];
export declare const mockProcessHistory: ({
    id: string;
    taskName: string;
    assignee: string;
    startTime: string;
    endTime: string;
    comment: string;
    outcome: string;
} | {
    id: string;
    taskName: string;
    assignee: string;
    startTime: string;
    comment: string;
    outcome: string;
    endTime?: undefined;
})[];
export declare function getMockProcessDefinitionPage(params: any): {
    total: number;
    rows: ProcessDefinition[];
};
export declare function getMockProcessInstancePage(params: any): {
    total: number;
    rows: ProcessInstance[];
};
export declare function getMockTodoTaskPage(params: any): {
    total: number;
    rows: Task[];
};
export declare function getMockDoneTaskPage(params: any): {
    total: number;
    rows: Task[];
};
export declare function getMockProcessHistory(_processInstanceId: string): ({
    id: string;
    taskName: string;
    assignee: string;
    startTime: string;
    endTime: string;
    comment: string;
    outcome: string;
} | {
    id: string;
    taskName: string;
    assignee: string;
    startTime: string;
    comment: string;
    outcome: string;
    endTime?: undefined;
})[];
//# sourceMappingURL=workflow.mock.d.ts.map