FROM node:22-alpine
RUN apk add --no-cache bash
RUN npm install -g npm@11.1.0 

WORKDIR /app

EXPOSE 3000

CMD ["sh", "-c", "npm install && npm run dev"]
