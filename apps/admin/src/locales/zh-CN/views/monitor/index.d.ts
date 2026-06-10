declare const _default: {
    online: {
        menu: string;
        title: string;
        fields: {
            tokenId: string;
            username: string;
            ipaddr: string;
            loginLocation: string;
            browser: string;
            os: string;
            loginTime: string;
            deptName: string;
        };
        buttons: {
            forceLogout: string;
            batchForceLogout: string;
            export: string;
        };
        messages: {
            forceLogoutSuccess: string;
            forceLogoutConfirm: string;
            batchForceLogoutConfirm: string;
        };
    };
    loginLog: {
        menu: string;
        title: string;
        fields: {
            infoId: string;
            username: string;
            ipaddr: string;
            loginLocation: string;
            browser: string;
            os: string;
            status: string;
            statusMap: {
                '0': string;
                '1': string;
            };
            msg: string;
            loginTime: string;
        };
        buttons: {
            delete: string;
            clean: string;
            export: string;
        };
        messages: {
            deleteSuccess: string;
            cleanSuccess: string;
            deleteConfirm: string;
            cleanConfirm: string;
        };
    };
    operLog: {
        menu: string;
        title: string;
        fields: {
            operId: string;
            title: string;
            businessType: string;
            businessTypeMap: {
                '0': string;
                '1': string;
                '2': string;
                '3': string;
                '4': string;
                '5': string;
                '6': string;
                '7': string;
                '8': string;
                '9': string;
            };
            method: string;
            requestMethod: string;
            operatorType: string;
            operatorTypeMap: {
                '0': string;
                '1': string;
                '2': string;
            };
            operName: string;
            deptName: string;
            operUrl: string;
            operIp: string;
            operLocation: string;
            operParam: string;
            jsonResult: string;
            status: string;
            statusMap: {
                '0': string;
                '1': string;
            };
            errorMsg: string;
            operTime: string;
            costTime: string;
            costTimeUnit: string;
        };
        buttons: {
            detail: string;
            delete: string;
            clean: string;
            export: string;
        };
        messages: {
            deleteSuccess: string;
            cleanSuccess: string;
            deleteConfirm: string;
            cleanConfirm: string;
        };
    };
    job: {
        menu: string;
        title: string;
        fields: {
            jobId: string;
            jobName: string;
            jobGroup: string;
            jobGroupMap: {
                default: string;
                system: string;
            };
            invokeTarget: string;
            cronExpression: string;
            misfirePolicy: string;
            misfirePolicyMap: {
                '1': string;
                '2': string;
                '3': string;
            };
            concurrent: string;
            concurrentMap: {
                '0': string;
                '1': string;
            };
            status: string;
            statusMap: {
                '0': string;
                '1': string;
            };
            createBy: string;
            createTime: string;
            updateBy: string;
            updateTime: string;
            remark: string;
        };
        buttons: {
            add: string;
            edit: string;
            delete: string;
            execute: string;
            pause: string;
            resume: string;
            export: string;
            log: string;
        };
        messages: {
            addSuccess: string;
            editSuccess: string;
            deleteSuccess: string;
            executeSuccess: string;
            pauseSuccess: string;
            resumeSuccess: string;
            deleteConfirm: string;
            executeConfirm: string;
        };
    };
    server: {
        menu: string;
        title: string;
        fields: {
            cpu: string;
            memory: string;
            disk: string;
            network: string;
            os: string;
            serverName: string;
            serverIp: string;
            uptime: string;
            config: string;
        };
        buttons: {
            refresh: string;
            chart: string;
        };
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map