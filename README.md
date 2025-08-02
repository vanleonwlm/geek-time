# 极客时间

## 本地运行

通过 `.env` 文件修改运行配置。

使用 `docs/geek_time.sql` 文件来创建数据库、表和初始化数据。

```bash
npm install
npm start
```

## Docker 运行

本地构建并推送到远程仓库。

```
docker buildx build --platform linux/amd64 -t vanleon/geek-time:1.0.7 -t vanleon/geek-time:latest .
docker push vanleon/geek-time:1.0.7
docker push vanleon/geek-time:latest
```

本地运行。
```
docker pull vanleon/geek-time:latest
docker run \
    -e MYSQL_HOST=YOUR_MYSQL_HOST \
    -e MYSQL_PORT=YOUR_MYSQL_PORT \
    -e MYSQL_USER=YOUR_MYSQL_USER \
    -e MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD \
    -e MYSQL_DATABASE=geek_time \
    -p 4000:4000 \
    vanleon/geek-time:latest
```
