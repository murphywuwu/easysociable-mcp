FROM node:20-slim

WORKDIR /app

ENV EASYSOCIABLE_ALLOW_ENV_CREDENTIALS=true
ENV EASYSOCIABLE_API_KEY=glama_guest_introspection_key

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENTRYPOINT ["node", "bin/easysociable-mcp.js", "--transport", "stdio"]
