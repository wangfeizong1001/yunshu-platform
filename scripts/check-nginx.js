import { Client } from 'ssh2';
import { SocksClient } from 'socks';
import { createReadStream } from 'fs';
import http from 'http';

const TARGET_HOST = '120.48.97.237';
const TARGET_PORT = 22;
const PROXY_URL = process.env.HTTP_PROXY || process.env.http_proxy || '';

console.log('正在连接服务器...');
console.log(`代理: ${PROXY_URL || '无'}`);

function connectViaHttpProxy(proxyUrl, targetHost, targetPort) {
  return new Promise((resolve, reject) => {
    const proxy = new URL(proxyUrl);
    const options = {
      hostname: proxy.hostname,
      port: proxy.port || 80,
      method: 'CONNECT',
      path: `${targetHost}:${targetPort}`,
    };

    const req = http.request(options);
    req.on('connect', (res, socket) => {
      if (res.statusCode === 200) {
        resolve(socket);
      } else {
        reject(new Error(`代理连接失败: ${res.statusCode}`));
      }
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  let sock;
  if (PROXY_URL) {
    try {
      sock = await connectViaHttpProxy(PROXY_URL, TARGET_HOST, TARGET_PORT);
      console.log('代理隧道建立成功');
    } catch (err) {
      console.error('代理连接失败:', err.message);
      process.exit(1);
    }
  }

  const conn = new Client();

  conn
    .on('ready', () => {
      console.log('SSH 连接成功');
      console.log('\n=== 查找 Nginx 配置 ===');
      conn.exec(
        'find /etc/nginx -name "*.conf" | xargs grep -l "location /playground" 2>/dev/null; echo "---"; find /etc/nginx -name "*.conf" | head -20',
        (err, stream) => {
          if (err) {
            console.error('执行失败:', err);
            conn.end();
            return;
          }
          let out = '';
          stream
            .on('close', () => {
              console.log(out);

              console.log('\n=== 读取完整 Nginx server 配置 ===');
              conn.exec(
                'grep -rn "location /playground" /etc/nginx/ --include="*.conf" -A 5 -B 10',
                (err2, stream2) => {
                  if (err2) {
                    console.error('执行失败:', err2);
                    conn.end();
                    return;
                  }
                  let out2 = '';
                  stream2
                    .on('close', () => {
                      console.log(out2);

                      console.log('\n=== 读取完整 server 块 ===');
                      conn.exec(
                        'cat /etc/nginx/conf.d/yunshu.conf 2>/dev/null || cat /etc/nginx/sites-enabled/yunshu 2>/dev/null || for f in $(grep -rl "location /playground" /etc/nginx/ --include="*.conf"); do echo "=== $f ==="; cat "$f"; done',
                        (err3, stream3) => {
                          if (err3) {
                            console.error('执行失败:', err3);
                            conn.end();
                            return;
                          }
                          let out3 = '';
                          stream3
                            .on('close', () => {
                              console.log(out3);
                              conn.end();
                            })
                            .on('data', (d) => (out3 += d.toString()))
                            .stderr.on('data', (d) => (out3 += d.toString()));
                        },
                      );
                    })
                    .on('data', (d) => (out2 += d.toString()))
                    .stderr.on('data', (d) => (out2 += d.toString()));
                },
              );
            })
            .on('data', (d) => (out += d.toString()))
            .stderr.on('data', (d) => (out += d.toString()));
        },
      );
    })
    .on('error', (err) => {
      console.error('SSH 错误:', err.message);
    })
    .connect({
      sock,
      host: sock ? undefined : TARGET_HOST,
      port: TARGET_PORT,
      username: 'root',
      password: 'Wang982565817!@#',
      readyTimeout: 30000,
    });
}

main().catch(console.error);
