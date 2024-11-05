FROM node:alpine AS development

WORKDIR /usr/src/app

# Copy các tệp cấu hình và cài đặt toàn bộ gói
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install -g pnpm
RUN pnpm install

# Copy mã nguồn vào container
COPY apps/bio apps/bio
COPY libs libs

# Cài đặt các gói cho ứng dụng bio
# RUN cd apps/bio && pnpm install

# Không cần build ở đây vì chúng ta sẽ chạy ở chế độ dev
# RUN pnpm run build bio

# Chuyển sang bước production (nếu cần)
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/bio/main"]
