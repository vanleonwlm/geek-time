# 极客时间

## Node

```javascript
npm install
npm start
```

## Docker

### build

```bash
docker build -t vanleon/geek-time:1.0.0 .
docker push vanleon/geek-time:1.0.0
```

### run

```bash
docker pull vanleon/geek-time:1.0.0
docker run \
    -e MYSQL_HOST=YOUR_MYSQL_HOST \
    -e MYSQL_PORT=YOUR_MYSQL_PORT \
    -e MYSQL_USER=YOUR_MYSQL_USER \
    -e MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD \
    -e MYSQL_DATABASE=geek_time \
    -p 4000:4000 \
    vanleon/geek-time:1.0.0
```
