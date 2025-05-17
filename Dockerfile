# 1. Base image
FROM node:18-alpine

# 2. Working directory
WORKDIR /app

# 3. Copy dependencies
COPY package*.json ./
RUN npm install

# 4. Copy source code
COPY . .

# 5. Build TypeScript
RUN npm run build

# 6. Expose app port
EXPOSE 3000

# 7. Start app
CMD ["node", "dist/server.js"]
