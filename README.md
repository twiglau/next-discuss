# Discuss 项目

## 发布

## 部署

1. 配置环境 Node, nrm (切换镜像源)
2. 上传代码到服务器
3. 安装依赖 npm install
4. 运行 npm run build
5. 运行 `pm2 start npm --name "discuss" -- run start`
6. 运行 `pm2 list` 查看进程
7. 运行 `pm2 save` 保存进程
8. 运行 `pm2 startup` 设置开机自启

## 配置nginx

```bash
whereis nginx
cd /etc/nginx/vhosts
ls
```

```bash
# 创建新的配置文件
nano discuss.zhihur.conf
```

```nginx
server {
    #HTTPS的默认访问端口443。
    #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。
    listen 443 ssl;

    #填写证书绑定的域名
    server_name discuss.zhihur.com;

    #填写证书文件绝对路径
    ssl_certificate vhosts/cert/discuss.zhihur.com.pem;
    #填写证书私钥文件绝对路径
    ssl_certificate_key vhosts/cert/discuss.zhihur.com.key;

    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;

    #自定义设置使用的TLS协议的类型以及加密套件（以下为配置示例，请您自行评估是否需要配置）
    #TLS协议版本越高，HTTPS通信的安全性越高，但是相较于低版本TLS协议，高版本TLS协议对浏览器的兼容性较差。
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

    #表示优先使用服务端加密套件。默认开启
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:3000;
        index index.html index.htm;
    }
}

server {
    listen 80;
    server_name discuss.zhihur.com;
    rewrite ^(.*)$ https://$host$1;
}
```
