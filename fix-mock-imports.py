#!/usr/bin/env python3
"""修复 mock 文件中损坏的 import 和类型注解"""
import re
import os

files_to_fix = [
    '/workspace/apps/admin/src/mock/dict.mock.ts',
    '/workspace/apps/admin/src/mock/system/oss.mock.ts',
    '/workspace/apps/admin/src/mock/system/sms.mock.ts',
    '/workspace/apps/admin/src/mock/system/sso.mock.ts',
    '/workspace/apps/admin/src/mock/system/third.mock.ts',
    '/workspace/apps/admin/src/mock/tenant/tenant-package.mock.ts',
    '/workspace/apps/admin/src/mock/config.mock.ts',
    '/workspace/apps/admin/src/mock/file.mock.ts',
    '/workspace/apps/admin/src/mock/gen/gen.mock.ts',
    '/workspace/apps/admin/src/mock/menu.mock.ts',
    '/workspace/apps/admin/src/mock/monitor/job.mock.ts',
    '/workspace/apps/admin/src/mock/monitor/logininfor.mock.ts',
    '/workspace/apps/admin/src/mock/monitor/online.mock.ts',
    '/workspace/apps/admin/src/mock/monitor/operlog.mock.ts',
    '/workspace/apps/admin/src/mock/monitor/server.mock.ts',
    '/workspace/apps/admin/src/mock/notice.mock.ts',
    '/workspace/apps/admin/src/mock/role.mock.ts',
    '/workspace/apps/admin/src/mock/tenant/tenant.mock.ts',
    '/workspace/apps/admin/src/mock/user.mock.ts',
    '/workspace/apps/admin/src/mock/dashboard.mock.ts',
    '/workspace/apps/admin/src/mock/form.mock.ts',
    '/workspace/apps/admin/src/mock/knowledge.mock.ts',
    '/workspace/apps/admin/src/mock/report.mock.ts',
    '/workspace/apps/admin/src/mock/search.mock.ts',
    '/workspace/apps/admin/src/mock/workflow.mock.ts',
]

for fp in files_to_fix:
    if not os.path.exists(fp):
        print(f"跳过不存在: {fp}")
        continue
    
    with open(fp, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    in_import_block = False
    
    for line in lines:
        # 检测 import type 或 import { 行（多行导入开始）
        if re.match(r'^\s*import\s+(type\s+)?\{', line) and not '}' in line.split('from')[0] if 'from' in line else True:
            # 简化检测：如果是import行 或者 行内有 @yunshu/shared，跳过
            pass
        
        # 检测损坏的多行 import：包含 @yunshu/shared 关键字的行 和 import type { 行
        if '@yunshu/shared' in line:
            continue
        
        # 检测 import type { 开头的行
        stripped = line.strip()
        if stripped.startswith('import type {') or (stripped.startswith('import {') and 'from' in line and '@yunshu/shared' not in line):
            # 如果这行没有闭合 (没有 }) 且下面几行有 @yunshu/shared - 我们需要跳过整个块
            in_import_block = True
            continue
        
        if in_import_block:
            # 继续跳过直到找到结尾
            if '@yunshu/shared' in line:
                in_import_block = False
                continue
            if '}' in line and 'from' in line:
                in_import_block = False
                continue
            continue
        
        new_lines.append(line)
    
    # 写回
    with open(fp, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"已修复: {fp}")

print("\n修复完成")
