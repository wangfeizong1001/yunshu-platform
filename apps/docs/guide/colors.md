# 颜色系统

云枢中台提供**浅色/深色双主题**的完整颜色令牌。

## 颜色令牌架构

```
primary         → 主色（品牌色）
  ├── primaryLight
  ├── primaryDark
  └── primaryAlpha*

background      → 背景色
surface-1~4     → 递进表面色（4 级）
text-primary~disabled → 文字色（4 级）

success/warning/danger/info → 状态色
border/borderLight/borderDark → 边框色
```

## 浅色主题

| 令牌 | 色值 | 说明 |
|------|------|------|
| `--primary` | `#4a9eff` | 天蓝色，科技感 |
| `--background` | `#ffffff` | 纯白背景 |
| `--text-primary` | `#212529` | 深灰文字 |

## 深色主题

| 令牌 | 色值 | 说明 |
|------|------|------|
| `--primary` | `#4a9eff` | 主色不变 |
| `--background` | `#0a0e27` | 深蓝黑背景 |
| `--text-primary` | `#e0e0e0` | 浅灰文字 |

## WCAG 对比度

所有文字-背景组合均达到 **WCAG AA 级**（对比度 ≥ 4.5:1）。
