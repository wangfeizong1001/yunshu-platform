/**
 * 云枢中台 — ESLint 配置
 */

// 由于当前 eslint 配置是 CommonJS 格式，先保持简单
// 未来可以升级到 eslint.config.js 格式
module.exports = {
  root: true,
  extends: ['./tools/eslint-config/index.js'],
};
