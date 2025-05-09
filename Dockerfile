# 使用官方的 Node 镜像作为基础镜像
FROM node:latest

# 在容器内创建一个目录用于存放 Node.js 应用程序
RUN mkdir -p /app
WORKDIR /app

# 将本地的应用代码复制到容器内的工作目录
COPY . /app

# 暴露容器的端口，这里假设 Node.js 应用监听的是 4000 端口
EXPOSE $PORT

# 安装 Node.js 依赖
RUN npm install

# 启动 Node.js 应用
CMD ["node", "src/app.js"]
