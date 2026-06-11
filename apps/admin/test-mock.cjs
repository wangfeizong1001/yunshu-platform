/**
 * 独立测试：验证 mock 插件的核心编译+加载逻辑
 */
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { createRequire } = require('node:module');
const path = require('node:path');

// __dirname 在 CJS 中是全局的，此处直接使用
const mockDir = path.join(__dirname, 'mock');
const tmpDir = path.join(mockDir, '.compiled');

const routeFiles = [
  `${mockDir}/routes/auth/login.ts`,
  `${mockDir}/routes/dashboard/dashboard.ts`,
  `${mockDir}/routes/monitor/job.ts`,
  `${mockDir}/routes/monitor/logininfor.ts`,
  `${mockDir}/routes/monitor/online.ts`,
  `${mockDir}/routes/monitor/operlog.ts`,
  `${mockDir}/routes/monitor/server.ts`,
  `${mockDir}/routes/report/report.ts`,
  `${mockDir}/routes/system/dept.ts`,
  `${mockDir}/routes/system/form.ts`,
  `${mockDir}/routes/system/knowledge.ts`,
  `${mockDir}/routes/system/menu.ts`,
  `${mockDir}/routes/system/message.ts`,
  `${mockDir}/routes/system/notification.ts`,
  `${mockDir}/routes/system/post.ts`,
  `${mockDir}/routes/system/role.ts`,
  `${mockDir}/routes/system/user.ts`,
  `${mockDir}/routes/tool/gen.ts`,
  `${mockDir}/routes/workflow/index.ts`,
];

// 查找 esbuild
let esbuildCmd = 'esbuild';
const tryPaths = [
  path.join(__dirname, 'node_modules/.bin/esbuild'),
  '/workspace/node_modules/.pnpm/esbuild@0.21.5/node_modules/esbuild/bin/esbuild',
  '/workspace/node_modules/.pnpm/esbuild@0.27.7/node_modules/esbuild/bin/esbuild',
  '/workspace/node_modules/.pnpm/esbuild@0.28.0/node_modules/esbuild/bin/esbuild',
];
for (const p of tryPaths) {
  if (fs.existsSync(p)) { esbuildCmd = p; console.log('Using esbuild:', p); break; }
}

if (!fs.existsSync(esbuildCmd)) {
  console.error('ERROR: esbuild not found');
  process.exit(1);
}

// 清理旧编译文件
if (fs.existsSync(tmpDir)) {
  for (const f of fs.readdirSync(tmpDir)) {
    if (f.endsWith('.cjs')) fs.unlinkSync(path.join(tmpDir, f));
  }
}
fs.mkdirSync(tmpDir, { recursive: true });

// 用 createRequire 确保能加载 .cjs 文件
const req = createRequire(path.join(tmpDir, '__test__.cjs'));

// 编译所有路由文件
const routes = [];
for (const tsFile of routeFiles) {
  const cjsFile = path.join(tmpDir, tsFile.split('/').slice(-2).join('_').replace(/\.ts$/, '.cjs'));
  const rel = tsFile.split('/').slice(-2).join('/');
  console.log(`编译: ${rel}`);
  try {
    execFileSync(esbuildCmd, [
      tsFile, '--bundle', '--outfile=' + cjsFile,
      '--platform=node', '--format=cjs', '--target=node18', '--log-level=warning',
    ], { stdio: 'pipe' });
    delete req.cache[req.resolve(cjsFile)];
    const mod = req(cjsFile);
    const arr = mod.default || mod;
    if (Array.isArray(arr)) {
      routes.push(...arr);
      console.log(`  OK 加载了 ${arr.length} 个路由`);
    } else {
      console.log(`  WARN 模块格式异常:`, typeof arr);
    }
  } catch (err) {
    console.error(`  FAIL: ${err.message.split('\n')[0]}`);
  }
}

console.log(`\n总计加载路由: ${routes.length}`);

// 测试匹配
const tests = [
  ['/api/auth/captcha', 'get'],
  ['/api/auth/login', 'post'],
  ['/api/auth/userinfo', 'get'],
  ['/api/system/menu/list', 'get'],
  ['/api/system/user/list', 'get'],
];

console.log('\n路由匹配测试:');
for (const [url, method] of tests) {
  const matched = routes.find(r => r.url === url && (r.method || 'get') === method);
  console.log(`  ${method.toUpperCase()} ${url}: ${matched ? 'OK ✓' : 'FAIL ✗'}`);
}

// 测试响应
console.log('\n响应功能测试:');
for (const [url, method] of tests.slice(0, 2)) {
  const matched = routes.find(r => r.url === url && (r.method || 'get') === method);
  if (matched) {
    try {
      const result = matched.response({ body: {}, query: {}, headers: {} });
      if (result instanceof Promise) {
        result.then(r => console.log(`  ${method.toUpperCase()} ${url}: OK code=${r.code}`))
          .catch(e => console.error(`  ${method.toUpperCase()} ${url}: FAIL ${e.message.split('\n')[0]}`));
      } else {
        console.log(`  ${method.toUpperCase()} ${url}: OK code=${result.code}`);
      }
    } catch (e) {
      console.error(`  ${method.toUpperCase()} ${url}: FAIL ${e.message.split('\n')[0]}`);
    }
  }
}
