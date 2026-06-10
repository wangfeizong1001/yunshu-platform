const http = require('http');

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function test() {
  const opts = {
    hostname: 'localhost',
    port: 3001,
    headers: { 'Content-Type': 'application/json' },
  };

  console.log('=== 测试 1: GET /api/auth/captcha');
  let r = await makeRequest({ ...opts, path: '/api/auth/captcha', method: 'GET' });
  console.log('Status:', r.statusCode);
  try {
    const json = JSON.parse(r.body);
    console.log('code:', json.code, 'data keys:', Object.keys(json.data || {}).join(', '));
  } catch (e) {
    console.log('Body:', r.body.slice(0, 300));
  }

  console.log('\n=== 测试 2: POST /api/auth/login');
  const body = JSON.stringify({ username: 'admin', password: 'admin123' });
  r = await makeRequest(
    {
      ...opts,
      path: '/api/auth/login',
      method: 'POST',
      headers: { ...opts.headers, 'Content-Length': Buffer.byteLength(body) },
    },
    body,
  );
  console.log('Status:', r.statusCode);
  try {
    const json = JSON.parse(r.body);
    console.log('code:', json.code, 'msg:', json.msg);
    if (json.data) console.log('data keys:', Object.keys(json.data).join(', '));
  } catch (e) {
    console.log('Body:', r.body.slice(0, 300));
  }

  console.log('\n=== 测试 3: GET /api/auth/userinfo');
  r = await makeRequest({
    ...opts,
    path: '/api/auth/userinfo',
    method: 'GET',
    headers: { ...opts.headers, Authorization: 'Bearer mock-token-test-1' },
  });
  console.log('Status:', r.statusCode);
  try {
    const json = JSON.parse(r.body);
    console.log('code:', json.code, 'username:', json.data?.username);
  } catch (e) {
    console.log('Body:', r.body.slice(0, 300));
  }

  console.log('\n=== 测试 4: GET /api/system/menu/list');
  r = await makeRequest({ ...opts, path: '/api/system/menu/list', method: 'GET' });
  console.log('Status:', r.statusCode);
  try {
    const json = JSON.parse(r.body);
    console.log('code:', json.code, 'data length:', json.data?.length);
  } catch (e) {
    console.log('Body:', r.body.slice(0, 300));
  }
}

test();
