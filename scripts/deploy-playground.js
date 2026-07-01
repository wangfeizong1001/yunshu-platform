import { Client } from 'ssh2';
import { createReadStream } from 'fs';
import { basename } from 'path';

const conn = new Client();
const config = {
  host: '120.48.97.237',
  port: 22,
  username: 'root',
  password: 'Wang982565817!@#',
  readyTimeout: 30000,
};

if (process.env.HTTP_PROXY || process.env.http_proxy) {
  const proxyUrl = new URL(process.env.HTTP_PROXY || process.env.http_proxy);
  console.log(`使用代理: ${proxyUrl.host}`);
}

conn
  .on('ready', () => {
    console.log('SSH 连接成功');

    conn.exec(
      'cat /etc/nginx/sites-enabled/default 2>/dev/null || cat /etc/nginx/conf.d/default.conf 2>/dev/null || find /etc/nginx -name "*.conf" -exec grep -l "location /playground" {} \\;',
      (err, stream) => {
        if (err) {
          console.error('执行命令失败:', err);
          conn.end();
          return;
        }
        let output = '';
        stream
          .on('close', (code) => {
            console.log('Nginx 配置文件:');
            console.log(output);
            conn.end();
          })
          .on('data', (data) => {
            output += data.toString();
          })
          .stderr.on('data', (data) => {
            console.error('STDERR:', data.toString());
          });
      },
    );
  })
  .on('error', (err) => {
    console.error('连接错误:', err.message);
  })
  .connect(config);
