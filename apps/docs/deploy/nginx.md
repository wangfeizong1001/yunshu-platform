# Nginx 配置

admin 后台 SPA 应用需要 Nginx 配置以支持路由 history 模式和 API 代理。

## 完整配置

参考 [apps/admin/nginx.conf](file:///workspace/apps/admin/nginx.conf)：

```nginx
server {
    listen       80;
    server_name  localhost;

    # 字符集
    charset utf-8;

    # 日志
    access_log  /var/log/nginx/access.log  main;
    error_log   /var/log/nginx/error.log;

    # 客户端上传大小
    client_max_body_size 20M;

    # 根目录
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        # SPA 路由回退
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass         http://backend:8080/;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
        proxy_buffer_size     128k;
        proxy_buffers         4 256k;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss
               application/atom+xml image/svg+xml;
}
```

## HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /etc/nginx/ssl/your-domain.crt;
    ssl_certificate_key /etc/nginx/ssl/your-domain.key;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;

    location / {
        root   /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 关键配置说明

### 1. SPA History 模式

```nginx
try_files $uri $uri/ /index.html;
```

Vue Router 使用 history 模式时，必须配置此项，否则刷新会 404。

### 2. API 反向代理

```nginx
location /api/ {
    proxy_pass http://backend:8080/;
}
```

将 `/api/xxx` 请求代理到后端 8080 端口。

### 3. 静态资源缓存

```nginx
location ~* \.(js|css|png|jpg|svg|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

带 hash 的资源可以设置长期缓存（Vue/Vite 构建产物）。

### 4. gzip 压缩

启用 gzip 后，文本资源（JS/CSS/HTML）压缩率约 70%。

## 重启 Nginx

```bash
# 测试配置
nginx -t

# 重新加载
nginx -s reload

# 或使用 systemctl
systemctl reload nginx
```
