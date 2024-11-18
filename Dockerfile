# ベースイメージとして最新のNode.jsを使用
FROM node:18

# 必要なツールをインストール
RUN apt-get update && apt-get install -y git

# 作業ディレクトリを作成
WORKDIR /app

# Gitリポジトリをクローン
RUN git clone -b feat/api https://github.com/rgbkids/terminal-app.git .

# パッケージをインストール
RUN npm install --legacy-peer-deps

# ビルド引数としてポートを受け取る（デフォルトは8080）
ARG PORT=8080
ENV PORT=${PORT}

# ポートを指定されたPORT値に置換するスクリプト
RUN sed -i "s/8080/${PORT}/g" src/server.ts
RUN sed -i 's/HOME_DIR = ""/HOME_DIR = "\/app\/terminal-app\/vercel\/examples\/nextjs"/g' src/server.ts

# ビルド
RUN npm run build

# Next.jsアプリケーションを作成
WORKDIR /app/terminal-app/vercel
# RUN npx create-next-app@latest my-next-app -y
RUN git clone -b main https://github.com/vercel/vercel.git .
# RUN npm install
WORKDIR /app

# コンテナ起動時にサーバーを立ち上げる
CMD ["npm", "start"]

# コンテナ外部からアクセスするためのポートを指定
EXPOSE ${PORT}
