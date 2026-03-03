FROM node:22

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build || (echo "Build failed" && ls -la && exit 1)

EXPOSE 5000

CMD ["npm", "start"]
