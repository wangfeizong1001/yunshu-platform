#!/usr/bin/env python3
"""清理 mock 文件中残留的类型引用"""
import re
import os

# 所有已知需要清理的类型名
TYPE_NAMES = [
    'SysConfig', 'SysConfigPageResp',
    'SysDictType', 'SysDictTypePageResp', 'SysDictData', 'SysDictDataPageResp',
    'SysFile', 'SysFilePageResp', 'SysFileUploadResp',
    'IGenTable', 'IGenColumn', 'IGenConfig', 'IGenPreview',
    'SysMenu',
    'IJob', 'IJobLog',
    'ILogininfor', 'IOnline', 'IOperlog', 'IServer',
    'SysNotice', 'SysNoticePageResp',
    'SysRole', 'SysRolePageResp',
    'OssConfig', 'OssFile', 'OssFilePageResp', 'OssConfigResp', 'OssUploadResp',
    'SmsConfig', 'SmsTemplate', 'SmsTemplatePageResp', 'SmsLog', 'SmsLogPageResp', 'SmsSendResp',
    'SsoApplication', 'SsoAppPageResp', 'SsoConfig', 'SsoAuthorizeResp', 'SsoTokenResp', 'SsoUserInfo',
    'ThirdLoginConfig', 'ThirdLoginLog', 'ThirdLoginLogPageResp', 'ThirdAuthorizeResp',
    'TenantPackage', 'TenantPackageQuery', 'TenantPackagePageResp',
    'Tenant', 'TenantQuery', 'TenantPageResp',
    'SysUser', 'SysUserPageResp',
    'SysDept',
]

# 目录里的所有 mock 文件
dirs = [
    '/workspace/apps/admin/src/mock',
    '/workspace/apps/admin/src/mock/gen',
    '/workspace/apps/admin/src/mock/monitor',
    '/workspace/apps/admin/src/mock/system',
    '/workspace/apps/admin/src/mock/tenant',
]

for d in dirs:
    if not os.path.isdir(d):
        continue
    for fname in os.listdir(d):
        if not fname.endswith('.mock.ts'):
            continue
        fp = os.path.join(d, fname)
        
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Step 1: 删除多行 import type { ... } from '@yunshu/shared'
        # 匹配: import type { 开始 到 结束 } from '@yunshu/shared';
        content = re.sub(
            r'import\s+type\s*\{[^}]*\}\s*from\s*[\'"]@yunshu/shared[\'"];?\s*',
            '',
            content,
            flags=re.MULTILINE | re.DOTALL,
        )
        
        # Step 2: 删除可能跨更多行的 broken import (以 } from '@yunshu/shared' 结尾)
        content = re.sub(
            r'import\s*\{[^}]*\}\s*from\s*[\'"]@yunshu/shared[\'"];?\s*',
            '',
            content,
            flags=re.MULTILINE | re.DOTALL,
        )
        
        # Step 3: 删除残留的 broken import 行（未闭合的）
        lines = content.split('\n')
        new_lines = []
        skip_until = -1
        in_multiline_import = False
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            # 如果行开始 import type { 且没有闭合
            if (re.match(r'^import\s+type\s*\{', stripped) or re.match(r'^import\s*\{', stripped)):
                if 'from' in stripped and ('@yunshu/shared' in stripped or 'yunshu' in stripped):
                    continue
                # 检测多行 import 是否引用 @yunshu/shared
                in_multiline_import = True
                continue
            
            if in_multiline_import:
                if '@yunshu/shared' in line:
                    in_multiline_import = False
                    continue
                if '}' in line and 'from' in line:
                    in_multiline_import = False
                    continue
                # 继续跳过导入中的内容行
                continue
            
            new_lines.append(line)
        
        content = '\n'.join(new_lines)
        
        # Step 4: 替换类型注解
        # 替换 ': TypeName[]' 为 ': any[]'
        for tname in TYPE_NAMES:
            # 如 ': SysDictType[]'
            content = re.sub(
                r':\s*' + re.escape(tname) + r'\[\]',
                ': any[]',
                content,
            )
            # 如 ': SysDictType'
            content = re.sub(
                r':\s*' + re.escape(tname) + r'(\s|$|[,)])',
                r': any\1',
                content,
            )
            # 如 '<SysDictType>'
            content = re.sub(
                r'<' + re.escape(tname) + r'>',
                '<any>',
                content,
            )
            # 如 'as SysDictType[]'
            content = re.sub(
                r'\bas\s+' + re.escape(tname) + r'\[\]',
                'as any[]',
                content,
            )
            # 如 'as SysDictType'
            content = re.sub(
                r'\bas\s+' + re.escape(tname) + r'(\s|$|[)])',
                r'as any\1',
                content,
            )
        
        if content != original:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"已修改: {fp}")
        else:
            print(f"未修改: {fp}")

print("\n所有 mock 文件处理完成")
