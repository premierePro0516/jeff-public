# May 28, 2026: Install Sub-Store in Docker. First line heading in Markdown

docker run -d \
  --name sub-store \
  --restart always \
  -p 3001:3001 \
  -v /etc/sub-store:/opt/sub-store/data \
  -e SUB_STORE_FRONTEND_BACKEND_PATH=/backend \
  xream/sub-store

<!--  压缩为一行的命令，可以在SSH终端直接复制粘贴执行 -->
docker run -d --name sub-store --restart always -p 3001:3001 -v /etc/sub-store:/opt/sub-store/data -e SUB_STORE_FRONTEND_BACKEND_PATH=/backend xream/sub-store

docker run -d \
  --name sub-store \
  --restart always \
  --net=host \
  -v /etc/sub-store:/opt/sub-store/data \
  -e SUB_STORE_FRONTEND_BACKEND_PATH=/backend \
  xream/sub-store

<!--  压缩为一行的命令，可以在SSH终端直接复制粘贴执行 -->
docker run -d --name sub-store --restart always --net=host -v /etc/sub-store:/opt/sub-store/data -e SUB_STORE_FRONTEND_BACKEND_PATH=/backend xream/sub-store

<!--清理旧容器：在运行新命令前，请先执行 docker rm -f sub-store 强制删除旧的容器，否则会提示名称冲突 -->
docker rm -f sub-store

<!-- 2. 如何访问与使用
容器启动成功后，您可以通过浏览器访问 Sub-Store 的前端界面：

访问地址：http://<您的OpenWRT局域网IP>:3001?api=http://<您的OpenWRT局域网IP>:3001/backend

示例：如果您的 OpenWRT IP 是 192.168.1.1，则访问：
http://192.168.2.1:3001?api=http://192.168.2.1:3001/backend

⚠️ 重要提示：必须在 URL 后面加上 ?api=... 参数，否则前端页面会因为找不到后端服务而报错或提示连接失败。 -->

<!-- 1. 停止并删除旧容器（别担心，挂载了本地目录，数据不会丢） -->
docker stop sub-store && docker rm sub-store

<!-- 2. 拉取最新的镜像 -->
docker pull xream/sub-store

<!-- 3. 重新运行上方第一步的安装脚本 -->
docker run -d --name sub-store --restart always -p 3001:3001 -v /etc/sub-store:/opt/sub-store/data -e SUB_STORE_FRONTEND_BACKEND_PATH=/backend xream/sub-store

<!-- Ending Hear -->