# 主题

云枢中台内置浅色/深色双主题，支持**系统偏好自动跟随**。

## 切换主题

```typescript
import { useTheme } from '@yunshu/ui';

const { theme, setTheme, toggleTheme } = useTheme();

// 手动切换
setTheme('dark');

// 切换亮暗
toggleTheme();

// 跟随系统偏好
followSystem();
```

## CSS 类名方式

```html
<html class="theme-light">  <!-- 浅色主题 -->
<html class="theme-dark">   <!-- 深色主题 -->
<html>                      <!-- 跟随系统偏好 -->
```

## 自定义主题

可通过 `@yunshu/design-tokens` 的运行时 API 覆盖任意颜色令牌：

```typescript
import { lightColors } from '@yunshu/design-tokens';

// 修改主色
lightColors.primary = '#ff6b6b';
```

完整的定制方案请参考 CLI 的 `yunshu theme` 命令。
