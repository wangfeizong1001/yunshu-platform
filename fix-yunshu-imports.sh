#!/bin/bash
# 批量修复脚本：移除 @yunshu/shared 引用，使用 any 类型代替
set -e

echo "=== Step 1: 修复 mock 文件中的 @yunshu/shared 引用 ==="

for f in /workspace/apps/admin/src/mock/*.mock.ts /workspace/apps/admin/src/mock/**/*.mock.ts; do
  if [ -f "$f" ]; then
    echo "处理: $f"
    # 移除 import { ... } from '@yunshu/shared' 行
    sed -i "/from ['\"]@yunshu\/shared['\"]/d" "$f"
    # 把 as SomeType[] 改为 as any[]
    # 把 : SomeType 注解改为 : any
    # 把类型参数 <SomeType> 改为 <any>
    python3 -c "
import re, sys
fp = sys.argv[1]
with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()
# 替换 import 行（带花括号的）
content = re.sub(r\"import\\s*\\{[^}]*\\}\\s*from\\s*['\\\"]@yunshu/shared['\\\"];?\\s*\\n\", '', content)
# 替换单行 import
content = re.sub(r\"import\\s+\\w+\\s*from\\s*['\\\"]@yunshu/shared['\\\"];?\\s*\\n\", '', content)
with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)
" "$f"
  fi
done

echo ""
echo "=== Step 2: 修复视图文件中的 @yunshu/shared 引用 ==="

for f in /workspace/apps/admin/src/views/**/*.vue; do
  if [ -f "$f" ]; then
    # 只处理含有 @yunshu/shared 的文件
    if grep -q "@yunshu/shared" "$f" 2>/dev/null; then
      echo "处理: $f"
      python3 -c "
import re, sys
fp = sys.argv[1]
with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r\"import\\s*\\{[^}]*\\}\\s*from\\s*['\\\"]@yunshu/shared['\\\"];?\\s*\\n\", '', content)
content = re.sub(r\"import\\s+\\w+\\s*from\\s*['\\\"]@yunshu/shared['\\\"];?\\s*\\n\", '', content)
with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)
" "$f"
    fi
  fi
done

echo ""
echo "=== Step 3: 修复 composables 中的 @yunshu/shared 引用 ==="

for f in /workspace/apps/admin/src/composables/*.ts; do
  if [ -f "$f" ]; then
    if grep -q "@yunshu/shared" "$f" 2>/dev/null; then
      echo "处理: $f"
      python3 -c "
import re, sys
fp = sys.argv[1]
with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r\"import\\s*\\{[^}]*\\}\\s*from\\s*['\\\"]@yunshu/shared['\\\"];?\\s*\\n\", '', content)
with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)
" "$f"
    fi
  fi
done

echo ""
echo "=== 批量修复 @yunshu/shared 完成 ==="
